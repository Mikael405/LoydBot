const { SlashCommandBuilder } = require('discord.js');
const config = require('../config');
const { fmt, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loja')
    .setDescription('Mostra os itens à venda'),

  async execute(interaction) {
    const e = embed()
      .setTitle('🛒 Loja de Kains')
      .setDescription('Use `/comprar` para adquirir um item.');

    for (const item of Object.values(config.loja)) {
      e.addFields({
        name: `${item.emoji} ${item.nome}`,
        value: `${item.descricao}\n**Preço:** ${fmt(item.preco)}`,
      });
    }

    return interaction.reply({ embeds: [e] });
  },
};
