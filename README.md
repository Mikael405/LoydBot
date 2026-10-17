# 🪙 Kains Bot — bot de economia para Discord

Bot simples de economia feito com Node.js (discord.js v14). A moeda é o **Kains**.

## Comandos

| Comando | O que faz |
|---|---|
| `/coletar` | Ganha uns Kains (cooldown de 30s) |
| `/trabalhar` | Ganha mais Kains (cooldown de 2min) |
| `/saldo [usuario]` | Mostra carteira, banco e total |
| `/depositar <quantia>` | Carteira → banco (aceita `tudo`) |
| `/sacar <quantia>` | Banco → carteira (aceita `tudo`) |
| `/loja` | Lista os itens à venda |
| `/comprar <item> [quantidade]` | Compra um item |
| `/inventario` | Mostra seus itens |
| `/ajuda` | Lista os comandos |

Item de teste na loja: **⛏️ Picareta de Ferro** (500 Kains) — dá +50% no `/coletar`.

---

## Como rodar na sua máquina (passo a passo)

### 1. Instale o Node.js
Baixe a versão **LTS** em https://nodejs.org e instale (versão 18 ou mais nova).
Para conferir, abra o terminal e rode `node --version`.

### 2. Crie o bot no Discord
1. Acesse https://discord.com/developers/applications → **New Application** → dê um nome.
2. No menu **Bot**, clique em **Reset Token** e **copie o token** (guarde como senha, nunca compartilhe!).
3. No menu **OAuth2 → URL Generator**:
   - Em *Scopes*, marque `bot` e `applications.commands`.
   - Em *Bot Permissions*, marque `Send Messages` e `Embed Links`.
   - Abra a URL gerada no final da página e adicione o bot ao seu servidor.

> Não precisa ligar nenhuma "Privileged Gateway Intent".

### 3. (Opcional, recomendado) Pegue o ID do seu servidor
No Discord: *Configurações → Avançado → Modo Desenvolvedor* (ligado). Depois clique com o botão direito no ícone do servidor → **Copiar ID do servidor**.
Com isso os comandos aparecem na hora; sem isso podem demorar um pouco.

### 4. Ligue o bot
Abra o terminal **dentro desta pasta** e escolha **uma** das opções:

**Opção A — assistente em Python (mais fácil)**
```
python iniciar.py
```
Ele confere o Node, pergunta o token (e o ID do servidor), instala tudo e liga o bot.

**Opção B — manual**
```
npm install
```
Copie `.env.example` para `.env`, abra no bloco de notas e preencha o `DISCORD_TOKEN` (e o `GUILD_ID`, se quiser). Depois:
```
npm start
```

Quando aparecer `✅ Online como ...` o bot está funcionando. Vá ao Discord e digite `/` para ver os comandos! Para desligar, use **Ctrl+C**.

---

## Estrutura

```
kains-bot/
├── index.js        # liga o bot e registra os comandos
├── config.js       # moeda, cooldowns, valores e itens da loja
├── database.js     # banco em arquivo JSON (data/db.json)
├── utils.js        # funções auxiliares
├── iniciar.py      # assistente de instalação (Python)
└── commands/       # um arquivo por comando
```

- **Ajustar valores** (ganhos, cooldowns, preço): edite o `config.js`.
- **Novo item na loja**: copie o bloco da picareta em `config.js` e troque os dados.
- **Novo comando**: crie um arquivo em `commands/` seguindo o modelo dos outros — ele é carregado sozinho.
- Os dados ficam em `data/db.json`. Para zerar a economia, apague esse arquivo com o bot desligado.
