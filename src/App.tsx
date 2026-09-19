import { useEffect, useRef, useState } from 'react'

// ── Petal data ──────────────────────────────────────────────────────────────

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.5 + 3) % 100}%`,
  size: 10 + (i % 5) * 4,
  duration: 8 + (i % 7) * 1.8,
  delay: (i * 1.1) % 12,
  color: i % 3 === 0 ? '#f7c5d5' : i % 3 === 1 ? '#e8d5f8' : '#fde8f0',
  rotate: (i * 23) % 180,
}))

const BLOOM_EMOJIS = ['🌸', '🌺', '🌷', '💐', '🌹', '✿', '🪷', '🌼', '💮']

// ── Types ───────────────────────────────────────────────────────────────────

interface BloomParticle {
  id: number
  emoji: string
  x: number
  y: number
  dx: number
  dy: number
  rot: number
}

// ── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [blooms, setblooms] = useState<BloomParticle[]>([])
  const bloomRef = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLElement>(null)

  // Intersection-observer fade-ins for sections below the hero
  useEffect(() => {
    const targets = [sectionRef.current, messageRef.current, cardsRef.current].filter(Boolean)
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).style.opacity = '1'
            ;(e.target as HTMLElement).style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.12 }
    )
    targets.forEach((t) => {
      if (t) {
        ;(t as HTMLElement).style.opacity = '0'
        ;(t as HTMLElement).style.transform = 'translateY(32px)'
        ;(t as HTMLElement).style.transition = 'opacity 0.9s ease, transform 0.9s ease'
        obs.observe(t as HTMLElement)
      }
    })
    return () => obs.disconnect()
  }, [])

  function triggerBouquet(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const newBlooms: BloomParticle[] = Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * 2 * Math.PI + Math.random() * 0.4
      const dist = 120 + Math.random() * 140
      return {
        id: bloomRef.current++,
        emoji: BLOOM_EMOJIS[i % BLOOM_EMOJIS.length],
        x: cx,
        y: cy,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: Math.random() * 720 - 360,
      }
    })

    setblooms((prev) => [...prev, ...newBlooms])
    setTimeout(() => {
      setblooms((prev) => prev.filter((b) => !newBlooms.some((n) => n.id === b.id)))
    }, 1500)
  }

  return (
    <>
      {/* ── Falling petals ── */}
      {PETALS.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
            opacity: 0,
          }}
        />
      ))}

      {/* ── Bloom burst particles ── */}
      {blooms.map((b) => (
        <div
          key={b.id}
          className="bloom-burst"
          style={{
            left: b.x,
            top: b.y,
            // CSS custom props for the keyframe targets
            ['--dx' as string]: `${b.dx}px`,
            ['--dy' as string]: `${b.dy}px`,
            ['--rot' as string]: `${b.rot}deg`,
          }}
        >
          {b.emoji}
        </div>
      ))}

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="hero">
        <p className="hero-eyebrow fade-in">A gift from the heart</p>

        <h1 className="hero-title fade-in fade-in-delay-1">Flowers For You,<br />My Love</h1>

        <div className="hero-divider fade-in fade-in-delay-2">
          <span className="hero-divider-line" />
          <span className="hero-divider-icon">✦</span>
          <span className="hero-divider-line right" />
        </div>

        <p className="hero-subtitle fade-in fade-in-delay-2">
          Every petal holds a whisper, every bloom a promise —<br />
          this garden was grown just for you.
        </p>

        <button className="bouquet-btn fade-in fade-in-delay-3" onClick={triggerBouquet}>
          Open Your Bouquet 💐
        </button>
      </section>

      {/* ══ FLOWER SHOWCASE ══════════════════════════════════════════════ */}
      <section className="section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <h2 className="section-title">A Bouquet for You</h2>
        <p className="section-subtitle">Each flower chosen with intention, each one meant for you</p>

        <div className="cards-grid" ref={cardsRef as React.RefObject<HTMLElement>}>
          <FlowerCard
            emoji="🌹"
            name="Rose"
            badge="Eternal Love"
            poem="Where words fail, the rose speaks deep crimson devotion, endless and true."
          />
          <FlowerCard
            emoji="🪷"
            name="Lily"
            badge="Pure Grace"
            poem="Soft as moonlight, gentle as a whisper a lily blooms only for the pure of heart."
          />
          <FlowerCard
            emoji="🌷"
            name="Tulip"
            badge="Perfect Love"
            poem="A tulip declares what the heart knows you are the one, wholly and perfectly."
          />
        </div>
      </section>

      {/* ══ LOVE MESSAGE ═════════════════════════════════════════════════ */}
      <section className="message-section">
        <div className="message-frame" ref={messageRef}>
          <span className="message-ornament">✦</span>
          <p className="message-quote">
            "I just wanted to tell you something true: you are beautiful. Not just today—always, in every light, in every mood. These flowers are for you, because you deserve to be surrounded by things as lovely as you are."
          </p>
          <span className="message-signature">Just Because</span>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer>
        <div className="footer-divider">
          <span className="footer-line" />
          <span>🌸 ✦ 🌸</span>
          <span className="footer-line right" />
        </div>
        <p className="footer-text">Made with love, just for you</p>
      </footer>
    </>
  )
}

// ── FlowerCard ────────────────────────────────────────────────────────────────

function FlowerCard({
  emoji,
  name,
  badge,
  poem,
}: {
  emoji: string
  name: string
  badge: string
  poem: string
}) {
  return (
    <article className="flower-card">
      <span className="flower-icon">{emoji}</span>
      <h3 className="flower-name">{name}</h3>
      <span className="flower-badge">{badge}</span>
      <p className="flower-poem">{poem}</p>
    </article>
  )
}
