const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../database');
const { fmt, parseQuantia, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sacar')
    .setDescription('Saca Kains do banco para a carteira')
    .addStringOption((o) =>
      o.setName('quantia').setDescription('Um número ou "tudo"').setRequired(true)
    ),

  async execute(interaction) {
    const user = db.getUser(interaction.user.id);
    const quantia = parseQuantia(interaction.options.getString('quantia'), user.banco);

    if (!quantia) {
      return interaction.reply({
        content: '❌ Informe uma quantia válida (um número maior que zero ou "tudo").',
        flags: MessageFlags.Ephemeral,
      });
    }
    if (quantia > user.banco) {
      return interaction.reply({
        content: `❌ Você só tem ${fmt(user.banco)} no banco.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    user.banco -= quantia;
    user.carteira += quantia;
    db.salvar();

    return interaction.reply({
      embeds: [
        embed()
          .setTitle('🏧 Saque realizado')
          .setDescription(`Você sacou ${fmt(quantia)}.`)
          .addFields(
            { name: '👛 Carteira', value: fmt(user.carteira), inline: true },
            { name: '🏦 Banco', value: fmt(user.banco), inline: true }
          ),
      ],
    });
  },
};
