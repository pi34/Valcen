import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Avatar } from './Avatar';
import { TEAMMATES } from '../data/demoData';
import { Sparkles, Pencil } from 'lucide-react';
import type { AgentEvent } from '../types';

export function ActivityFeed() {
  const { events, teamUpdateFlash } = useStore();
  const feed: (AgentEvent | { kind: 'flash'; id: string; text: string })[] = [];
  if (teamUpdateFlash) {
    feed.push({ kind: 'flash', id: 'flash-live', text: teamUpdateFlash });
  }
  feed.push(...events.slice(0, 6));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold">
          Activity
        </h3>
        <span className="text-[10.5px] text-white/35">Live</span>
      </div>
      <div className="relative pl-4">
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-white/5" />
        <AnimatePresence initial={false}>
          {feed.map((item) => {
            if ('kind' in item && item.kind === 'flash') {
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="relative pb-3"
                >
                  <Dot color="#E8B86A" pulse />
                  <div className="rounded-lg px-2.5 py-2 bg-amber-glow/[0.08] border border-amber-glow/20">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Pencil size={10} className="text-amber-glow" />
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-glow/90">
                        You
                      </span>
                      <span className="text-[10px] text-white/35">· just now</span>
                    </div>
                    <div className="text-[12.5px] text-white/92 leading-[1.45]">{item.text}</div>
                  </div>
                </motion.div>
              );
            }
            const ev = item as AgentEvent;
            const t = TEAMMATES.find((x) => x.id === ev.teammate);
            const isRetrieval = ev.kind === 'retrieval';
            return (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="relative pb-3"
              >
                <Dot color={isRetrieval ? '#8FBCB9' : '#C9A3E3'} />
                <div className="flex items-start gap-2">
                  <Avatar id={ev.teammate} size={18} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11.5px] font-semibold text-white/95">
                        {t?.name}
                      </span>
                      {isRetrieval && (
                        <span className="flex items-center gap-1 text-[9.5px] uppercase tracking-wider text-emerald-300/90 bg-emerald-400/10 px-1.5 py-[1px] rounded-full border border-emerald-400/20 font-semibold">
                          <Sparkles size={8} /> retrieved
                        </span>
                      )}
                      <span className="text-[10.5px] text-white/35 ml-auto shrink-0">
                        {ev.at}
                      </span>
                    </div>
                    <div className="text-[12px] text-white/70 leading-[1.5]">
                      {isRetrieval ? (
                        <>
                          via{' '}
                          <span className="font-mono text-amber-glow/90 text-[11px]">
                            {ev.agentName}
                          </span>{' '}
                          — {ev.text.replace(/^retrieved\s*/, '').replace(/\.$/, '')}
                        </>
                      ) : (
                        ev.text
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Dot({ color, pulse = false }: { color: string; pulse?: boolean }) {
  return (
    <span className="absolute -left-[9px] top-1.5" aria-hidden>
      {pulse && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: color, opacity: 0.5 }}
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <span
        className="relative block w-[7px] h-[7px] rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 0 2px #0A0A0C, 0 0 10px -2px ${color}`,
        }}
      />
    </span>
  );
}
