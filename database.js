// Banco de dados simples em arquivo JSON (data/db.json).
// Não precisa instalar nada extra e é mais que suficiente para um bot pequeno.
//
// Obs.: os comandos alteram os dados e salvam ANTES de responder (sem "await"
// no meio), então não há risco de dois comandos se atropelarem.

const fs = require('fs');
const path = require('path');
const config = require('./config');

const PASTA = path.join(__dirname, 'data');
const ARQUIVO = path.join(PASTA, 'db.json');

let db = { users: {} };

function salvar() {
  // Escreve num arquivo temporário e renomeia: evita corromper o banco se o bot cair no meio.
  const tmp = ARQUIVO + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, ARQUIVO);
}

function carregar() {
  fs.mkdirSync(PASTA, { recursive: true });
  if (!fs.existsSync(ARQUIVO)) return salvar();

  try {
    db = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));
    if (!db.users) db.users = {};
  } catch (erro) {
    const backup = `${ARQUIVO}.corrompido-${Date.now()}`;
    fs.copyFileSync(ARQUIVO, backup);
    console.error(`⚠️ db.json estava corrompido. Backup salvo em ${backup}. Começando um banco novo.`);
    db = { users: {} };
    salvar();
  }
}

function getUser(id) {
  if (!db.users[id]) {
    db.users[id] = {
      carteira: config.saldoInicial,
      banco: 0,
      inventario: {},
      cooldowns: {},
    };
  }
  return db.users[id];
}

// Retorna quantos ms faltam para o cooldown acabar (0 = liberado)
function cooldownRestante(user, chave, duracao) {
  const fim = (user.cooldowns[chave] || 0) + duracao;
  return Math.max(0, fim - Date.now());
}

function iniciarCooldown(user, chave) {
  user.cooldowns[chave] = Date.now();
}

module.exports = { carregar, salvar, getUser, cooldownRestante, iniciarCooldown };
