// "Design your own": a live plain-weave preview built from the chosen colours.
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Shuffle, ShoppingBag, MessageCircle, Minus, Plus } from 'lucide-react'
import { waLink } from './config'
import { Reveal, ease } from './fx'

const PALETTE = [
  { name: 'Madder red', hex: '#a8322d' }, { name: 'Indigo', hex: '#22305a' }, { name: 'Turmeric', hex: '#e0a526' },
  { name: 'Cream', hex: '#f3ead8' }, { name: 'Forest', hex: '#2f5d50' }, { name: 'Maroon', hex: '#6b2b3a' },
  { name: 'Rani pink', hex: '#c2477a' }, { name: 'Sky blue', hex: '#5b8db8' }, { name: 'Charcoal', hex: '#33302d' },
  { name: 'Ivory', hex: '#fbf8f2' },
]
const STYLES = [{ id: 'check', label: 'Checks' }, { id: 'stripe', label: 'Stripes' }, { id: 'border', label: 'Border' }]
const PRESETS = [
  { name: 'Classic khes', style: 'check', slots: [3, 0, 1], band: 4 },
  { name: 'Royal indigo', style: 'stripe', slots: [1, 2, 3], band: 3 },
  { name: 'Wedding bright', style: 'check', slots: [0, 2, 6], band: 2 },
  { name: 'Forest calm', style: 'border', slots: [4, 3, 2], band: 4 },
]
const SLOT_NAMES = ['Base', 'Stripe', 'Accent']
const TYPES = ['Khes', 'Bedsheet', 'Shawl', 'Durrie']
const SIZES = ['Single', 'Double']
const COLS = 28, ROWS = 20, CELL = 12

// Which colour slot each thread uses: 0 base, 1 stripe, 2 accent.
function threads(style, band, n, weft) {
  return Array.from({ length: n }, (_, i) => {
    if (style === 'border') {
      const d = Math.min(i, n - 1 - i)
      return d < band ? (d === band - 1 ? 2 : 1) : 0
    }
    if (style === 'stripe' && weft) return 0
    const k = i % (band * 3)
    return k < band ? 1 : k === band ? 2 : 0
  })
}

function Weave({ colors, style, band }) {
  const warp = useMemo(() => threads(style, band, COLS, false), [style, band])
  const weft = useMemo(() => threads(style, band, ROWS, true), [style, band])
  return (
    <svg viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} className="block h-full w-full" role="img" aria-label="Live preview of your woven design">
      <defs>
        <linearGradient id="gWarp" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".18" /><stop offset=".45" stopColor="#fff" stopOpacity=".22" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></linearGradient>
        <linearGradient id="gWeft" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity=".14" /><stop offset=".5" stopColor="#fff" stopOpacity=".12" /><stop offset="1" stopColor="#000" stopOpacity=".2" /></linearGradient>
      </defs>
      {weft.map((wf, r) => warp.map((wp, c) => {
        const up = (r + c) % 2 === 0 // warp thread on top
        const x = c * CELL, y = r * CELL
        return (
          <g key={`${r}-${c}`}>
            <rect x={x} y={y} width={CELL} height={CELL} fill={colors[up ? wp : wf]}
              style={{ transition: `fill .45s ease ${(r + c) * 0.012}s` }} />
            <rect x={x + (up ? 1 : 0)} y={y + (up ? 0 : 1)} width={up ? CELL - 2 : CELL} height={up ? CELL : CELL - 2}
              rx={2} fill={`url(#${up ? 'gWarp' : 'gWeft'})`} />
          </g>
        )
      }))}
    </svg>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? 'border-loom bg-loom text-cream' : 'border-line bg-white text-ink/75 hover:border-loom/40'}`}>
      {children}
    </button>
  )
}

export default function Designer({ onAdd }) {
  const [style, setStyle] = useState('check')
  const [slots, setSlots] = useState([3, 0, 1])
  const [band, setBand] = useState(4)
  const [active, setActive] = useState(1)
  const [type, setType] = useState('Khes')
  const [size, setSize] = useState('Double')
  const [qty, setQty] = useState(1)
  const [flash, setFlash] = useState(0)

  const colors = slots.map((i) => PALETTE[i].hex)
  const names = slots.map((i) => PALETTE[i].name)
  const styleLabel = STYLES.find((s) => s.id === style).label
  const summary = `${styleLabel}: ${names[0]} base, ${names[1]} stripes, ${names[2]} accent · ${size}`

  const pick = (p) => { setStyle(p.style); setSlots(p.slots); setBand(p.band); setFlash((f) => f + 1) }
  const shuffle = () => {
    const pool = [...PALETTE.keys()].sort(() => Math.random() - 0.5)
    pick({ style: STYLES[Math.floor(Math.random() * 3)].id, slots: pool.slice(0, 3), band: 2 + Math.floor(Math.random() * 4) })
  }
  const setColor = (i) => setSlots((s) => s.map((v, k) => (k === active ? i : v)))
  const add = () => onAdd(
    { id: `custom-${type}`, name: `Custom ${type}`, pattern: '', swatch: colors, colors: [{ name: summary }] },
    { name: summary, hex: colors[0] }, qty)
  const message = `Sat Sri Akal! I designed a custom ${type} on your website:\n${summary}\nStripe width: ${band}\nQuantity: ${qty}\n\nPlease share the price and how long it will take.`

  return (
    <section id="designer" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-madder">Design your own</p>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-loom">Pick the colours. We weave it.</h2>
          <p className="mt-3 text-muted">Play with colours and patterns below. The preview shows how the threads will cross on the loom. Like it? Send it to us.</p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <div className="relative overflow-hidden rounded-[28px] bg-loom-deep p-3 shadow-2xl shadow-loom/25">
                <div className="aspect-[7/5] overflow-hidden rounded-[20px]">
                  <Weave colors={colors} style={style} band={band} />
                </div>
                <AnimatePresence>
                  <motion.span key={flash} className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    initial={{ left: '-40%' }} animate={{ left: '120%' }} transition={{ duration: 1, ease }} />
                </AnimatePresence>
                <span className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-loom backdrop-blur">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-wa" /> Live preview
                </span>
              </div>
              <p className="mt-4 text-sm text-muted"><b className="text-ink">Your design:</b> {type} · {summary}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-7">
            <div>
              <p className="mb-2 text-sm font-semibold">Start from a favourite</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => <Chip key={p.name} onClick={() => pick(p)}>{p.name}</Chip>)}
                <button onClick={shuffle} className="flex items-center gap-1.5 rounded-full border border-dashed border-madder/50 px-4 py-2 text-sm font-semibold text-madder hover:bg-madder hover:text-white transition">
                  <Shuffle size={15} /> Surprise me
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Pattern</p>
              <div className="inline-flex rounded-full border border-line bg-white p-1">
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)} className="relative rounded-full px-5 py-2 text-sm font-semibold">
                    {style === s.id && <motion.span layoutId="style-pill" className="absolute inset-0 rounded-full bg-madder" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className={`relative ${style === s.id ? 'text-white' : 'text-ink/70'}`}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Colours <span className="font-normal text-muted">(tap a slot, then a colour)</span></p>
              <div className="flex gap-3">
                {SLOT_NAMES.map((n, k) => (
                  <button key={n} onClick={() => setActive(k)}
                    className={`flex flex-1 items-center gap-2 rounded-2xl border-2 bg-white p-2 text-left transition ${active === k ? 'border-loom shadow-md' : 'border-transparent ring-1 ring-line'}`}>
                    <motion.span layout className="h-9 w-9 flex-none rounded-xl ring-1 ring-black/10" animate={{ backgroundColor: colors[k] }} />
                    <span className="min-w-0 leading-tight"><span className="block text-xs text-muted">{n}</span><span className="block truncate text-sm font-semibold">{names[k]}</span></span>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2.5 sm:grid-cols-10">
                {PALETTE.map((c, i) => (
                  <motion.button key={c.name} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} onClick={() => setColor(i)}
                    aria-label={c.name} title={c.name}
                    className={`aspect-square rounded-full ring-1 ring-black/10 ${slots[active] === i ? 'outline-2 outline-offset-2 outline-loom' : ''}`}
                    style={{ background: c.hex }} />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="band" className="mb-2 flex justify-between text-sm font-semibold">Stripe width <span className="font-normal text-muted">{band} threads</span></label>
              <input id="band" type="range" min={1} max={6} value={band} onChange={(e) => setBand(+e.target.value)} className="w-full accent-madder" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold">Product</p>
                <div className="flex flex-wrap gap-2">{TYPES.map((t) => <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>)}</div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Size &amp; quantity</p>
                <div className="flex flex-wrap items-center gap-2">
                  {SIZES.map((s) => <Chip key={s} active={size === s} onClick={() => setSize(s)}>{s}</Chip>)}
                  <span className="ml-1 inline-flex items-center rounded-full border border-line bg-white">
                    <button aria-label="Less" className="grid h-9 w-9 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={15} /></button>
                    <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                    <button aria-label="More" className="grid h-9 w-9 place-items-center" onClick={() => setQty((q) => q + 1)}><Plus size={15} /></button>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <motion.button whileTap={{ scale: 0.97 }} onClick={add}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-loom px-6 py-3.5 font-semibold text-cream hover:bg-loom-deep">
                <ShoppingBag size={18} /> Add to enquiry list
              </motion.button>
              <a href={waLink(message)} target="_blank" rel="noopener"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-wa px-6 py-3.5 font-semibold text-white hover:brightness-110">
                <MessageCircle size={18} /> Send design on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
