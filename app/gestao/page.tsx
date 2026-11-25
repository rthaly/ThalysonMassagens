import { redirect } from 'next/navigation'
import { CalendarAdmin } from '@/components/calendar-admin'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/gestao/entrar')
  if (user.email?.toLowerCase() !== 'relaxecomthalyson@gmail.com') redirect('/')
  return <CalendarAdmin email={user.email}/>
}
