const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../database');
const { fmt, parseQuantia, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('depositar')
    .setDescription('Guarda Kains da carteira no banco')
    .addStringOption((o) =>
      o.setName('quantia').setDescription('Um número ou "tudo"').setRequired(true)
    ),

  async execute(interaction) {
    const user = db.getUser(interaction.user.id);
    const quantia = parseQuantia(interaction.options.getString('quantia'), user.carteira);

    if (!quantia) {
      return interaction.reply({
        content: '❌ Informe uma quantia válida (um número maior que zero ou "tudo").',
        flags: MessageFlags.Ephemeral,
      });
    }
    if (quantia > user.carteira) {
      return interaction.reply({
        content: `❌ Você só tem ${fmt(user.carteira)} na carteira.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    user.carteira -= quantia;
    user.banco += quantia;
    db.salvar();

    return interaction.reply({
      embeds: [
        embed()
          .setTitle('🏦 Depósito realizado')
          .setDescription(`Você depositou ${fmt(quantia)}.`)
          .addFields(
            { name: '👛 Carteira', value: fmt(user.carteira), inline: true },
            { name: '🏦 Banco', value: fmt(user.banco), inline: true }
          ),
      ],
    });
  },
};
