import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Avatar } from './Avatar';
import { TEAMMATES } from '../data/demoData';

export function AgentActivity() {
  const { events } = useStore();
  const retrievals = events.filter((e) => e.kind === 'retrieval').slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] uppercase tracking-[0.14em] text-white/45 font-medium">
          Agent activity
        </h3>
      </div>
      <div className="space-y-1">
        <AnimatePresence initial={false}>
          {retrievals.map((e) => {
            const teammate = TEAMMATES.find((t) => t.id === e.teammate);
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 py-1.5 relative"
              >
                <div className="relative shrink-0 mt-0.5">
                  <Avatar id={e.teammate} size={18} />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{
                      background: '#8FBCB9',
                      boxShadow: '0 0 0 1.5px #0A0A0C',
                    }}
                    aria-hidden
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-white/80 leading-tight">
                    <span className="font-medium text-white/95">
                      {teammate?.name}’s
                    </span>{' '}
                    agent{' '}
                    <span className="font-mono text-[11px] text-amber-glow/85">
                      {e.agentName}
                    </span>{' '}
                    {e.text}
                  </div>
                  <div className="text-[10.5px] text-white/35 mt-0.5">{e.at}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
