import { motion } from 'framer-motion';
import { Battery, Wifi, Search } from 'lucide-react';
import { useStore } from '../store';
import { useEffect, useState } from 'react';

export function MenuBar() {
  const { sidebarOpen, toggleSidebar, supermodeRecording } = useStore();
  const [time, setTime] = useState(() => formatTime());

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-7 glass-strong flex items-center px-3 text-[12px] text-white/80 z-50"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 0,
        background:
          'linear-gradient(180deg, rgba(14,14,18,0.72) 0%, rgba(14,14,18,0.56) 100%)',
      }}
    >
      <div className="flex items-center gap-4">
        <span className="font-semibold text-white/95"></span>
        <span className="font-semibold">Valcen</span>
        <span className="text-white/55">File</span>
        <span className="text-white/55">Edit</span>
        <span className="text-white/55">Project</span>
        <span className="text-white/55">Agents</span>
        <span className="text-white/55">Window</span>
        <span className="text-white/55">Help</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <ContextMenuBarIcon
          active={sidebarOpen}
          recording={supermodeRecording}
          onClick={toggleSidebar}
        />
        <Search size={13} className="text-white/70" />
        <Wifi size={13} className="text-white/70" />
        <Battery size={14} className="text-white/70" />
        <span className="text-white/80 tabular-nums">{time}</span>
      </div>
    </div>
  );
}

function ContextMenuBarIcon({
  active,
  recording,
  onClick,
}: {
  active: boolean;
  recording: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center gap-1.5 px-1.5 py-0.5 rounded-md"
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      transition={{ duration: 0.15 }}
      aria-label="Toggle Valcen sidebar"
    >
      <ContextGlyph size={14} />
      <span className="text-[11.5px] font-medium text-white/90 tracking-tight">
        {recording ? 'Supermode' : 'Valcen'}
      </span>
      {recording && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-red-500 record-pulse ml-0.5"
          aria-hidden
        />
      )}
      {active && !recording && (
        <motion.span
          layoutId="menubarActive"
          className="absolute inset-0 rounded-md"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset' }}
        />
      )}
    </motion.button>
  );
}

export function ContextGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="20" y2="20">
          <stop offset="0" stopColor="#E8B86A" />
          <stop offset="1" stopColor="#C9A3E3" />
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="7.5" stroke="url(#cg)" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="3.2" fill="url(#cg)" />
      <circle cx="10" cy="10" r="7.5" stroke="url(#cg)" strokeOpacity="0.2" strokeWidth="3" />
    </svg>
  );
}

function formatTime() {
  const d = new Date();
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day}  ${t}`;
}
