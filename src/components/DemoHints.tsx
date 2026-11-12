import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from '../store';

type HintKey = 'drop' | 'approve' | 'retrieved';

export function DemoHints() {
  const { pendingReview, events, sidebarOpen } = useStore();
  const [stage, setStage] = useState<HintKey>('drop');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (pendingReview.length > 1) setStage('approve');
    const last = events[0];
    if (last && last.kind === 'retrieval' && last.at === 'just now') {
      setStage('retrieved');
      const id = setTimeout(() => setDismissed(true), 4500);
      return () => clearTimeout(id);
    }
  }, [pendingReview, events]);

  if (!sidebarOpen || dismissed) return null;

  const COPY: Record<HintKey, { title: string; body: string }> = {
    drop: {
      title: 'Try dropping a decision',
      body: 'Paste any note about the checkout launch — Valcen will extract it for your team.',
    },
    approve: {
      title: 'Approve it',
      body: 'Once you approve, teammates and their agents can retrieve it as ground truth.',
    },
    retrieved: {
      title: 'Manahil’s agent just retrieved it',
      body: 'Her PR review now has the latest decision baked in.',
    },
  };
  const copy = COPY[stage];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 left-6 w-[300px] rounded-xl p-3 z-50 glass-strong"
        style={{
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-start gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,184,106,0.3) 0%, rgba(201,163,227,0.2) 100%)',
              boxShadow: '0 0 0 1px rgba(232,184,106,0.3)',
            }}
          >
            <span className="text-[11px]">✨</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold text-white/95">{copy.title}</div>
            <div className="text-[11.5px] text-white/60 mt-0.5 leading-[1.5]">
              {copy.body}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/40 hover:text-white/80 text-[14px] leading-none"
            aria-label="Dismiss hint"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
