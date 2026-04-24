// ── State ──────────────────────────────────────────────────────────────────
const foguetes  = [];
const satelites = [];
let simRunning  = false;

// ── Navigation ─────────────────────────────────────────────────────────────
function showTab(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  event.currentTarget.classList.add('active');
  if (id === 'hangar')    renderHangar();
  if (id === 'simulacao') renderSimSelects();
}

// ── Alerts ─────────────────────────────────────────────────────────────────
function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  el.className = 'alert show alert-' + type;
  el.textContent = '> ' + msg;
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Add Foguete ────────────────────────────────────────────────────────────
function addFoguete() {
  const nome        = document.getElementById('f-nome').value.trim();
  const carga       = parseFloat(document.getElementById('f-carga').value);
  const combustivel = parseFloat(document.getElementById('f-combustivel').value);
  const temperatura = parseFloat(document.getElementById('f-temperatura').value);
  const status      = document.getElementById('f-status').value;

  if (!nome || isNaN(carga) || isNaN(combustivel) || isNaN(temperatura)) {
    showAlert('alert-foguete', 'Preencha todos os campos corretamente.', 'danger');
    return;
  }

  foguetes.push({ nome, carga, combustivel, temperatura, status });
  showAlert('alert-foguete', 'Foguete "' + nome + '" registrado com sucesso!', 'success');
  ['f-nome', 'f-carga', 'f-combustivel', 'f-temperatura'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ── Add Satélite ───────────────────────────────────────────────────────────
function addSatelite() {
  const nome   = document.getElementById('s-nome').value.trim();
  const massa  = parseFloat(document.getElementById('s-massa').value);
  const orbita = document.getElementById('s-orbita').value;
  const energia = parseFloat(document.getElementById('s-energia').value);
  const obs    = document.getElementById('s-obs').value;
  const tempo  = document.getElementById('s-tempo').value;

  if (!nome || isNaN(massa) || isNaN(energia)) {
    showAlert('alert-satelite', 'Preencha todos os campos corretamente.', 'danger');
    return;
  }

  satelites.push({ nome, massa, orbita, energia, obs, tempo, status: 'Inativo' });
  showAlert('alert-satelite', 'Satélite "' + nome + '" registrado com sucesso!', 'success');
  ['s-nome', 's-massa', 's-energia'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ── Badge helpers ──────────────────────────────────────────────────────────
function getTempBadge(t) {
  if (t > 70)  return '<span class="badge badge-red">Alta 🔥</span>';
  if (t >= 10) return '<span class="badge badge-yellow">Média 🌡️</span>';
  return '<span class="badge badge-blue">Baixa ❄️</span>';
}

function getStatusBadge(s) {
  if (s === 'Ativo')      return '<span class="badge badge-green">ATIVO</span>';
  if (s === '--Lançado--') return '<span class="badge badge-blue">LANÇADO</span>';
  if (s === '--Falha--')  return '<span class="badge badge-red">FALHA</span>';
  return '<span class="badge badge-orange">' + s.toUpperCase() + '</span>';
}

// ── Render Hangar ──────────────────────────────────────────────────────────
function renderHangar() {
  const lf = document.getElementById('lista-foguetes');
  const ls = document.getElementById('lista-satelites');

  document.getElementById('count-foguetes').textContent =
    foguetes.length + ' unidade' + (foguetes.length !== 1 ? 's' : '');
  document.getElementById('count-satelites').textContent =
    satelites.length + ' unidade' + (satelites.length !== 1 ? 's' : '');

  lf.innerHTML = foguetes.length === 0
    ? '<div class="list-empty">// Nenhum foguete registrado</div>'
    : foguetes.map(f => `
        <div class="item-card">
          <div class="item-icon">🚀</div>
          <div class="item-body">
            <div class="item-name">${f.nome}</div>
            <div class="item-props">
              <div class="prop">
                <span class="prop-label">Carga</span>
                <span class="prop-value">${f.carga} kg</span>
              </div>
              <div class="prop">
                <span class="prop-label">Combustível</span>
                <span class="prop-value">${f.combustivel} L</span>
              </div>
              <div class="prop">
                <span class="prop-label">Temperatura</span>
                <span class="prop-value">${f.temperatura}°C ${getTempBadge(f.temperatura)}</span>
              </div>
              <div class="prop">
                <span class="prop-label">Status</span>
                <span class="prop-value">${getStatusBadge(f.status)}</span>
              </div>
            </div>
          </div>
        </div>`).join('');

  ls.innerHTML = satelites.length === 0
    ? '<div class="list-empty">// Nenhum satélite registrado</div>'
    : satelites.map(s => `
        <div class="item-card">
          <div class="item-icon">🛰️</div>
          <div class="item-body">
            <div class="item-name">${s.nome}</div>
            <div class="item-props">
              <div class="prop">
                <span class="prop-label">Massa</span>
                <span class="prop-value">${s.massa} kg</span>
              </div>
              <div class="prop">
                <span class="prop-label">Órbita</span>
                <span class="prop-value"><span class="badge badge-blue">${s.orbita}</span></span>
              </div>
              <div class="prop">
                <span class="prop-label">Energia</span>
                <span class="prop-value">${s.energia}%</span>
              </div>
              <div class="prop">
                <span class="prop-label">Observação</span>
                <span class="prop-value">${s.obs}</span>
              </div>
              <div class="prop">
                <span class="prop-label">Tempo Órbita</span>
                <span class="prop-value">${s.tempo}</span>
              </div>
              <div class="prop">
                <span class="prop-label">Status</span>
                <span class="prop-value">${getStatusBadge(s.status)}</span>
              </div>
            </div>
          </div>
        </div>`).join('');
}

// ── Populate simulation selects ────────────────────────────────────────────
function renderSimSelects() {
  const sf = document.getElementById('sim-foguete');
  const ss = document.getElementById('sim-satelite');

  sf.innerHTML = '<option value="">-- Selecionar Foguete --</option>' +
    foguetes.map((f, i) => `<option value="${i}">${f.nome}</option>`).join('');

  ss.innerHTML = '<option value="">-- Selecionar Satélite --</option>' +
    satelites.map((s, i) => `<option value="${i}">${s.nome}</option>`).join('');
}

// ── Simulation ─────────────────────────────────────────────────────────────
function simularLancamento() {
  if (simRunning) return;

  const fi = document.getElementById('sim-foguete').value;
  const si = document.getElementById('sim-satelite').value;

  if (fi === '') { alert('Selecione um foguete!'); return; }

  const f = foguetes[parseInt(fi)];
  const s = si !== '' ? satelites[parseInt(si)] : null;
  simRunning = true;

  const out = document.getElementById('sim-output');
  out.innerHTML = '';

  // Helper line builders
  const lines = [];
  const ok   = txt => lines.push({ txt, cls: 'ok' });
  const warn = txt => lines.push({ txt, cls: 'warn' });
  const fail = txt => lines.push({ txt, cls: 'fail' });
  const info = txt => lines.push({ txt, cls: 'accent' });
  const norm = txt => lines.push({ txt, cls: '' });

  // Build log sequence
  info('> SISTEMA DE LANÇAMENTO INICIADO');
  norm('> Foguete selecionado: ' + f.nome);
  norm('> Combustível atual: ' + f.combustivel.toFixed(1) + ' L');
  norm('');
  info('> [1/5] VERIFICAÇÃO DE SISTEMAS...');
  norm('> Checando integridade estrutural...');

  if (f.temperatura > 70) {
    warn('> ALERTA: Temperatura ALTA detectada — ' + f.temperatura + '°C');
    warn('> Acionando sistema de resfriamento...');
  } else if (f.temperatura < 20) {
    warn('> ALERTA: Temperatura BAIXA detectada — ' + f.temperatura + '°C');
  } else {
    ok('> Temperatura nominal: ' + f.temperatura + '°C ✓');
  }

  norm('');
  info('> [2/5] ABASTECIMENTO...');
  const abast     = 100;
  const combFinal = f.combustivel + abast;
  norm('> Adicionando ' + abast + ' L de propelente...');
  ok('> Combustível total: ' + combFinal.toFixed(1) + ' L ✓');
  f.combustivel = combFinal;

  norm('');
  info('> [3/5] CONTAGEM REGRESSIVA...');
  norm('> 5...4...3...2...1...');
  norm('');

  const lancou = combFinal > 400;

  if (lancou) {
    info('> [4/5] IGNIÇÃO!');
    ok('> LANÇAMENTO BEM-SUCEDIDO! ✓');
    ok('> Foguete ' + f.nome + ' em ascensão!');
    f.status = '--Lançado--';

    if (s) {
      norm('');
      info('> [5/5] IMPLANTAÇÃO DO SATÉLITE...');
      norm('> Satélite: ' + s.nome);
      norm('> Separação dos estágios...');
      ok('> Satélite em trajetória para órbita ' + s.orbita + ' ✓');
      norm('> Ativando painéis solares...');
      s.energia = Math.min(100, s.energia + 20);
      ok('> Painéis ativados — Energia: ' + s.energia.toFixed(1) + '% ✓');
      s.status = 'Ativo';
      ok('> Satélite ' + s.nome + ' OPERACIONAL ✓');
      ok('> Enviando dados: "Missão concluída com sucesso!"');
      norm('');
      ok('> ---');
      ok('> MISSÃO CONCLUÍDA !');
      ok('> ---');
    } else {
      ok('> ---');
      ok('> LANÇAMENTO CONCLUÍDO !');
      ok('> ---');
    }
  } else {
    fail('> [4/5] FALHA NO SISTEMA DE PROPULSÃO!');
    fail('> Combustível insuficiente: ' + combFinal.toFixed(1) + ' L (mínimo: 400 L)');
    fail('> LANÇAMENTO NÃO CONCLUÍDO!');
    fail('>---');
    fail('> MISSÃO FALHOU — ABASTEÇA O FOGUETE!');
    fail('> ---');
    f.status = '--Falha--';
  }

  // Update telemetry panel
  document.getElementById('telemetry').style.display = 'grid';
  document.getElementById('t-comb').textContent  = combFinal.toFixed(0);
  document.getElementById('pb-comb').style.width = Math.min(100, (combFinal / 1000) * 100) + '%';
  document.getElementById('t-temp').textContent  = f.temperatura.toFixed(1);
  document.getElementById('pb-temp').style.width = Math.min(100, (f.temperatura / 100) * 100) + '%';

  if (s) {
    document.getElementById('t-ener').textContent  = s.energia.toFixed(1);
    document.getElementById('pb-ener').style.width = s.energia + '%';
  }

  const statusEl = document.getElementById('t-status');
  statusEl.textContent  = lancou ? '✓ OK' : '✗ FALHA';
  statusEl.style.color  = lancou ? 'var(--accent2)' : 'var(--danger)';

  // Animate terminal lines with staggered delay
  lines.forEach((l, i) => {
    const span = document.createElement('span');
    span.className = 'sim-line' + (l.cls ? ' ' + l.cls : '');
    span.textContent = l.txt;
    span.style.animationDelay = (i * 120) + 'ms';
    out.appendChild(span);
    out.appendChild(document.createElement('br'));
  });

  setTimeout(() => { simRunning = false; }, lines.length * 120 + 500);
}

// ── Clear simulation ───────────────────────────────────────────────────────
function limparSim() {
  document.getElementById('sim-output').innerHTML =
    '<span class="sim-line accent" style="opacity:1">// SISTEMA PRONTO. AGUARDANDO INSTRUÇÃO...</span>' +
    '<br><span class="sim-cursor"></span>';
  document.getElementById('telemetry').style.display = 'none';
  simRunning = false;
}
