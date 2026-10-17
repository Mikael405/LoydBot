const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../database');
const config = require('../config');
const { fmt, aleatorio, quando, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trabalhar')
    .setDescription('Trabalha para ganhar uma boa quantia de Kains'),

  async execute(interaction) {
    const user = db.getUser(interaction.user.id);
    const { cooldown, min, max } = config.trabalhar;

    const falta = db.cooldownRestante(user, 'trabalhar', cooldown);
    if (falta > 0) {
      return interaction.reply({
        content: `😮‍💨 Você está cansado de tanto trabalhar! Volte ${quando(falta)}.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const ganho = aleatorio(min, max);
    user.carteira += ganho;
    db.iniciarCooldown(user, 'trabalhar');
    db.salvar();

    const emprego = config.empregos[aleatorio(0, config.empregos.length - 1)];
    return interaction.reply({
      embeds: [
        embed()
          .setTitle('💼 Trabalho')
          .setDescription(`Você ${emprego} e recebeu ${fmt(ganho)}!`)
          .setFooter({ text: `Carteira: ${user.carteira.toLocaleString('pt-BR')} ${config.moeda.nome}` }),
      ],
    });
  },
};
