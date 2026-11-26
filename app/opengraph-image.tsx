import { ImageResponse } from 'next/og'

// Cartão que aparece quando o link do site é enviado no WhatsApp, Instagram ou redes sociais.
// Só vocabulário público (mesma regra do SEO).
export const alt = 'Relaxar hoje com Thalyson: massagem na Bela Vista, São Paulo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 90px', background: '#121312', color: '#f2f0eb' }}>
        <div style={{ fontSize: 30, letterSpacing: 4, textTransform: 'uppercase', color: '#a9b3a4', display: 'flex' }}>Bela Vista · São Paulo</div>
        <div style={{ fontSize: 96, lineHeight: 1.05, marginTop: 24, display: 'flex' }}>Relaxar hoje com Thalyson</div>
        <div style={{ fontSize: 38, marginTop: 36, color: '#d8d6cf', display: 'flex' }}>Tire o peso do corpo. Desligue a cabeça.</div>
        <div style={{ fontSize: 30, marginTop: 48, color: '#a9b3a4', display: 'flex' }}>Hora marcada · direto pelo WhatsApp</div>
      </div>
    ),
    size,
  )
}
