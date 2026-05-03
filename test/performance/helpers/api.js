import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const CABECALHOS_JSON = { 'Content-Type': 'application/json' };

function cabecalhosAutenticados(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function verificarHealth() {
  return http.get(`${BASE_URL}/health`);
}

export function criarUsuario(dados) {
  return http.post(`${BASE_URL}/users`, JSON.stringify(dados), {
    headers: CABECALHOS_JSON,
  });
}

export function login(email, senha) {
  return http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password: senha }),
    { headers: CABECALHOS_JSON }
  );
}

export function obterPerfil(token) {
  return http.get(`${BASE_URL}/users/me`, {
    headers: cabecalhosAutenticados(token),
  });
}

export function criarTarefa(dados, token) {
  return http.post(`${BASE_URL}/tasks`, JSON.stringify(dados), {
    headers: cabecalhosAutenticados(token),
  });
}

export function listarTarefas(token, params = {}) {
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const url = `${BASE_URL}/tasks${query ? `?${query}` : ''}`;
  return http.get(url, { headers: cabecalhosAutenticados(token) });
}

export function obterTarefa(id, token) {
  return http.get(`${BASE_URL}/tasks/${id}`, {
    headers: cabecalhosAutenticados(token),
  });
}

export function atualizarTarefa(id, dados, token) {
  return http.patch(`${BASE_URL}/tasks/${id}`, JSON.stringify(dados), {
    headers: cabecalhosAutenticados(token),
  });
}

export function excluirTarefa(id, token) {
  return http.del(`${BASE_URL}/tasks/${id}`, null, {
    headers: cabecalhosAutenticados(token),
  });
}
