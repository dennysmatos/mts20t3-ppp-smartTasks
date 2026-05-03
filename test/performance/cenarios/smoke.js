/**
 * Smoke Test — verifica que todos os endpoints respondem corretamente
 * com carga mínima (1 VU por 1 minuto).
 *
 * Uso: k6 run test/performance/cenarios/smoke.js
 */
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

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
const duracaoLogin = new Trend('duracao_login_ms');

export const options = {
  vus: 1,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    taxa_erros: ['rate<0.01'],
  },
};

export default function () {
  // 1. Health check
  const resHealth = verificarHealth();
  const okHealth = check(resHealth, {
    'health — status 200': (r) => r.status === 200,
    'health — campo status presente': (r) =>
      r.json('data.status') !== undefined,
  });
  taxaErros.add(!okHealth);

  sleep(0.5);

  // 2. Criar usuário único por VU/iteração
  const email = `smoke-vu${__VU}-it${__ITER}@perf.teste`;
  const senha = 'senha123';

  const resUsuario = criarUsuario({
    name: 'Usuário Smoke',
    email,
    password: senha,
  });
  const okUsuario = check(resUsuario, {
    'criar usuário — status 201': (r) => r.status === 201,
    'criar usuário — sem campo password na resposta': (r) =>
      r.json('data.password') === undefined,
  });
  taxaErros.add(!okUsuario);

  if (resUsuario.status !== 201) {
    sleep(1);
    return;
  }

  sleep(0.5);

  // 3. Login
  const inicioLogin = Date.now();
  const resLogin = login(email, senha);
  duracaoLogin.add(Date.now() - inicioLogin);

  const okLogin = check(resLogin, {
    'login — status 200': (r) => r.status === 200,
    'login — token presente': (r) => typeof r.json('data.token') === 'string',
  });
  taxaErros.add(!okLogin);

  if (resLogin.status !== 200) {
    sleep(1);
    return;
  }

  const token = resLogin.json('data.token');

  sleep(0.5);

  // 4. Perfil do usuário autenticado
  const resPerfil = obterPerfil(token);
  const okPerfil = check(resPerfil, {
    'perfil — status 200': (r) => r.status === 200,
    'perfil — email correto': (r) => r.json('data.email') === email,
  });
  taxaErros.add(!okPerfil);

  sleep(0.5);

  // 5. Criar tarefa
  const resTarefa = criarTarefa(
    {
      title: 'Tarefa Smoke Test',
      description: 'Criada durante smoke test de performance',
      status: 'pending',
    },
    token
  );
  const okTarefa = check(resTarefa, {
    'criar tarefa — status 201': (r) => r.status === 201,
    'criar tarefa — id presente': (r) => r.json('data.id') !== undefined,
    'criar tarefa — status pending': (r) => r.json('data.status') === 'pending',
  });
  taxaErros.add(!okTarefa);

  if (resTarefa.status !== 201) {
    sleep(1);
    return;
  }

  const idTarefa = resTarefa.json('data.id');

  sleep(0.5);

  // 6. Listar tarefas
  const resListar = listarTarefas(token);
  const okListar = check(resListar, {
    'listar tarefas — status 200': (r) => r.status === 200,
    'listar tarefas — array data': (r) => Array.isArray(r.json('data')),
  });
  taxaErros.add(!okListar);

  sleep(0.3);

  // 7. Listar com filtro de status
  const resListarFiltro = listarTarefas(token, { status: 'pending' });
  check(resListarFiltro, {
    'listar com filtro — status 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // 8. Obter tarefa por ID
  const resObter = obterTarefa(idTarefa, token);
  const okObter = check(resObter, {
    'obter tarefa — status 200': (r) => r.status === 200,
    'obter tarefa — id correto': (r) => r.json('data.id') === idTarefa,
  });
  taxaErros.add(!okObter);

  sleep(0.5);

  // 9. Atualizar tarefa
  const resAtualizar = atualizarTarefa(
    idTarefa,
    { status: 'in_progress', title: 'Tarefa Smoke Atualizada' },
    token
  );
  const okAtualizar = check(resAtualizar, {
    'atualizar tarefa — status 200': (r) => r.status === 200,
    'atualizar tarefa — status in_progress': (r) =>
      r.json('data.status') === 'in_progress',
  });
  taxaErros.add(!okAtualizar);

  sleep(0.5);

  // 10. Excluir tarefa
  const resExcluir = excluirTarefa(idTarefa, token);
  const okExcluir = check(resExcluir, {
    'excluir tarefa — status 204': (r) => r.status === 204,
  });
  taxaErros.add(!okExcluir);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'relatorios/smoke.html': gerarRelatorioHtml(data, 'Smoke Test'),
    'relatorios/smoke.json': JSON.stringify(data, null, 2),
    stdout: resumoTexto(data),
  };
}
