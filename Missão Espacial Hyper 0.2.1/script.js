const API_FOGUETES    = 'http://localhost:8080/foguetes';
const API_ASTRONAUTAS = 'http://localhost:8080/astronautas';
 
let foguetes   = [];
let astronautas = [];
const satelites = [];
 
// ── Carregar dados da API ──
async function carregarFoguetes() {
  try {
    const res = await fetch(API_FOGUETES);
    foguetes = await res.json();
    preencherSelects();
    preencherSelectTrajetoria();
  } catch (e) { console.error('Erro ao carregar foguetes:', e); }
}
 
async function carregarAstronautas() {
  try {
    const res = await fetch(API_ASTRONAUTAS);
    astronautas = await res.json();
  } catch (e) { console.error('Erro ao carregar astronautas:', e); }
}
 
// ── Registrar astronauta ──
async function registrarAstronauta() {
  const [nome, idade, nacionalidade, especializacao] = lerCampos(['a-nome','a-idade','a-nac','a-esp']);
  if (!nome || !nacionalidade || idade === '' || isNaN(+idade))
    return mostrarAlerta('alerta-astronauta', '⚠ Preencha todos os campos.', 'erro');
  try {
    const res = await fetch(API_ASTRONAUTAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, idade: +idade, nacionalidade, especializacao })
    });
    const novo = await res.json();
    astronautas.push(novo);
    mostrarAlerta('alerta-astronauta', `✓ Astronauta "${nome}" registrado!`, 'ok');
    ['a-nome','a-idade','a-nac'].forEach(id => document.getElementById(id).value = '');
  } catch (e) {
    mostrarAlerta('alerta-astronauta', '✗ Erro ao conectar com o servidor.', 'erro');
  }
}
 
// ── Navegação ──
function trocarAba(id, botao) {
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('ativo'));
  document.getElementById(id).classList.add('ativa');
  botao.classList.add('ativo');
  if (id === 'astronautas') carregarAstronautas();
  if (id === 'hangar')     renderizarHangar();
  if (id === 'simulacao')  preencherSelects();
  if (id === 'trajetoria') preencherSelectTrajetoria();
}
 
// ── Alerta temporário ──
function mostrarAlerta(id, msg, tipo) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'alerta ' + tipo;
  setTimeout(() => el.className = 'alerta', 3000);
}
 
function lerCampos(ids) {
  return ids.map(id => {
    const el = document.getElementById(id);
    return el.tagName === 'SELECT' ? el.value : el.value.trim();
  });
}
 
// ── Registrar foguete 
async function registrarFoguete() {
  const [nome, carga, comb, temp, status] = lerCampos(['f-nome','f-carga','f-combustivel','f-temperatura','f-status']);
  if (!nome || [carga,comb,temp].some(v => v === '' || isNaN(+v)))
    return mostrarAlerta('alerta-foguete', '⚠ Preencha todos os campos.', 'erro');
 
  try {
    const res = await fetch(API_FOGUETES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, carga: +carga, combustivel: +comb, temperatura: +temp, status })
    });
 
    const novoFoguete = await res.json();
    foguetes.push(novoFoguete);
    mostrarAlerta('alerta-foguete', `✓ Foguete "${nome}" registrado!`, 'ok');
    preencherSelects();
    preencherSelectTrajetoria();
    ['f-nome','f-carga','f-combustivel','f-temperatura'].forEach(id => document.getElementById(id).value = '');
  } catch (e) {
    mostrarAlerta('alerta-foguete', '✗ Erro ao conectar com o servidor.', 'erro');
  }
}
 
// ── Registrar satélite  ──
function registrarSatelite() {
  const [nome, massa, energia, orbita, obs, tempo] = lerCampos(['s-nome','s-massa','s-energia','s-orbita','s-obs','s-tempo']);
  if (!nome || [massa,energia].some(v => v === '' || isNaN(+v)))
    return mostrarAlerta('alerta-satelite', '⚠ Preencha todos os campos.', 'erro');
 
  satelites.push({ nome, massa:+massa, energia:+energia, orbita, obs, tempo, status:'Inativo' });
  mostrarAlerta('alerta-satelite', `✓ Satélite "${nome}" registrado!`, 'ok');
  ['s-nome','s-massa','s-energia'].forEach(id => document.getElementById(id).value = '');
}
 
// ── Deletar foguete ──
function deletarFoguete(i) {
  foguetes.splice(i, 1);
  preencherSelects();
  preencherSelectTrajetoria();
  renderizarHangar();
}
 
// ── Renderizar Hangar ──
function renderizarHangar() {
  document.getElementById('qtd-astronautas').textContent = astronautas.length;
  document.getElementById('qtd-foguetes').textContent    = foguetes.length;
  document.getElementById('qtd-satelites').textContent   = satelites.length;
 
  document.getElementById('lista-astronautas').innerHTML = astronautas.length
    ? astronautas.map(a => `<div class="item"><strong>👨‍🚀 ${a.nome}</strong>
        <span>Idade: ${a.idade}</span><span>Nacionalidade: ${a.nac}</span>
        <span class="badge">${a.esp}</span></div>`).join('')
    : '<p class="vazio">Nenhum astronauta registrado.</p>';
 
  document.getElementById('lista-foguetes').innerHTML = foguetes.length
    ? foguetes.map((f, i) => `<div class="item"><strong> ${f.nome}</strong>
        <span>Carga: ${f.carga} kg</span><span>Combustível: ${f.combustivel} L</span>
        <span>Temperatura: ${f.temperatura}°C</span><span class="badge">${f.status}</span>
        <button class="btn vermelho" style="padding:4px 12px;font-size:11px" onclick="deletarFoguete(${i})">✕ Deletar</button></div>`).join('')
    : '<p class="vazio">Nenhum foguete registrado.</p>';
 
  document.getElementById('lista-satelites').innerHTML = satelites.length
    ? satelites.map(s => `<div class="item"><strong> ${s.nome}</strong>
        <span>Massa: ${s.massa} kg</span><span>Órbita: ${s.orbita}</span>
        <span>Energia: ${s.energia}%</span><span>Função: ${s.obs}</span>
        <span class="badge">${s.status}</span></div>`).join('')
    : '<p class="vazio">Nenhum satélite registrado.</p>';
}
 
// ── Preencher selects ──
function opcoes(arr) {
  return arr.map((x, i) => `<option value="${i}">${x.nome}</option>`).join('');
}
function preencherSelects() {
  document.getElementById('sim-foguete').innerHTML  = '<option value="">-- Selecionar Foguete --</option>'  + opcoes(foguetes);
  document.getElementById('sim-satelite').innerHTML = '<option value="">-- Selecionar Satélite --</option>' + opcoes(satelites);
}
function preencherSelectTrajetoria() {
  document.getElementById('traj-foguete').innerHTML = '<option value="">-- Selecionar Foguete --</option>' + opcoes(foguetes);
}
 
// ── Simulação ──
function simularLancamento() {
  const fi = document.getElementById('sim-foguete').value;
  if (fi === '') return alert('Selecione um foguete!');
 
  const f   = foguetes[+fi];
  const si  = document.getElementById('sim-satelite').value;
  const s   = si !== '' ? satelites[+si] : null;
  const log = [];
  const add = (txt, cor='') => log.push({ txt, cor });
 
  add('> INICIANDO LANÇAMENTO...', 'azul');
  add(`> Foguete: ${f.nome} | Combustível: ${f.combustivel} L`);
  add(f.temperatura > 70
    ? `> ⚠ Temperatura ALTA: ${f.temperatura}°C — resfriando...` : `> ✓ Temperatura normal: ${f.temperatura}°C`,
    f.temperatura > 70 ? 'amarelo' : 'verde');
 
  f.combustivel += 100;
  add(`> Abastecimento: +100 L → Total: ${f.combustivel} L`);
  add('> 5... 4... 3... 2... 1...');
 
  const ok = f.combustivel > 400;
  if (ok) {
    add('>  LANÇAMENTO BEM-SUCEDIDO!', 'verde');
    f.status = 'Lançado';
    if (s) {
      add(`> Separando satélite ${s.nome}...`);
      s.energia = Math.min(100, s.energia + 20);
      add(`> ✓ Satélite em órbita ${s.orbita} | Energia: ${s.energia}%`, 'verde');
      s.status = 'Ativo';
      add('> ✓ MISSÃO CONCLUÍDA!', 'verde');
    } else {
      add('> ✓ LANÇAMENTO CONCLUÍDO!', 'verde');
    }
  } else {
    add(`> ✗ FALHA! Combustível insuficiente: ${f.combustivel} L (mínimo: 400 L)`, 'vermelho');
    f.status = 'Falha';
    add('> ✗ MISSÃO FALHOU!', 'vermelho');
  }
 
  document.getElementById('terminal').innerHTML = log.map((l, i) =>
    `<span class="${l.cor}" style="animation-delay:${i * 100}ms">${l.txt}</span>`).join('');
 
  const tel = document.getElementById('telemetria');
  tel.style.display = 'grid';
  document.getElementById('t-comb').textContent  = f.combustivel;
  document.getElementById('t-temp').textContent  = f.temperatura;
  document.getElementById('t-ener').textContent  = s ? s.energia : '--';
  const stEl = document.getElementById('t-status');
  stEl.textContent = ok ? '✓ OK' : '✗ FALHA';
  stEl.style.color = ok ? '#00ff9d' : '#ff3d5a';
}
 
function limparSimulacao() {
  document.getElementById('terminal').innerHTML = '<span class="azul">// SISTEMA PRONTO. AGUARDANDO INSTRUÇÃO...</span>';
  document.getElementById('telemetria').style.display = 'none';
}
 
// ── Trajetória ──
function mostrarTrajetoria() {
  const fi = document.getElementById('traj-foguete').value;
  if (fi === '') return alert('Selecione um foguete!');
 
  const f    = foguetes[+fi];
  const seed = +fi + 1;
  const pts  = [
    { x: 80,                   y: 340, label: 'Terra' },
    { x: 80  + seed * 60,      y: 260 - seed * 10, label: 'Ignição' },
    { x: 200 + seed * 50,      y: 180 - seed * 15, label: 'Atmosfera' },
    { x: 340 + seed * 40,      y: 100 - seed * 5,  label: 'Órbita' },
  ];
 
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i-1].x + pts[i].x) / 2;
    d += ` Q ${cx} ${pts[i-1].y} ${pts[i].x} ${pts[i].y}`;
  }
 
  const pins = pts.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="6" fill="#060b14" stroke="#00c8ff" stroke-width="2"/>
    <circle cx="${p.x}" cy="${p.y}" r="2" fill="#00c8ff"/>
    <line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${p.y-28}" stroke="#00c8ff" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="${p.x}" y="${p.y-34}" text-anchor="middle" fill="#00c8ff" font-size="11" font-family="monospace">${p.label}</text>`).join('');
 
  document.getElementById('traj-container').innerHTML = `
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" class="traj-svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(0,200,255,0.06)" stroke-width="1"/>
        </pattern>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="600" height="380" fill="#02080f"/>
      <rect width="600" height="380" fill="url(#grid)"/>
      <path d="${d}" fill="none" stroke="rgba(0,200,255,0.15)" stroke-width="6" stroke-linecap="round"/>
      <path id="traj-path" d="${d}" fill="none" stroke="#00c8ff" stroke-width="2.5"
        stroke-dasharray="600" stroke-dashoffset="600" stroke-linecap="round" filter="url(#glow)">
        <animate attributeName="stroke-dashoffset" from="600" to="0" dur="1.8s" fill="freeze"/>
      </path>
      ${pins}
      <text font-size="22" text-anchor="middle">
        <animateMotion dur="1.8s" fill="freeze" rotate="auto"><mpath href="#traj-path"/></animateMotion>
      </text>
      <text x="300" y="370" text-anchor="middle" fill="rgba(0,200,255,0.4)" font-size="11" font-family="monospace" letter-spacing="3">${f.nome.toUpperCase()}</text>
    </svg>`;
 
  const info = document.getElementById('traj-info');
  info.style.display = 'flex';
  info.innerHTML = `<span> <b>${f.nome}</b></span><span>Combustível: ${f.combustivel} L</span>
    <span>Temperatura: ${f.temperatura}°C</span><span>Status: ${f.status}</span>`;
}
 
function limparTrajetoria() {
  document.getElementById('traj-container').innerHTML = '<p class="vazio">Selecione um foguete para visualizar a trajetória.</p>';
  document.getElementById('traj-info').style.display = 'none';
}
 
// ── Iniciar ──
carregarFoguetes();
carregarAstronautas();

