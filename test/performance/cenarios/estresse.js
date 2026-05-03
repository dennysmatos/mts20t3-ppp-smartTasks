/**
 * Teste de Estresse — aumenta carga progressivamente para identificar
 * o ponto de degradação da API.
 * Rampa: 0→10→20→30→40→50 VUs (1 min cada etapa) → pico 50 VUs (2m)
 *        → recuperação 50→0 VUs (1m).
 * Total: ~9 minutos.
 *
 * ATENÇÃO: Este teste esgota propositalmente a capacidade da API.
 * Espera-se que a taxa de erros aumente à medida que os VUs crescem.
 * Execute apenas em ambiente de testes, nunca em produção.
 *
 * Uso: k6 run test/performance/cenarios/estresse.js
 */
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

import {
  verificarHealth,
  criarUsuario,
  login,
  criarTarefa,
  listarTarefas,
  atualizarTarefa,
  excluirTarefa,
} from '../helpers/api.js';
import { gerarRelatorioHtml, resumoTexto } from '../helpers/relatorio.js';

const taxaErros = new Rate('taxa_erros');
const duracaoCRUD = new Trend('duracao_crud_ms');
const errosAutenticacao = new Counter('erros_autenticacao');
const errosTarefa = new Counter('erros_tarefa');

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '1m', target: 30 },
    { duration: '1m', target: 40 },
    { duration: '1m', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    // Limiares permissivos — o objetivo é observar a degradação, não bloquear
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.30'],
    taxa_erros: ['rate<0.30'],
  },
};

export default function () {
  const email = `estresse-vu${__VU}-it${__ITER}@perf.teste`;
  const senha = 'estresse123';

  // 1. Criar usuário
  const resUsuario = criarUsuario({
    name: `VU ${__VU} Iter ${__ITER}`,
    email,
    password: senha,
  });

  if (resUsuario.status !== 201) {
    taxaErros.add(true);
    errosAutenticacao.add(1);
    sleep(0.5);
    return;
  }

  // 2. Login
  const resLogin = login(email, senha);

  if (resLogin.status !== 200) {
    taxaErros.add(true);
    errosAutenticacao.add(1);
    sleep(0.5);
    return;
  }

  taxaErros.add(false);
  const token = resLogin.json('data.token');

  const inicioCRUD = Date.now();

  // 3. Health check rápido
  verificarHealth();

  // 4. Criar tarefa
  const resTarefa = criarTarefa(
    {
      title: `Tarefa VU${__VU} IT${__ITER}`,
      description: 'Teste de estresse',
      status: 'pending',
    },
    token
  );

  if (resTarefa.status !== 201) {
    taxaErros.add(true);
    errosTarefa.add(1);
    sleep(0.3);
    return;
  }

  taxaErros.add(false);
  const idTarefa = resTarefa.json('data.id');

  // 5. Listar tarefas com paginação
  const resListar = listarTarefas(token, { page: '1', limit: '10' });
  check(resListar, {
    'listar — status 200 ou aceitável': (r) =>
      r.status === 200 || r.status === 503,
  });

  sleep(0.1);

  // 6. Atualizar tarefa
  const resAtualizar = atualizarTarefa(
    idTarefa,
    { status: 'in_progress' },
    token
  );

  if (resAtualizar.status !== 200) {
    taxaErros.add(true);
    errosTarefa.add(1);
  } else {
    taxaErros.add(false);
  }

  sleep(0.1);

  // 7. Excluir tarefa (limpeza)
  const resExcluir = excluirTarefa(idTarefa, token);

  if (resExcluir.status !== 204) {
    taxaErros.add(true);
    errosTarefa.add(1);
  } else {
    taxaErros.add(false);
  }

  duracaoCRUD.add(Date.now() - inicioCRUD);

  // Pausa menor que no teste de carga para pressionar mais a API
  sleep(0.3);
}

export function handleSummary(data) {
  const vus = data.metrics.vus_max?.values?.value ?? '?';
  const tituloCompleto = `Teste de Estresse (pico: ${vus} VUs)`;

  return {
    'relatorios/estresse.html': gerarRelatorioHtml(data, tituloCompleto),
    'relatorios/estresse.json': JSON.stringify(data, null, 2),
    stdout: resumoTexto(data),
  };
}
