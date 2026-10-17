const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../database');
const { fmt, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('saldo')
    .setDescription('Mostra seu saldo de Kains')
    .addUserOption((o) =>
      o.setName('usuario').setDescription('Ver o saldo de outra pessoa (opcional)')
    ),

  async execute(interaction) {
    const alvo = interaction.options.getUser('usuario') ?? interaction.user;

    if (alvo.bot) {
      return interaction.reply({ content: '🤖 Bots não têm conta bancária.', flags: MessageFlags.Ephemeral });
    }

    const u = db.getUser(alvo.id);
    db.salvar();

    return interaction.reply({
      embeds: [
        embed()
          .setTitle(`💰 Saldo de ${alvo.displayName ?? alvo.username}`)
          .addFields(
            { name: '👛 Carteira', value: fmt(u.carteira), inline: true },
            { name: '🏦 Banco', value: fmt(u.banco), inline: true },
            { name: '📊 Total', value: fmt(u.carteira + u.banco), inline: true }
          ),
      ],
    });
  },
};
