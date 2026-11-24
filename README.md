# Amorim Espetinhos — Cardápio Digital

Cardápio digital da espetaria: hero com o espetinho em destaque, carrossel orbital de espetinhos,
cardápio por categorias, carrinho, checkout com envio pelo WhatsApp e painel do proprietário.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · componentes no padrão shadcn/ui (Radix) · GSAP + ScrollTrigger · Lucide · Supabase (opcional).

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
```

- Cardápio: `/`
- Painel do proprietário: `/#/admin` (link "Área do proprietário" no rodapé)

## Antes de publicar — checklist

1. **Logo oficial:** já incluída em `public/brand/logo.png` (arquivo original, apenas recortado no círculo; o original intacto está em
   `public/brand/logo-original.jpeg`). Também é o favicon (`favicon-64.png`, `apple-touch-icon.png`).
2. **Fotos:** todos os produtos já têm fotos reais em `public/photos/` (banco de imagens: Unsplash e Wikimedia Commons;
   fontes em `scripts/photos.json`, créditos no rodapé em "Créditos das fotos"). São fotos ilustrativas, não dos pratos da casa:
   o ideal é trocar pelas fotos próprias no painel (Produtos → editar → Enviar foto; hero em Configurações).
   Ao trocar, o crédito daquela foto sai sozinho do rodapé. As duas fotos do Wikimedia (lata de guaraná e farofa) são CC BY-SA 4.0
   e exigem o crédito enquanto estiverem em uso.
3. **Dados de contato:** WhatsApp que recebe os pedidos, telefone, endereço, Instagram, taxa de entrega e horários
   estão com valores demonstrativos — altere em Configurações.
4. **Supabase** (necessário para receber pedidos de clientes no painel e para o login seguro) — veja abaixo.

## Dados: modo demonstração × Supabase

| | Sem variáveis (demonstração) | Com Supabase |
|---|---|---|
| Cardápio | Salvo no navegador | Banco Postgres, leitura pública |
| Painel | PIN (`VITE_ADMIN_PIN`, padrão `1234`) — **não é segurança real** | Login e-mail/senha + RLS |
| Pedidos no painel | Só os feitos no mesmo navegador | Todos, em tempo real |
| Alterações → cardápio | Na hora, entre abas do mesmo navegador | Na hora, para todos (Realtime) |

Em qualquer modo, o pedido sempre é enviado ao WhatsApp da espetaria com a mensagem completa.

### Configurar o Supabase

1. Crie um projeto em supabase.com e rode `supabase/schema.sql` no SQL Editor.
2. Crie o usuário do proprietário em *Authentication → Users* e rode
   `insert into public.admins (user_id) values ('<uuid do usuário>');`
3. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Entre no painel e use **Configurações → Restaurar demonstração** para popular o banco com o cardápio inicial (ou cadastre do zero).

Fotos enviadas pelo painel são reduzidas (máx. 1200 px, JPEG) e guardadas junto ao produto. Para catálogos grandes,
vale migrar para o Supabase Storage.

## Estrutura

```
src/
  components/
    Header.tsx  Hero.tsx  Highlights.tsx  MenuSections.tsx  CategoryNavigation.tsx
    ProductCard.tsx  ProductModal.tsx  CartDrawer.tsx  Checkout.tsx  Footer.tsx
    MobileCartBar.tsx  Logo.tsx  ProductImage.tsx  art/FoodArt.tsx
    ui/dish-orbit-carousel.tsx   ← carrossel orbital (genérico e reutilizável)
    ui/*                          ← button, dialog, input, tabs, switch, badge (padrão shadcn)
    admin/AdminDashboard.tsx  OrdersPanel  ProductsPanel  CategoriesPanel  SettingsPanel
  data/seed.ts        ← cardápio demonstrativo (produtos, preços, categorias, horários)
  lib/repo/           ← camada de dados: local.ts e supabase.ts com a mesma interface
  lib/whatsapp.ts     ← mensagem formatada do pedido
  store/              ← carrinho (persistido), cardápio, toasts
supabase/schema.sql
```

## Carrossel orbital (`ui/dish-orbit-carousel.tsx`)

Adaptação do Dish Orbit Carousel: a imagem gira em órbita em torno de um eixo à esquerda (sai pelo topo, a próxima
entra por baixo), título em duas linhas com pesos diferentes, cor de destaque por categoria, setas, miniaturas,
gesto de deslizar, teclado (← →) e indicador de posição. Chef e avaliações foram removidos (sem dados reais);
"likes" viraram favoritos do próprio cliente salvos no aparelho; "order" adiciona ao carrinho. Os espetinhos que
aparecem nele são os marcados com ★ no painel.

Todas as animações respeitam `prefers-reduced-motion`.
