const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../database');
const config = require('../config');
const { fmt, aleatorio, quando, embed } = require('../utils');

// Sorteia um minério levando em conta o "peso" de cada um (os raros têm peso menor)
function sortearMinerio() {
  const { minerios } = config.minerar;
  let sorteio = Math.random() * minerios.reduce((soma, m) => soma + m.peso, 0);
  for (const minerio of minerios) {
    sorteio -= minerio.peso;
    if (sorteio <= 0) return minerio;
  }
  return minerios[0];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minerar')
    .setDescription('Minera minérios valiosos (precisa de uma picareta)'),

  async execute(interaction) {
    const user = db.getUser(interaction.user.id);

    if (!(user.inventario.picareta > 0)) {
      return interaction.reply({
        content: '⛏️ Você tenta minerar com as próprias mãos, mas não tem nem arranhão na pedra! Use `/loja` para comprar a sua picareta e voltar para a mina.',
        flags: MessageFlags.Ephemeral,
      });
    }

    const falta = db.cooldownRestante(user, 'minerar', config.minerar.cooldown);
    if (falta > 0) {
      return interaction.reply({
        content: `⏳ Sua picareta precisa descansar! Volte a minerar ${quando(falta)}.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const minerio = sortearMinerio();
    const ganho = aleatorio(minerio.min, minerio.max);

    user.carteira += ganho;
    db.iniciarCooldown(user, 'minerar');
    db.salvar();

    return interaction.reply({
      embeds: [
        embed()
          .setTitle('⛏️ Mineração')
          .setDescription(`Você minerou **${minerio.emoji} ${minerio.nome}** e vendeu por ${fmt(ganho)}!`)
          .setFooter({ text: `Carteira: ${user.carteira.toLocaleString('pt-BR')} ${config.moeda.nome}` }),
      ],
    });
  },
};
