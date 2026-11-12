import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Maximize2, Minus, Mic } from 'lucide-react';
import { useStore } from '../store';
import { PROJECT } from '../data/demoData';
import { AvatarStack } from './Avatar';
import { DropArea } from './DropArea';
import { ReviewQueue } from './ReviewQueue';
import { ActivityFeed } from './ActivityFeed';
import { RunningAgents } from './RunningAgents';
import { SupermodeButton } from './Supermode';
import { ContextGlyph } from './MenuBar';
import { inElectron } from '../electron-api';
import type { Decision } from '../types';

export function Sidebar({ asWindow = false }: { asWindow?: boolean }) {
  const {
    sidebarOpen,
    approveDecision,
    addEvent,
    flashTeamUpdate,
    openFull,
    setAgentState,
    highlight,
  } = useStore();

  function handleApprove(d: Decision) {
    approveDecision(d.id);
    highlight(d.id);
    flashTeamUpdate(`approved “${trunc(d.title, 60)}”`);

    setTimeout(() => setAgentState('ra-2', 'retrieving'), 600);
    setTimeout(() => {
      addEvent({
        id: `e-${Date.now()}`,
        kind: 'retrieval',
        teammate: 'manahil',
        agentName: 'Harbor',
        text: `retrieved "${trunc(d.title, 48)}" while reviewing PR #1189.`,
        decisionId: d.id,
        at: 'just now',
      });
      setAgentState('ra-2', 'writing');
    }, 2200);

    setTimeout(() => {
      setAgentState('ra-2', 'thinking');
      flashTeamUpdate(undefined);
      highlight(undefined);
    }, 8000);
  }

  function handleOpenFull() {
    if (window.context?.openFullWindow) {
      window.context.openFullWindow();
    } else {
      openFull();
    }
  }

  // In Electron sidebar window mode, we fill the whole window
  if (asWindow) {
    return (
      <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden glass-strong noise relative">
        <Header asWindow />
        <ScrollArea onApprove={handleApprove} />
        <FooterBar onExpand={handleOpenFull} />
      </div>
    );
  }

  // Browser overlay mode
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: '110%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '110%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }}
          className="fixed top-10 right-3 bottom-3 w-[420px] rounded-2xl z-40 overflow-hidden flex flex-col glass-strong noise"
          style={{
            boxShadow:
              '0 32px 80px -24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <Header />
          <ScrollArea onApprove={handleApprove} />
          <FooterBar onExpand={handleOpenFull} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function ScrollArea({ onApprove }: { onApprove: (d: Decision) => void }) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4 space-y-4">
      <ProjectBanner />
      <DropArea />
      <ReviewQueue onApprove={onApprove} />
      <RunningAgents />
      <ActivityFeed />
      <SupermodeRow />
    </div>
  );
}

function Header({ asWindow = false }: { asWindow?: boolean }) {
  const { closeSidebar } = useStore();
  function close() {
    if (window.context?.closeSidebar) window.context.closeSidebar();
    else closeSidebar();
  }
  return (
    <div
      className={
        'flex items-center gap-2 px-4 pt-4 pb-3 ' + (asWindow ? 'app-region-drag' : '')
      }
      style={asWindow ? { WebkitAppRegion: 'drag' } as React.CSSProperties : undefined}
    >
      <ContextGlyph size={18} />
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-[22px] text-white/95 leading-none">Valcen</span>
        <span className="text-[10px] text-white/35 bg-white/5 px-1.5 py-0.5 rounded-full font-mono">
          v0.1
        </span>
      </div>
      <div className="flex-1" />
      {asWindow && inElectron() && (
        <span className="text-[10px] text-white/35 font-mono mr-1">⌘⇧C</span>
      )}
      <button
        onClick={close}
        className="w-6 h-6 rounded-md hover:bg-white/10 text-white/50 hover:text-white/90 flex items-center justify-center"
        aria-label="Close"
        style={asWindow ? { WebkitAppRegion: 'no-drag' } as React.CSSProperties : undefined}
      >
        <Minus size={13} />
      </button>
    </div>
  );
}

function ProjectBanner() {
  return (
    <button
      className="w-full rounded-xl p-3 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
      style={{
        background:
          'linear-gradient(135deg, rgba(232,184,106,0.08) 0%, rgba(143,188,185,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display text-[17px] text-white/95"
        style={{
          background:
            'linear-gradient(135deg, rgba(232,184,106,0.35) 0%, rgba(201,163,227,0.25) 100%)',
          boxShadow:
            '0 0 0 1px rgba(232,184,106,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        HR
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-semibold text-white/95 leading-tight truncate">
            {PROJECT.client}
          </span>
          <ChevronDown size={13} className="text-white/40 shrink-0" />
        </div>
        <div className="text-[11.5px] text-white/55 mt-0.5 truncate">
          {PROJECT.name} · <span className="font-mono text-white/40">{PROJECT.repo}</span>
        </div>
      </div>
      <AvatarStack ids={PROJECT.team.map((t) => t.id)} size={22} />
    </button>
  );
}

function SupermodeRow() {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-2.5">
        Supermode
      </h3>
      <SupermodeButton />
    </div>
  );
}

function FooterBar({ onExpand }: { onExpand: () => void }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 border-t border-white/5"
      style={{
        background:
          'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%)',
      }}
    >
      <div className="flex items-center gap-1.5 text-[10.5px] text-white/40">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90" />
        <span>synced · 3 teammates</span>
      </div>
      <button
        onClick={onExpand}
        className="flex items-center gap-1.5 text-[11px] text-white/70 hover:text-white/95 px-2 py-1 rounded-md hover:bg-white/[0.06] transition-colors"
      >
        <Maximize2 size={11} />
        Open Project Memory
      </button>
    </div>
  );
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// Keep Mic in imports to avoid unused-import warnings when SupermodeRow renders compact variant
void Mic;
