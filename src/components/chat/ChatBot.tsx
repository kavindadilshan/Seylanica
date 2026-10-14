import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MessageCircle, SendHorizontal, Sparkles, X } from 'lucide-react'
import { LogoMark } from '../brand/Logo'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import { SITE } from '../../config/site'
import { openWhatsApp, whatsappLink } from '../../lib/whatsapp'
import { SUGGESTION_TO_INTENT, WELCOME_SUGGESTIONS, intentById, matchIntent, type ChatAction } from '../../data/chatbot'

interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
  actions?: ChatAction[]
  suggestions?: string[]
}

/** Renders **bold** and line breaks from knowledge-base replies (no HTML injection). */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => (part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part))}
        </Fragment>
      ))}
    </>
  )
}

let nextId = 1

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: nextId++,
      from: 'bot',
      text: `Hi! I'm the ${SITE.brand} assistant. Ask me about grades, specs, MOQ, samples or shipping, or order straight on WhatsApp.`,
      suggestions: WELCOME_SUGGESTIONS,
    },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /** Adds the user's message, then a bot reply after a short "typing" delay. */
  function ask(text: string, intentId?: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { id: nextId++, from: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    const intent = intentId ? intentById(intentId) : matchIntent(trimmed)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: nextId++, from: 'bot', text: intent.reply, actions: intent.actions, suggestions: intent.suggestions }])
    }, 550 + Math.min(intent.reply.length * 4, 900))
  }

  function runAction(a: ChatAction) {
    if (a.kind === 'whatsapp') return openWhatsApp(a.message)
    navigate(a.to)
    if (window.innerWidth < 640) setOpen(false)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    ask(input)
  }

  const lastBot = [...messages].reverse().find((m) => m.from === 'bot')

  return (
    <div className="no-print fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {/* Chat panel */}
      <section
        aria-label="Seylanica assistant"
        aria-hidden={!open}
        className={`flex h-[min(620px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-cinnamon/10 bg-cream shadow-2xl shadow-cinnamon/30 transition-all duration-300 sm:w-[390px] ${
          open ? 'visible scale-100 opacity-100' : 'invisible pointer-events-none scale-90 opacity-0'
        }`}
      >
        <header className="grain flex items-center gap-3 bg-cinnamon px-5 py-4 text-cream">
          <LogoMark className="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-none font-semibold">{SITE.brand} Assistant</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-cream/70">
              <span className="h-2 w-2 rounded-full bg-[#25D366]" /> Instant answers · Team on WhatsApp
            </p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream/10">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.from === 'user' ? '' : 'space-y-2'}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === 'user' ? 'rounded-br-md bg-cinnamon text-cream' : 'rounded-bl-md border border-cinnamon/10 bg-white text-ink shadow-sm'
                  }`}
                >
                  <RichText text={m.text} />
                </div>
                {m.actions && (
                  <div className="flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => runAction(a)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                          a.kind === 'whatsapp' ? 'bg-[#25D366] text-white hover:bg-[#1ebe5b]' : 'bg-gold/20 text-cinnamon hover:bg-gold/35'
                        }`}
                      >
                        {a.kind === 'whatsapp' ? <WhatsAppIcon className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex">
              <div className="flex gap-1 rounded-2xl rounded-bl-md border border-cinnamon/10 bg-white px-4 py-3.5 shadow-sm" aria-label="Assistant is typing">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-cinnamon/40" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick replies from the latest bot message */}
        {!typing && lastBot?.suggestions && (
          <div className="flex gap-2 overflow-x-auto border-t border-cinnamon/10 px-4 py-3 [scrollbar-width:none]">
            {lastBot.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s, SUGGESTION_TO_INTENT[s])}
                className="shrink-0 rounded-full border border-cinnamon/15 bg-white px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap text-cinnamon transition hover:border-gold hover:bg-gold/10"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-cinnamon/10 bg-white p-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about grades, MOQ, shipping…"
            aria-label="Message"
            className="min-w-0 flex-1 rounded-full bg-sand px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold/40"
          />
          <button type="submit" disabled={!input.trim()} aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-cinnamon text-cream transition hover:bg-cinnamon-700 disabled:opacity-40">
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
        <p className="bg-white px-4 pb-2 text-center text-[10px] text-cinnamon/50">Automated assistant. Orders are confirmed by our team on WhatsApp.</p>
      </section>

      {/* Floating launchers */}
      <div className="flex items-center gap-3">
        <a
          href={whatsappLink('Hello Seylanica, I would like to place an order.')}
          target="_blank"
          rel="noreferrer"
          aria-label="Order on WhatsApp"
          className="group flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-xl shadow-[#25D366]/30 transition hover:-translate-y-0.5 animate-pulse-ring"
        >
          <WhatsAppIcon className="h-7 w-7" />
          <span className="hidden text-sm font-bold sm:inline">Order</span>
        </a>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-cinnamon text-gold shadow-xl shadow-cinnamon/30 transition hover:-translate-y-0.5 hover:bg-cinnamon-700"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          {!open && (
            <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-cinnamon-950">
              <Sparkles className="h-3 w-3" />
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
