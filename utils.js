const { EmbedBuilder } = require('discord.js');
const config = require('./config');

// 1234 -> "🪙 **1.234** Kains"
const fmt = (n) => `${config.moeda.emoji} **${n.toLocaleString('pt-BR')}** ${config.moeda.nome}`;

const aleatorio = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Gera o "daqui a pouco" do Discord, ex.: <t:1700000000:R> vira "em 30 segundos"
const quando = (ms) => `<t:${Math.floor((Date.now() + ms) / 1000)}:R>`;

// Aceita "100", "1.000" ou "tudo". Retorna null se for inválido.
function parseQuantia(texto, max) {
  const t = texto.trim().toLowerCase();
  if (['tudo', 'all', 'max'].includes(t)) return max;
  const n = parseInt(t.replace(/[.,\s]/g, ''), 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

const embed = () => new EmbedBuilder().setColor(config.cor).setTimestamp();

module.exports = { fmt, aleatorio, quando, parseQuantia, embed };
