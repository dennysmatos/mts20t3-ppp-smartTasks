import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export function gerarRelatorioHtml(data, titulo) {
  const dr = data.metrics.http_req_duration?.values;
  const falhas = data.metrics.http_req_failed?.values;
  const reqs = data.metrics.http_reqs?.values;
  const checks = data.metrics.checks?.values;

  const pct = (v) => (v != null ? `${(v * 100).toFixed(2)}%` : '-');
  const ms = (v) => (v != null ? `${v.toFixed(2)} ms` : '-');
  const num = (v) => (v != null ? v.toFixed(2) : '-');

  const totalChecks = (checks?.passes ?? 0) + (checks?.fails ?? 0);
  const taxaSucesso =
    totalChecks > 0
      ? `${(((checks?.passes ?? 0) / totalChecks) * 100).toFixed(2)}%`
      : '-';

  const corTaxaErro =
    (falhas?.rate ?? 0) > 0.05
      ? '#dc3545'
      : (falhas?.rate ?? 0) > 0.01
        ? '#fd7e14'
        : '#28a745';

  const dadosRecebidos =
    data.metrics.data_received?.values?.count != null
      ? `${(data.metrics.data_received.values.count / 1024).toFixed(2)} KB`
      : '-';

  const dadosEnviados =
    data.metrics.data_sent?.values?.count != null
      ? `${(data.metrics.data_sent.values.count / 1024).toFixed(2)} KB`
      : '-';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório K6 — ${titulo}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f0f2f5; color: #333; padding: 24px; }
    h1 { font-size: 1.75rem; color: #1a1a2e; margin-bottom: 4px; }
    .subtitulo { color: #666; margin-bottom: 24px; font-size: 0.9rem; }
    .grade { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
             gap: 16px; margin-bottom: 24px; }
    .cartao { background: #fff; border-radius: 10px; padding: 20px; text-align: center;
              box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .cartao-valor { font-size: 2rem; font-weight: 700; }
    .cartao-label { font-size: 0.8rem; color: #666; margin-top: 4px; text-transform: uppercase;
                    letter-spacing: 0.05em; }
    .secao { background: #fff; border-radius: 10px; padding: 20px;
             box-shadow: 0 1px 4px rgba(0,0,0,0.08); margin-bottom: 20px; }
    .secao h2 { font-size: 1rem; font-weight: 600; margin-bottom: 16px;
                padding-bottom: 8px; border-bottom: 2px solid #e8ecf0; color: #444; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th { background: #4a6cf7; color: #fff; padding: 10px 12px; text-align: left;
         font-weight: 500; }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f2f5; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f8f9fe; }
    .ok { color: #28a745; font-weight: 600; }
    .aviso { color: #fd7e14; font-weight: 600; }
    .erro { color: #dc3545; font-weight: 600; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 12px;
             font-size: 0.75rem; font-weight: 600; }
    .badge-ok { background: #d4edda; color: #155724; }
    .badge-erro { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <h1>Relatório de Performance K6</h1>
  <p class="subtitulo">Cenário: <strong>${titulo}</strong> &nbsp;|&nbsp; Gerado em: ${new Date().toLocaleString('pt-BR')}</p>

  <div class="grade">
    <div class="cartao">
      <div class="cartao-valor" style="color:#4a6cf7">${reqs?.count ?? '-'}</div>
      <div class="cartao-label">Total de Requisições</div>
    </div>
    <div class="cartao">
      <div class="cartao-valor" style="color:#4a6cf7">${num(reqs?.rate)}/s</div>
      <div class="cartao-label">Requisições/segundo</div>
    </div>
    <div class="cartao">
      <div class="cartao-valor" style="color:#17a2b8">${dr ? `${dr['p(95)'].toFixed(0)} ms` : '-'}</div>
      <div class="cartao-label">P95 Duração</div>
    </div>
    <div class="cartao">
      <div class="cartao-valor" style="color:#17a2b8">${dr ? `${dr.avg.toFixed(0)} ms` : '-'}</div>
      <div class="cartao-label">Média Duração</div>
    </div>
    <div class="cartao">
      <div class="cartao-valor" style="color:${corTaxaErro}">${pct(falhas?.rate)}</div>
      <div class="cartao-label">Taxa de Erros</div>
    </div>
    <div class="cartao">
      <div class="cartao-valor" style="color:#28a745">${taxaSucesso}</div>
      <div class="cartao-label">Taxa de Sucesso (checks)</div>
    </div>
  </div>

  <div class="secao">
    <h2>Duração das Requisições HTTP</h2>
    <table>
      <thead>
        <tr><th>Métrica</th><th>Mínimo</th><th>Médio</th><th>Mediano</th>
            <th>P90</th><th>P95</th><th>P99</th><th>Máximo</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>http_req_duration</strong></td>
          <td>${ms(dr?.min)}</td>
          <td>${ms(dr?.avg)}</td>
          <td>${ms(dr?.med)}</td>
          <td>${ms(dr?.['p(90)'])}</td>
          <td>${ms(dr?.['p(95)'])}</td>
          <td>${ms(dr?.['p(99)'])}</td>
          <td>${ms(dr?.max)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="secao">
    <h2>Verificações (Checks)</h2>
    <table>
      <thead><tr><th>Métrica</th><th>Valor</th></tr></thead>
      <tbody>
        <tr><td>Total de Verificações</td><td>${totalChecks}</td></tr>
        <tr><td>Passou</td><td class="ok">${checks?.passes ?? '-'}</td></tr>
        <tr><td>Falhou</td><td class="${(checks?.fails ?? 0) > 0 ? 'erro' : 'ok'}">${checks?.fails ?? '-'}</td></tr>
        <tr><td>Taxa de Sucesso</td>
            <td><span class="badge ${(checks?.fails ?? 0) > 0 ? 'badge-erro' : 'badge-ok'}">${taxaSucesso}</span></td></tr>
      </tbody>
    </table>
  </div>

  <div class="secao">
    <h2>Métricas de Rede</h2>
    <table>
      <thead><tr><th>Métrica</th><th>Valor</th></tr></thead>
      <tbody>
        <tr><td>Dados Recebidos</td>
            <td>${dadosRecebidos}</td></tr>
        <tr><td>Dados Enviados</td>
            <td>${dadosEnviados}</td></tr>
        <tr><td>Tempo Conectando</td>
            <td>${ms(data.metrics.http_req_connecting?.values?.avg)}</td></tr>
        <tr><td>Tempo Aguardando</td>
            <td>${ms(data.metrics.http_req_waiting?.values?.avg)}</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

export function resumoTexto(data, opcoes) {
  return textSummary(data, opcoes ?? { indent: '  ', enableColors: true });
}
