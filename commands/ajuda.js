const { SlashCommandBuilder } = require('discord.js');
const config = require('../config');
const { embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Lista todos os comandos do bot'),

  async execute(interaction) {
    return interaction.reply({
      embeds: [
        embed()
          .setTitle(`${config.moeda.emoji} Economia de ${config.moeda.nome}`)
          .setDescription(
            [
              '**Ganhar**',
              '`/coletar` — ganha uns trocados (cooldown curto)',
              '`/trabalhar` — ganha mais, mas demora mais para repetir',
              '`/minerar` — minera minérios valiosos (precisa de picareta)',
              '',
              '**Dinheiro**',
              '`/saldo` — vê sua carteira e seu banco',
              '`/depositar` — guarda Kains no banco',
              '`/sacar` — tira Kains do banco',
              '',
              '**Loja**',
              '`/loja` — vê os itens à venda',
              '`/comprar` — compra um item',
              '`/inventario` — vê o que você tem',
            ].join('\n')
          ),
      ],
    });
  },
};
