import gsap from 'gsap'
import { prefersReducedMotion } from './utils'

/** Bolinha de brasa voando do botão até o carrinho visível. */
export function flyToCart(from: HTMLElement | null) {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-cart-target]')).filter((el) => el.offsetParent !== null)
  const target = targets[targets.length - 1]
  if (!target) return
  const bump = () => gsap.fromTo(target, { scale: 1 }, { scale: 1.18, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' })
  if (!from || prefersReducedMotion()) return void bump()
  const a = from.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  const dot = document.createElement('div')
  dot.style.cssText = `position:fixed;z-index:100;left:${a.left + a.width / 2 - 9}px;top:${a.top + a.height / 2 - 9}px;width:18px;height:18px;border-radius:999px;background:radial-gradient(circle at 35% 35%,#ffd2a0,#F07832 45%,#B83A24);box-shadow:0 0 18px 4px rgba(240,120,50,.7);pointer-events:none`
  document.body.appendChild(dot)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  gsap.timeline({ onComplete: () => { dot.remove(); bump() } })
    .to(dot, { x: dx, duration: 0.7, ease: 'power1.inOut' }, 0)
    .to(dot, { y: dy, duration: 0.7, ease: 'back.in(1.6)' }, 0)
    .to(dot, { scale: 0.4, duration: 0.7, ease: 'power2.in' }, 0)
}
