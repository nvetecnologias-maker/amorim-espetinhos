import { useState } from 'react'
import { CartDrawer } from '@/components/CartDrawer'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Highlights } from '@/components/Highlights'
import { MenuSections } from '@/components/MenuSections'
import { MobileCartBar } from '@/components/MobileCartBar'
import { ProductModal } from '@/components/ProductModal'
import { Toaster } from '@/components/Toaster'
import { useMenu } from '@/store/menu'
import type { Product } from '@/types'

export function MenuPage() {
  const [selected, setSelected] = useState<string | null>(null)
  // Busca o produto atualizado (se o painel mudar o preço, o modal reflete)
  const product = useMenu((s) => s.products.find((p) => p.id === selected) ?? null)
  const open = (p: Product) => setSelected(p.id)

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Highlights onOpen={open} />
        <MenuSections onOpen={open} />
      </main>
      <Footer />
      <MobileCartBar />
      <CartDrawer />
      <ProductModal product={product} onClose={() => setSelected(null)} />
      <Toaster />
    </>
  )
}
