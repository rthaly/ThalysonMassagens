import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActionBar } from './ActionBar'
import { DetailsStep } from './DetailsStep'
import { Header } from './Header'
import { PackagesStep } from './PackagesStep'
import { ProfileDialog } from './ProfileDialog'
import { ScheduleStep } from './ScheduleStep'
import { SuccessStep } from './SuccessStep'
import { Welcome } from './Welcome'
import {
  CONFIG,
  EMPTY_DRAFT,
  PACKAGES,
  type AddonId,
  type DayInfo,
  type Draft,
  type LastBooking,
  type LocType,
  type Step,
} from './config'
import {
  buildBookingLink,
  buildDays,
  buildIcs,
  buildInvoice,
  copyText,
  formatCnpj,
  fromMin,
  getSlots,
  hasDraftContent,
  isOnboarded,
  isReturning as readReturning,
  KEYS,
  makeCode,
  maskCep,
  readDraft,
  readLastBooking,
  store,
  toMin,
  vibrate,
  writeDraft,
} from './lib'

export default function App() {
  const [draft, setDraft] = useState<Draft>(() => readDraft())
  const [step, setStep] = useState<Step>(() => (isOnboarded() ? 1 : 0))
  const [returning, setReturning] = useState(() => readReturning())
  const [lastBooking, setLastBooking] = useState<LastBooking | null>(() => readLastBooking())
  const [now, setNow] = useState(() => new Date())
  const [profileOpen, setProfileOpen] = useState(false)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const [attempted, setAttempted] = useState({ step2: false, step3: false })
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponOpen, setCouponOpen] = useState(false)
  const [shakeCoupon, setShakeCoupon] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [hp, setHp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sentLink, setSentLink] = useState('')
  const [bookingCode, setBookingCode] = useState('')

  const headingRef = useRef<HTMLHeadingElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const streetRef = useRef<HTMLInputElement>(null)
  const numberRef = useRef<HTMLInputElement>(null)
  const paymentRef = useRef<HTMLDivElement>(null)
  const selectedDateRef = useRef<HTMLButtonElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cepAbort = useRef<AbortController | null>(null)
  const submitLock = useRef(false)
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pkg = useMemo(() => PACKAGES.find((item) => item.id === draft.packageId) ?? PACKAGES[0], [draft.packageId])
  const isHome = draft.locType === 'home'
  const invoice = useMemo(() => buildInvoice(draft, pkg, returning), [draft, pkg, returning])
  const days = useMemo(() => buildDays(invoice.duration, draft.locType, now), [invoice.duration, draft.locType, now])
  const slots = useMemo(
    () => (draft.date ? getSlots(draft.date, invoice.duration, draft.locType, now) : []),
    [draft.date, invoice.duration, draft.locType, now],
  )
  const selectedSlot = slots.find((slot) => slot.t === draft.time && slot.ok) ?? null
  const endTime = draft.time ? fromMin(toMin(draft.time) + invoice.duration) : ''

  const nextFree = useMemo<{ date: DayInfo; time: string } | null>(() => {
    if (days.length === 0) return null
    const start = Math.max(0, days.findIndex((day) => day.key === draft.date))
    const ordered = [...days.slice(start), ...days.slice(0, start)]
    for (const day of ordered) {
      const slot = getSlots(day.key, invoice.duration, draft.locType, now).find((item) => item.ok)
      if (slot) return { date: day, time: slot.t }
    }
    return null
  }, [days, draft.date, invoice.duration, draft.locType, now])

  const nameError = draft.name.trim().length >= 3 ? '' : 'Me diga seu nome (mínimo 3 letras).'
  const streetError = !draft.street.trim() ? 'Informe a rua.' : ''
  const numberError = !draft.number.trim() ? 'Informe o número.' : ''
  const bairroError = !draft.bairro.trim() ? 'Informe o bairro.' : ''
  const paymentError = draft.payment ? '' : 'Escolha como prefere pagar.'
  const dateError = attempted.step2 && !draft.date ? 'Escolha uma data.' : ''
  const timeError = attempted.step2 && draft.date && !draft.time ? 'Escolha um horário.' : ''

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }, [])

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((previous) => ({ ...previous, ...patch }))
  }, [])

  const go = useCallback((next: Step) => {
    vibrate(8)
    setAttempted({ step2: false, step3: false })
    setStep(next)
  }, [])

  const scrollToId = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (!element) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
  }, [])

  /* Relógio: mantém a lista de horários honesta sem recarregar a página. */
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(interval)
  }, [])

  /* Rascunho local: nada vai para servidor. Expira em 7 dias. */
  useEffect(() => {
    if (step === 4) return undefined
    const timer = setTimeout(() => {
      if (hasDraftContent(draft)) writeDraft(draft)
      else store.remove(KEYS.draft)
    }, 450)
    return () => clearTimeout(timer)
  }, [draft, step])

  /* Se a duração/local mudar ou o horário passar, limpa a seleção. */
  useEffect(() => {
    if (!draft.time) return
    if (slots.some((slot) => slot.t === draft.time && slot.ok)) return
    setDraft((previous) => (previous.time === draft.time ? { ...previous, time: '' } : previous))
    if (step === 2) showToast('Esse horário não está mais disponível. Escolha outro.')
    if (step === 3) {
      showToast('Seu horário expirou. Escolha outro para continuar.')
      setStep(2)
    }
  }, [slots, draft.time, step, showToast])

  /* Foco no título a cada passo: leitores de tela entendem a troca de contexto. */
  useEffect(() => {
    if (step === 0) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    const timer = setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 320)
    return () => clearTimeout(timer)
  }, [step])

  /* Mantém a data selecionada visível na régua horizontal. */
  useEffect(() => {
    if (step !== 2 || !draft.date) return undefined
    const timer = setTimeout(() => {
      selectedDateRef.current?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [step, draft.date])

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      if (shakeTimer.current) clearTimeout(shakeTimer.current)
      cepAbort.current?.abort()
    },
    [],
  )

  const start = () => {
    vibrate(12)
    store.set(KEYS.onboard, 'yes')
    setStep(1)
  }

  const selectPackage = (id: string) => {
    vibrate(8)
    setDraft((previous) => ({
      ...previous,
      packageId: id,
      addons: id === 'aparo_solo' ? { ...previous.addons, aparo: false } : previous.addons,
    }))
  }

  const toggleAddon = (id: AddonId) => {
    vibrate(8)
    setDraft((previous) => ({
      ...previous,
      addons: { ...previous.addons, [id]: !previous.addons[id] },
    }))
  }

  const setLocation = (locType: LocType) => {
    if (locType === draft.locType) return
    vibrate(8)
    setDraft((previous) => ({ ...previous, locType, time: '' }))
  }

  const selectDate = (key: string) => {
    vibrate(8)
    setDraft((previous) => ({ ...previous, date: key, time: '' }))
  }

  const selectTime = (time: string) => {
    vibrate(8)
    setDraft((previous) => ({ ...previous, time }))
  }

  const selectNextFree = () => {
    if (!nextFree) return
    vibrate(10)
    setDraft((previous) => ({ ...previous, date: nextFree.date.key, time: nextFree.time }))
  }

  const goDetails = () => {
    if (!draft.date) {
      setAttempted((previous) => ({ ...previous, step2: true }))
      showToast('Escolha uma data para continuar.')
      scrollToId('date-section')
      return
    }
    if (!selectedSlot) {
      setAttempted((previous) => ({ ...previous, step2: true }))
      showToast('Escolha um horário para continuar.')
      scrollToId('time-section')
      return
    }
    go(3)
  }

  const handleCep = async (value: string) => {
    const masked = maskCep(value)
    update({ cep: masked })

    if (masked.length !== 9) {
      cepAbort.current?.abort()
      cepAbort.current = null
      setCepLoading(false)
      return
    }

    cepAbort.current?.abort()
    const controller = new AbortController()
    cepAbort.current = controller
    setCepLoading(true)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${masked.replace(/\D/g, '')}/json/`, {
        signal: controller.signal,
      })
      if (!response.ok) throw new Error('cep')
      const data = (await response.json()) as { erro?: boolean; logradouro?: string; bairro?: string }
      if (data.erro) {
        showToast('CEP não encontrado. Preencha o endereço manualmente.')
        return
      }
      setDraft((previous) => ({
        ...previous,
        street: data.logradouro || previous.street,
        bairro: data.bairro || previous.bairro,
      }))
      window.setTimeout(() => numberRef.current?.focus(), 140)
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        showToast('Não consegui buscar o CEP. Preencha manualmente.')
      }
    } finally {
      if (cepAbort.current === controller) {
        cepAbort.current = null
        setCepLoading(false)
      }
    }
  }

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase().slice(0, 30)
    if (!code) {
      setCouponError('Digite o código do cupom.')
      return
    }
    if (CONFIG.COUPONS[code]) {
      vibrate([10, 30])
      update({ coupon: code })
      setCouponInput('')
      setCouponError('')
      setCouponOpen(false)
      showToast(`Cupom ${code} aplicado.`)
      return
    }
    vibrate(30)
    setCouponError('Cupom inválido ou expirado.')
    setShakeCoupon(true)
    if (shakeTimer.current) clearTimeout(shakeTimer.current)
    shakeTimer.current = setTimeout(() => setShakeCoupon(false), 420)
  }

  const submit = () => {
    if (submitLock.current) return

    if (!draft.date || !draft.time || !selectedSlot) {
      showToast('Seu horário expirou. Escolha novamente.')
      go(2)
      return
    }

    if (draft.name.trim().length < 3) {
      setAttempted((previous) => ({ ...previous, step3: true }))
      showToast('Me diga seu nome para continuar.')
      nameRef.current?.focus()
      return
    }

    if (isHome && (!draft.street.trim() || !draft.number.trim() || !draft.bairro.trim())) {
      setAttempted((previous) => ({ ...previous, step3: true }))
      showToast('Complete o endereço para continuar.')
      if (!draft.street.trim()) streetRef.current?.focus()
      else if (!draft.number.trim()) numberRef.current?.focus()
      else document.getElementById('bairro')?.focus()
      return
    }

    if (!draft.payment) {
      setAttempted((previous) => ({ ...previous, step3: true }))
      showToast('Escolha como prefere pagar.')
      paymentRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      })
      return
    }

    submitLock.current = true
    setSubmitting(true)

    if (hp) {
      window.setTimeout(() => {
        setSubmitting(false)
        setStep(4)
        submitLock.current = false
      }, 400)
      return
    }

    const code = makeCode()
    const link = buildBookingLink({ ...draft, name: draft.name.trim() }, pkg, invoice, code)
    const record: LastBooking = {
      code,
      title: pkg.title,
      date: draft.date,
      time: draft.time,
      duration: invoice.duration,
      total: invoice.total,
      signal: invoice.signal,
      link,
      createdAt: Date.now(),
    }

    /* Abre a aba ainda dentro do clique para o navegador não bloquear. */
    const popup = window.open('', '_blank')

    store.set(KEYS.returning, 'yes')
    store.set(KEYS.last, JSON.stringify(record))
    store.remove(KEYS.draft)

    setLastBooking(record)
    setBookingCode(code)
    setSentLink(link)
    setStep(4)
    setSubmitting(false)
    vibrate([20, 40, 20])

    window.setTimeout(() => {
      submitLock.current = false
    }, 1400)

    if (popup) {
      popup.opener = null
      popup.location.href = link
    } else {
      showToast('Tudo pronto. Toque em abrir WhatsApp para enviar.')
    }
  }

  const copyPix = async () => {
    const ok = await copyText(CONFIG.PIX_KEY)
    const pretty = formatCnpj(CONFIG.PIX_KEY)
    showToast(ok ? `Pix copiado: ${pretty}` : `Chave Pix: ${pretty}`)
  }

  const copyCode = async () => {
    if (!bookingCode) return
    const ok = await copyText(bookingCode)
    showToast(ok ? 'Código copiado.' : `Código: ${bookingCode}`)
  }

  const downloadIcs = () => {
    if (!draft.date || !draft.time) return
    const ics = buildIcs(draft, pkg, invoice, bookingCode)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `thalyson-${draft.date}.ics`
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1500)
  }

  const resetFlow = () => {
    vibrate(10)
    setDraft((previous) => ({
      ...EMPTY_DRAFT,
      name: previous.name,
      locType: previous.locType,
      cep: previous.cep,
      street: previous.street,
      number: previous.number,
      comp: previous.comp,
      bairro: previous.bairro,
      optIn: previous.optIn,
      addons: {},
    }))
    setReturning(readReturning())
    setStep(1)
    setSentLink('')
    setBookingCode('')
    setAttempted({ step2: false, step3: false })
    setCouponInput('')
    setCouponError('')
    setCouponOpen(false)
    setSubmitting(false)
    submitLock.current = false
  }

  const clearData = () => {
    store.clearNamespace()
    setDraft({ ...EMPTY_DRAFT, addons: {} })
    setReturning(false)
    setLastBooking(null)
    setStep(0)
    setSentLink('')
    setBookingCode('')
    setAttempted({ step2: false, step3: false })
    setCouponInput('')
    setCouponError('')
    setCouponOpen(false)
    setProfileOpen(false)
    showToast('Dados apagados deste aparelho.')
  }

  return (
    <div className="min-h-dvh">
      <div className="ambient" aria-hidden="true" />
      <span className="side-mark side-mark--left hidden xl:block">Bela Vista · São Paulo</span>
      <span className="side-mark side-mark--right hidden xl:block">Atendimento privado · 18+</span>

      <div className="shell relative">
        <Header step={step} onProfile={() => setProfileOpen(true)} />

        <main>
          {step === 0 && <Welcome onStart={start} onProfile={() => setProfileOpen(true)} />}

          {step === 1 && (
            <PackagesStep
              draft={draft}
              pkg={pkg}
              invoice={invoice}
              isReturning={returning}
              headingRef={headingRef}
              onSelectPackage={selectPackage}
              onToggleAddon={toggleAddon}
              onBack={() => go(0)}
            />
          )}

          {step === 2 && (
            <ScheduleStep
              draft={draft}
              days={days}
              slots={slots}
              duration={invoice.duration}
              endTime={endTime}
              isHome={isHome}
              dateError={dateError}
              timeError={timeError}
              nextFree={nextFree}
              headingRef={headingRef}
              selectedDateRef={selectedDateRef}
              onLocation={setLocation}
              onDate={selectDate}
              onTime={selectTime}
              onNextFree={selectNextFree}
              onBack={() => go(1)}
            />
          )}

          {step === 3 && (
            <DetailsStep
              draft={draft}
              pkg={pkg}
              invoice={invoice}
              isHome={isHome}
              endTime={endTime}
              duration={invoice.duration}
              attempted={attempted.step3}
              nameError={nameError}
              streetError={streetError}
              numberError={numberError}
              bairroError={bairroError}
              paymentError={paymentError}
              cepLoading={cepLoading}
              couponInput={couponInput}
              couponError={couponError}
              couponOpen={couponOpen}
              shakeCoupon={shakeCoupon}
              hp={hp}
              headingRef={headingRef}
              nameRef={nameRef}
              streetRef={streetRef}
              numberRef={numberRef}
              paymentRef={paymentRef}
              onUpdate={update}
              onCep={handleCep}
              onCouponInput={(value) => {
                setCouponInput(value.toUpperCase())
                setCouponError('')
              }}
              onToggleCoupon={() => setCouponOpen((open) => !open)}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={() => update({ coupon: '' })}
              onHp={setHp}
              onEditPackage={() => go(1)}
              onEditSchedule={() => go(2)}
              onSubmit={submit}
              onBack={() => go(2)}
            />
          )}

          {step === 4 && (
            <SuccessStep
              draft={draft}
              pkg={pkg}
              invoice={invoice}
              code={bookingCode}
              sentLink={sentLink}
              endTime={endTime}
              isHome={isHome}
              headingRef={headingRef}
              onCopyPix={copyPix}
              onCopyCode={copyCode}
              onDownloadIcs={downloadIcs}
              onReset={resetFlow}
              onProfile={() => setProfileOpen(true)}
            />
          )}
        </main>

        {(step === 1 || step === 2 || step === 3) && (
          <ActionBar
            step={step}
            draft={draft}
            pkg={pkg}
            invoice={invoice}
            duration={invoice.duration}
            endTime={endTime}
            dayCount={days.length}
            submitting={submitting}
            onGoSchedule={() => go(2)}
            onGoDetails={goDetails}
            onSubmit={submit}
          />
        )}

        {toast && (
          <div key={toast.id} className="toast toast-in" role="status" aria-live="polite">
            {toast.message}
          </div>
        )}

        <ProfileDialog
          open={profileOpen}
          lastBooking={lastBooking}
          onClose={() => setProfileOpen(false)}
          onClearData={clearData}
        />
      </div>
    </div>
  )
}
