// Enquiry list: pick products, then send one WhatsApp message with everything.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLenis } from 'lenis/react'
import { X, Plus, Minus, ShoppingBag, MessageCircle, Check, Trash2, Share2 } from 'lucide-react'
import { waLink } from './config'
import { ease } from './fx'

const KEY = 'gh-enquiry'

export function useEnquiry() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* storage blocked: list just won't persist */ }
  }, [items])

  const add = (p, { name: color, hex }, qty) => setItems((list) => {
    const key = `${p.id}-${color}`
    return list.some((i) => i.key === key)
      ? list.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      : [...list, { key, id: p.id, name: p.name, pattern: p.pattern, swatch: p.swatch, color, hex, isDefault: p.colors[0].name === color, qty }]
  })
  const setQty = (key, qty) => setItems((list) =>
    qty < 1 ? list.filter((i) => i.key !== key) : list.map((i) => (i.key === key ? { ...i, qty } : i)))
  const clear = () => setItems([])
  const count = items.reduce((s, i) => s + i.qty, 0)
  return { items, add, setQty, clear, count }
}

const enquiryText = (items) =>
  `Sat Sri Akal! I'd like to enquire about:\n${items
    .map((i, n) => `${n + 1}. ${i.name} (${i.color}) × ${i.qty}`)
    .join('\n')}\n\nPlease share prices and availability.`

function useOverlay(open, onClose) {
  const lenis = useLenis()
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { lenis?.start(); window.removeEventListener('keydown', k) }
  }, [open, lenis, onClose])
}

function Stepper({ value, onChange, small }) {
  const s = small ? 'h-8 w-8' : 'h-10 w-10'
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button aria-label="Less" className={`${s} grid place-items-center rounded-full hover:bg-cream`} onClick={() => onChange(value - 1)}><Minus size={16} /></button>
      <motion.span key={value} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-8 text-center font-semibold tabular-nums">{value}</motion.span>
      <button aria-label="More" className={`${s} grid place-items-center rounded-full hover:bg-cream`} onClick={() => onChange(value + 1)}><Plus size={16} /></button>
    </div>
  )
}

export function QuickView({ product, onClose, onAdd, notify }) {
  const [color, setColor] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  useEffect(() => { setColor(0); setQty(1); setAdded(false) }, [product])
  useOverlay(!!product, onClose)

  const add = () => {
    onAdd(product, product.colors[color], qty)
    setAdded(true)
    setTimeout(onClose, 900)
  }
  const share = async () => {
    const url = `${location.origin}${location.pathname}?p=${product.id}`
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else { await navigator.clipboard.writeText(url); notify('Product link copied') }
    } catch { /* user closed the share sheet */ }
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label={product.name}
            className="relative grid max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-3xl bg-paper sm:grid-cols-2 sm:rounded-3xl"
            initial={{ y: 80, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 80, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button onClick={share} aria-label="Share this product" className="absolute right-15 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow hover:scale-110 transition-transform"><Share2 size={17} /></button>
            <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow hover:rotate-90 transition-transform"><X size={18} /></button>
            <div className="relative h-56 sm:h-full">
              <motion.div className={`absolute inset-0 ${product.pattern}`} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease }} />
              <motion.div className="absolute inset-0 mix-blend-color" animate={{ backgroundColor: product.colors[color].hex, opacity: color ? 0.75 : 0 }} transition={{ duration: 0.5 }} />
            </div>
            <div className="overflow-y-auto p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-madder">{product.cat}</p>
              <h3 className="mt-1 font-display text-3xl font-bold text-loom">{product.name}</h3>
              <p className="mt-3 text-muted">{product.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {product.details.map((d, i) => (
                  <motion.li key={d} className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                    <Check size={16} className="text-wa" />{d}
                  </motion.li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-semibold">Colour: <span className="font-normal text-muted">{product.colors[color].name}</span></p>
              <div className="mt-2 flex gap-3">
                {product.colors.map((c, i) => (
                  <button key={c.name} aria-label={c.name} onClick={() => setColor(i)}
                    className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-paper transition ${i === color ? 'ring-2 ring-loom scale-110' : 'hover:scale-110'}`}
                    style={{ background: c.hex }} />
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <Stepper value={qty} onChange={(v) => setQty(Math.max(1, v))} />
                <span className="text-sm text-muted">pieces</span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={add} disabled={added}
                  className="flex items-center justify-center gap-2 rounded-full bg-loom px-6 py-3.5 font-semibold text-cream">
                  <AnimatePresence mode="wait" initial={false}>
                    {added
                      ? <motion.span key="ok" className="flex items-center gap-2" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><Check size={18} /> Added to list</motion.span>
                      : <motion.span key="add" className="flex items-center gap-2" exit={{ y: -12, opacity: 0 }}><ShoppingBag size={18} /> Add to enquiry list</motion.span>}
                  </AnimatePresence>
                </motion.button>
                <a href={waLink(`Hi, I'm interested in ${product.name} (${product.colors[color].name}) × ${qty}. Price please?`)} target="_blank" rel="noopener"
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-wa px-6 py-3 font-semibold text-wa hover:bg-wa hover:text-white transition-colors">
                  <MessageCircle size={18} /> Ask price on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Drawer({ open, onClose, enquiry }) {
  useOverlay(open, onClose)
  const { items, setQty, clear } = enquiry
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            data-lenis-prevent aria-label="Enquiry list"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h3 className="font-display text-2xl font-bold text-loom">Your enquiry list</h3>
              <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag size={44} className="mx-auto text-line" />
                    <p className="mt-4 font-display text-xl text-loom">Nothing here yet</p>
                    <p className="mt-1 text-sm text-muted">Add products, then send one WhatsApp message for all of them.</p>
                  </div>
                </motion.div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.key} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80, height: 0, marginTop: 0 }}
                        className="flex items-center gap-4 rounded-2xl border border-line bg-white p-3">
                        <div className={`relative h-16 w-16 flex-none overflow-hidden rounded-xl ${i.pattern}`}
                          style={i.swatch ? { background: `repeating-linear-gradient(90deg, ${i.swatch[0]} 0 8px, ${i.swatch[1]} 8px 14px, ${i.swatch[2]} 14px 16px)` } : undefined}>
                          {!i.isDefault && <span className="absolute inset-0 opacity-75 mix-blend-color" style={{ background: i.hex }} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{i.name}</p>
                          <p className="text-sm text-muted">{i.color}</p>
                          <div className="mt-1.5"><Stepper small value={i.qty} onChange={(v) => setQty(i.key, v)} /></div>
                        </div>
                        <button aria-label={`Remove ${i.name}`} onClick={() => setQty(i.key, 0)} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-cream hover:text-madder"><Trash2 size={17} /></button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="space-y-3 border-t border-line p-6">
                <a href={waLink(enquiryText(items))} target="_blank" rel="noopener"
                  className="flex items-center justify-center gap-2 rounded-full bg-wa px-6 py-4 font-semibold text-white shadow-lg shadow-wa/30 hover:brightness-110">
                  <MessageCircle size={20} /> Send enquiry on WhatsApp
                </a>
                <button onClick={clear} className="w-full text-sm text-muted hover:text-madder">Clear list</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
