const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config');
const { fmt, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventario')
    .setDescription('Mostra os itens que você tem'),

  async execute(interaction) {
    const user = db.getUser(interaction.user.id);

    const linhas = Object.entries(user.inventario)
      .filter(([, qtd]) => qtd > 0)
      .map(([id, qtd]) => {
        const item = config.loja[id];
        return item ? `${item.emoji} **${item.nome}** x${qtd}\n└ ${item.descricao}` : `❔ ${id} x${qtd}`;
      });

    return interaction.reply({
      embeds: [
        embed()
          .setTitle(`🎒 Inventário de ${interaction.user.displayName ?? interaction.user.username}`)
          .setDescription(linhas.length ? linhas.join('\n\n') : 'Seu inventário está vazio por enquanto. Use `/loja` para ver os itens à venda!')
          .setFooter({ text: `Carteira: ${user.carteira.toLocaleString('pt-BR')} ${config.moeda.nome}` }),
      ],
    });
  },
};
