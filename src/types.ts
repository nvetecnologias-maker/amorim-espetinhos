export type BadgeId = 'mais-vendido' | 'novidade' | 'favorito' | 'mais-pedido' | 'economize'

/** Ilustração usada quando o produto ainda não tem fotografia cadastrada. */
export type ArtKind =
  | 'beef' | 'chicken' | 'sausage' | 'kafta' | 'heart' | 'cheese'
  | 'medal-chicken' | 'medal-beef' | 'pancetta' | 'mixed'
  | 'cassava' | 'farofa' | 'vinaigrette' | 'garlic-bread' | 'rice' | 'potato-salad' | 'sauce'
  | 'fries' | 'polenta' | 'cassava-fried' | 'onion-rings' | 'calabresa' | 'mixed-portion'
  | 'cola' | 'guarana' | 'water' | 'sparkling' | 'juice' | 'soda2l'
  | 'combo'

/** Como a categoria é apresentada no cardápio. */
export type CategoryLayout = 'grid' | 'compact' | 'large' | 'combo' | 'drinks'

/** Qual conjunto de observações rápidas o modal oferece. */
export type NotesPreset = 'espeto' | 'porcao' | 'bebida' | 'nenhum'

export interface Category {
  id: string
  name: string
  /** Frase curta exibida no topo da seção. */
  tagline: string
  accent: string
  layout: CategoryLayout
  notesPreset: NotesPreset
  order: number
}

export interface Product {
  id: string
  categoryId: string
  name: string
  /** Linha fina do título no carrossel (ex.: "Espetinho de"). */
  titleTop: string
  /** Linha forte do título no carrossel (ex.: "Carne Bovina"). */
  titleBottom: string
  description: string
  longDescription: string
  /** Preço em centavos. */
  price: number
  ingredients: string[]
  /** URL ou data URL da fotografia real. Vazio = ilustração. */
  image: string
  art: ArtKind
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
  /** Taxa de entrega em centavos. */
  deliveryFee: number
  deliveryEstimate: string
  pickupEstimate: string
  hours: DayHours[]
  statusOverride: 'auto' | 'open' | 'closed'
  /** Foto opcional do espetinho do hero. Vazio = ilustração. */
  heroImage: string
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
  total: number
  status: OrderStatus
}
