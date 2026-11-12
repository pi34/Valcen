import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Avatar } from './Avatar';
import { TEAMMATES } from '../data/demoData';

export function TeamUpdates() {
  const { events, teamUpdateFlash } = useStore();
  const recent = events.filter((e) => e.kind === 'update').slice(0, 2);

  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.14em] text-white/45 font-medium mb-2">
        Team updates
      </h3>
      <div className="space-y-1.5">
        <AnimatePresence initial={false}>
          {teamUpdateFlash && (
            <motion.div
              key="flash"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-start gap-2 py-1.5 px-2 rounded-lg bg-amber-glow/[0.08] border border-amber-glow/20"
            >
              <Avatar id="riya" size={18} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-white/90 leading-tight">
                  {teamUpdateFlash}
                </div>
                <div className="text-[10.5px] text-white/35 mt-0.5">just now</div>
              </div>
            </motion.div>
          )}
          {recent.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 py-1"
            >
              <Avatar id={e.teammate} size={18} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-white/80 leading-tight">
                  <span className="font-medium text-white/95">
                    {TEAMMATES.find((t) => t.id === e.teammate)?.name}
                  </span>{' '}
                  {e.text.replace(new RegExp(`^${TEAMMATES.find((t) => t.id === e.teammate)?.name}\\s*`), '')}
                </div>
                <div className="text-[10.5px] text-white/35 mt-0.5">{e.at}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
