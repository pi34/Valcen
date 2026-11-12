import { motion } from 'framer-motion';
import { Pause, Play, Flame, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { Avatar } from './Avatar';
import { TEAMMATES } from '../data/demoData';
import type { RunningAgent } from '../types';

export function RunningAgents() {
  const { runningAgents } = useStore();
  const active = runningAgents.filter((a) => a.state !== 'idle' && a.state !== 'paused').length;
  const totalToday = runningAgents.reduce((sum, a) => sum + (a.costToday ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold">
          Agents running
        </h3>
        <div className="flex items-center gap-2 text-[10.5px]">
          <span className="text-white/40">{active} active</span>
          <span className="text-white/20">·</span>
          <span className="text-white/60 font-mono tabular-nums">
            ${totalToday.toFixed(2)} today
          </span>
        </div>
      </div>
      <div className="space-y-1">
        {runningAgents.map((a) => (
          <AgentRow key={a.id} agent={a} />
        ))}
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: RunningAgent }) {
  const { setAgentState } = useStore();
  const t = TEAMMATES.find((x) => x.id === agent.owner);
  const hot = agent.risk === 'hot';
  const paused = agent.state === 'paused';

  function toggle() {
    setAgentState(agent.id, paused ? 'thinking' : 'paused');
  }

  return (
    <motion.div
      layout
      animate={{
        backgroundColor: hot
          ? 'rgba(239, 143, 93, 0.06)'
          : 'rgba(255,255,255,0)',
      }}
      className="rounded-lg border px-2.5 py-1.5"
      style={{
        borderColor: hot
          ? 'rgba(239, 143, 93, 0.28)'
          : 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <Avatar id={agent.owner} size={20} />
          <StateIndicator state={agent.state} risk={agent.risk} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-amber-glow/95 text-[11.5px] font-semibold">
              {agent.name}
            </span>
            <span className="text-white/35 text-[11px]">· {t?.name}</span>
            {hot && (
              <span className="flex items-center gap-0.5 text-[9.5px] uppercase tracking-wider font-bold px-1.5 py-[1px] rounded-full ml-auto"
                style={{
                  color: '#F5A572',
                  background: 'rgba(239, 143, 93, 0.14)',
                  border: '1px solid rgba(239, 143, 93, 0.35)',
                }}
              >
                <Flame size={9} /> hot
              </span>
            )}
          </div>
          <div className="text-[10.5px] text-white/50 mt-0.5 truncate">
            {paused ? 'paused · ' : stateLabel(agent.state) + ' '}
            {agent.task}
          </div>
          {typeof agent.costToday === 'number' && (
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono tabular-nums">
              <span className={hot ? 'text-[#F5A572]' : 'text-white/55'}>
                ${agent.costToday.toFixed(2)} today
              </span>
              <span className="text-white/15">·</span>
              <span className={hot ? 'text-[#F5A572]/80' : 'text-white/40'}>
                {agent.tokensPerMin?.toLocaleString() ?? 0} t/min
              </span>
              {hot && !paused && (
                <span className="flex items-center gap-0.5 text-[9.5px] text-[#F5A572] ml-auto">
                  <AlertTriangle size={9} /> 14h running
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={toggle}
          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white/55 hover:text-white/95 hover:bg-white/[0.08] transition-colors"
          aria-label={paused ? 'Resume agent' : 'Pause agent'}
          title={paused ? 'Resume agent' : 'Pause agent'}
        >
          {paused ? <Play size={11} fill="currentColor" /> : <Pause size={11} fill="currentColor" />}
        </button>
      </div>
    </motion.div>
  );
}

function StateIndicator({
  state,
  risk,
}: {
  state: RunningAgent['state'];
  risk?: RunningAgent['risk'];
}) {
  if (state === 'idle') {
    return (
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-white/20"
        style={{ boxShadow: '0 0 0 1.5px #0A0A0C' }}
      />
    );
  }
  if (state === 'paused') {
    return (
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
        style={{ background: '#C9A3E3', boxShadow: '0 0 0 1.5px #0A0A0C' }}
      />
    );
  }
  const color = risk === 'hot' ? '#F5A572' : state === 'writing' ? '#E8B86A' : '#8FBCB9';
  return (
    <>
      <motion.span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full agent-ping"
        style={{ background: color }}
      />
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: '0 0 0 1.5px #0A0A0C' }}
      />
    </>
  );
}

function stateLabel(s: RunningAgent['state']): string {
  switch (s) {
    case 'thinking':
      return 'thinking ·';
    case 'retrieving':
      return 'retrieving ·';
    case 'writing':
      return 'writing ·';
    default:
      return '';
  }
}
