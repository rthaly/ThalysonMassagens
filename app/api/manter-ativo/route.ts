// Chamado uma vez por dia pela Vercel (vercel.json). O plano grátis do Supabase pausa o projeto
// depois de 7 dias sem uso, e aí o login da gestão para de funcionar. Este pedido diário evita isso.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Não autorizado', { status: 401 })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return Response.json({ ok: false, motivo: 'sem Supabase' })
  try {
    const headers = { apikey: key, Authorization: `Bearer ${key}` }
    const [auth, rest] = await Promise.all([
      fetch(`${url}/auth/v1/settings`, { headers, cache: 'no-store' }),
      fetch(`${url}/rest/v1/`, { headers, cache: 'no-store' }),
    ])
    return Response.json({ ok: auth.ok, auth: auth.status, rest: rest.status })
  } catch {
    return Response.json({ ok: false, motivo: 'Supabase não respondeu' }, { status: 502 })
  }
}
