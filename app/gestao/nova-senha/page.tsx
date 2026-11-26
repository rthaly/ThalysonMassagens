import { NewPassword } from '@/components/calendar-admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Só abre com a sessão criada pelo link do e-mail de "Esqueci a senha"
export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email?.toLowerCase() !== 'relaxecomthalyson@gmail.com') redirect('/gestao/entrar')
  return <main className="admin-auth-page"><NewPassword/><a href="/gestao" className="admin-back">← Voltar à gestão</a></main>
}
