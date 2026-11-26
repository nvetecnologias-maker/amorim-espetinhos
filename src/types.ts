export type BadgeId = 'mais-vendido' | 'novidade' | 'favorito' | 'mais-pedido' | 'economize'


/** Como a categoria é apresentada no cardápio. */
export type CategoryLayout = 'list' | 'grid'

/** Qual conjunto de observações rápidas o modal oferece. */
export type NotesPreset = 'carne' | 'lanche' | 'porcao' | 'bebida' | 'nenhum'

/** Bloco do cardápio em que a categoria aparece (como as páginas do cardápio impresso). */
export type MenuSection = 'cardapio' | 'bebidas'

export interface Category {
  id: string
  name: string
  /** Frase curta exibida no topo da seção. */
  tagline: string
  accent: string
  layout: CategoryLayout
  notesPreset: NotesPreset
  /** Página do cardápio: comidas ("cardapio") ou "bebidas". */
  section: MenuSection
  order: number
}

export interface Product {
  id: string
  categoryId: string
  name: string
  /** Linha fina do título no carrossel de destaques (opcional). */
  titleTop: string
  /** Linha forte do título no carrossel de destaques. */
  titleBottom: string
  /** Nome completo usado no carrinho e na mensagem do WhatsApp (ex.: "Prato Feito de Costela"). Vazio = usa o nome. */
  orderName?: string
  /** Subtítulo dentro da categoria (ex.: "Garrafa 600ml", "Long Neck"). Vazio = sem subtítulo. */
  group?: string
  /** Detalhe curto ao lado do nome (ex.: "500g in natura", "8 unidades"). */
  detail?: string
  /** Escolha obrigatória antes de adicionar (ex.: sabor do refrigerante). */
  options?: string[]
  /** Rótulo da escolha (ex.: "Sabor"). */
  optionsLabel?: string
  description: string
  longDescription: string
  /** Preço em centavos. */
  price: number
  ingredients: string[]
  /** URL ou data URL de uma fotografia REAL do produto. Vazio = sem foto. */
  image: string
  badges: BadgeId[]
  available: boolean
  /** Aparece no carrossel de destaque. */
  featured: boolean
  order: number
  /** Itens incluídos (só para combos). */
  comboItems?: string[]
}

export interface DayHours {
  /** 0 = domingo … 6 = sábado */
  day: number
  open: string
  close: string
  closed: boolean
}

export interface Settings {
  storeName: string
  slogan: string
  /** Somente dígitos, com DDI. Ex.: 5511999999999 */
  whatsapp: string
  phone: string
  instagram: string
  address: string
  city: string
  /** Taxa de entrega em centavos. null = "a combinar" (informada pelo WhatsApp). */
  deliveryFee: number | null
  deliveryEstimate: string
  pickupEstimate: string
  hours: DayHours[]
  /** 'none' = não mostrar aberto/fechado (horário ainda não cadastrado). */
  statusOverride: 'auto' | 'open' | 'closed' | 'none'
  /** Foto real opcional para a primeira tela. Vazio = só a marca. */
  heroImage: string
  /** Aviso exibido em destaque (ex.: dias de almoço). */
  notice: string
}

export interface MenuData {
  categories: Category[]
  products: Product[]
  settings: Settings
}

export interface CartItem {
  lineId: string
  productId: string
  name: string
  categoryId: string
  unitPrice: number
  qty: number
  /** Observações rápidas selecionadas. */
  notes: string[]
  /** Observação escrita pelo cliente. */
  customNote: string
}

export type OrderType = 'entrega' | 'retirada'
export type PaymentMethod = 'pix' | 'dinheiro' | 'credito' | 'debito'
export type OrderStatus = 'novo' | 'preparando' | 'saiu' | 'pronto' | 'concluido' | 'cancelado'

export interface Address {
  street: string
  number: string
  complement: string
  district: string
  reference: string
}

export interface Order {
  id: string
  code: string
  createdAt: string
  customerName: string
  customerPhone: string
  type: OrderType
  address: Address | null
  payment: PaymentMethod
  /** Troco para (centavos), só em dinheiro. */
  changeFor: number | null
  notes: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  /** Taxa ainda não definida: combinar pelo WhatsApp. */
  deliveryFeePending?: boolean
  total: number
  status: OrderStatus
}
