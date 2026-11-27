'use client'

import { useEffect } from 'react'

// Refração de vidro (estilo Liquid Glass) com um filtro nativo do navegador: o fundo atrás da barra de preço,
// do cartão do topo e do botão do assistente "entorta" nas bordas, como numa lente.
// Só roda em Chrome/Edge/Android Chrome (única família que aceita SVG dentro de backdrop-filter).
// Nos outros navegadores nada muda: ficam o desfoque e o aro de luz de sempre.
function suportaRefracao() {
  try {
    const nav = navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] }; deviceMemory?: number }
    const chromium = !!nav.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand))
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent)
    const fraco = typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4
    return chromium && !ios && !fraco && CSS.supports('backdrop-filter', 'url(#a) blur(1px)')
  } catch { return false }
}

// Mapa de deslocamento: cada pixel guarda para onde a borda "empurra" o fundo (R = horizontal, G = vertical).
function mapaDaLente(w: number, h: number, bisel: number) {
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const ctx = c.getContext('2d'); if (!ctx) return ''
  const img = ctx.createImageData(w, h)
  const r = h / 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = Math.min(Math.max(x + 0.5, r), w - r), py = h / 2
      const dx = px - (x + 0.5), dy = py - (y + 0.5)
      const dist = Math.hypot(dx, dy)
      const d = r - dist // distância até a borda, para dentro
      let mx = 0, my = 0
      if (d < bisel && dist > 0) {
        const t = 1 - Math.max(d, 0) / bisel
        const m = 1 - Math.sqrt(Math.max(0, 1 - t * t)) // perfil convexo: quase zero no meio, forte na borda
        mx = (dx / dist) * m; my = (dy / dist) * m
      }
      const i = (y * w + x) * 4
      img.data[i] = 128 + mx * 127; img.data[i + 1] = 128 + my * 127; img.data[i + 2] = 128; img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL('image/png')
}

export function LiquidLens() {
  useEffect(() => {
    if (!suportaRefracao()) return undefined
    const url = mapaDaLente(640, 128, 30)
    if (!url) return undefined
    const ns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true')
    svg.style.cssText = 'position:absolute;pointer-events:none'
    svg.innerHTML = `<filter id="lg-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage href="${url}" preserveAspectRatio="none" result="mapa"/><feDisplacementMap in="SourceGraphic" in2="mapa" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter>`
    document.body.appendChild(svg)
    document.documentElement.classList.add('lg-refract')
    return () => { svg.remove(); document.documentElement.classList.remove('lg-refract') }
  }, [])
  return null
}
