// Small reusable animation pieces.
import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1]

export function Reveal({ children, delay = 0, y = 40, x = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// Word-by-word slide-up reveal.
export function Words({ text, show = true, delay = 0 }) {
  return (
    <span aria-label={text}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '110%' }}
              animate={{ y: show ? 0 : '110%' }}
              transition={{ duration: 0.9, delay: delay + i * 0.08, ease }}
            >
              {w}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </span>
  )
}

// Element drifts toward the cursor.
export function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 220, damping: 15 })
  const y = useSpring(0, { stiffness: 220, damping: 15 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  return (
    <motion.div ref={ref} className="inline-block" style={{ x, y }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }}>
      {children}
    </motion.div>
  )
}

// 3D tilt following the cursor.
export function Tilt({ children, className = '', ...rest }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 160, damping: 16 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 160, damping: 16 })
  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5) }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease, onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{v}{suffix}</span>
}

const THREADS = ['#a8322d', '#e0a526', '#22305a', '#f8f1e4']

// A loom: warp threads stand ready, weft rows shuttle in left/right, then the over-under weave shows.
export function Loom({ show = true, className = '' }) {
  const cols = 20, rows = 16, W = 400, H = 320, cw = W / cols, rh = H / rows
  const warpX = (c) => c * cw + cw / 2
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Threads being woven on a loom">
      <rect width={W} height={H} fill="#172040" />
      {Array.from({ length: cols }, (_, c) => (
        <line key={`w${c}`} x1={warpX(c)} x2={warpX(c)} y1={0} y2={H} stroke={THREADS[(c + 2) % 4]} strokeOpacity={0.55} strokeWidth={cw - 8} />
      ))}
      {Array.from({ length: rows }, (_, r) => (
        <motion.rect
          key={`f${r}`} x={0} y={r * rh} width={W} height={rh - 1}
          fill={THREADS[(r >> 1) % 4]}
          style={{ transformOrigin: r % 2 ? 'right' : 'left', transformBox: 'fill-box' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: show ? 1 : 0 }}
          transition={{ duration: 0.45, delay: 0.3 + r * 0.11, ease: 'easeInOut' }}
        />
      ))}
      {Array.from({ length: cols }, (_, c) => (
        <motion.line
          key={`o${c}`} x1={warpX(c)} x2={warpX(c)} y1={0} y2={H}
          stroke={THREADS[(c + 2) % 4]} strokeWidth={cw - 4}
          strokeDasharray={`${rh} ${rh}`} strokeDashoffset={c % 2 ? rh : 0}
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 + rows * 0.11 }}
        />
      ))}
    </svg>
  )
}

export function Preloader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1700)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-loom"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex flex-col items-center gap-6">
        <svg width="96" height="64" viewBox="0 0 96 64">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.line key={i} x1={6 + i * 12} x2={6 + i * 12} y1={0} y2={64} stroke="#f8f1e4" strokeOpacity={0.35} strokeWidth={4}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: i * 0.04 }} />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <motion.line key={`h${i}`} x1={i % 2 ? 96 : 0} x2={i % 2 ? 0 : 96} y1={8 + i * 12} y2={8 + i * 12}
              stroke={THREADS[i % 3]} strokeWidth={6} strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.4 + i * 0.18, ease: 'easeInOut' }} />
          ))}
        </svg>
        <motion.p
          className="font-display text-2xl tracking-wide text-cream"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
        >
          Gurchet Handloom
        </motion.p>
      </div>
    </motion.div>
  )
}
