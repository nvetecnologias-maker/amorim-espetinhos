import type { Category, MenuData, Product, Settings } from '@/types'

/**
 * Cardápio do Ponto da Costela, transcrito das artes oficiais do cardápio
 * (páginas "Cardápio" e "Bebidas"). Produtos, descrições e preços são
 * exatamente os das artes. Tudo é editável no painel (#/admin).
 */
export const seedCategories: Category[] = [
  { id: 'prato-feito', name: 'Prato Feito', tagline: 'Prato completo com arroz e acompanhamentos.', accent: '#F47A20', layout: 'grid', notesPreset: 'carne', section: 'cardapio', order: 1 },
  { id: 'porcoes', name: 'Porções', tagline: 'Pra dividir na mesa (ou não).', accent: '#F47A20', layout: 'grid', notesPreset: 'porcao', section: 'cardapio', order: 2 },
  { id: 'combos', name: 'Combos', tagline: 'A costela com tudo que ela merece.', accent: '#F47A20', layout: 'combo', notesPreset: 'carne', section: 'cardapio', order: 3 },
  { id: 'assados', name: 'Assados', tagline: 'Costela, contra filé e picanha.', accent: '#F47A20', layout: 'large', notesPreset: 'carne', section: 'cardapio', order: 4 },
  { id: 'escondidinho', name: 'Escondidinho', tagline: 'Escondidinho de costela.', accent: '#F47A20', layout: 'grid', notesPreset: 'nenhum', section: 'cardapio', order: 5 },
  { id: 'lanches', name: 'Lanches', tagline: 'Com hambúrguer de costela.', accent: '#F47A20', layout: 'grid', notesPreset: 'lanche', section: 'cardapio', order: 6 },
  { id: 'sanduiches', name: 'Sanduíches', tagline: 'Costela desfiada no pão.', accent: '#F47A20', layout: 'grid', notesPreset: 'lanche', section: 'cardapio', order: 7 },
  { id: 'acompanhamentos', name: 'Acompanhamentos', tagline: 'Pra completar o prato.', accent: '#F47A20', layout: 'compact', notesPreset: 'nenhum', section: 'cardapio', order: 8 },
  { id: 'cervejas', name: 'Cervejas', tagline: 'Garrafa, lata, chopp e long neck.', accent: '#F47A20', layout: 'drinks', notesPreset: 'bebida', section: 'bebidas', order: 9 },
  { id: 'refrigerantes', name: 'Refrigerantes', tagline: 'Gelado pra acompanhar.', accent: '#F47A20', layout: 'drinks', notesPreset: 'bebida', section: 'bebidas', order: 10 },
  { id: 'diversos', name: 'Diversos', tagline: 'Energéticos, sucos, caipirinha e mais.', accent: '#F47A20', layout: 'drinks', notesPreset: 'bebida', section: 'bebidas', order: 11 },
]

const REFRI_LATA = ['Coca-Cola', 'Guaraná', 'Fanta', 'Sprite', 'Pepsi', 'Soda']

let order = 0
type Input = Pick<Product, 'id' | 'categoryId' | 'name' | 'price'> & Partial<Product>
const p = (x: Input): Product => ({
  titleTop: '',
  titleBottom: x.name,
  description: '',
  longDescription: '',
  ingredients: [],
  image: '',
  badges: [],
  available: true,
  featured: false,
  order: ++order,
  ...x,
})

export const seedProducts: Product[] = [
  // ——— Prato Feito ———
  p({ id: 'pf-costela', image: '/photos/pf-costela.webp', featured: true, categoryId: 'prato-feito', name: 'Costela', orderName: 'Prato Feito de Costela', price: 2990, description: 'Arroz, farofa, vinagrete, mandioca e costela.' }),
  p({ id: 'pf-frango-parmegiana', image: '/photos/parmegiana.webp', categoryId: 'prato-feito', name: 'Frango à Parmegiana', orderName: 'Prato Feito Frango à Parmegiana', price: 2490, description: 'Arroz, frango à parmegiana e batata frita.' }),
  p({ id: 'pf-bife-parmegiana', image: '/photos/parmegiana.webp', categoryId: 'prato-feito', name: 'Bife à Parmegiana', orderName: 'Prato Feito Bife à Parmegiana', price: 2990, description: 'Arroz, bife à parmegiana e batata frita.' }),

  // ——— Porções ———
  p({ id: 'batata-frita', image: '/photos/batata-frita.webp', categoryId: 'porcoes', name: 'Batata Frita', orderName: 'Porção de Batata Frita', detail: '500g in natura', price: 2490 }),
  p({ id: 'batata-catupiry-costela', image: '/photos/batata-catupiry-costela.webp', featured: true, categoryId: 'porcoes', name: 'Batata Frita com Catupiry e Costela', orderName: 'Porção de Batata Frita com Catupiry e Costela', price: 3990 }),
  p({ id: 'bolinho-costela', image: '/photos/bolinho-costela.webp', featured: true, categoryId: 'porcoes', name: 'Bolinho de Costela', orderName: 'Porção de Bolinho de Costela', detail: '8 unidades', price: 3990 }),
  p({ id: 'aneis-cebola', image: '/photos/aneis-cebola.webp', categoryId: 'porcoes', name: 'Anéis de Cebola', orderName: 'Porção de Anéis de Cebola', detail: '250g in natura', price: 1990 }),
  p({ id: 'dadinho-tapioca', image: '/photos/dadinho-tapioca.webp', categoryId: 'porcoes', name: 'Dadinho de Tapioca', orderName: 'Porção de Dadinho de Tapioca', detail: '15 unidades', price: 1990 }),
  p({ id: 'ovo-codorna', image: '/photos/ovo-codorna.webp', categoryId: 'porcoes', name: 'Ovo de Codorna', orderName: 'Porção de Ovo de Codorna', detail: '200g', price: 1990 }),
  p({ id: 'azeitona', image: '/photos/azeitona.webp', categoryId: 'porcoes', name: 'Azeitona', orderName: 'Porção de Azeitona', detail: '150g', price: 1490 }),

  // ——— Combos ———
  p({ id: 'combo-costela', image: '/photos/combo-costela.webp', categoryId: 'combos', name: 'Combo Costela', price: 10990, featured: true, description: 'Arroz, farofa, vinagrete, mandioca e costela.', comboItems: ['Costela', 'Arroz', 'Farofa', 'Vinagrete', 'Mandioca'] }),
  p({ id: 'combo-costela-meio', image: '/photos/combo-costela-meio.webp', categoryId: 'combos', name: 'Combo Costela (meio)', price: 8790, description: 'Arroz, farofa, vinagrete, mandioca e costela.', comboItems: ['Costela (meio)', 'Arroz', 'Farofa', 'Vinagrete', 'Mandioca'] }),
  p({ id: 'combo-contra-file', image: '/photos/combo-contra-file.webp', categoryId: 'combos', name: 'Combo Contra Filé', price: 10990, description: 'Arroz, farofa, vinagrete, mandioca e contra filé.', comboItems: ['Contra filé', 'Arroz', 'Farofa', 'Vinagrete', 'Mandioca'] }),
  p({ id: 'combo-picanha', image: '/photos/combo-picanha.webp', categoryId: 'combos', name: 'Combo Picanha', price: 12190, featured: true, description: 'Arroz, farofa, vinagrete, mandioca e picanha.', comboItems: ['Picanha', 'Arroz', 'Farofa', 'Vinagrete', 'Mandioca'] }),
  p({ id: 'combinho-x-costela', image: '/photos/combinho-x-costela.webp', categoryId: 'combos', group: 'Combinho', comboItems: ['X-Costela', 'Batata frita', 'Refri lata'], name: 'X-Costela + Batata Frita + Refri Lata', orderName: 'Combinho X-Costela + Batata Frita + Refri Lata', price: 2990, options: REFRI_LATA, optionsLabel: 'Refri lata' }),
  p({ id: 'combinho-x-costela-bacon', image: '/photos/combinho-x-costela-bacon.webp', categoryId: 'combos', group: 'Combinho', comboItems: ['X-Costela com Bacon', 'Batata frita', 'Refri lata'], name: 'X-Costela com Bacon + Batata Frita + Refri Lata', orderName: 'Combinho X-Costela com Bacon + Batata Frita + Refri Lata', price: 3490, options: REFRI_LATA, optionsLabel: 'Refri lata' }),
  p({ id: 'combinho-x-costela-salada', image: '/photos/combinho-x-costela-salada.webp', categoryId: 'combos', group: 'Combinho', comboItems: ['X-Costela Salada', 'Batata frita', 'Refri lata'], name: 'X-Costela Salada + Batata Frita + Refri Lata', orderName: 'Combinho X-Costela Salada + Batata Frita + Refri Lata', price: 3490, options: REFRI_LATA, optionsLabel: 'Refri lata' }),
  p({ id: 'combinho-sanduiche-costela', image: '/photos/combinho-sanduiche-costela.webp', categoryId: 'combos', group: 'Combinho', comboItems: ['Sanduíche de Costela', 'Batata frita', 'Refri lata'], name: 'Sanduíche de Costela + Batata Frita + Refri Lata', orderName: 'Combinho Sanduíche de Costela + Batata Frita + Refri Lata', price: 3490, options: REFRI_LATA, optionsLabel: 'Refri lata' }),

  // ——— Assados ———
  p({ id: 'assado-costela', image: '/photos/assado-costela.webp', featured: true, categoryId: 'assados', name: 'Costela', orderName: 'Costela Assada', price: 7490 }),
  p({ id: 'assado-costela-meia', image: '/photos/assado-costela-meia.webp', categoryId: 'assados', name: 'Costela (meia)', orderName: 'Costela Assada (meia)', price: 4590 }),
  p({ id: 'assado-contra-file', image: '/photos/assado-contra-file.webp', categoryId: 'assados', name: 'Contra Filé', orderName: 'Contra Filé Assado', detail: '800g in natura', price: 7490 }),
  p({ id: 'assado-picanha', image: '/photos/assado-picanha.webp', featured: true, categoryId: 'assados', name: 'Picanha', orderName: 'Picanha Assada', detail: '800g in natura', price: 8690 }),

  // ——— Escondidinho ———
  p({ id: 'escondidinho-costela', image: '/photos/escondidinho-costela.webp', categoryId: 'escondidinho', name: 'Costela', orderName: 'Escondidinho de Costela', price: 3990 }),

  // ——— Lanches ———
  p({ id: 'x-costela', image: '/photos/x-costela.webp', categoryId: 'lanches', name: 'X-Costela', price: 1990, description: 'Pão, hambúrguer de costela, mussarela e molho especial.' }),
  p({ id: 'x-costela-bacon', image: '/photos/x-costela-bacon.webp', featured: true, categoryId: 'lanches', name: 'X-Costela com Bacon', price: 2490, description: 'Pão, hambúrguer de costela, bacon, mussarela e molho especial.' }),
  p({ id: 'x-costela-salada', image: '/photos/x-costela-salada.webp', categoryId: 'lanches', name: 'X-Costela Salada', price: 2490, description: 'Pão, hambúrguer de costela, rúcula, tomate, mussarela e molho especial.' }),

  // ——— Sanduíches ———
  p({ id: 'sanduiche-costela', image: '/photos/sanduiche-costela.webp', categoryId: 'sanduiches', name: 'Costela', orderName: 'Sanduíche de Costela', price: 2490, description: 'Pão, costela desfiada, mussarela e molho especial.' }),

  // ——— Acompanhamentos ———
  p({ id: 'arroz', image: '/photos/arroz.webp', categoryId: 'acompanhamentos', name: 'Arroz', price: 1290 }),
  p({ id: 'farofa', image: '/photos/farofa.webp', categoryId: 'acompanhamentos', name: 'Farofa', price: 1290 }),
  p({ id: 'vinagrete', image: '/photos/vinagrete.webp', categoryId: 'acompanhamentos', name: 'Vinagrete', price: 1290 }),
  p({ id: 'mandioca', image: '/photos/mandioca-frita.webp', categoryId: 'acompanhamentos', name: 'Mandioca', price: 1290 }),

  // ——— Refrigerantes ———
  p({ id: 'refri-2l', image: '/photos/refri-2l.webp', categoryId: 'refrigerantes', name: '2 Litros', orderName: 'Refrigerante 2 Litros', price: 1590, description: 'Coca-Cola, Guaraná.', options: ['Coca-Cola', 'Guaraná'], optionsLabel: 'Sabor' }),
  p({ id: 'refri-1l', image: '/photos/refri-2l.webp', categoryId: 'refrigerantes', name: '1 Litro', orderName: 'Refrigerante 1 Litro', price: 1190, description: 'Coca-Cola, Guaraná.', options: ['Coca-Cola', 'Guaraná'], optionsLabel: 'Sabor' }),
  p({ id: 'refri-600', image: '/photos/refri-2l.webp', categoryId: 'refrigerantes', name: '600 ml', orderName: 'Refrigerante 600 ml', price: 800, description: 'Coca-Cola, Guaraná, Fanta, Sprite.', options: ['Coca-Cola', 'Guaraná', 'Fanta', 'Sprite'], optionsLabel: 'Sabor' }),
  p({ id: 'refri-lata', image: '/photos/coca-lata.webp', categoryId: 'refrigerantes', name: 'Lata 350ml', orderName: 'Refrigerante Lata 350ml', price: 600, description: 'Coca-Cola, Guaraná, Fanta, Sprite, Pepsi, Soda.', options: REFRI_LATA, optionsLabel: 'Sabor' }),
  p({ id: 'refri-ks', image: '/photos/refri-2l.webp', categoryId: 'refrigerantes', name: 'KS', orderName: 'Coca-Cola KS', price: 550, description: 'Coca-Cola.' }),

  // ——— Cervejas ———
  p({ id: 'cerveja-spaten-600', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Spaten', orderName: 'Cerveja Spaten 600ml', price: 1200 }),
  p({ id: 'cerveja-original-600', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Original', orderName: 'Cerveja Original 600ml', price: 1200 }),
  p({ id: 'cerveja-corona-600', image: '/photos/cerveja-corona.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Corona', orderName: 'Cerveja Corona 600ml', price: 1500 }),
  p({ id: 'cerveja-stella-600', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Stella Artois', orderName: 'Cerveja Stella Artois 600ml', price: 1300 }),
  p({ id: 'cerveja-budweiser-600', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Budweiser', orderName: 'Cerveja Budweiser 600ml', price: 1000 }),
  p({ id: 'cerveja-brahma-600', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Brahma', orderName: 'Cerveja Brahma 600ml', price: 900 }),
  p({ id: 'cerveja-skol-600', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Skol', orderName: 'Cerveja Skol 600ml', price: 850 }),
  p({ id: 'cerveja-boa-600', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Garrafa 600ml', name: 'Boa', orderName: 'Cerveja Boa 600ml', price: 800 }),
  p({ id: 'cerveja-lata', image: '/photos/cerveja-lata.webp', categoryId: 'cervejas', group: 'Lata 350ml', name: 'Cerveja em lata', orderName: 'Cerveja Lata 350ml', price: 600, description: 'Informe a marca nas observações.' }),
  p({ id: 'chopp-350', image: '/photos/chopp-350.webp', categoryId: 'cervejas', group: 'Chopp', name: '350 ml', orderName: 'Chopp 350 ml', price: 990 }),
  p({ id: 'chopp-500', image: '/photos/chopp-500.webp', categoryId: 'cervejas', group: 'Chopp', name: '500 ml', orderName: 'Chopp 500 ml', price: 1350 }),
  p({ id: 'longneck-corona', image: '/photos/cerveja-corona.webp', categoryId: 'cervejas', group: 'Long Neck', name: 'Corona', orderName: 'Long Neck Corona', price: 1090 }),
  p({ id: 'longneck-stella', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Long Neck', name: 'Stella Artois', orderName: 'Long Neck Stella Artois', price: 990 }),
  p({ id: 'longneck-budweiser', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Long Neck', name: 'Budweiser', orderName: 'Long Neck Budweiser', price: 890 }),
  p({ id: 'longneck-spaten', image: '/photos/cerveja-garrafa.webp', categoryId: 'cervejas', group: 'Long Neck', name: 'Spaten', orderName: 'Long Neck Spaten', price: 890 }),

  // ——— Diversos ———
  p({ id: 'energetico-redbull', image: '/photos/energetico-redbull.webp', categoryId: 'diversos', name: 'Energético Redbull', price: 1350 }),
  p({ id: 'energetico-monster', image: '/photos/energetico-monster.webp', categoryId: 'diversos', name: 'Energético Monster', price: 1350 }),
  p({ id: 'campari', image: '/photos/campari.webp', categoryId: 'diversos', name: 'Campari', price: 2000 }),
  p({ id: 'agua', image: '/photos/agua.webp', categoryId: 'diversos', name: 'Água', price: 350 }),
  p({ id: 'suco-dell-valle', image: '/photos/suco.webp', categoryId: 'diversos', name: 'Suco Dell Valle', price: 600 }),
  p({ id: 'suco-laranja', image: '/photos/suco-laranja.webp', categoryId: 'diversos', name: 'Suco de Laranja', price: 1000 }),
  p({ id: 'caipirinha', image: '/photos/caipirinha.webp', categoryId: 'diversos', name: 'Caipirinha', price: 1500 }),
  p({ id: 'roseta', categoryId: 'diversos', name: 'Roseta', price: 500 }),
]

/** Horário ainda não informado: todos os dias "fechado" e o selo de aberto/fechado oculto (statusOverride 'none'). */
const week = () => [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, open: '11:00', close: '15:00', closed: true }))

export const seedSettings: Settings = {
  storeName: 'Ponto da Costela',
  slogan: 'Costela, assados, lanches e porções. Peça pelo WhatsApp.',
  // Contato das artes oficiais do cardápio.
  whatsapp: '5544920011031',
  phone: '(44) 92001-1031',
  instagram: 'pontoda.costela0',
  // Ainda não informados — editar no painel (Configurações).
  address: '',
  city: '',
  deliveryFee: null,
  deliveryEstimate: '',
  pickupEstimate: '',
  hours: week(),
  statusOverride: 'none',
  heroImage: '',
  notice: 'Servimos almoço aos sábados, domingos e feriados',
}

export const seedMenu: MenuData = {
  categories: seedCategories,
  products: seedProducts,
  settings: seedSettings,
}
