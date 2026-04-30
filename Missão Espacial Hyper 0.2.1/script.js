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
            <strong>🚀 ${f.nome}</strong>
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
            <strong>🛰️ ${s.nome}</strong>
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
    adicionar('> 🔥 IGNIÇÃO! LANÇAMENTO BEM-SUCEDIDO! ✓', 'verde');
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
