import type { Category, MenuData, Product, Settings } from '@/types'

export const seedCategories: Category[] = [
  { id: 'bovinos', name: 'Espetinhos Bovinos', tagline: 'Corte nobre, sal grosso e brasa viva.', accent: '#B83A24', layout: 'grid', notesPreset: 'espeto', order: 1 },
  { id: 'frango', name: 'Espetinhos de Frango', tagline: 'Marinados na casa, dourados por fora e suculentos por dentro.', accent: '#E8952F', layout: 'grid', notesPreset: 'espeto', order: 2 },
  { id: 'suinos', name: 'Espetinhos Suínos', tagline: 'Gordura no ponto, pururuca na brasa.', accent: '#D4572E', layout: 'grid', notesPreset: 'espeto', order: 3 },
  { id: 'especiais', name: 'Especiais', tagline: 'Os queridinhos que só saem da nossa churrasqueira.', accent: '#F07832', layout: 'grid', notesPreset: 'espeto', order: 4 },
  { id: 'acompanhamentos', name: 'Acompanhamentos', tagline: 'Pra completar o espeto do jeito certo.', accent: '#C9A26B', layout: 'compact', notesPreset: 'porcao', order: 5 },
  { id: 'porcoes', name: 'Porções', tagline: 'Pra dividir na mesa (ou não).', accent: '#E0A040', layout: 'large', notesPreset: 'porcao', order: 6 },
  { id: 'combos', name: 'Combos', tagline: 'Espeto, acompanhamento e bebida com preço de amigo.', accent: '#F07832', layout: 'combo', notesPreset: 'espeto', order: 7 },
  { id: 'bebidas', name: 'Bebidas', tagline: 'Gelada pra acompanhar a brasa.', accent: '#7FB3C4', layout: 'drinks', notesPreset: 'bebida', order: 8 },
]

let order = 0
const p = (x: Omit<Product, 'order' | 'available' | 'image' | 'longDescription' | 'titleTop' | 'titleBottom'> & Partial<Product>): Product => {
  const [top, ...rest] = x.name.startsWith('Espetinho') ? ['Espetinho', x.name.replace(/^Espetinho\s*/, '')] : ['', x.name]
  return {
    titleTop: top,
    titleBottom: rest.join(' '),
    longDescription: x.description,
    image: `/photos/${x.id}.webp`,
    available: true,
    order: ++order,
    ...x,
  }
}

export const seedProducts: Product[] = [
  // ——— Espetinhos (os 10 demonstrativos do carrossel) ———
  p({ id: 'carne-bovina', categoryId: 'bovinos', name: 'Espetinho de Carne Bovina', titleTop: 'Espetinho de', titleBottom: 'Carne Bovina', price: 1200, art: 'beef', featured: true, badges: ['mais-vendido'],
    description: 'Cubos de alcatra no sal grosso, dourados na brasa com marcas de grelha.',
    longDescription: 'Cubos generosos de alcatra temperados só com sal grosso e um toque de alho, assados na brasa de carvão até ganhar aquela casquinha dourada com marcas de grelha. Por dentro, suculento. Acompanha farofa da casa.',
    ingredients: ['Alcatra', 'Sal grosso', 'Alho', 'Farofa da casa'] }),
  p({ id: 'frango', categoryId: 'frango', name: 'Espetinho de Frango', titleTop: 'Espetinho de', titleBottom: 'Frango', price: 1000, art: 'chicken', featured: true, badges: [],
    description: 'Sobrecoxa marinada no alho e páprica, dourada e suculenta.',
    longDescription: 'Pedaços de sobrecoxa marinados por 12 horas no alho, limão, páprica defumada e cheiro-verde. Assados devagar para ficarem dourados por fora e macios por dentro.',
    ingredients: ['Sobrecoxa', 'Alho', 'Limão', 'Páprica defumada', 'Cheiro-verde'] }),
  p({ id: 'linguica-toscana', categoryId: 'suinos', name: 'Espetinho de Linguiça Toscana', titleTop: 'Espetinho de', titleBottom: 'Linguiça Toscana', price: 1000, art: 'sausage', featured: true, badges: [],
    description: 'Linguiça toscana em rodelas grossas, tostada e estalando na brasa.',
    longDescription: 'Rodelas grossas de linguiça toscana assadas na brasa até a pele estalar. Clássico de qualquer roda de churrasco.',
    ingredients: ['Linguiça toscana', 'Pimenta-do-reino'] }),
  p({ id: 'kafta', categoryId: 'bovinos', name: 'Espetinho de Kafta', titleTop: 'Espetinho de', titleBottom: 'Kafta', price: 1300, art: 'kafta', featured: true, badges: ['favorito'],
    description: 'Carne moída temperada com hortelã, cebola e especiarias árabes.',
    longDescription: 'Kafta artesanal de carne bovina moída na casa, com cebola, salsinha, hortelã e um blend de especiarias árabes. Assada inteira no espeto.',
    ingredients: ['Carne bovina moída', 'Cebola', 'Salsinha', 'Hortelã', 'Especiarias árabes'] }),
  p({ id: 'coracao', categoryId: 'frango', name: 'Espetinho de Coração', titleTop: 'Espetinho de', titleBottom: 'Coração', price: 1200, art: 'heart', featured: true, badges: [],
    description: 'Coraçãozinho de frango temperado no alho, tostadinho por fora.',
    longDescription: 'Corações de frango limpos e temperados com alho, sal e um toque de shoyu. Ficam tostadinhos por fora e macios por dentro.',
    ingredients: ['Coração de frango', 'Alho', 'Shoyu', 'Sal'] }),
  p({ id: 'queijo-coalho', categoryId: 'especiais', name: 'Espetinho de Queijo Coalho', titleTop: 'Espetinho de', titleBottom: 'Queijo Coalho', price: 1200, art: 'cheese', featured: true, badges: [],
    description: 'Queijo coalho dourado na brasa, com opção de melaço ou orégano.',
    longDescription: 'Queijo coalho grelhado até formar uma crosta dourada. Peça com melaço de cana ou orégano nas observações.',
    ingredients: ['Queijo coalho', 'Orégano ou melaço (opcional)'] }),
  p({ id: 'medalhao-frango', categoryId: 'frango', name: 'Espetinho de Medalhão de Frango', titleTop: 'Medalhão de', titleBottom: 'Frango', price: 1400, art: 'medal-chicken', featured: true, badges: ['novidade'],
    description: 'Peito de frango envolto em bacon, crocante e suculento.',
    longDescription: 'Medalhões de peito de frango envoltos em fatias de bacon e assados até o bacon ficar crocante. Suculência garantida.',
    ingredients: ['Peito de frango', 'Bacon', 'Sal', 'Pimenta-do-reino'] }),
  p({ id: 'medalhao-carne', categoryId: 'bovinos', name: 'Espetinho de Medalhão de Carne', titleTop: 'Medalhão de', titleBottom: 'Carne', price: 1600, art: 'medal-beef', featured: true, badges: [],
    description: 'Mignon envolto em bacon, o espeto mais nobre da casa.',
    longDescription: 'Medalhões de filé-mignon envoltos em bacon defumado e assados no ponto que você pedir. O espeto mais nobre da casa.',
    ingredients: ['Filé-mignon', 'Bacon defumado', 'Sal grosso'] }),
  p({ id: 'panceta', categoryId: 'suinos', name: 'Espetinho de Panceta', titleTop: 'Espetinho de', titleBottom: 'Panceta', price: 1400, art: 'pancetta', featured: true, badges: [],
    description: 'Barriga suína com pururuca crocante e carne macia.',
    longDescription: 'Cubos de panceta temperados com limão e sal, assados até a pele virar pururuca. Crocante por fora, macia por dentro.',
    ingredients: ['Panceta suína', 'Limão', 'Sal'] }),
  p({ id: 'misto', categoryId: 'especiais', name: 'Espetinho Misto', titleTop: 'Espetinho', titleBottom: 'Misto', price: 1500, art: 'mixed', featured: true, badges: [],
    description: 'Carne, frango, linguiça e pimentão no mesmo espeto.',
    longDescription: 'O melhor de tudo num espeto só: alcatra, frango, linguiça toscana, cebola e pimentão intercalados e assados juntos.',
    ingredients: ['Alcatra', 'Frango', 'Linguiça toscana', 'Cebola', 'Pimentão'] }),

  // ——— Acompanhamentos ———
  p({ id: 'mandioca-cozida', categoryId: 'acompanhamentos', name: 'Mandioca cozida', price: 900, art: 'cassava', featured: false, badges: [], description: 'Mandioca macia na manteiga de garrafa.', ingredients: ['Mandioca', 'Manteiga de garrafa', 'Sal'] }),
  p({ id: 'farofa', categoryId: 'acompanhamentos', name: 'Farofa temperada', price: 600, art: 'farofa', featured: false, badges: ['mais-vendido'], description: 'Farofa crocante com bacon, cebola e cheiro-verde.', ingredients: ['Farinha de mandioca', 'Bacon', 'Cebola', 'Cheiro-verde'] }),
  p({ id: 'vinagrete', categoryId: 'acompanhamentos', name: 'Vinagrete', price: 500, art: 'vinaigrette', featured: false, badges: [], description: 'Tomate, cebola e pimentão picadinhos no vinagre.', ingredients: ['Tomate', 'Cebola', 'Pimentão', 'Vinagre', 'Azeite'] }),
  p({ id: 'pao-de-alho', categoryId: 'acompanhamentos', name: 'Pão de alho', price: 800, art: 'garlic-bread', featured: false, badges: ['favorito'], description: 'Pão de alho cremoso, gratinado na brasa.', ingredients: ['Pão', 'Creme de alho', 'Queijo'] }),
  p({ id: 'arroz', categoryId: 'acompanhamentos', name: 'Arroz branco', price: 600, art: 'rice', featured: false, badges: [], description: 'Arroz soltinho, feito na hora.', ingredients: ['Arroz', 'Alho', 'Sal'] }),
  p({ id: 'maionese', categoryId: 'acompanhamentos', name: 'Maionese de batata', price: 800, art: 'potato-salad', featured: false, badges: [], description: 'Maionese caseira de batata com cenoura e cheiro-verde.', ingredients: ['Batata', 'Cenoura', 'Maionese caseira', 'Cheiro-verde'] }),
  p({ id: 'molho-casa', categoryId: 'acompanhamentos', name: 'Molho especial da casa', price: 300, art: 'sauce', featured: false, badges: ['novidade'], description: 'Molho de alho e ervas, receita da família Amorim.', ingredients: ['Alho', 'Ervas', 'Azeite'] }),

  // ——— Porções ———
  p({ id: 'batata-frita', categoryId: 'porcoes', name: 'Porção de batata frita', price: 2800, art: 'fries', featured: false, badges: ['mais-vendido'], description: 'Batata frita sequinha e crocante. Serve 2 pessoas.', ingredients: ['Batata', 'Sal'] }),
  p({ id: 'polenta', categoryId: 'porcoes', name: 'Polenta frita', price: 2600, art: 'polenta', featured: false, badges: [], description: 'Palitos de polenta crocantes por fora, cremosos por dentro.', ingredients: ['Polenta', 'Parmesão'] }),
  p({ id: 'mandioca-frita', categoryId: 'porcoes', name: 'Mandioca frita', price: 2600, art: 'cassava-fried', featured: false, badges: [], description: 'Mandioca frita dourada, com sal grosso.', ingredients: ['Mandioca', 'Sal grosso'] }),
  p({ id: 'aneis-cebola', categoryId: 'porcoes', name: 'Anéis de cebola', price: 2700, art: 'onion-rings', featured: false, badges: [], description: 'Anéis de cebola empanados e crocantes.', ingredients: ['Cebola', 'Empanado crocante'] }),
  p({ id: 'calabresa', categoryId: 'porcoes', name: 'Calabresa acebolada', price: 3200, art: 'calabresa', featured: false, badges: ['favorito'], description: 'Calabresa fatiada na chapa com muita cebola.', ingredients: ['Calabresa', 'Cebola'] }),
  p({ id: 'porcao-mista', categoryId: 'porcoes', name: 'Porção mista', price: 4500, art: 'mixed-portion', featured: false, badges: [], description: 'Batata, mandioca, calabresa e anéis de cebola. Serve 3 pessoas.', ingredients: ['Batata frita', 'Mandioca frita', 'Calabresa', 'Anéis de cebola'] }),

  // ——— Combos ———
  p({ id: 'combo-individual', categoryId: 'combos', name: 'Combo Individual', price: 3200, art: 'combo', featured: false, badges: ['economize'], description: 'Pra matar a fome de um.', ingredients: [],
    comboItems: ['2 espetinhos à escolha', '1 acompanhamento', '1 bebida lata'] }),
  p({ id: 'combo-casal', categoryId: 'combos', name: 'Combo Casal', price: 6200, art: 'combo', featured: false, badges: ['mais-pedido'], description: 'Pra dividir a brasa a dois.', ingredients: [],
    comboItems: ['4 espetinhos à escolha', '2 acompanhamentos', '2 bebidas lata'] }),
  p({ id: 'combo-familia', categoryId: 'combos', name: 'Combo Família', price: 12900, art: 'combo', featured: false, badges: ['economize'], description: 'Churrasco completo pra família toda.', ingredients: [],
    comboItems: ['8 espetinhos à escolha', '3 acompanhamentos', '1 porção à escolha'] }),

  // ——— Bebidas ———
  p({ id: 'coca-lata', categoryId: 'bebidas', name: 'Coca-Cola lata', price: 600, art: 'cola', featured: false, badges: [], description: 'Lata 350 ml, bem gelada.', ingredients: [] }),
  p({ id: 'guarana-lata', categoryId: 'bebidas', name: 'Guaraná lata', price: 600, art: 'guarana', featured: false, badges: [], description: 'Lata 350 ml, bem gelada.', ingredients: [] }),
  p({ id: 'agua', categoryId: 'bebidas', name: 'Água mineral', price: 400, art: 'water', featured: false, badges: [], description: 'Garrafa 500 ml, sem gás.', ingredients: [] }),
  p({ id: 'agua-gas', categoryId: 'bebidas', name: 'Água com gás', price: 450, art: 'sparkling', featured: false, badges: [], description: 'Garrafa 500 ml, com gás.', ingredients: [] }),
  p({ id: 'suco', categoryId: 'bebidas', name: 'Suco natural', price: 900, art: 'juice', featured: false, badges: [], description: 'Laranja, limão ou maracujá. 500 ml. Informe o sabor nas observações.', ingredients: [] }),
  p({ id: 'refri-2l', categoryId: 'bebidas', name: 'Refrigerante 2 litros', price: 1400, art: 'soda2l', featured: false, badges: [], description: 'Coca-Cola ou Guaraná. Informe o sabor nas observações.', ingredients: [] }),
]

const week = (open: string, close: string) =>
  [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, open, close, closed: day === 1 }))

export const seedSettings: Settings = {
  storeName: 'Amorim Espetinhos',
  slogan: 'Acenda a fome. A gente cuida da brasa.',
  // Dados de contato DEMONSTRATIVOS — altere no painel (Configurações).
  whatsapp: '5500000000000',
  phone: '(00) 0000-0000',
  instagram: 'amorimespetinhos',
  address: 'Endereço da espetaria (editar no painel)',
  city: 'Cidade – UF',
  deliveryFee: 600,
  deliveryEstimate: '40–60 min',
  pickupEstimate: '20–30 min',
  hours: week('18:00', '23:30'),
  statusOverride: 'auto',
  heroImage: '/photos/hero.webp',
}

export const seedMenu: MenuData = {
  categories: seedCategories,
  products: seedProducts,
  settings: seedSettings,
}
