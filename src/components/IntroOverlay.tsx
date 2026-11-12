import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Share2, Check, Sparkles } from 'lucide-react';
import { ContextGlyph } from './MenuBar';

export function IntroOverlay() {
  const [open, setOpen] = useState(() => {
    try {
      return !window.localStorage.getItem('context-intro-seen');
    } catch {
      return true;
    }
  });

  function dismiss() {
    try {
      window.localStorage.setItem('context-intro-seen', '1');
    } catch {}
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md"
            onClick={dismiss}
          />
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-w-[94vw] rounded-3xl p-8 z-[95] glass-strong"
            style={{
              boxShadow:
                '0 48px 120px -24px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <ContextGlyph size={22} />
              <span className="font-display text-[26px] text-white/95 leading-none">
                Valcen
              </span>
            </div>
            <h1 className="font-display text-[32px] leading-[1.1] text-white/95 mb-3 text-balance">
              Shared memory for your team <br />and their AI agents.
            </h1>
            <p className="text-[14.5px] text-white/60 leading-[1.55] mb-7 text-balance">
              Drop a decision from your work. One tap approves it. From that moment, every
              teammate — and every agent they use — pulls from the same ground truth.
            </p>

            <div className="space-y-2.5 mb-7">
              <IntroStep
                num={1}
                icon={<Share2 size={13} />}
                title="Drop a decision"
                body="Type a line about the checkout launch in the sidebar."
              />
              <IntroStep
                num={2}
                icon={<Check size={13} />}
                title="Approve it"
                body="It becomes shared project memory."
              />
              <IntroStep
                num={3}
                icon={<Sparkles size={13} />}
                title="Watch Manahil’s agent retrieve it"
                body="Her PR review updates automatically."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[11px] text-white/40">
                Pretend client: <span className="text-white/70 font-medium">HappyRobots YC</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={dismiss}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13px]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(232,184,106,0.95) 0%, rgba(201,163,227,0.9) 100%)',
                  color: '#1A1A1E',
                  boxShadow: '0 8px 24px -8px rgba(232,184,106,0.4)',
                }}
              >
                Start the demo <ArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function IntroStep({
  num,
  icon,
  title,
  body,
}: {
  num: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[12px] font-semibold text-white/80"
        style={{
          background:
            'linear-gradient(135deg, rgba(232,184,106,0.2) 0%, rgba(201,163,227,0.15) 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        {num}
      </div>
      <div className="w-6 h-6 rounded-md flex items-center justify-center text-white/55 bg-white/[0.03] shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-white/95 leading-tight">{title}</div>
        <div className="text-[11.5px] text-white/55 mt-0.5">{body}</div>
      </div>
    </div>
  );
}
