import { useState, useMemo } from 'react';
import { Search, GitBranch, Circle, Clock, FileText, Sparkles, Hash, Users, Archive, Settings } from 'lucide-react';
import { useStore } from '../store';
import { PROJECT, TEAMMATES } from '../data/demoData';
import { Avatar, AvatarStack } from './Avatar';
import { ContextGlyph } from './MenuBar';
import type { Decision } from '../types';

type Tab = 'decisions' | 'activity' | 'window';

/** Full window rendered as the entire Electron window (no modal backdrop). */
export function FullWindowStandalone() {
  const [tab, setTab] = useState<Tab>('decisions');
  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% 10%, #1A1424 0%, transparent 55%),' +
          'radial-gradient(ellipse 70% 50% at 80% 90%, #142028 0%, transparent 60%),' +
          'linear-gradient(135deg, #0A0A0C 0%, #0C0C14 100%)',
      }}
    >
      <TitleBar />
      <SideNav tab={tab} setTab={setTab} />
      <MainPane tab={tab} />
    </div>
  );
}

function TitleBar() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-11 flex items-center px-4 z-20 pointer-events-none"
      style={{
        WebkitAppRegion: 'drag',
        background:
          'linear-gradient(180deg, rgba(14,14,18,0.5) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      } as React.CSSProperties}
    >
      <div className="w-20" />
      <div className="flex-1 flex items-center justify-center gap-2 text-[12px] text-white/70">
        <ContextGlyph size={13} />
        <span className="font-medium text-white/90">Valcen</span>
        <span className="text-white/25">—</span>
        <span>{PROJECT.client} · {PROJECT.name}</span>
      </div>
      <div className="w-20" />
    </div>
  );
}

function SideNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'decisions', label: 'Decisions', icon: <FileText size={13} />, count: 23 },
    { id: 'activity', label: 'Agent activity', icon: <Sparkles size={13} />, count: 48 },
    { id: 'window', label: 'Context window', icon: <Hash size={13} /> },
  ];
  const secondary = [
    { label: 'Teammates', icon: <Users size={13} /> },
    { label: 'Archive', icon: <Archive size={13} /> },
    { label: 'Settings', icon: <Settings size={13} /> },
  ];
  return (
    <div
      className="w-[240px] shrink-0 pt-14 px-3 pb-4 flex flex-col"
      style={{
        background: 'rgba(0,0,0,0.3)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="px-2 mb-3">
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/35 font-semibold mb-1.5">
          Project
        </div>
        <div className="flex items-center gap-2 py-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-[14px] text-white/95 shrink-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,184,106,0.35) 0%, rgba(201,163,227,0.25) 100%)',
              boxShadow: '0 0 0 1px rgba(232,184,106,0.3)',
            }}
          >
            HR
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-white/95 leading-tight truncate">
              Checkout launch
            </div>
            <div className="text-[10.5px] text-white/45 font-mono truncate">
              {PROJECT.repo}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-0.5 mb-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className={
              'w-full flex items-center gap-2 py-1.5 px-2 rounded-md text-[12.5px] transition-colors ' +
              (tab === it.id
                ? 'bg-white/[0.09] text-white/95'
                : 'text-white/65 hover:text-white/95 hover:bg-white/[0.04]')
            }
          >
            <span className={tab === it.id ? 'text-amber-glow' : ''}>{it.icon}</span>
            <span className="flex-1 text-left">{it.label}</span>
            {it.count != null && (
              <span className="text-[10.5px] text-white/35 tabular-nums">{it.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/35 font-semibold px-2 mb-1">
        Workspace
      </div>
      <div className="space-y-0.5 flex-1">
        {secondary.map((it) => (
          <button
            key={it.label}
            className="w-full flex items-center gap-2 py-1.5 px-2 rounded-md text-[12.5px] text-white/55 hover:text-white/90 hover:bg-white/[0.04]"
          >
            {it.icon}
            {it.label}
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 px-2">
        <Avatar id="riya" size={22} />
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-white/90 leading-tight">
            Riya
          </div>
          <div className="text-[10.5px] text-white/40">riya@happyrobots</div>
        </div>
      </div>
    </div>
  );
}

function MainPane({ tab }: { tab: Tab }) {
  return (
    <div className="flex-1 pt-14 flex flex-col min-w-0">
      {tab === 'decisions' && <DecisionsView />}
      {tab === 'activity' && <ActivityView />}
      {tab === 'window' && <ContextWindowView />}
    </div>
  );
}

function DecisionsView() {
  const { decisions, highlightDecisionId } = useStore();
  const [selectedId, setSelectedId] = useState<string>(decisions[0]?.id);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return decisions;
    const q = query.toLowerCase();
    return decisions.filter(
      (d) => d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q),
    );
  }, [query, decisions]);

  const selected = decisions.find((d) => d.id === selectedId) ?? decisions[0];

  return (
    <div className="flex flex-1 min-h-0">
      <div className="w-[400px] shrink-0 border-r border-white/5 flex flex-col min-h-0">
        <div className="px-6 pb-3">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-display text-[28px] text-white/95 leading-none">
              Project memory
            </h1>
            <AvatarStack ids={PROJECT.team.map((t) => t.id)} size={20} />
          </div>
          <p className="text-[12px] text-white/50 mt-1.5">
            Decisions your team and their agents treat as ground truth.
          </p>
          <div className="mt-3.5 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/5">
            <Search size={13} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search decisions…"
              className="flex-1 bg-transparent outline-none text-[12.5px] text-white/90 placeholder:text-white/35"
            />
            <span className="text-[10px] text-white/35 font-mono px-1 py-0.5 rounded border border-white/8">
              ⌘K
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={
                'w-full text-left p-3 rounded-xl mb-1.5 transition-all ' +
                (selected?.id === d.id
                  ? 'bg-white/[0.08] ring-1 ring-inset ring-white/10'
                  : 'hover:bg-white/[0.04]') +
                (highlightDecisionId === d.id ? ' ring-1 ring-amber-glow/50' : '')
              }
              style={
                highlightDecisionId === d.id
                  ? { boxShadow: '0 0 24px -8px rgba(232,184,106,0.4)' }
                  : undefined
              }
            >
              <div className="flex items-start gap-2 mb-1.5">
                <Avatar id={d.author} size={18} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium text-white/95 leading-tight line-clamp-2">
                    {d.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-white/40 ml-7">
                <Clock size={9} />
                <span>{d.createdAt}</span>
                <span className="text-white/15">·</span>
                <span className="truncate">{d.source}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <DecisionDetail d={selected} />}
    </div>
  );
}

function DecisionDetail({ d }: { d: Decision }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="px-10 py-7 border-b border-white/5">
        <div className="flex items-center gap-2 text-[11px] text-white/45 mb-3">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300/90 border border-emerald-400/20 font-semibold">
            <Circle size={6} fill="currentColor" />
            Approved
          </span>
          <span>· {d.createdAt}</span>
        </div>
        <h2 className="font-display text-[34px] text-white/95 leading-[1.15] text-balance">
          {d.title}
        </h2>
        <p className="text-[14px] text-white/70 leading-[1.6] mt-3 max-w-[70ch]">{d.body}</p>
        <div className="flex items-center gap-2 mt-4">
          {d.tags?.map((t) => (
            <span
              key={t}
              className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/5 text-white/60"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="px-10 py-6 flex gap-10 flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        <div className="flex-1 min-w-0">
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-3">
            Source
          </h3>
          <div className="rounded-xl p-4 border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch size={11} className="text-white/40" />
              <span className="text-[12px] font-mono text-white/85">{d.source}</span>
            </div>
            {d.sourceDetail && (
              <div className="text-[11.5px] text-white/50 ml-5">{d.sourceDetail}</div>
            )}
            <div className="text-[12.5px] text-white/70 mt-3 pt-3 border-t border-white/5 leading-[1.55]">
              “{d.body}”
            </div>
          </div>
        </div>

        <div className="w-[300px] shrink-0">
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-3">
            Retrieval history
          </h3>
          {!d.retrievedBy?.length ? (
            <div className="text-[11.5px] text-white/40 italic">
              No agents have retrieved this yet.
            </div>
          ) : (
            <div className="space-y-2">
              {d.retrievedBy.map((r, i) => {
                const t = TEAMMATES.find((x) => x.id === r.teammate);
                return (
                  <div key={i} className="flex items-start gap-2">
                    <Avatar id={r.teammate} size={18} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] text-white/85 leading-tight">
                        <span className="font-semibold">{t?.name}’s</span>{' '}
                        <span className="font-mono text-amber-glow/85 text-[11px]">
                          {r.agent}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-white/40 mt-0.5">{r.at}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityView() {
  const { events } = useStore();
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-10 py-7">
      <h1 className="font-display text-[28px] text-white/95 mb-1">Agent activity</h1>
      <p className="text-[12px] text-white/50 mb-5">
        Every time an agent read from this project.
      </p>
      <div className="space-y-1 max-w-3xl">
        {events.map((e) => {
          const t = TEAMMATES.find((x) => x.id === e.teammate);
          return (
            <div
              key={e.id}
              className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-white/[0.03]"
            >
              <Avatar id={e.teammate} size={24} />
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] text-white/85 leading-[1.55]">
                  <span className="font-semibold text-white/95">{t?.name}’s</span>{' '}
                  agent{' '}
                  <span className="font-mono text-amber-glow/90 text-[11.5px]">
                    {e.agentName}
                  </span>{' '}
                  {e.text}
                </div>
                <div className="text-[10.5px] text-white/40 mt-0.5">{e.at}</div>
              </div>
              <span className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/55 capitalize mt-0.5">
                {e.kind}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContextWindowView() {
  const { decisions } = useStore();
  const tokensUsed = decisions.length * 148 + 1842;
  const tokensMax = 24000;
  const pct = Math.min(100, (tokensUsed / tokensMax) * 100);

  const segments = [
    { label: 'System', pct: 6, color: '#4A4A52' },
    { label: 'Project memory', pct: 32, color: '#E8B86A' },
    { label: 'Retrieved decisions', pct: 18, color: '#C9A3E3' },
    { label: 'Running context', pct: 14, color: '#8FBCB9' },
    { label: 'Free', pct: 30, color: '#1A1A1E' },
  ];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-10 py-7">
      <h1 className="font-display text-[28px] text-white/95 mb-1">Context window</h1>
      <p className="text-[12px] text-white/50 mb-6">
        Live breakdown of what Valcen is feeding to agents on this project.
      </p>

      <div className="rounded-xl p-5 border border-white/5 bg-white/[0.02] mb-5 max-w-3xl">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="font-mono text-[14px] text-white/90">
              {tokensUsed.toLocaleString()}{' '}
              <span className="text-white/40">/ {tokensMax.toLocaleString()} tokens</span>
            </div>
            <div className="text-[11px] text-white/45 mt-0.5">
              {pct.toFixed(1)}% of budget on this task
            </div>
          </div>
          <div className="text-[10.5px] text-white/40 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-glow/70" />
            auto-compacting at 85%
          </div>
        </div>

        <div className="flex h-3 w-full rounded-full overflow-hidden">
          {segments.map((s) => (
            <div
              key={s.label}
              style={{
                width: `${s.pct}%`,
                background: s.color,
                boxShadow:
                  s.label === 'Free'
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.05)'
                    : undefined,
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-sm"
                style={{ background: s.color }}
              />
              <span className="text-[11px] text-white/70">{s.label}</span>
              <span className="text-[11px] text-white/35 font-mono">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-3">
        What's loaded right now
      </h3>
      <div className="space-y-2 max-w-3xl">
        {decisions.slice(0, 5).map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5"
          >
            <Hash size={12} className="text-white/35 shrink-0" />
            <div className="flex-1 min-w-0 text-[12.5px] text-white/85 truncate">
              {d.title}
            </div>
            <span className="text-[10.5px] text-white/40 font-mono tabular-nums">
              {Math.floor(80 + Math.random() * 240)} tok
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
