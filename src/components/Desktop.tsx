import { motion } from 'framer-motion';

export function Desktop() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Deep night-sky gradient wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 20% 10%, #2A1F3A 0%, transparent 50%),' +
            'radial-gradient(ellipse 80% 60% at 85% 90%, #1C2A3A 0%, transparent 55%),' +
            'radial-gradient(ellipse 60% 40% at 60% 50%, #3A2A4A 0%, transparent 60%),' +
            'linear-gradient(135deg, #0D0B14 0%, #0A0A0C 50%, #080812 100%)',
        }}
      />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Floating light orbs */}
      <motion.div
        className="absolute w-[520px] h-[520px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(232, 184, 106, 0.12) 0%, transparent 70%)',
          top: '-15%',
          left: '55%',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(143, 188, 185, 0.10) 0%, transparent 70%)',
          bottom: '-10%',
          left: '10%',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <BackgroundApps />
    </div>
  );
}

function BackgroundApps() {
  return (
    <>
      {/* Mock VS Code / editor on left */}
      <div
        className="absolute rounded-xl overflow-hidden"
        style={{
          top: '70px',
          left: '36px',
          width: '720px',
          height: '560px',
          boxShadow:
            '0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="h-9 flex items-center gap-2 px-4"
          style={{ background: '#1E1E22' }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center text-[11px] text-white/40 font-mono">
            happyrobots/web — src/routes/checkout/+page.svelte
          </div>
        </div>
        <div
          className="h-full px-5 py-4 font-mono text-[12.5px] leading-[1.65]"
          style={{ background: '#141418', color: '#A8A8B0' }}
        >
          <CodeLines />
        </div>
      </div>

      {/* Mock Figma / design app top right */}
      <div
        className="absolute rounded-xl overflow-hidden"
        style={{
          top: '110px',
          right: '460px',
          width: '420px',
          height: '320px',
          boxShadow:
            '0 24px 50px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="h-8 flex items-center gap-2 px-3"
          style={{ background: '#1A1A1E' }}
        >
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center text-[11px] text-white/40 font-mono">
            Figma — Checkout v4
          </div>
        </div>
        <div
          className="h-full p-6 relative"
          style={{
            background:
              'linear-gradient(180deg, #16161B 0%, #121216 100%)',
          }}
        >
          <div className="absolute inset-6 rounded-md border border-white/5 bg-white/[0.015] p-4">
            <div className="h-2.5 w-24 bg-white/10 rounded-full mb-3" />
            <div className="h-1.5 w-44 bg-white/5 rounded-full mb-1.5" />
            <div className="h-1.5 w-36 bg-white/5 rounded-full mb-6" />
            <div className="h-8 w-full bg-white/[0.04] rounded-md border border-white/5 mb-2" />
            <div className="h-8 w-full bg-white/[0.04] rounded-md border border-white/5 mb-4" />
            <div className="h-9 w-full bg-amber-glow/20 rounded-md border border-amber-glow/40" />
          </div>
        </div>
      </div>
    </>
  );
}

function CodeLines() {
  const lines = [
    { num: 1, tokens: [{ t: 'import', c: '#C586C0' }, { t: ' ', c: '' }, { t: '{ loadCart }', c: '#9CDCFE' }, { t: ' from ', c: '#D4D4D4' }, { t: "'$lib/cart'", c: '#CE9178' }] },
    { num: 2, tokens: [{ t: 'import', c: '#C586C0' }, { t: ' type ', c: '#C586C0' }, { t: '{ PageLoad }', c: '#4EC9B0' }, { t: ' from ', c: '#D4D4D4' }, { t: "'./$types'", c: '#CE9178' }] },
    { num: 3, tokens: [] },
    { num: 4, tokens: [{ t: 'export', c: '#C586C0' }, { t: ' ', c: '' }, { t: 'const', c: '#569CD6' }, { t: ' load', c: '#DCDCAA' }, { t: ': ', c: '#D4D4D4' }, { t: 'PageLoad', c: '#4EC9B0' }, { t: ' = ', c: '#D4D4D4' }, { t: 'async', c: '#C586C0' }, { t: ' ({ fetch, cookies }) => {', c: '#D4D4D4' }] },
    { num: 5, tokens: [{ t: '  const', c: '#569CD6' }, { t: ' session', c: '#9CDCFE' }, { t: ' = cookies.', c: '#D4D4D4' }, { t: 'get', c: '#DCDCAA' }, { t: "('session');", c: '#CE9178' }] },
    { num: 6, tokens: [{ t: '  const', c: '#569CD6' }, { t: ' cart', c: '#9CDCFE' }, { t: ' = ', c: '#D4D4D4' }, { t: 'await', c: '#C586C0' }, { t: ' ', c: '' }, { t: 'loadCart', c: '#DCDCAA' }, { t: '(fetch, session);', c: '#D4D4D4' }] },
    { num: 7, tokens: [] },
    { num: 8, tokens: [{ t: '  // TODO: enforce guest-tap gate before card form', c: '#6A9955' }] },
    { num: 9, tokens: [{ t: '  const', c: '#569CD6' }, { t: ' guestGate', c: '#9CDCFE' }, { t: ' = !session;', c: '#D4D4D4' }] },
    { num: 10, tokens: [] },
    { num: 11, tokens: [{ t: '  return', c: '#C586C0' }, { t: ' { cart, guestGate };', c: '#D4D4D4' }] },
    { num: 12, tokens: [{ t: '};', c: '#D4D4D4' }] },
    { num: 13, tokens: [] },
    { num: 14, tokens: [{ t: '// decisions pinned by Valcen:', c: '#6A9955' }] },
    { num: 15, tokens: [{ t: '//   HR-412 · Guest checkout stays, gated by a single tap', c: '#6A9955' }] },
    { num: 16, tokens: [{ t: '//   Payments · Apple Pay first, Google Pay in v1.1', c: '#6A9955' }] },
  ];
  return (
    <div>
      {lines.map((l) => (
        <div key={l.num} className="flex">
          <span className="w-7 text-right pr-3 text-white/20 select-none">{l.num}</span>
          <span>
            {l.tokens.map((tok, i) => (
              <span key={i} style={{ color: tok.c || '#D4D4D4' }}>
                {tok.t}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
