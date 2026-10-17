const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../database');
const config = require('../config');
const { fmt, aleatorio, quando, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coletar')
    .setDescription('Coleta alguns Kains pelo caminho'),

  async execute(interaction) {
    const user = db.getUser(interaction.user.id);
    const { cooldown, min, max } = config.coletar;

    const falta = db.cooldownRestante(user, 'coletar', cooldown);
    if (falta > 0) {
      return interaction.reply({
        content: `⏳ Você já coletou há pouco! Tente de novo ${quando(falta)}.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    let ganho = aleatorio(min, max);
    let extra = '';
    if (user.inventario.picareta > 0) {
      const bonus = Math.round(ganho * config.bonusPicareta);
      ganho += bonus;
      extra = `\n⛏️ Bônus da picareta: **+${bonus}**`;
    }

    user.carteira += ganho;
    db.iniciarCooldown(user, 'coletar');
    db.salvar();

    const frase = config.coletaveis[aleatorio(0, config.coletaveis.length - 1)];
    return interaction.reply({
      embeds: [
        embed()
          .setTitle('🌿 Coleta')
          .setDescription(`Você ${frase} e ganhou ${fmt(ganho)}!${extra}`)
          .setFooter({ text: `Carteira: ${user.carteira.toLocaleString('pt-BR')} ${config.moeda.nome}` }),
      ],
    });
  },
};
