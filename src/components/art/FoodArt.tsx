import { useId } from 'react'
import type { ArtKind } from '@/types'

/**
 * Ilustrações vetoriais usadas ENQUANTO o produto não tem fotografia real.
 * Assim que o proprietário envia a foto no painel, ela substitui a arte.
 * Tudo em SVG: leve, nítido em qualquer tela e sem dependência de rede.
 */

type PieceKind = 'kafta' | 'beef' | 'chicken' | 'sausage' | 'heart' | 'cheese' | 'medal-beef' | 'medal-chicken' | 'pancetta' | 'onion' | 'pepper-red' | 'pepper-green' | 'bread'

// Gerador pseudoaleatório determinístico (mesma arte em toda renderização)
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const PALETTE: Record<PieceKind, { base: string; mid: string; dark: string; hi: string; mark: string }> = {
  kafta: { base: '#6e3420', mid: '#94502e', dark: '#341208', hi: '#cf8656', mark: '#1d0a06' },
  beef: { base: '#7a2f1c', mid: '#a5502b', dark: '#3a120a', hi: '#e08a4f', mark: '#1d0a06' },
  chicken: { base: '#c97a2c', mid: '#e3a050', dark: '#7a3f12', hi: '#ffd08a', mark: '#4a220a' },
  sausage: { base: '#8f3b28', mid: '#b5583a', dark: '#4a160c', hi: '#f0a07a', mark: '#2a0c06' },
  heart: { base: '#5e1d17', mid: '#86362a', dark: '#2a0806', hi: '#c86a50', mark: '#1a0504' },
  cheese: { base: '#f0d79a', mid: '#f8e7bd', dark: '#c48a3a', hi: '#fff6dc', mark: '#8a4a14' },
  'medal-beef': { base: '#6a2717', mid: '#934226', dark: '#2e0e07', hi: '#d47a48', mark: '#1d0a06' },
  'medal-chicken': { base: '#c98a42', mid: '#e7b073', dark: '#7a4a1a', hi: '#ffdcaa', mark: '#4a220a' },
  pancetta: { base: '#c26a3c', mid: '#e8b27a', dark: '#6a2a14', hi: '#ffe2b0', mark: '#3a1408' },
  onion: { base: '#e9d3d8', mid: '#f7ecee', dark: '#9c6b7a', hi: '#ffffff', mark: '#6a3a2a' },
  'pepper-red': { base: '#b3261e', mid: '#d8453a', dark: '#5a0c08', hi: '#ff9a8a', mark: '#2a0604' },
  'pepper-green': { base: '#3d7a2a', mid: '#5aa040', dark: '#173a10', hi: '#b6e39a', mark: '#0e2008' },
  bread: { base: '#d39a4a', mid: '#ecc27a', dark: '#8a5420', hi: '#fff0c8', mark: '#4a2a0a' },
}

const SKEWER_PIECES: Partial<Record<ArtKind, PieceKind[]>> = {
  beef: ['beef', 'beef', 'beef', 'beef', 'beef'],
  kafta: ['kafta', 'kafta'],
  chicken: ['chicken', 'chicken', 'chicken', 'chicken', 'chicken'],
  sausage: ['sausage', 'sausage', 'sausage', 'sausage', 'sausage'],
  heart: ['heart', 'heart', 'heart', 'heart', 'heart', 'heart', 'heart', 'heart'],
  cheese: ['cheese', 'cheese', 'cheese', 'cheese'],
  'medal-beef': ['medal-beef', 'medal-beef', 'medal-beef', 'medal-beef'],
  'medal-chicken': ['medal-chicken', 'medal-chicken', 'medal-chicken', 'medal-chicken'],
  pancetta: ['pancetta', 'pancetta', 'pancetta', 'pancetta'],
  mixed: ['beef', 'onion', 'chicken', 'pepper-red', 'sausage', 'pepper-green', 'beef'],
  'garlic-bread': ['bread', 'bread', 'bread', 'bread'],
}

const WIDTH: Record<PieceKind, number> = {
  kafta: 128,
  beef: 54, chicken: 54, sausage: 50, heart: 30, cheese: 62, 'medal-beef': 60, 'medal-chicken': 60, pancetta: 58, onion: 16, 'pepper-red': 18, 'pepper-green': 18, bread: 60,
}
const HEIGHT: Record<PieceKind, number> = {
  kafta: 50,
  beef: 60, chicken: 56, sausage: 50, heart: 40, cheese: 52, 'medal-beef': 74, 'medal-chicken': 74, pancetta: 62, onion: 62, 'pepper-red': 58, 'pepper-green': 58, bread: 64,
}

function Piece({ kind, x, y, uid, seed }: { kind: PieceKind; x: number; y: number; uid: string; seed: number }) {
  const c = PALETTE[kind]
  const w = WIDTH[kind]
  const h = HEIGHT[kind]
  const r = rng(seed)
  const jitter = (n: number) => (r() - 0.5) * n
  const gid = `${uid}-${kind}`
  const clip = `${uid}-clip-${seed}`
  const rot = kind === 'kafta' ? jitter(3) : jitter(14)

  let shape: React.ReactNode
  if (kind === 'heart') {
    shape = <path d={`M0 ${-h / 2} C ${w / 1.6} ${-h / 2.2}, ${w / 1.8} ${h / 4}, 0 ${h / 2} C ${-w / 1.8} ${h / 4}, ${-w / 1.6} ${-h / 2.2}, 0 ${-h / 2}Z`} />
  } else if (kind === 'kafta') {
    shape = <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} />
  } else if (kind === 'medal-beef' || kind === 'medal-chicken' || kind === 'sausage') {
    shape = <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={kind === 'sausage' ? w / 2.4 : w / 2.2} />
  } else if (kind === 'onion' || kind.startsWith('pepper')) {
    shape = <path d={`M${-w / 2} ${-h / 2} Q ${w / 2} ${-h / 3} ${w / 2} 0 Q ${w / 2} ${h / 3} ${-w / 2} ${h / 2} Q ${-w / 6} 0 ${-w / 2} ${-h / 2}Z`} />
  } else {
    const k = kind === 'beef' ? 9 : kind === 'chicken' ? 14 : 8
    // forma levemente irregular para parecer corte de carne
    const p = [
      [-w / 2 + jitter(6), -h / 2 + jitter(6)], [w / 2 + jitter(6), -h / 2 + jitter(6)],
      [w / 2 + jitter(6), h / 2 + jitter(6)], [-w / 2 + jitter(6), h / 2 + jitter(6)],
    ]
    shape = (
      <path
        d={`M${p[0][0] + k} ${p[0][1]} L${p[1][0] - k} ${p[1][1]} Q${p[1][0]} ${p[1][1]} ${p[1][0]} ${p[1][1] + k} L${p[2][0]} ${p[2][1] - k} Q${p[2][0]} ${p[2][1]} ${p[2][0] - k} ${p[2][1]} L${p[3][0] + k} ${p[3][1]} Q${p[3][0]} ${p[3][1]} ${p[3][0]} ${p[3][1] - k} L${p[0][0]} ${p[0][1] + k} Q${p[0][0]} ${p[0][1]} ${p[0][0] + k} ${p[0][1]}Z`}
      />
    )
  }

  const grill = !['onion', 'pepper-red', 'pepper-green'].includes(kind)
  const flecks = Array.from({ length: kind === 'heart' ? 2 : kind === 'kafta' ? 18 : 7 }, () => [jitter(w * 0.8), jitter(h * 0.8), 0.6 + r() * 1.3])

  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <radialGradient id={gid} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={c.hi} />
          <stop offset="28%" stopColor={c.mid} />
          <stop offset="70%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
        <clipPath id={clip}>{shape}</clipPath>
      </defs>
      <g fill={`url(#${gid})`}>{shape}</g>
      <g clipPath={`url(#${clip})`}>
        {kind === 'pancetta' && (
          <>
            <rect x={-w} y={-h / 2} width={w * 2} height={h * 0.26} fill="#d9963c" />
            <rect x={-w} y={-h / 2 + h * 0.26} width={w * 2} height={h * 0.16} fill="#f6e2c0" />
            <rect x={-w} y={-h / 2 + h * 0.42} width={w * 2} height={h * 0.2} fill="#b8573a" />
            <rect x={-w} y={-h / 2 + h * 0.62} width={w * 2} height={h * 0.1} fill="#f3dcc0" />
            <rect x={-w} y={-h / 2 + h * 0.72} width={w * 2} height={h * 0.3} fill="#9e4630" />
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx={-w / 2 + (i * w) / 8} cy={-h / 2 + 5 + jitter(4)} r={2.2} fill="#f5c46a" opacity={0.8} />
            ))}
          </>
        )}
        {(kind === 'medal-beef' || kind === 'medal-chicken') && (
          <>
            {Array.from({ length: 6 }, (_, i) => (
              <rect key={i} x={-w} y={-h / 2 + (i * h) / 6} width={w * 2} height={h / 12} fill={i % 2 ? '#f2c7a8' : '#8e2f22'} opacity={0.85} transform={`skewY(${-8 + jitter(4)})`} />
            ))}
            <rect x={-w} y={-h / 2} width={w * 2} height={h} fill={c.dark} opacity={0.15} />
          </>
        )}
        {kind === 'bread' && <rect x={-w / 2 + 8} y={-4} width={w - 16} height={8} rx={4} fill="#fff4d6" opacity={0.95} />}
        {grill &&
          (kind === 'kafta' ? [-0.4, -0.2, 0, 0.2, 0.4] : [-0.35, 0, 0.35]).map((t, i) => (
            <rect
              key={i}
              x={-w}
              y={t * h - 3.5}
              width={w * 2}
              height={kind === 'cheese' || kind === 'bread' ? 6 : 7}
              fill={c.mark}
              opacity={kind === 'cheese' ? 0.55 : 0.75}
              transform={`rotate(${-32 + jitter(6)})`}
              rx={3}
            />
          ))}
        {/* borda tostada */}
        <g fill="none" stroke={c.dark} strokeWidth={6} opacity={0.55}>{shape}</g>
        {/* brilho de suculência */}
        <ellipse cx={-w * 0.12} cy={-h * 0.26} rx={w * 0.26} ry={h * 0.08} fill="#fff" opacity={kind === 'cheese' ? 0.35 : 0.22} />
        {flecks.map(([fx, fy, fr], i) => (
          <circle key={i} cx={fx} cy={fy} r={fr} fill={kind === 'chicken' || kind === 'pepper-green' || kind === 'kafta' ? '#4f8a2a' : '#fff4e0'} opacity={0.75} />
        ))}
      </g>
    </g>
  )
}

function Skewer({ pieces, uid, glow = true }: { pieces: PieceKind[]; uid: string; glow?: boolean }) {
  const gap = 4
  const total = pieces.reduce((s, p) => s + WIDTH[p] + gap, -gap)
  const start = 212 - total / 2
  let x = start
  const placed = pieces.map((p, i) => {
    const cx = x + WIDTH[p] / 2
    x += WIDTH[p] + gap
    return { p, cx, i }
  })
  return (
    <g transform="rotate(-24 200 200)">
      <defs>
        <linearGradient id={`${uid}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9c68e" />
          <stop offset="55%" stopColor="#b98a4e" />
          <stop offset="100%" stopColor="#6e4a22" />
        </linearGradient>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      {glow && <ellipse cx={210} cy={262} rx={total / 1.6} ry={28} fill={`url(#${uid}-shadow)`} />}
      {/* espeto de madeira */}
      <path d="M18 196 L382 196 L398 200 L382 204 L18 204 Q12 200 18 196Z" fill={`url(#${uid}-wood)`} />
      <rect x={18} y={196} width={58} height={8} rx={3} fill="#8a5a2a" opacity={0.5} />
      {placed.map(({ p, cx, i }) => (
        <Piece key={i} kind={p} x={cx} y={200} uid={uid} seed={i * 97 + p.length * 13 + 7} />
      ))}
    </g>
  )
}

/* ——— Acompanhamentos, porções, bebidas ——— */

function Bowl({ uid, children, color = '#1c1c1c', rim = '#2c2c2c', small = false }: { uid: string; children: React.ReactNode; color?: string; rim?: string; small?: boolean }) {
  const s = small ? 0.72 : 1
  return (
    <g transform={`translate(200 215) scale(${s}) translate(-200 -215)`}>
      <defs>
        <clipPath id={`${uid}-bowl`}>
          <ellipse cx={200} cy={190} rx={138} ry={58} />
        </clipPath>
        <linearGradient id={`${uid}-bowlg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rim} />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
      </defs>
      <ellipse cx={200} cy={300} rx={130} ry={22} fill="#000" opacity={0.6} />
      <path d="M58 190 Q66 300 200 300 Q334 300 342 190Z" fill={`url(#${uid}-bowlg)`} />
      <ellipse cx={200} cy={190} rx={144} ry={62} fill={rim} />
      <ellipse cx={200} cy={190} rx={138} ry={58} fill={color} />
      <g clipPath={`url(#${uid}-bowl)`}>{children}</g>
    </g>
  )
}

function scatter(seed: number, n: number, cx: number, cy: number, rx: number, ry: number) {
  const r = rng(seed)
  return Array.from({ length: n }, () => {
    const a = r() * Math.PI * 2, d = Math.sqrt(r())
    return { x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, rot: r() * 180, t: r() }
  })
}

function Board({ uid, children }: { uid: string; children: React.ReactNode }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-board`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6b4424" />
          <stop offset="1" stopColor="#3a220f" />
        </linearGradient>
      </defs>
      <ellipse cx={200} cy={318} rx={160} ry={22} fill="#000" opacity={0.6} />
      <rect x={44} y={150} width={312} height={160} rx={30} fill={`url(#${uid}-board)`} />
      <rect x={44} y={150} width={312} height={14} rx={7} fill="#8a5a30" opacity={0.6} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M60 ${180 + i * 22} Q200 ${172 + i * 22} 340 ${182 + i * 22}`} stroke="#2a170a" strokeOpacity={0.35} fill="none" />
      ))}
      {children}
    </g>
  )
}

const Stick = ({ x, y, w, h, rot, fill, edge }: { x: number; y: number; w: number; h: number; rot: number; fill: string; edge: string }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill={fill} stroke={edge} strokeWidth={1.5} />
    <rect x={-w / 2 + 2} y={-h / 2 + 2} width={w * 0.35} height={h - 4} rx={2} fill="#fff" opacity={0.18} />
  </g>
)

function Drink({ kind, uid }: { kind: ArtKind; uid: string }) {
  const can = (body: string, band: string) => (
    <g>
      <defs>
        <linearGradient id={`${uid}-can`} x1="0" x2="1">
          <stop offset="0" stopColor={body} stopOpacity={0.7} />
          <stop offset="0.3" stopColor={body} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="0.7" stopColor={body} />
          <stop offset="1" stopColor="#000" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <ellipse cx={200} cy={334} rx={78} ry={14} fill="#000" opacity={0.6} />
      <rect x={136} y={96} width={128} height={236} rx={18} fill={`url(#${uid}-can)`} />
      <rect x={136} y={176} width={128} height={70} fill={band} opacity={0.9} />
      <path d="M136 176 Q200 196 264 176" stroke="#fff" strokeOpacity={0.5} strokeWidth={4} fill="none" />
      <ellipse cx={200} cy={98} rx={60} ry={12} fill="#cfcfcf" />
      <ellipse cx={200} cy={98} rx={46} ry={8} fill="#9a9a9a" />
      {scatter(5, 22, 200, 220, 56, 100).map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.5 + d.t * 2.5} fill="#fff" opacity={0.35} />
      ))}
    </g>
  )
  const bottle = (liquid: string, cap: string, big = false, bubbles = false) => {
    const s = big ? 1.12 : 1
    return (
      <g transform={`translate(200 215) scale(${s}) translate(-200 -215)`}>
        <ellipse cx={200} cy={340} rx={70} ry={12} fill="#000" opacity={0.6} />
        <path d="M176 70 L224 70 L224 100 Q262 128 262 172 L262 318 Q262 336 244 336 L156 336 Q138 336 138 318 L138 172 Q138 128 176 100Z" fill={liquid} opacity={0.85} />
        <path d="M176 70 L224 70 L224 100 Q262 128 262 172 L262 318 Q262 336 244 336 L156 336 Q138 336 138 318 L138 172 Q138 128 176 100Z" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} />
        <rect x={172} y={52} width={56} height={24} rx={5} fill={cap} />
        <rect x={138} y={200} width={124} height={62} fill="#f3e9d8" opacity={0.92} />
        <rect x={138} y={222} width={124} height={8} fill={cap} opacity={0.8} />
        <rect x={150} y={110} width={14} height={210} rx={7} fill="#fff" opacity={0.25} />
        {bubbles && scatter(9, 26, 200, 290, 50, 34).map((d, i) => <circle key={i} cx={d.x} cy={d.y - 120 * d.t} r={1.5 + d.t * 3} fill="#fff" opacity={0.5} />)}
      </g>
    )
  }
  switch (kind) {
    case 'cola': return can('#b3141b', '#1a1a1a')
    case 'guarana': return can('#1f7a32', '#f3e9d8')
    case 'water': return bottle('#9fd0e6', '#2a7ab8')
    case 'sparkling': return bottle('#a7e0cf', '#2e8a5a', false, true)
    case 'soda2l': return bottle('#2a0c06', '#b3141b', true)
    case 'juice':
      return (
        <g>
          <ellipse cx={200} cy={336} rx={78} ry={14} fill="#000" opacity={0.6} />
          <path d="M128 110 L272 110 L254 330 L146 330Z" fill="#f7a531" opacity={0.92} />
          <path d="M128 110 L272 110 L254 330 L146 330Z" fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={4} />
          <ellipse cx={200} cy={130} rx={70} ry={10} fill="#ffd27a" />
          {[150, 190, 228].map((x, i) => <rect key={i} x={x} y={128 + i * 8} width={30} height={26} rx={5} fill="#fff" opacity={0.4} transform={`rotate(${i * 15 - 10} ${x} 140)`} />)}
          <rect x={222} y={52} width={10} height={170} rx={5} fill="#B83A24" transform="rotate(14 227 140)" />
          <circle cx={262} cy={112} r={30} fill="#f0c020" stroke="#7aa02a" strokeWidth={6} />
          <rect x={150} y={150} width={14} height={170} rx={7} fill="#fff" opacity={0.25} />
        </g>
      )
    default: return null
  }
}

function SideOrPortion({ kind, uid }: { kind: ArtKind; uid: string }) {
  switch (kind) {
    case 'cassava':
      return (
        <Bowl uid={uid}>
          {scatter(3, 16, 200, 190, 110, 44).map((d, i) => (
            <Stick key={i} x={d.x} y={d.y} w={48} h={26} rot={d.rot} fill="#f2dc9a" edge="#c8a24a" />
          ))}
          {scatter(4, 8, 200, 180, 90, 30).map((d, i) => <ellipse key={i} cx={d.x} cy={d.y} rx={8} ry={3} fill="#ffe680" opacity={0.7} />)}
        </Bowl>
      )
    case 'farofa':
      return (
        <Bowl uid={uid} color="#d9a656">
          {scatter(7, 260, 200, 190, 140, 60).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={1.2 + d.t * 1.6} fill={d.t > 0.8 ? '#7a3010' : d.t > 0.55 ? '#f0cf8a' : '#b77a32'} />)}
          {scatter(8, 14, 200, 190, 110, 44).map((d, i) => <rect key={i} x={d.x} y={d.y} width={8} height={6} rx={2} fill="#8e2f22" />)}
          {scatter(9, 16, 200, 190, 110, 44).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={2.5} fill="#3f8a2a" />)}
        </Bowl>
      )
    case 'vinaigrette':
      return (
        <Bowl uid={uid} color="#5a1a10">
          {scatter(11, 90, 200, 190, 130, 54).map((d, i) => (
            <rect key={i} x={d.x - 5} y={d.y - 5} width={10} height={9} rx={2} fill={d.t > 0.66 ? '#d63a26' : d.t > 0.33 ? '#f1ece0' : '#4f9a33'} transform={`rotate(${d.rot} ${d.x} ${d.y})`} />
          ))}
          <ellipse cx={170} cy={170} rx={60} ry={12} fill="#fff" opacity={0.12} />
        </Bowl>
      )
    case 'rice':
      return (
        <Bowl uid={uid} color="#f4efe4">
          {scatter(13, 240, 200, 190, 140, 60).map((d, i) => <ellipse key={i} cx={d.x} cy={d.y} rx={4} ry={1.6} fill={d.t > 0.5 ? '#fffdf6' : '#e6dcc8'} transform={`rotate(${d.rot} ${d.x} ${d.y})`} />)}
        </Bowl>
      )
    case 'potato-salad':
      return (
        <Bowl uid={uid} color="#f2e6bf">
          {scatter(17, 30, 200, 190, 120, 48).map((d, i) => <rect key={i} x={d.x - 9} y={d.y - 8} width={18} height={15} rx={5} fill="#f8eecb" stroke="#e0cf96" />)}
          {scatter(18, 26, 200, 190, 120, 48).map((d, i) => <rect key={i} x={d.x} y={d.y} width={6} height={6} rx={1} fill="#ee8a2a" />)}
          {scatter(19, 24, 200, 190, 120, 48).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={2.2} fill="#3f8a2a" />)}
        </Bowl>
      )
    case 'sauce':
      return (
        <Bowl uid={uid} small color="#c9b24a">
          <ellipse cx={200} cy={190} rx={138} ry={58} fill="#b8a03a" />
          {scatter(23, 60, 200, 190, 120, 48).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={2 + d.t * 2} fill={d.t > 0.5 ? '#2f6b1e' : '#f3e9b0'} opacity={0.85} />)}
          <ellipse cx={160} cy={170} rx={50} ry={10} fill="#fff" opacity={0.25} />
        </Bowl>
      )
    case 'fries':
    case 'polenta':
    case 'cassava-fried': {
      const look = kind === 'fries' ? ['#f2c443', '#c9921e', 16, 70] : kind === 'polenta' ? ['#f0b832', '#b8781a', 26, 66] : ['#f1d79a', '#c39a4a', 24, 64]
      return (
        <Board uid={uid}>
          {scatter(kind.length * 7, kind === 'fries' ? 46 : 26, 200, 225, 120, 50).map((d, i) => (
            <Stick key={i} x={d.x} y={d.y} w={look[3] as number} h={look[2] as number} rot={d.rot} fill={look[0] as string} edge={look[1] as string} />
          ))}
          {kind === 'polenta' && scatter(31, 40, 200, 225, 120, 50).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={1.6} fill="#fff6d0" />)}
          {scatter(29, 30, 200, 225, 120, 50).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={1.4} fill="#fff" opacity={0.8} />)}
        </Board>
      )
    }
    case 'onion-rings':
      return (
        <Board uid={uid}>
          {scatter(37, 11, 200, 225, 110, 46).map((d, i) => (
            <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.rot})`}>
              <ellipse rx={34} ry={22} fill="none" stroke="#c98a2e" strokeWidth={14} />
              <ellipse rx={34} ry={22} fill="none" stroke="#f0c060" strokeWidth={6} strokeDasharray="4 5" />
            </g>
          ))}
        </Board>
      )
    case 'calabresa':
      return (
        <Board uid={uid}>
          {scatter(41, 22, 200, 225, 120, 50).map((d, i) => (
            <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.rot})`}>
              <path d="M-22 0 A22 22 0 0 1 22 0Z" fill="#a8302a" stroke="#5a120c" strokeWidth={3} />
              {[-10, 0, 9].map((x) => <circle key={x} cx={x} cy={-7} r={2.4} fill="#f2d0b8" />)}
            </g>
          ))}
          {scatter(43, 18, 200, 220, 120, 46).map((d, i) => (
            <path key={i} d={`M${d.x - 22} ${d.y} Q${d.x} ${d.y - 16} ${d.x + 22} ${d.y}`} stroke="#f3e2c6" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9} />
          ))}
        </Board>
      )
    case 'mixed-portion':
      return (
        <Board uid={uid}>
          {scatter(47, 18, 140, 225, 70, 44).map((d, i) => <Stick key={i} x={d.x} y={d.y} w={64} h={16} rot={d.rot} fill="#f2c443" edge="#c9921e" />)}
          {scatter(48, 10, 260, 205, 70, 30).map((d, i) => <Stick key={i} x={d.x} y={d.y} w={60} h={24} rot={d.rot} fill="#f1d79a" edge="#c39a4a" />)}
          {scatter(49, 9, 260, 255, 70, 26).map((d, i) => (
            <path key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.rot})`} d="M-20 0 A20 20 0 0 1 20 0Z" fill="#a8302a" stroke="#5a120c" strokeWidth={3} />
          ))}
          {scatter(50, 4, 140, 220, 50, 30).map((d, i) => <ellipse key={i} cx={d.x} cy={d.y} rx={28} ry={18} fill="none" stroke="#c98a2e" strokeWidth={11} />)}
        </Board>
      )
    default:
      return null
  }
}

export function FoodArt({ kind, className, glow = true }: { kind: ArtKind; className?: string; glow?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const skewer = SKEWER_PIECES[kind]

  let content: React.ReactNode
  if (skewer) content = <Skewer pieces={skewer} uid={uid} glow={glow} />
  else if (['cola', 'guarana', 'water', 'sparkling', 'juice', 'soda2l'].includes(kind)) content = <Drink kind={kind} uid={uid} />
  else if (kind === 'combo')
    content = (
      <g>
        <g transform="translate(-30 40) scale(0.9)">
          <Skewer pieces={SKEWER_PIECES.beef!} uid={`${uid}a`} />
        </g>
        <g transform="translate(10 -40) scale(0.85)">
          <Skewer pieces={SKEWER_PIECES.chicken!} uid={`${uid}b`} glow={false} />
        </g>
        <g transform="translate(250 150) scale(0.42)">
          <Drink kind="cola" uid={`${uid}c`} />
        </g>
        <g transform="translate(-10 190) scale(0.45)">
          <SideOrPortion kind="farofa" uid={`${uid}d`} />
        </g>
      </g>
    )
  else content = <SideOrPortion kind={kind} uid={uid} />

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-hidden="true">
      {content}
    </svg>
  )
}
