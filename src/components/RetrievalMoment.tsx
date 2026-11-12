import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, GitPullRequest } from 'lucide-react';
import { useStore } from '../store';
import { Avatar } from './Avatar';
import { TEAMMATES } from '../data/demoData';

export function RetrievalMoment() {
  const { events } = useStore();
  const [current, setCurrent] = useState<null | {
    id: string;
    teammate: string;
    agentName: string;
    text: string;
    decisionTitle: string;
  }>(null);
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    const latest = events[0];
    if (!latest || latest.kind !== 'retrieval' || latest.at !== 'just now') return;
    if (seen.current.has(latest.id)) return;
    seen.current.add(latest.id);
    const match = latest.text.match(/retrieved\s+"([^"]+)"/);
    setCurrent({
      id: latest.id,
      teammate: latest.teammate,
      agentName: latest.agentName,
      text: latest.text,
      decisionTitle: match?.[1] ?? latest.text,
    });
    const id = setTimeout(() => setCurrent(null), 5200);
    return () => clearTimeout(id);
  }, [events]);

  const t = current ? TEAMMATES.find((x) => x.id === current.teammate) : null;

  return (
    <AnimatePresence>
      {current && t && (
        <>
          <motion.div
            key="rm-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 55%, rgba(232,184,106,0.14) 0%, transparent 55%)',
            }}
          />
          <motion.div
            key="rm-card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed left-1/2 top-24 -translate-x-1/2 z-[85] w-[480px] max-w-[92vw] pointer-events-none"
          >
            <div
              className="rounded-2xl p-5 glass-strong"
              style={{
                boxShadow:
                  '0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,184,106,0.22), 0 0 60px -10px rgba(232,184,106,0.3)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: t.color,
                      opacity: 0.4,
                    }}
                    animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <div className="relative">
                    <Avatar id={t.id} size={38} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={11} className="text-amber-glow" />
                    <span className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-amber-glow/90">
                      Agent retrieval · live
                    </span>
                  </div>
                  <div className="text-[14px] text-white/95 leading-[1.4]">
                    <span className="font-semibold">{t.name}’s</span> agent{' '}
                    <span className="font-mono text-amber-glow/90">{current.agentName}</span>{' '}
                    just pulled your decision into her work.
                  </div>
                </div>
              </div>

              <div
                className="mt-4 rounded-xl p-3.5 border"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                }}
              >
                <div className="text-[12.5px] text-white/85 leading-[1.5] mb-2">
                  “{current.decisionTitle}”
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <GitPullRequest size={11} />
                  <span>{t.name === 'Manahil' ? 'PR #1189 · happyrobots/web' : 'referenced in agent context'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
