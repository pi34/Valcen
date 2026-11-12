import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Square, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import type { Decision } from '../types';

type Beat = {
  id: string;
  caption: string;
  delayMs: number;
  action?: () => void;
};

const DEMO_DECISION: Decision = {
  id: 'd-demo-1',
  title: 'Shipping defaults to billing on first order',
  body:
    'On the first order, shipping address defaults to billing. A secondary "ship to a different address" link below reveals the full form. No extra form fields for 92% of flows.',
  source: 'Dropped by Riya',
  sourceDetail: 'Sidebar · just now',
  author: 'riya',
  status: 'pending',
  createdAt: 'just now',
  tags: ['checkout'],
};

export function DemoScript() {
  const {
    openSidebar,
    closeSidebar,
    addPending,
    approveDecision,
    highlight,
    flashTeamUpdate,
    addEvent,
    setAgentState,
    openFull,
    closeFull,
    discardDecision,
  } = useStore();

  const [running, setRunning] = useState(false);
  const [beatIdx, setBeatIdx] = useState(-1);
  const [activeBeat, setActiveBeat] = useState<Beat | null>(null);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }

  function stop() {
    clearTimers();
    setRunning(false);
    setBeatIdx(-1);
    setActiveBeat(null);
    highlight(undefined);
    flashTeamUpdate(undefined);
    closeFull();
    openSidebar();
  }

  function start() {
    clearTimers();
    discardDecision(DEMO_DECISION.id);
    closeFull();
    setRunning(true);
    setBeatIdx(0);

    const beats: Beat[] = [
      {
        id: 'open',
        caption: 'The Valcen sidebar.',
        delayMs: 2000,
        action: () => openSidebar(),
      },
      {
        id: 'cost',
        caption: 'Scout — Riya’s agent — has been running 14 hours. $14 so far.',
        delayMs: 3800,
      },
      {
        id: 'drop',
        caption: 'Riya drops a decision for the team.',
        delayMs: 2600,
        action: () => addPending(DEMO_DECISION),
      },
      {
        id: 'extract',
        caption: 'Extracted, waiting for her review.',
        delayMs: 2600,
      },
      {
        id: 'approve',
        caption: 'Approved. Now visible to the team.',
        delayMs: 2200,
        action: () => {
          approveDecision(DEMO_DECISION.id);
          highlight(DEMO_DECISION.id);
          flashTeamUpdate('approved “Shipping defaults to billing on first order”');
        },
      },
      {
        id: 'harbor',
        caption: 'Manahil’s agent Harbor is reviewing a related PR.',
        delayMs: 2000,
        action: () => setAgentState('ra-2', 'retrieving'),
      },
      {
        id: 'retrieve',
        caption: 'It pulls Riya’s decision into its context. The reason shows up in the activity feed.',
        delayMs: 4200,
        action: () => {
          addEvent({
            id: `e-demo-${Date.now()}`,
            kind: 'retrieval',
            teammate: 'manahil',
            agentName: 'Harbor',
            text:
              'retrieved "Shipping defaults to billing on first order" while reviewing PR #1189.',
            decisionId: DEMO_DECISION.id,
            at: 'just now',
            why:
              'Harbor is reviewing PR #1189, which modifies checkout/address.tsx. This decision is tagged checkout and specifies shipping address behavior — matched on shipping, billing, and address.',
            matched: ['shipping', 'billing', 'address', 'checkout'],
          });
          setAgentState('ra-2', 'writing');
        },
      },
      {
        id: 'memory',
        caption: 'Project Memory — every decision, source, and retrieval.',
        delayMs: 4200,
        action: () => openFull(),
      },
      {
        id: 'close',
        caption: '',
        delayMs: 2200,
        action: () => {
          closeFull();
          setAgentState('ra-2', 'thinking');
          flashTeamUpdate(undefined);
          highlight(undefined);
        },
      },
    ];

    let cursor = 0;
    beats.forEach((b, i) => {
      const at = cursor;
      cursor += b.delayMs;
      const t = window.setTimeout(() => {
        setBeatIdx(i);
        setActiveBeat(b);
        b.action?.();
      }, at);
      timers.current.push(t);
    });

    const endTimer = window.setTimeout(() => {
      setRunning(false);
      setBeatIdx(-1);
      setActiveBeat(null);
    }, cursor + 800);
    timers.current.push(endTimer);
  }

  useEffect(() => () => clearTimers(), []);

  const totalBeats = 9;
  const progress = running && beatIdx >= 0 ? (beatIdx + 1) / totalBeats : 0;

  return (
    <>
      {/* Controls — top-left, below Valcen wordmark */}
      <motion.button
        onClick={running ? stop : start}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fixed top-16 left-6 z-[80] flex items-center gap-2 px-3 py-1.5 rounded-full glass-strong text-[11.5px] font-semibold text-white/95"
        style={{
          boxShadow:
            '0 10px 24px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {running ? (
          <>
            <Square size={10} fill="currentColor" className="text-red-400" />
            <span>Stop demo</span>
          </>
        ) : (
          <>
            <Circle size={10} fill="currentColor" className="text-red-400 record-pulse" />
            <span>Play demo</span>
          </>
        )}
      </motion.button>

      {running && (
        <>
          <motion.button
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={start}
            className="fixed top-16 left-[124px] z-[80] flex items-center gap-1 px-2.5 py-1.5 rounded-full glass-strong text-[11px] text-white/75 hover:text-white/95"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}
          >
            <RotateCcw size={10} />
            Restart
          </motion.button>

          {/* Progress bar at the very top — subtle "we're recording" affordance */}
          <div className="fixed top-0 left-0 right-0 h-0.5 z-[90] bg-white/5 pointer-events-none">
            <motion.div
              className="h-full origin-left"
              style={{
                background: 'linear-gradient(90deg, #E8B86A 0%, #C9A3E3 100%)',
              }}
              animate={{ scaleX: progress }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </>
      )}

      <AnimatePresence>
        {running && activeBeat?.caption && (
          <motion.div
            key={`cap-${activeBeat.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[76] pointer-events-none"
          >
            <div
              className="px-5 py-3 rounded-2xl glass-strong max-w-[600px] text-center"
              style={{
                boxShadow:
                  '0 24px 60px -18px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)',
              }}
            >
              <div className="text-[15.5px] text-white/95 leading-[1.45] text-balance">
                {activeBeat.caption}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
