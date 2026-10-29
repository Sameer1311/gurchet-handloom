import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring, useTransform, useMotionValueEvent } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ShoppingBag, MessageCircle, Phone, MapPin, Clock, Menu, X, ArrowRight, ChevronDown, Truck, Store, Sparkles, Users, Search, Check } from 'lucide-react'
import { SHOP, waLink } from './config'
import { CATEGORIES, PRODUCTS, STEPS, FAQS } from './data'
import { Reveal, Words, Magnetic, Tilt, Counter, Loom, Preloader, ease } from './fx'
import { useEnquiry, QuickView, Drawer } from './Enquiry'
import Designer from './Designer'

const NAV = [['Products', '#products'], ['Design your own', '#designer'], ['How it’s made', '#process'], ['Wholesale', '#buyers'], ['Visit', '#visit']]

function useGo() {
  const lenis = useLenis()
  return (id) => (e) => {
    e?.preventDefault()
    lenis ? lenis.scrollTo(id, { offset: -72, duration: 1.4 }) : document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

function useOpenNow() {
  const calc = () => {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const h = d.getHours() + d.getMinutes() / 60
    return SHOP.hours.days.includes(d.getDay()) && h >= SHOP.hours.open && h < SHOP.hours.close
  }
  const [open, setOpen] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setOpen(calc()), 60_000)
    return () => clearInterval(t)
  }, [])
  return open
}

function Kicker({ children, light }) {
  return <p className={`text-xs font-semibold uppercase tracking-[.16em] ${light ? 'text-turmeric' : 'text-madder'}`}>{children}</p>
}

function Header({ ready, count, onBag }) {
  const go = useGo()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 30))

  return (
    <>
      <motion.header
        initial={{ y: -90 }} animate={{ y: ready ? 0 : -90 }} transition={{ duration: 0.8, ease }}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : ''}`}
      >
        <div className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
          <a href="#top" onClick={go('#top')} className="group flex items-center gap-2.5 font-display text-lg font-bold text-loom">
            <span className="woven-border block h-8 w-8 rounded-lg transition-transform duration-500 group-hover:rotate-90" />
            {SHOP.name}
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} onClick={go(h)}
                className="relative text-[15px] font-medium text-ink/80 hover:text-loom after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-madder after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onBag} aria-label={`Enquiry list, ${count} items`} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-cream">
              <ShoppingBag size={21} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 1.8 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-madder px-1 text-[11px] font-bold text-white">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <a href={waLink('Sat Sri Akal! I want to know about your handloom products.')} target="_blank" rel="noopener"
              className="hidden items-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 sm:flex">
              <MessageCircle size={17} /> WhatsApp
            </a>
            <button onClick={() => setMenu(true)} aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream md:hidden"><Menu size={22} /></button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-0 z-50 flex flex-col bg-loom px-6 py-6 text-cream md:hidden"
            initial={{ clipPath: 'circle(0% at 92% 5%)' }} animate={{ clipPath: 'circle(150% at 92% 5%)' }} exit={{ clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            <button onClick={() => setMenu(false)} aria-label="Close menu" className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-white/10"><X size={22} /></button>
            <nav className="mt-10 flex flex-col gap-5">
              {NAV.map(([l, h], i) => (
                <motion.a key={h} href={h} onClick={(e) => { setMenu(false); go(h)(e) }}
                  className="font-display text-4xl font-bold"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.07, ease }}>
                  {l}
                </motion.a>
              ))}
            </nav>
            <motion.a href={waLink('Sat Sri Akal! I want to know about your handloom products.')} target="_blank" rel="noopener"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-auto flex items-center justify-center gap-2 rounded-full bg-wa py-4 font-semibold text-white">
              <MessageCircle size={20} /> Chat on WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Hero({ ready }) {
  const go = useGo()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const loomY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const loomRotate = useTransform(scrollYProgress, [0, 1], [0, -4])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fade = { initial: { opacity: 0, y: 20 }, animate: ready ? { opacity: 1, y: 0 } : {} }

  return (
    <section id="top" ref={ref} className="relative overflow-hidden bg-cream pb-24 pt-28 lg:pb-32 lg:pt-36">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-turmeric/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-madder/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-[1.05fr_1fr]">
        <motion.div style={{ y: textY }}>
          <motion.p {...fade} transition={{ delay: 0.1, duration: 0.7 }} className="font-pa text-xl font-bold text-madder sm:text-2xl">
            ਹੱਥ ਨਾਲ ਬੁਣਿਆ, ਪਿਆਰ ਨਾਲ ਬਣਾਇਆ
          </motion.p>
          <h1 className="mt-3 font-display text-[clamp(2.6rem,7.5vw,4.6rem)] font-bold leading-[1.02] text-loom">
            <Words text="Pure handloom," show={ready} delay={0.2} />
            <span className="italic text-madder"><Words text="woven in Tarn Taran" show={ready} delay={0.45} /></span>
          </h1>
          <motion.p {...fade} transition={{ delay: 0.8, duration: 0.7 }} className="mt-6 max-w-md text-lg text-muted">
            Khes, durries, shawls and bedsheets made on traditional looms. Order straight from the weaver on WhatsApp.
          </motion.p>
          <motion.div {...fade} transition={{ delay: 0.95, duration: 0.7 }} className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <a href={waLink('Sat Sri Akal! Please share your product catalogue and prices.')} target="_blank" rel="noopener"
                className="group flex items-center gap-2 rounded-full bg-wa px-7 py-4 font-semibold text-white shadow-lg shadow-wa/30">
                <MessageCircle size={20} className="transition-transform group-hover:-rotate-12" /> Order on WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#products" onClick={go('#products')} className="group flex items-center gap-2 rounded-full border-2 border-loom px-7 py-3.5 font-semibold text-loom hover:bg-loom hover:text-cream transition-colors">
                Explore products <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </motion.div>
          <motion.div {...fade} transition={{ delay: 1.1, duration: 0.7 }} className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-2"><Sparkles size={16} className="text-turmeric" /> 100% handwoven</span>
            <span className="flex items-center gap-2"><Store size={16} className="text-turmeric" /> Retail &amp; wholesale</span>
            <span className="flex items-center gap-2"><Truck size={16} className="text-turmeric" /> All-India delivery</span>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: loomY, rotate: loomRotate }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }} animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.1, ease }}
            className="aspect-[5/4] overflow-hidden rounded-[28px] shadow-2xl shadow-loom/30 ring-1 ring-black/5"
          >
            <Loom show={ready} className="h-full w-full" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: [0, -10, 0] } : {}}
            transition={{ opacity: { delay: 2.4 }, y: { delay: 2.4, duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-left-8"
          >
            <span className="woven-border h-10 w-10 rounded-xl" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-loom">Woven by hand</p>
              <p className="text-xs text-muted">Thread by thread, in Tarn Taran</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="woven-border absolute inset-x-0 bottom-0 h-3" />
    </section>
  )
}

function Marquee() {
  const words = ['Khes', 'Durrie', 'Shawl', 'Bedsheet', 'Parna', 'Dupatta', 'Wholesale', 'Custom orders']
  const row = [...words, ...words]
  return (
    <div className="overflow-hidden bg-loom py-5 text-cream">
      <div className="marquee flex w-max gap-10">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl italic sm:text-3xl">
            {w}<span className="text-turmeric not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Stats() {
  const items = [
    { n: <Counter to={100} suffix="%" />, l: 'Handwoven on traditional looms' },
    { n: <Counter to={PRODUCTS.length} />, l: 'Product ranges, many colours each' },
    { n: <Counter to={1} suffix=" tap" />, l: 'To order on WhatsApp' },
  ]
  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
        {items.map((s, i) => (
          <Reveal key={i} delay={i * 0.1} className="text-center sm:text-left">
            <p className="font-display text-5xl font-bold text-loom">{s.n}</p>
            <p className="mt-1 text-muted">{s.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Products({ onOpen, cat, setCat }) {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const list = PRODUCTS.filter((p) =>
    (cat === 'All' || p.cat === cat) &&
    (!needle || `${p.name} ${p.desc} ${p.cat} ${p.colors.map((c) => c.name).join(' ')}`.toLowerCase().includes(needle)))
  return (
    <section id="products" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Kicker>Our products</Kicker>
            <h2 className="mt-2 max-w-lg font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-loom">Made on the loom, not in a factory</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
            <label className="group flex w-full items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 transition focus-within:border-loom focus-within:shadow-md sm:w-72">
              <Search size={17} className="text-muted group-focus-within:text-loom" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search khes, shawl, red…" aria-label="Search products"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted/70" />
              <AnimatePresence>
                {q && <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setQ('')} aria-label="Clear search"><X size={16} /></motion.button>}
              </AnimatePresence>
            </label>
            <div className="flex gap-0.5 rounded-full border border-line bg-white p-1">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCat(c)} className="relative rounded-full px-3 py-2 text-sm font-semibold sm:px-4">
                  {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-loom" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className={`relative transition-colors ${cat === c ? 'text-cream' : 'text-ink/70 hover:text-ink'}`}>{c}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div key={p.id} layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease }}>
                <Tilt onClick={() => onOpen(p)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(p)}
                  className="group cursor-pointer overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition-shadow hover:shadow-2xl hover:shadow-loom/15">
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <div className={`absolute inset-0 ${p.pattern} transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1`} />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur">{p.cat}</span>
                    <span className="absolute bottom-4 left-4 flex translate-y-3 items-center gap-1.5 rounded-full bg-loom px-4 py-2 text-sm font-semibold text-cream opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Quick view <ArrowRight size={15} />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-loom">{p.name}</h3>
                    <p className="mt-1.5 text-[15px] text-muted">{p.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        {p.colors.map((c) => <span key={c.name} className="h-6 w-6 rounded-full border-2 border-white" style={{ background: c.hex }} />)}
                      </div>
                      <span className="text-sm font-semibold text-madder">View details →</span>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {list.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-3xl border border-dashed border-line py-16 text-center">
              <p className="font-display text-2xl text-loom">No match for “{q}”</p>
              <p className="mt-2 text-muted">We may still make it. Just ask.</p>
              <a href={waLink(`Sat Sri Akal! Do you make ${q}?`)} target="_blank" rel="noopener"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 font-semibold text-white"><MessageCircle size={18} /> Ask on WhatsApp</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

const OCCASIONS = [
  { t: 'Weddings', d: 'Bright dupattas, shawls and gift sets for the big day.', pattern: 'pat-dupatta', cat: 'Wear' },
  { t: 'Winter warmth', d: 'Thick khes and woollen shawls for cold Punjab nights.', pattern: 'pat-shawl', cat: 'Wear' },
  { t: 'Everyday home', d: 'Bedsheets and khes that get softer with every wash.', pattern: 'pat-sheet', cat: 'Bedding' },
  { t: 'Floors & rooms', d: 'Durries in bold traditional designs, every size.', pattern: 'pat-durrie', cat: 'Floor' },
  { t: 'Gifting', d: 'Handwoven pieces families keep for years.', pattern: 'pat-khes', cat: 'All' },
]

// Vertical scroll drives a horizontal row of panels.
function Occasions({ onPick }) {
  const ref = useRef(null)
  const track = useRef(null)
  const dist = useRef(0)
  const [height, setHeight] = useState('100vh')
  useEffect(() => {
    const measure = () => {
      dist.current = Math.max(0, track.current.scrollWidth - window.innerWidth)
      setHeight(`calc(100vh + ${dist.current}px)`)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -v * dist.current)
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section ref={ref} style={{ height }} className="relative bg-cream">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4">
          <Kicker>Shop by occasion</Kicker>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-loom">Something for every moment</h2>
        </div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex w-max gap-6 pl-4 pr-[10vw] lg:pl-[max(1rem,calc((100vw-72rem)/2+1rem))]">
          {OCCASIONS.map((o, i) => (
            <button key={o.t} onClick={() => onPick(o.cat)}
              className="group relative h-[52vh] max-h-[500px] w-[78vw] max-w-[420px] flex-none overflow-hidden rounded-[28px] text-left shadow-xl shadow-loom/15">
              <div className={`absolute inset-0 ${o.pattern} transition-transform duration-[1.2s] ease-out group-hover:scale-110`} />
              <div className="absolute inset-0 bg-gradient-to-t from-loom-deep via-loom-deep/40 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-loom-deep/50 to-transparent" />
              <span className="absolute left-6 top-5 font-display text-6xl font-bold text-white/70">0{i + 1}</span>
              <div className="absolute inset-x-6 bottom-6 text-white">
                <h3 className="font-display text-3xl font-bold">{o.t}</h3>
                <p className="mt-2 text-white/75">{o.d}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-loom transition group-hover:gap-3">
                  Shop now <ArrowRight size={15} />
                </span>
              </div>
            </button>
          ))}
        </motion.div>
        <div className="mx-auto mt-8 h-1 w-40 overflow-hidden rounded-full bg-loom/10">
          <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-madder" />
        </div>
      </div>
    </section>
  )
}

function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28 })
  return (
    <section id="process" className="relative overflow-hidden bg-loom py-24 text-cream lg:py-32">
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-madder/25 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="max-w-xl">
          <Kicker light>How it’s made</Kicker>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-white">From yarn to your home</h2>
          <p className="mt-3 text-white/65">Every piece passes through skilled hands. That’s why it lasts for years.</p>
        </Reveal>
        <div ref={ref} className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute bottom-0 left-[31px] top-0 w-[3px] rounded bg-white/10 md:left-[calc(50%-1.5px)]" />
          <motion.div style={{ scaleY: progress }} className="absolute bottom-0 left-[31px] top-0 w-[3px] origin-top rounded bg-gradient-to-b from-turmeric via-madder to-turmeric md:left-[calc(50%-1.5px)]" />
          {STEPS.map((s, i) => {
            const right = i % 2 === 1
            return (
              <div key={s.t} className={`relative mb-12 pl-20 last:mb-0 md:w-1/2 md:pl-0 ${right ? 'md:ml-auto md:pl-14' : 'md:pr-14 md:text-right'}`}>
                <motion.span
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '-120px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                  className={`absolute left-3 top-1 grid h-10 w-10 place-items-center rounded-full bg-turmeric font-bold text-loom shadow-[0_0_0_6px_var(--color-loom)] ${right ? 'md:-left-5' : 'md:left-auto md:-right-5'}`}>
                  {i + 1}
                </motion.span>
                <Reveal x={right ? 40 : -40} y={0}>
                  <div className="rounded-3xl border border-white/10 bg-white/[.04] p-6 backdrop-blur transition-colors hover:bg-white/[.08]">
                    <h3 className="font-display text-xl font-bold text-white">{s.t}</h3>
                    <p className="mt-2 text-white/65">{s.d}</p>
                  </div>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const BUYERS = {
  retail: {
    icon: Users, title: 'For families & gifting', pattern: 'pat-khes',
    points: ['Single pieces at weaver prices', 'Wedding and Diwali gift sets', 'Delivery anywhere in India'],
    cta: 'Shop on WhatsApp', msg: 'Sat Sri Akal! I want to buy for my home. Please share your catalogue.',
  },
  wholesale: {
    icon: Store, title: 'For shops & traders', pattern: 'pat-durrie',
    points: ['Wholesale rates on bulk orders', 'Custom colours and sizes', 'Regular supply you can count on'],
    cta: 'Ask wholesale rates', msg: 'Sat Sri Akal! I am a shop owner/trader. Please share your wholesale rates.',
  },
}

const QTY = ['10–50 pcs', '50–200 pcs', '200+ pcs']

// Builds a complete wholesale enquiry and opens it in WhatsApp.
function WholesaleForm() {
  const [f, setF] = useState({ shop: '', city: '', items: [], qty: QTY[0], note: '' })
  const [err, setErr] = useState({})
  const [shake, setShake] = useState(0)
  const set = (k, v) => { setF((s) => ({ ...s, [k]: v })); setErr((e) => ({ ...e, [k]: false })) }
  const toggle = (name) => set('items', f.items.includes(name) ? f.items.filter((n) => n !== name) : [...f.items, name])

  const send = (e) => {
    e.preventDefault()
    const bad = { shop: !f.shop.trim(), city: !f.city.trim(), items: f.items.length === 0 }
    setErr(bad)
    if (Object.values(bad).some(Boolean)) { setShake((s) => s + 1); return }
    const msg = `Sat Sri Akal! Wholesale enquiry:\nShop: ${f.shop.trim()}\nCity: ${f.city.trim()}\nProducts: ${f.items.join(', ')}\nQuantity: ${f.qty}${f.note.trim() ? `\nNote: ${f.note.trim()}` : ''}\n\nPlease share your wholesale rates.`
    window.open(waLink(msg), '_blank', 'noopener')
  }
  const field = (bad) => `w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-loom focus:shadow-md ${bad ? 'border-madder' : 'border-line'}`

  return (
    <motion.form onSubmit={send} noValidate
      key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}
      className="space-y-4 bg-cream p-8 sm:p-10">
      <p className="font-display text-xl font-bold text-loom">Get wholesale rates</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={field(err.shop)} placeholder="Shop name *" value={f.shop} onChange={(e) => set('shop', e.target.value)} aria-label="Shop name" aria-invalid={!!err.shop} />
        <input className={field(err.city)} placeholder="City *" value={f.city} onChange={(e) => set('city', e.target.value)} aria-label="City" aria-invalid={!!err.city} />
      </div>
      <div>
        <p className={`mb-2 text-sm font-semibold ${err.items ? 'text-madder' : ''}`}>Products you need *</p>
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map((p) => {
            const on = f.items.includes(p.name)
            return (
              <motion.button type="button" key={p.id} whileTap={{ scale: 0.94 }} onClick={() => toggle(p.name)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${on ? 'border-loom bg-loom text-cream' : 'border-line bg-white text-ink/75'}`}>
                {on && <Check size={14} />}{p.name}
              </motion.button>
            )
          })}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Quantity per order</p>
        <div className="inline-flex rounded-full border border-line bg-white p-1">
          {QTY.map((q) => (
            <button type="button" key={q} onClick={() => set('qty', q)} className="relative rounded-full px-3.5 py-1.5 text-sm font-semibold">
              {f.qty === q && <motion.span layoutId="qty-pill" className="absolute inset-0 rounded-full bg-turmeric" />}
              <span className="relative">{q}</span>
            </button>
          ))}
        </div>
      </div>
      <textarea className={field(false)} rows={2} placeholder="Anything else? (colours, sizes, delivery date)" value={f.note} onChange={(e) => set('note', e.target.value)} aria-label="Note" />
      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-wa px-6 py-3.5 font-semibold text-white hover:brightness-110">
        <MessageCircle size={18} /> Send on WhatsApp
      </button>
    </motion.form>
  )
}

function Buyers() {
  const [mode, setMode] = useState('retail')
  const b = BUYERS[mode]
  return (
    <section id="buyers" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <Kicker>Who we sell to</Kicker>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-loom">For homes and for shops</h2>
          <div className="mt-8 inline-flex rounded-full border border-line bg-white p-1">
            {Object.keys(BUYERS).map((k) => (
              <button key={k} onClick={() => setMode(k)} className="relative rounded-full px-7 py-2.5 font-semibold capitalize">
                {mode === k && <motion.span layoutId="buyer-pill" className="absolute inset-0 rounded-full bg-madder" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className={`relative ${mode === k ? 'text-white' : 'text-ink/70'}`}>{k}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <div className="mt-12 overflow-hidden rounded-[32px] border border-line bg-white">
          <AnimatePresence mode="wait">
            <motion.div key={mode} className="grid md:grid-cols-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="p-8 sm:p-12">
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="grid h-14 w-14 place-items-center rounded-2xl bg-cream text-madder"><b.icon size={26} /></motion.div>
                <motion.h3 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 font-display text-3xl font-bold text-loom">{b.title}</motion.h3>
                <ul className="mt-6 space-y-3">
                  {b.points.map((p, i) => (
                    <motion.li key={p} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                      className="flex items-center gap-3 text-lg"><span className="h-2.5 w-2.5 rounded-sm bg-turmeric" />{p}</motion.li>
                  ))}
                </ul>
                {mode === 'retail' && (
                  <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    href={waLink(b.msg)} target="_blank" rel="noopener"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3.5 font-semibold text-white hover:brightness-110">
                    <MessageCircle size={18} /> {b.cta}
                  </motion.a>
                )}
              </div>
              {mode === 'retail'
                ? <motion.div className={`min-h-64 ${b.pattern}`} initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }} transition={{ duration: 0.8, ease }} />
                : <WholesaleForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <Kicker>Questions</Kicker>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-loom">Good to know</h2>
          <p className="mt-3 text-muted">Anything else? Just ask on WhatsApp.</p>
        </Reveal>
        <Reveal delay={0.1}>
          {FAQS.map((f, i) => (
            <div key={f.q} className="border-b border-line">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-6 text-left font-display text-xl font-semibold text-loom">
                {f.q}
                <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white"><ChevronDown size={18} /></motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                    <p className="pb-6 text-lg text-muted">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Visit() {
  const open = useOpenNow()
  const fmt = (h) => `${h % 12 || 12} ${h < 12 ? 'am' : 'pm'}`
  return (
    <section id="visit" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <Kicker>Visit us</Kicker>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-loom">Come see the looms</h2>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa opacity-75" />}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${open ? 'bg-wa' : 'bg-madder'}`} />
            </span>
            {open ? 'Open now' : 'Closed now'}
          </div>
          <div className="mt-6 space-y-3 text-lg">
            <p className="flex items-center gap-3"><MapPin size={20} className="text-madder" /> {SHOP.name}, {SHOP.city}</p>
            <p className="flex items-center gap-3"><Clock size={20} className="text-madder" /> Mon–Sat, {fmt(SHOP.hours.open)} – {fmt(SHOP.hours.close)}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={waLink('Sat Sri Akal! I would like to visit your shop.')} target="_blank" rel="noopener"
              className="flex items-center gap-2 rounded-full bg-wa px-6 py-3.5 font-semibold text-white hover:brightness-110"><MessageCircle size={18} /> WhatsApp us</a>
            <a href={`tel:+${SHOP.phone}`} className="flex items-center gap-2 rounded-full border-2 border-loom px-6 py-3 font-semibold text-loom hover:bg-loom hover:text-cream transition-colors"><Phone size={18} /> Call now</a>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-[28px] border border-line shadow-xl shadow-loom/10">
            <iframe title={`Map: ${SHOP.city}`} loading="lazy" className="aspect-[4/3] w-full"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.mapQuery)}&z=13&output=embed`} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-loom-deep pb-28 pt-16 text-white/60">
      <div className="woven-border absolute inset-x-0 top-0 h-2" />
      <div className="mx-auto max-w-6xl px-4">
        <motion.p initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease }}
          className="font-display text-[13vw] font-bold leading-none text-white/[.07] lg:text-[9rem]">
          Handloom
        </motion.p>
        <div className="mt-8 flex flex-wrap justify-between gap-4 text-sm">
          <span>© {new Date().getFullYear()} {SHOP.name} · {SHOP.city}</span>
          <span>Sample design by Sameer Negi · product photos will replace the patterns</span>
        </div>
      </div>
    </footer>
  )
}

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div style={{ scaleX }} className="woven-border fixed inset-x-0 top-0 z-[60] h-1 origin-left" />
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [quick, setQuick] = useState(null)
  const [bag, setBag] = useState(false)
  const [cat, setCat] = useState('All')
  const [toast, setToast] = useState(null)
  const enquiry = useEnquiry()
  const go = useGo()
  const closeQuick = useCallback(() => setQuick(null), [])
  const closeBag = useCallback(() => setBag(false), [])
  const notify = useCallback((msg, action) => setToast({ msg, action, id: Date.now() }), [])
  const addToList = (p, color, qty) => { enquiry.add(p, color, qty); notify(`${p.name} added to your list`, true) }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  // ?p=<id> opens that product, so a product can be shared as a link.
  useEffect(() => {
    if (!ready) return
    const id = new URLSearchParams(location.search).get('p')
    const p = PRODUCTS.find((x) => x.id === id)
    if (p) setQuick(p)
  }, [ready])
  useEffect(() => {
    if (!ready) return
    const url = new URL(location.href)
    quick ? url.searchParams.set('p', quick.id) : url.searchParams.delete('p')
    history.replaceState(null, '', url)
  }, [quick, ready])

  const pickOccasion = (c) => { setCat(c); go('#products')() }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!ready && <Preloader onDone={() => setReady(true)} />}</AnimatePresence>
      <ScrollBar />
      <Header ready={ready} count={enquiry.count} onBag={() => setBag(true)} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Stats />
        <Products onOpen={setQuick} cat={cat} setCat={setCat} />
        <Occasions onPick={pickOccasion} />
        <Designer onAdd={addToList} />
        <Process />
        <Buyers />
        <Faq />
        <Visit />
      </main>
      <Footer />

      <motion.a
        href={waLink('Sat Sri Akal! I want to know about your handloom products.')} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }} animate={{ scale: ready ? 1 : 0 }} transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-40 grid h-16 w-16 place-items-center rounded-full bg-wa text-white shadow-xl shadow-wa/40"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-wa opacity-30" />
        <MessageCircle size={28} className="relative" />
      </motion.a>

      <AnimatePresence>
        {enquiry.count > 0 && !bag && (
          <motion.button
            onClick={() => setBag(true)}
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 z-40 flex items-center gap-3 whitespace-nowrap rounded-full bg-loom py-3 pl-5 pr-3 font-semibold text-cream shadow-2xl sm:left-1/2 sm:-translate-x-1/2"
          >
            <ShoppingBag size={18} /> {enquiry.count} <span className="hidden sm:inline">in enquiry list</span><span className="sm:hidden">item{enquiry.count > 1 ? 's' : ''}</span>
            <span className="rounded-full bg-wa px-3 py-1 text-sm text-white">Send</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} role="status"
            initial={{ y: -30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0 }}
            className="fixed left-1/2 top-20 z-[70] flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-ink py-2.5 pl-4 pr-2.5 text-sm font-semibold text-white shadow-2xl">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-wa"><Check size={14} /></span>
            {toast.msg}
            {toast.action && <button onClick={() => { setToast(null); setBag(true) }} className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">View</button>}
          </motion.div>
        )}
      </AnimatePresence>

      <QuickView product={quick} onClose={closeQuick} onAdd={addToList} notify={notify} />
      <Drawer open={bag} onClose={closeBag} enquiry={enquiry} />
    </MotionConfig>
  )
}
