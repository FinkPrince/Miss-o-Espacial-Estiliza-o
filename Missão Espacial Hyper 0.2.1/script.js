// ──  aplicação ───
const foguetes  = [];
const satelites = [];

// ── mudar de abas ───
function trocarAba(id, botao) {
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('ativo'));
  document.getElementById(id).classList.add('ativa');
  botao.classList.add('ativo');

  if (id === 'hangar')    renderizarHangar();
  if (id === 'simulacao') preencherSelects();
}

// ── Exibir alerta temporário ───
function mostrarAlerta(id, mensagem, tipo) {
  const el = document.getElementById(id);
  el.textContent = mensagem;
  el.className = 'alerta ' + tipo;
  setTimeout(() => el.className = 'alerta', 3000);
}

// ──  foguete ───
function registrarFoguete() {
  const nome        = document.getElementById('f-nome').value.trim();
  const carga       = parseFloat(document.getElementById('f-carga').value);
  const combustivel = parseFloat(document.getElementById('f-combustivel').value);
  const temperatura = parseFloat(document.getElementById('f-temperatura').value);
  const status      = document.getElementById('f-status').value;

  if (!nome || isNaN(carga) || isNaN(combustivel) || isNaN(temperatura)) {
    mostrarAlerta('alerta-foguete', '⚠ Preencha todos os campos.', 'erro');
    return;
  }

  foguetes.push({ nome, carga, combustivel, temperatura, status });
  mostrarAlerta('alerta-foguete', `✓ Foguete "${nome}" registrado!`, 'ok');
  ['f-nome', 'f-carga', 'f-combustivel', 'f-temperatura'].forEach(id =>
    document.getElementById(id).value = ''
  );
}

// ──  satélite ────
function registrarSatelite() {
  const nome   = document.getElementById('s-nome').value.trim();
  const massa  = parseFloat(document.getElementById('s-massa').value);
  const energia = parseFloat(document.getElementById('s-energia').value);
  const orbita = document.getElementById('s-orbita').value;
  const obs    = document.getElementById('s-obs').value;
  const tempo  = document.getElementById('s-tempo').value;

  if (!nome || isNaN(massa) || isNaN(energia)) {
    mostrarAlerta('alerta-satelite', ' Preencha todos os campos.', 'erro');
    return;
  }

  satelites.push({ nome, massa, energia, orbita, obs, tempo, status: 'Inativo' });
  mostrarAlerta('alerta-satelite', `✓ Satélite "${nome}" registrado!`, 'ok');
  ['s-nome', 's-massa', 's-energia'].forEach(id =>
    document.getElementById(id).value = ''
  );
}

// ── Renderizar Hangar ────
function renderizarHangar() {
  document.getElementById('qtd-foguetes').textContent = foguetes.length;
  document.getElementById('qtd-satelites').textContent = satelites.length;

  document.getElementById('lista-foguetes').innerHTML =
    foguetes.length === 0
      ? '<p class="vazio">Nenhum foguete registrado.</p>'
      : foguetes.map(f => `
          <div class="item">
            <strong> ${f.nome}</strong>
            <span>Carga: ${f.carga} kg</span>
            <span>Combustível: ${f.combustivel} L</span>
            <span>Temperatura: ${f.temperatura}°C</span>
            <span class="badge">${f.status}</span>
          </div>`).join('');

  document.getElementById('lista-satelites').innerHTML =
    satelites.length === 0
      ? '<p class="vazio">Nenhum satélite registrado.</p>'
      : satelites.map(s => `
          <div class="item">
            <strong> ${s.nome}</strong>
            <span>Massa: ${s.massa} kg</span>
            <span>Órbita: ${s.orbita}</span>
            <span>Energia: ${s.energia}%</span>
            <span>Função: ${s.obs}</span>
            <span class="badge">${s.status}</span>
          </div>`).join('');
}

// ── Preencher informacoes da simulação ────
function preencherSelects() {
  document.getElementById('sim-foguete').innerHTML =
    '<option value="">-- Selecionar Foguete --</option>' +
    foguetes.map((f, i) => `<option value="${i}">${f.nome}</option>`).join('');

  document.getElementById('sim-satelite').innerHTML =
    '<option value="">-- Selecionar Satélite --</option>' +
    satelites.map((s, i) => `<option value="${i}">${s.nome}</option>`).join('');
}

// ── Simulação de lançamento ─────
function simularLancamento() {
  const fi = document.getElementById('sim-foguete').value;
  const si = document.getElementById('sim-satelite').value;

  if (fi === '') { alert('Selecione um foguete!'); return; }

  const f = foguetes[parseInt(fi)];
  const s = si !== '' ? satelites[parseInt(si)] : null;

  const linhas = [];
  const adicionar = (txt, cor) => linhas.push({ txt, cor });

  // Verificações
  adicionar('> INICIANDO LANÇAMENTO...', 'azul');
  adicionar(`> Foguete: ${f.nome} | Combustível: ${f.combustivel} L`, '');

  if (f.temperatura > 70)
    adicionar(`> ⚠ Temperatura ALTA: ${f.temperatura}°C — resfriando...`, 'amarelo');
  else
    adicionar(`> ✓ Temperatura normal: ${f.temperatura}°C`, 'verde');

  // Abastecimento
  f.combustivel += 100;
  adicionar(`> Abastecimento: +100 L → Total: ${f.combustivel} L`, '');

  // Contagem regressiva
  adicionar('> 5... 4... 3... 2... 1...', '');

  // Lançamento ( pelo menos 400 coisa)
  const sucesso = f.combustivel > 400;

  if (sucesso) {
    adicionar('>   LANÇAMENTO BEM-SUCEDIDO! ', 'verde');
    f.status = 'Lançado';

    if (s) {
      adicionar(`> Separando satélite ${s.nome}...`, '');
      s.energia = Math.min(100, s.energia + 20);
      adicionar(`> ✓ Satélite em órbita ${s.orbita} | Energia: ${s.energia}%`, 'verde');
      s.status = 'Ativo';
      adicionar('> ✓ MISSÃO CONCLUÍDA!', 'verde');
    } else {
      adicionar('> ✓ LANÇAMENTO CONCLUÍDO!', 'verde');
    }
  } else {
    adicionar(`> ✗ FALHA! Combustível insuficiente: ${f.combustivel} L (mínimo: 400 L)`, 'vermelho');
    f.status = 'Falha';
    adicionar('> ✗ MISSÃO FALHOU!', 'vermelho');
  }

  // Renderizar terminal
  const terminal = document.getElementById('terminal');
  terminal.innerHTML = linhas.map((l, i) =>
    `<span class="${l.cor}" style="animation-delay:${i * 100}ms">${l.txt}</span>`
  ).join('');

  // Atualizar telemetria
  document.getElementById('telemetria').style.display = 'grid';
  document.getElementById('t-comb').textContent = f.combustivel;
  document.getElementById('t-temp').textContent = f.temperatura;
  document.getElementById('t-ener').textContent = s ? s.energia : '--';
  const statusEl = document.getElementById('t-status');
  statusEl.textContent = sucesso ? '✓ OK' : '✗ FALHA';
  statusEl.style.color = sucesso ? '#00ff9d' : '#ff3d5a';
}

// ── Limpar simulação ────
function limparSimulacao() {
  document.getElementById('terminal').innerHTML =
    '<span class="azul">// SISTEMA PRONTO. AGUARDANDO INSTRUÇÃO...</span>';
  document.getElementById('telemetria').style.display = 'none';
}
// ── Preencher select da trajetória ───
function preencherSelectTrajetoria() {
  document.getElementById('traj-foguete').innerHTML =
    '<option value="">-- Selecionar Foguete --</option>' +
    foguetes.map((f, i) => `<option value="${i}">${f.nome}</option>`).join('');
}
 
// ── Mostrar trajetória ────
function mostrarTrajetoria() {
  const fi = document.getElementById('traj-foguete').value;
  if (fi === '') { alert('Selecione um foguete!'); return; }
 
  const f = foguetes[parseInt(fi)];
 
  // Pontos da trajetória: Terra → Atmosfera → Órbita (variam por índice do foguete)
  const seed  = parseInt(fi) + 1;
  const pontos = [
    { x: 80,  y: 340, label: ' Terra' },
    { x: 80 + seed * 60,  y: 260 - seed * 10, label: ' Ignição' },
    { x: 200 + seed * 50, y: 180 - seed * 15, label: ' Atmosfera' },
    { x: 340 + seed * 40, y: 100 - seed * 5,  label: ' Órbita' },
  ];
 
  // Gerar path SVG curvo entre os pontos
  let d = `M ${pontos[0].x} ${pontos[0].y}`;
  for (let i = 1; i < pontos.length; i++) {
    const prev = pontos[i - 1];
    const cur  = pontos[i];
    const cx   = (prev.x + cur.x) / 2;
    d += ` Q ${cx} ${prev.y} ${cur.x} ${cur.y}`;
  }
 
  // Montar SVG
  const pins = pontos.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="6" fill="#060b14" stroke="#00c8ff" stroke-width="2"/>
    <circle cx="${p.x}" cy="${p.y}" r="2" fill="#00c8ff"/>
    <line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${p.y - 28}" stroke="#00c8ff" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="${p.x}" y="${p.y - 34}" text-anchor="middle" fill="#00c8ff" font-size="11" font-family="monospace">${p.label}</text>
  `).join('');
 
  document.getElementById('traj-container').innerHTML = `
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" class="traj-svg">
      <!-- Grade de fundo -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,200,255,0.06)" stroke-width="1"/>
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="600" height="380" fill="#02080f"/>
      <rect width="600" height="380" fill="url(#grid)"/>
 
      <!-- Trajetória pontilhada (sombra) -->
      <path d="${d}" fill="none" stroke="rgba(0,200,255,0.15)" stroke-width="6" stroke-linecap="round"/>
      <!-- Trajetória principal animada -->
      <path id="traj-path" d="${d}" fill="none" stroke="#00c8ff" stroke-width="2.5"
        stroke-dasharray="600" stroke-dashoffset="600" stroke-linecap="round"
        filter="url(#glow)">
        <animate attributeName="stroke-dashoffset" from="600" to="0" dur="1.8s" fill="freeze"/>
      </path>
 
      <!-- Pins -->
      ${pins}
 
      <!-- Ícone do foguete animado -->
      <text id="icone-foguete" font-size="22" text-anchor="middle">
        <animateMotion dur="1.8s" fill="freeze" rotate="auto">
          <mpath href="#traj-path"/>
        </animateMotion>
        
      </text>
 
      <!-- Nome do foguete -->
      <text x="300" y="370" text-anchor="middle" fill="rgba(0,200,255,0.4)" font-size="11" font-family="monospace" letter-spacing="3">${f.nome.toUpperCase()}</text>
    </svg>`;
 
  // Info do foguete
  const info = document.getElementById('traj-info');
  info.style.display = 'flex';
  info.innerHTML = `
    <span> <b>${f.nome}</b></span>
    <span>Combustível: ${f.combustivel} L</span>
    <span>Temperatura: ${f.temperatura}°C</span>
    <span>Status: ${f.status}</span>`;
}
 
// ── Limpar trajetória───
function limparTrajetoria() {
  document.getElementById('traj-container').innerHTML =
    '<p class="vazio">Selecione um foguete para visualizar a trajetória.</p>';
  document.getElementById('traj-info').style.display = 'none';
}
