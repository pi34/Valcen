import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Avatar } from './Avatar';
import { TEAMMATES } from '../data/demoData';

export function RunningAgents() {
  const { runningAgents } = useStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] uppercase tracking-[0.14em] text-white/45 font-medium">
          Running now
        </h3>
        <span className="text-[10.5px] text-white/40">
          {runningAgents.filter((a) => a.state !== 'idle').length} active
        </span>
      </div>
      <div className="space-y-1">
        {runningAgents.map((a) => {
          const t = TEAMMATES.find((x) => x.id === a.owner);
          return (
            <div
              key={a.id}
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <div className="relative shrink-0">
                <Avatar id={a.owner} size={18} />
                <StateIndicator state={a.state} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-white/90 leading-tight flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-amber-glow/90 text-[11px]">
                    {a.name}
                  </span>
                  <span className="text-white/35 text-[11px]">· {t?.name}</span>
                </div>
                <div className="text-[10.5px] text-white/45 mt-0.5 truncate">
                  {stateLabel(a.state)} {a.task}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StateIndicator({ state }: { state: 'thinking' | 'retrieving' | 'writing' | 'idle' }) {
  if (state === 'idle') {
    return (
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-white/20"
        style={{ boxShadow: '0 0 0 1.5px #0A0A0C' }}
      />
    );
  }
  return (
    <>
      <motion.span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full agent-ping"
        style={{ background: '#8FBCB9' }}
      />
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
        style={{
          background: state === 'writing' ? '#E8B86A' : '#8FBCB9',
          boxShadow: '0 0 0 1.5px #0A0A0C',
        }}
      />
    </>
  );
}

function stateLabel(s: string): string {
  switch (s) {
    case 'thinking':
      return 'thinking:';
    case 'retrieving':
      return 'retrieving:';
    case 'writing':
      return 'writing:';
    default:
      return 'idle:';
  }
}
