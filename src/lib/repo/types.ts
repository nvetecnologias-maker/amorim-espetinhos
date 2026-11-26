import type { Category, MenuData, Order, OrderStatus, Product, Settings } from '@/types'

/**
 * Contrato único de dados. O cardápio público e o painel só falam com esta
 * interface — trocar o armazenamento local pelo Supabase não muda nenhum componente.
 */
export interface Repository {
  readonly kind: 'local' | 'supabase' | 'api'
  loadMenu(): Promise<MenuData>
  /** Avisa quando o cardápio muda (outra aba, painel, realtime). */
  onMenuChange(cb: () => void): () => void

  saveProduct(product: Product): Promise<void>
  deleteProduct(id: string): Promise<void>
  saveProductsOrder(ids: string[]): Promise<void>
  saveCategory(category: Category): Promise<void>
  deleteCategory(id: string): Promise<void>
  saveSettings(settings: Settings): Promise<void>
  resetDemo?(): Promise<void>

  createOrder(order: Order): Promise<Order>
  listOrders(): Promise<Order[]>
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>
  onOrdersChange(cb: () => void): () => void

  /** Autenticação do proprietário. */
  getSession(): Promise<boolean>
  signIn(identifier: string, secret: string): Promise<void>
  signOut(): Promise<void>
  /** Texto de ajuda mostrado na tela de login. */
  readonly loginHint: string
  readonly loginMode: 'pin' | 'email'
}
