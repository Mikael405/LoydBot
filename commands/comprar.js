const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../database');
const config = require('../config');
const { fmt, embed } = require('../utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comprar')
    .setDescription('Compra um item da loja')
    .addStringOption((o) => {
      o.setName('item').setDescription('Item da loja').setRequired(true);
      for (const item of Object.values(config.loja)) {
        o.addChoices({ name: `${item.nome} — ${item.preco} ${config.moeda.nome}`, value: item.id });
      }
      return o;
    })
    .addIntegerOption((o) =>
      o.setName('quantidade').setDescription('Quantidade (padrão: 1)').setMinValue(1).setMaxValue(100)
    ),

  async execute(interaction) {
    const item = config.loja[interaction.options.getString('item')];
    const qtd = interaction.options.getInteger('quantidade') ?? 1;
    const user = db.getUser(interaction.user.id);

    if (!item) {
      return interaction.reply({ content: '❌ Esse item não existe.', flags: MessageFlags.Ephemeral });
    }

    const jaTem = user.inventario[item.id] || 0;
    if (item.unico && (jaTem > 0 || qtd > 1)) {
      return interaction.reply({
        content: `❌ **${item.nome}** é um item único: você só pode ter um.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const total = item.preco * qtd;
    if (user.carteira < total) {
      return interaction.reply({
        content: `❌ Faltam ${fmt(total - user.carteira)}. Você tem ${fmt(user.carteira)} na carteira.\n💡 Dica: se o dinheiro está no banco, use \`/sacar\`.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    user.carteira -= total;
    user.inventario[item.id] = jaTem + qtd;
    db.salvar();

    return interaction.reply({
      embeds: [
        embed()
          .setTitle('✅ Compra realizada')
          .setDescription(`Você comprou **${qtd}x ${item.emoji} ${item.nome}** por ${fmt(total)}.`)
          .setFooter({ text: `Carteira: ${user.carteira.toLocaleString('pt-BR')} ${config.moeda.nome}` }),
      ],
    });
  },
};
