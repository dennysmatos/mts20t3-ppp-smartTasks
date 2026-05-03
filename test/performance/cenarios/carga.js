/**
 * Teste de Carga — simula uso concorrente normal da API.
 * Rampa: 0→5 VUs (30s) → sustém 5 VUs (1m) → 5→10 VUs (30s)
 *        → sustém 10 VUs (2m) → 10→0 VUs (30s).
 * Total: ~4m30s.
 *
 * Uso: k6 run test/performance/cenarios/carga.js
 */
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

import {
  verificarHealth,
  criarUsuario,
  login,
  obterPerfil,
  criarTarefa,
  listarTarefas,
  obterTarefa,
  atualizarTarefa,
  excluirTarefa,
} from '../helpers/api.js';
import { gerarRelatorioHtml, resumoTexto } from '../helpers/relatorio.js';

const taxaErros = new Rate('taxa_erros');
const duracaoOperacaoCRUD = new Trend('duracao_crud_completo_ms');
const totalTarefasCriadas = new Counter('tarefas_criadas');
const totalUsuariosCriados = new Counter('usuarios_criados');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '2m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500', 'p(99)<3000'],
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95'],
    taxa_erros: ['rate<0.05'],
  },
};

function jornada_health(taxaErros) {
  const res = verificarHealth();
  const ok = check(res, { 'health — status 200': (r) => r.status === 200 });
  taxaErros.add(!ok);
  return ok;
}

function jornada_usuario_completa(vuId, iterId, taxaErros) {
  const email = `carga-vu${vuId}-it${iterId}@perf.teste`;
  const senha = 'carga123';

  const resUser = criarUsuario({
    name: `Usuário Carga ${vuId}`,
    email,
    password: senha,
  });

  if (
    !check(resUser, { 'criar usuário — status 201': (r) => r.status === 201 })
  ) {
    taxaErros.add(true);
    return null;
  }
  totalUsuariosCriados.add(1);

  const resLogin = login(email, senha);
  if (
    !check(resLogin, {
      'login — status 200': (r) => r.status === 200,
      'login — token válido': (r) => typeof r.json('data.token') === 'string',
    })
  ) {
    taxaErros.add(true);
    return null;
  }

  return resLogin.json('data.token');
}

function jornada_tarefas(token, taxaErros) {
  const inicio = Date.now();

  // Criar 3 tarefas
  const ids = [];
  const titulos = [
    'Implementar autenticação',
    'Escrever testes de integração',
    'Revisar documentação',
  ];

  for (let i = 0; i < titulos.length; i++) {
    const res = criarTarefa(
      {
        title: titulos[i],
        description: `Tarefa ${i + 1} do teste de carga`,
        status: 'pending',
      },
      token
    );
    if (check(res, { 'criar tarefa — status 201': (r) => r.status === 201 })) {
      ids.push(res.json('data.id'));
      totalTarefasCriadas.add(1);
    } else {
      taxaErros.add(true);
    }
    sleep(0.2);
  }

  if (ids.length === 0) return;

  // Listar tarefas (sem filtro)
  const resListar = listarTarefas(token);
  check(resListar, {
    'listar tarefas — status 200': (r) => r.status === 200,
    'listar tarefas — array não vazio': (r) =>
      Array.isArray(r.json('data')) && r.json('data').length > 0,
  });

  sleep(0.3);

  // Listar com filtros (simula comportamento real do frontend)
  listarTarefas(token, {
    status: 'pending',
    sortBy: 'createdAt',
    order: 'desc',
  });
  sleep(0.2);

  listarTarefas(token, { page: '1', limit: '10' });
  sleep(0.2);

  // Obter e atualizar a primeira tarefa
  const idAlvo = ids[0];
  const resObter = obterTarefa(idAlvo, token);
  check(resObter, {
    'obter tarefa — status 200': (r) => r.status === 200,
  });

  sleep(0.3);

  const resAtualizar = atualizarTarefa(
    idAlvo,
    { status: 'in_progress' },
    token
  );
  check(resAtualizar, {
    'atualizar tarefa — status 200': (r) => r.status === 200,
    'atualizar tarefa — in_progress': (r) =>
      r.json('data.status') === 'in_progress',
  });

  sleep(0.3);

  // Concluir e excluir todas
  for (const id of ids) {
    atualizarTarefa(id, { status: 'done' }, token);
    sleep(0.1);
    const resDel = excluirTarefa(id, token);
    check(resDel, { 'excluir — status 204': (r) => r.status === 204 });
    sleep(0.1);
  }

  duracaoOperacaoCRUD.add(Date.now() - inicio);
}

export default function () {
  // 10% das iterações apenas fazem health check
  if (__ITER % 10 === 0) {
    jornada_health(taxaErros);
    sleep(1);
    return;
  }

  const token = jornada_usuario_completa(__VU, __ITER, taxaErros);
  if (!token) {
    sleep(2);
    return;
  }

  sleep(0.5);

  // Perfil do usuário autenticado (simula carregamento da home)
  const resPerfil = obterPerfil(token);
  check(resPerfil, { 'perfil — status 200': (r) => r.status === 200 });

  sleep(0.5);

  jornada_tarefas(token, taxaErros);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'relatorios/carga.html': gerarRelatorioHtml(data, 'Teste de Carga'),
    'relatorios/carga.json': JSON.stringify(data, null, 2),
    stdout: resumoTexto(data),
  };
}
