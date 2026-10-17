// Configurações do bot: mexa aqui para ajustar a economia sem tocar nos comandos.

module.exports = {
  moeda: { nome: 'Kains', emoji: '🪙' },
  cor: 0xf1c40f,

  // Quanto cada usuário novo recebe ao criar a conta
  saldoInicial: 100,

  // Tempos em milissegundos
  coletar: { cooldown: 30_000, min: 20, max: 60 },
  trabalhar: { cooldown: 120_000, min: 100, max: 250 },

  // Só quem tem a Picareta consegue minerar. Cada minério tem um peso (chance relativa).
  minerar: {
    cooldown: 60_000,
    minerios: [
      { nome: 'Carvão', emoji: '⚫', min: 40, max: 80, peso: 45 },
      { nome: 'Ferro', emoji: '🔩', min: 80, max: 140, peso: 30 },
      { nome: 'Ouro', emoji: '🟡', min: 140, max: 220, peso: 17 },
      { nome: 'Diamante', emoji: '💎', min: 250, max: 400, peso: 7 },
      { nome: 'Esmeralda', emoji: '💚', min: 450, max: 700, peso: 1 },
    ],
  },

  // Bônus de quem tem a Picareta (0.5 = +50% no /coletar)
  bonusPicareta: 0.5,

  empregos: [
    'programou um site para um cliente',
    'entregou pizzas pela cidade',
    'consertou o computador do vizinho',
    'trabalhou de barista numa cafeteria',
    'ajudou numa mudança',
    'fez um bico como designer',
    'cuidou do pet de um amigo',
    'vendeu limonada na calçada',
  ],

  coletaveis: [
    'achou Kains caídos no chão',
    'devolveu uma carteira perdida ao dono',
    'minerou algumas pepitas brilhantes',
    'vendeu cogumelos que colheu na floresta',
    'achou um baú escondido atrás de uma árvore',
    'pescou um peixe dourado raríssimo',
  ],

  // Itens da loja. Para adicionar mais, é só copiar um bloco.
  loja: {
    picareta: {
      id: 'picareta',
      nome: 'Picareta de Ferro',
      emoji: '⛏️',
      preco: 500,
      unico: true, // só pode ter uma
      descricao: 'Libera o /minerar e aumenta em 50% o que você ganha no /coletar.',
    },
  },
};
