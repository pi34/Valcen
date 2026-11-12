import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import type { Decision } from '../types';

export function ReviewQueue({ onApprove }: { onApprove: (d: Decision) => void }) {
  const { pendingReview, discardDecision } = useStore();

  if (!pendingReview.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-amber-glow/90 font-semibold">
          <Sparkles size={11} />
          Needs your review
        </h3>
        <span className="text-[10.5px] text-amber-glow/90 bg-amber-glow/15 px-2 py-0.5 rounded-full font-semibold">
          {pendingReview.length}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {pendingReview.map((d) => (
          <motion.div
            key={d.id}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, x: 20, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="rounded-2xl p-4 mb-2.5 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,184,106,0.08) 0%, rgba(201,163,227,0.04) 100%)',
              boxShadow:
                '0 0 0 1px rgba(232,184,106,0.22), 0 10px 32px -12px rgba(232,184,106,0.3)',
            }}
          >
            {/* Top shimmer accent */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(232,184,106,0.9), transparent)',
              }}
            />

            <div className="text-[13.5px] font-semibold text-white/97 leading-[1.35] text-balance mb-1.5">
              {d.title}
            </div>
            <div className="text-[11.5px] text-white/60 leading-[1.5] mb-3 line-clamp-2">
              {d.body}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {d.tags?.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/8 text-white/65 font-medium"
                  >
                    #{t}
                  </span>
                ))}
                <span className="text-[10.5px] text-white/35 truncate">· {d.source}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => discardDecision(d.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/90 hover:bg-white/8"
                  aria-label="Discard"
                >
                  <X size={14} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => onApprove(d)}
                  className="h-7 px-3 rounded-lg flex items-center justify-center gap-1 text-[12px] font-semibold"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(232,184,106,0.98) 0%, rgba(201,163,227,0.92) 100%)',
                    color: '#1A1A1E',
                    boxShadow: '0 6px 16px -4px rgba(232,184,106,0.5)',
                  }}
                >
                  <Check size={12} strokeWidth={2.5} /> Approve
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
