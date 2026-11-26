# Ponto da Costela — Cardápio Digital

Cardápio digital do Ponto da Costela, no visual das artes oficiais do cardápio (fundo preto, laranja intenso,
tipografia branca, linhas finas laranja): cardápio por categorias, carrinho, escolha de sabor, observações,
checkout com envio pelo WhatsApp e painel do proprietário.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · componentes no padrão shadcn/ui (Radix) · GSAP · Lucide · Supabase (opcional).

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
```

- Cardápio: `/`
- Painel do proprietário: `/#/admin` (link "Área do proprietário" no rodapé)

## O que veio das artes oficiais

- **Produtos e preços:** todos os 59 itens das páginas "Cardápio" e "Bebidas", com as descrições e gramaturas
  das artes (`src/data/seed.ts`).
- **Marca:** o letreiro "★ PONTO DA ★ / COSTELA" entre linhas duplas laranja, recriado em código
  (`src/components/Logo.tsx`, fonte Russo One). Se houver a logo em arquivo, coloque em `public/brand/logo.png`
  e ajuste `BRAND_LOGO_SRC` em `src/lib/brand.ts`.
- **Contato:** delivery (44) 92001-1031 (é o número do QR Code de WhatsApp da arte) e Instagram @pontoda.costela0.
- **Aviso:** "Servimos almoço aos sábados, domingos e feriados".

## Pendente (editar em Painel → Configurações)

| Dado | Situação |
|---|---|
| Endereço e cidade | Não informado nas artes — fica oculto até ser preenchido |
| Horário de funcionamento | Não informado — selo "Aberto/Fechado" fica oculto (status "Não mostrar") |
| Taxa de entrega | Não informada — aparece "a combinar" no carrinho e no WhatsApp |
| Tempo de entrega/retirada | Não informado — oculto |
| Fotos dos produtos | Nenhuma: o cardápio é só texto, como o impresso. Envie fotos REAIS pelo painel se quiser |

## Recursos do cardápio

- Navegação por categorias (fixa no topo) e páginas "Cardápio" e "Bebidas" em duas colunas no computador.
- Subtítulos dentro da categoria (Garrafa 600ml, Lata 350ml, Chopp, Long Neck, Combinho).
- **Escolha obrigatória** (ex.: sabor do refrigerante, refri do combinho): o botão + abre a escolha antes de adicionar.
- **Nome no pedido**: itens com o mesmo nome no cardápio ("Costela") vão para o WhatsApp com nome completo
  ("Prato Feito de Costela", "Costela Assada", "Escondidinho de Costela"…).
- Observações rápidas por tipo (carne, lanche, porção, bebida) e observação livre.
- Carrinho com quantidades, checkout (entrega ou retirada, Pix/dinheiro/cartão, troco) e mensagem pronta no WhatsApp.
- Carrossel de destaques: aparece só para produtos marcados como destaque **e** com foto real.

## Dados: modo local × Supabase

| | Sem variáveis (local) | Com Supabase |
|---|---|---|
| Cardápio | Salvo no navegador | Banco Postgres, leitura pública |
| Painel | PIN (`VITE_ADMIN_PIN`, padrão `1234`) — **não é segurança real** | Login e-mail/senha + RLS |
| Pedidos no painel | Só os feitos no mesmo navegador | Todos, em tempo real |
| Alterações → cardápio | Na hora, entre abas do mesmo navegador | Na hora, para todos (Realtime) |

Em qualquer modo, o pedido sempre é enviado ao WhatsApp do Ponto da Costela com a mensagem completa.

### Configurar o Supabase

1. Crie um projeto em supabase.com e rode `supabase/schema.sql` no SQL Editor.
2. Crie o usuário do proprietário em *Authentication → Users* e rode
   `insert into public.admins (user_id) values ('<uuid do usuário>');`
3. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Entre no painel e use **Configurações → Restaurar cardápio original** para popular o banco.

## Estrutura

```
src/
  components/
    Header.tsx  Hero.tsx  Highlights.tsx  MenuSections.tsx  CategoryNavigation.tsx
    ProductCard.tsx  ProductModal.tsx  CartDrawer.tsx  Checkout.tsx  Footer.tsx
    MobileCartBar.tsx  Logo.tsx (letreiro)  ProductImage.tsx
    ui/*  admin/*
  data/seed.ts        ← cardápio do Ponto da Costela (produtos, preços, categorias, contato)
  lib/repo/           ← camada de dados: local.ts e supabase.ts com a mesma interface
  lib/whatsapp.ts     ← mensagem formatada do pedido
  store/              ← carrinho (persistido), cardápio, toasts
supabase/schema.sql
```

Todas as animações respeitam `prefers-reduced-motion`.
