import { AdminAccess } from '@/components/calendar-admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email?.toLowerCase() === 'relaxecomthalyson@gmail.com') redirect('/gestao')
  return <main className="admin-auth-page"><AdminAccess/><a href="/" className="admin-back">← Voltar ao site</a></main>
}
