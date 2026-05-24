const API = 'http://localhost:8080';
const $ = id => document.getElementById(id);

if (localStorage.getItem('esp_session')) window.location.href = 'sistema.html';

function trocarTab(tab, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('ativo'));
  btn.classList.add('ativo');
  $('secLogin').classList.toggle('ativa', tab === 'login');
  $('secCadastro').classList.toggle('ativa', tab === 'cadastro');
  limparMsgs();
}

function limparMsgs() {
  ['msgLogin','msgCadastro'].forEach(id => { $(id).className = 'msg'; $(id).textContent = ''; });
}

function msg(id, tipo, txt) { $(id).className = 'msg ' + tipo; $(id).textContent = txt; }

function verSenha(inputId, btn) {
  const inp = $(inputId);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.querySelector('.icone-olho').innerHTML = inp.type === 'text'
    ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}

async function chamarAPI(endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return { ok: res.ok, data: await res.json() };
}

async function doLogin() {
  const nome = $('l-nome').value.trim(), senha = $('l-senha').value;
  if (!nome || !senha) return msg('msgLogin','erro','Preencha todos os campos.');
  try {
    const { ok, data } = await chamarAPI('/auth/login', { nome, senha });
    if (ok) { localStorage.setItem('esp_session', data.usuario); window.location.href = 'index.html'; }
    else msg('msgLogin','erro', data.erro);
  } catch { msg('msgLogin','erro','Não foi possível conectar ao servidor.'); }
}

async function doCadastro() {
  const nome = $('c-nome').value.trim(), senha = $('c-senha').value, senha2 = $('c-senha2').value;
  if (!nome || !senha || !senha2) return msg('msgCadastro','erro','Preencha todos os campos.');
  if (nome.length < 3)  return msg('msgCadastro','erro','Nome precisa ter ao menos 3 caracteres.');
  if (senha.length < 4) return msg('msgCadastro','erro','Senha precisa ter ao menos 4 caracteres.');
  if (senha !== senha2) return msg('msgCadastro','erro','As senhas não coincidem.');
  try {
    const { ok, data } = await chamarAPI('/auth/cadastrar', { nome, senha });
    if (ok) {
      msg('msgCadastro','ok', data.mensagem + ' Entrando...');
      setTimeout(() => { localStorage.setItem('esp_session', nome); window.location.href = 'index.html'; }, 1200);
    } else msg('msgCadastro','erro', data.erro);
  } catch { msg('msgCadastro','erro','Não foi possível conectar ao servidor.'); }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') $('secLogin').classList.contains('ativa') ? doLogin() : doCadastro();
});