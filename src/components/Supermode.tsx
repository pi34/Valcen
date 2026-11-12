import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square } from 'lucide-react';
import { useStore } from '../store';
import { useEffect, useState } from 'react';

export function SupermodeButton({ compact = false }: { compact?: boolean }) {
  const { supermodeRecording, startSupermode, stopSupermode } = useStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!supermodeRecording) {
      setElapsed(0);
      return;
    }
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [supermodeRecording]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <AnimatePresence mode="wait">
      {!supermodeRecording ? (
        compact ? (
          <motion.button
            key="start-compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={startSupermode}
            className="w-full flex items-center gap-2 py-2 px-2.5 rounded-lg text-white/60 hover:text-white/95 hover:bg-white/[0.05] transition-colors"
          >
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(232,184,106,0.22) 0%, rgba(201,163,227,0.14) 100%)',
                boxShadow: '0 0 0 1px rgba(232,184,106,0.22)',
              }}
            >
              <Mic size={11} className="text-amber-glow" />
            </span>
            <span className="text-[12px] font-medium">Start Supermode</span>
            <span className="flex-1" />
            <span className="text-[10px] text-white/35">capture a window</span>
          </motion.button>
        ) : (
        <motion.button
          key="start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={startSupermode}
          className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl group"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.08) inset, 0 1px 0 rgba(255,255,255,0.04) inset',
          }}
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,184,106,0.3) 0%, rgba(201,163,227,0.2) 100%)',
              boxShadow: '0 0 0 1px rgba(232,184,106,0.3)',
            }}
          >
            <Mic size={13} className="text-amber-glow" />
          </span>
          <div className="flex-1 text-left">
            <div className="text-[12.5px] font-medium text-white/95 leading-tight">
              Start Supermode
            </div>
            <div className="text-[10.5px] text-white/45 mt-0.5">
              Capture a window; we extract the decisions for your review
            </div>
          </div>
        </motion.button>
        )
      ) : (
        <motion.div
          key="recording"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full rounded-xl p-3"
          style={{
            background:
              'linear-gradient(135deg, rgba(239,68,68,0.14) 0%, rgba(232,184,106,0.08) 100%)',
            boxShadow:
              '0 0 0 1px rgba(239,68,68,0.3) inset, 0 0 32px -10px rgba(239,68,68,0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 record-pulse" />
            <span className="text-[11px] font-semibold text-white/95 tracking-wide uppercase">
              Supermode recording
            </span>
            <span className="flex-1" />
            <span className="font-mono text-[11px] text-white/70 tabular-nums">
              {mm}:{ss}
            </span>
          </div>
          <div className="text-[11px] text-white/60 mb-2.5 leading-[1.5]">
            Capturing <span className="font-mono text-white/85">Figma — Checkout v4</span>.
            Valcen is listening for decisions and preferences.
          </div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <ListeningBars />
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={stopSupermode}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-[11.5px] font-medium text-white/90"
          >
            <Square size={10} fill="currentColor" /> Stop & review findings
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ListeningBars() {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: 'rgba(232,184,106,0.6)' }}
          animate={{
            height: [`${20 + Math.random() * 50}%`, `${30 + Math.random() * 70}%`, `${20 + Math.random() * 50}%`],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  );
}

export function SupermodeSummary() {
  const { supermodeSummaryOpen, closeSupermodeSummary, addPending } = useStore();
  const [note, setNote] = useState('');
  const [addTo, setAddTo] = useState<'project' | 'personal' | 'archive'>('project');

  if (!supermodeSummaryOpen) return null;

  const findings = [
    {
      id: 'f1',
      text: 'Shipping defaults to billing on first order; "ship somewhere else" is a secondary link, not a toggle.',
      checked: true,
    },
    {
      id: 'f2',
      text: 'Error states on the card form should announce via aria-live="polite".',
      checked: true,
    },
    {
      id: 'f3',
      text: 'Checkout CTA copy: "Place order" → "Confirm order" (per Riya + legal).',
      checked: false,
    },
  ];

  function confirm() {
    findings
      .filter((f) => f.checked)
      .forEach((f, i) => {
        addPending({
          id: `d-sm-${Date.now()}-${i}`,
          title: f.text,
          body: f.text,
          source: 'Supermode · Figma — Checkout v4',
          sourceDetail: `${findings.length} findings · 12 min session`,
          author: 'riya',
          status: 'pending',
          createdAt: 'just now',
          tags: ['checkout'],
        });
      });
    setNote('');
    closeSupermodeSummary();
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
        onClick={closeSupermodeSummary}
      />
      <motion.div
        key="dialog"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-w-[94vw] z-[90] rounded-2xl glass-strong p-5"
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,184,106,0.3) 0%, rgba(201,163,227,0.2) 100%)',
              boxShadow: '0 0 0 1px rgba(232,184,106,0.3)',
            }}
          >
            <Mic size={16} className="text-amber-glow" />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-white/95">
              Supermode session · 12 min
            </div>
            <div className="text-[11.5px] text-white/50 mt-0.5">
              Figma — Checkout v4 · {findings.length} findings extracted
            </div>
          </div>
          <button
            onClick={closeSupermodeSummary}
            className="text-white/40 hover:text-white/80 text-[18px] leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-1.5 mb-4">
          {findings.map((f) => (
            <label
              key={f.id}
              className="flex items-start gap-2.5 py-2 px-2.5 rounded-lg hover:bg-white/[0.03] cursor-pointer"
            >
              <input
                type="checkbox"
                defaultChecked={f.checked}
                className="mt-[3px] shrink-0 accent-amber-glow"
              />
              <span className="text-[12.5px] text-white/85 leading-[1.5]">{f.text}</span>
            </label>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything to add from this session? (optional)"
          rows={2}
          className="w-full bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2 text-[12.5px] text-white/90 placeholder:text-white/35 outline-none focus:border-amber-glow/40 resize-none"
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-white/45">Add to:</span>
            {(['project', 'personal', 'archive'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setAddTo(v)}
                className={
                  'px-2 py-1 rounded-md font-medium capitalize transition-colors ' +
                  (addTo === v
                    ? 'bg-white/15 text-white/95'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]')
                }
              >
                {v === 'project' ? 'Project memory' : v === 'personal' ? 'Personal' : 'Archive'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={closeSupermodeSummary}
              className="text-[12px] text-white/60 hover:text-white/90 px-3 py-1.5 rounded-md hover:bg-white/5"
            >
              Discard
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={confirm}
              className="text-[12px] font-medium px-3 py-1.5 rounded-md"
              style={{
                background:
                  'linear-gradient(135deg, rgba(232,184,106,0.95) 0%, rgba(201,163,227,0.9) 100%)',
                color: '#1A1A1E',
              }}
            >
              Send to review queue
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
