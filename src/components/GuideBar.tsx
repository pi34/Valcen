import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';
import { useStore } from '../store';

type Step = {
  id: 'drop' | 'approve' | 'retrieved';
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    id: 'drop',
    title: '1 · Drop a decision',
    body: 'Type anything you want your team to remember about checkout. Valcen extracts it.',
  },
  {
    id: 'approve',
    title: '2 · Approve it',
    body: 'One tap — the decision becomes shared ground truth for every teammate.',
  },
  {
    id: 'retrieved',
    title: '3 · Watch an agent pull it in',
    body: 'Manahil’s agent Harbor is reviewing a PR right now. It just picked up your decision.',
  },
];

export function GuideBar() {
  const { pendingReview, events } = useStore();
  const [dismissed, setDismissed] = useState(false);

  const current: Step['id'] = useMemo(() => {
    const latest = events[0];
    if (latest && latest.kind === 'retrieval' && latest.at === 'just now') return 'retrieved';
    if (pendingReview.length > 0) return 'approve';
    return 'drop';
  }, [pendingReview, events]);

  const index = STEPS.findIndex((s) => s.id === current);

  useEffect(() => {
    if (current !== 'retrieved') return;
    const id = setTimeout(() => setDismissed(true), 6000);
    return () => clearTimeout(id);
  }, [current]);

  if (dismissed) return null;

  const step = STEPS[index];

  return (
    <div className="fixed left-1/2 bottom-6 -translate-x-1/2 z-[60] pointer-events-none">
      <motion.div
        layout
        className="pointer-events-auto rounded-2xl px-4 py-3 glass-strong flex items-start gap-3 min-w-[380px] max-w-[460px]"
        style={{
          boxShadow:
            '0 24px 48px -16px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        <StepsRail index={index} />
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[12.5px] font-semibold text-white/95">{step.title}</span>
            </div>
            <div className="text-[11.5px] text-white/60 leading-[1.5]">{step.body}</div>
          </motion.div>
        </AnimatePresence>
        <ArrowCue step={step.id} />
        <button
          onClick={() => setDismissed(true)}
          className="text-white/40 hover:text-white/80 text-[14px] leading-none mt-0.5 shrink-0"
          aria-label="Dismiss guide"
        >
          ×
        </button>
      </motion.div>
    </div>
  );
}

function StepsRail({ index }: { index: number }) {
  return (
    <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
      {STEPS.map((_, i) => {
        const done = i < index;
        const active = i === index;
        return (
          <div
            key={i}
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
            style={{
              background: active
                ? 'linear-gradient(135deg, rgba(232,184,106,0.95) 0%, rgba(201,163,227,0.9) 100%)'
                : done
                ? 'rgba(143,188,185,0.3)'
                : 'rgba(255,255,255,0.06)',
              color: active ? '#1A1A1E' : done ? '#8FBCB9' : 'rgba(255,255,255,0.4)',
              boxShadow: active ? '0 0 0 2px rgba(232,184,106,0.2)' : 'none',
            }}
          >
            {done ? <Check size={10} /> : i + 1}
          </div>
        );
      })}
    </div>
  );
}

function ArrowCue({ step }: { step: Step['id'] }) {
  if (step === 'retrieved') return null;
  const label = step === 'drop' ? 'try the drop area' : 'click Approve';
  const Icon = step === 'approve' ? ArrowUp : ArrowUp;
  return (
    <div className="hidden md:flex items-center gap-1.5 text-[10.5px] text-amber-glow/90 self-end mb-0.5 shrink-0">
      <Icon size={11} />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}
