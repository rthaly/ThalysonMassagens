import { redirect } from 'next/navigation'
import { reviewUrl } from '@/lib/content'

// As avaliações ficam no Google Meu Negócio. Links antigos para /avaliacoes levam para lá.
export default function Page() {
  redirect(reviewUrl)
}
