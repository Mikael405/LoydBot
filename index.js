require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Events, REST, Routes, MessageFlags } = require('discord.js');
const db = require('./database');

if (!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN.includes('cole_o_token')) {
  console.error('❌ Falta o DISCORD_TOKEN no arquivo .env (veja o README).');
  process.exit(1);
}

db.carregar();

// Slash commands não precisam de nenhuma intent privilegiada.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carrega automaticamente tudo que estiver na pasta /commands
const pasta = path.join(__dirname, 'commands');
for (const arquivo of fs.readdirSync(pasta).filter((f) => f.endsWith('.js'))) {
  const cmd = require(path.join(pasta, arquivo));
  client.commands.set(cmd.data.name, cmd);
}

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Online como ${c.user.tag}`);

  // Registra os comandos automaticamente toda vez que o bot liga.
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const body = client.commands.map((cmd) => cmd.data.toJSON());
  const guildId = process.env.GUILD_ID;

  try {
    const rota = guildId
      ? Routes.applicationGuildCommands(c.user.id, guildId)
      : Routes.applicationCommands(c.user.id);
    await rest.put(rota, { body });
    console.log(`📜 ${body.length} comandos registrados ${guildId ? 'no seu servidor' : 'globalmente'}.`);
  } catch (erro) {
    console.error('❌ Erro ao registrar os comandos:', erro.message);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (erro) {
    console.error(`Erro no comando /${interaction.commandName}:`, erro);
    const aviso = { content: '❌ Ops, algo deu errado. Tente de novo!', flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) await interaction.followUp(aviso).catch(() => {});
    else await interaction.reply(aviso).catch(() => {});
  }
});

// Salva o banco ao fechar com Ctrl+C
process.on('SIGINT', () => {
  db.salvar();
  console.log('\n💾 Dados salvos. Até mais!');
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN).catch((erro) => {
  console.error('❌ Não consegui logar. O token está correto?', erro.message);
  process.exit(1);
});
