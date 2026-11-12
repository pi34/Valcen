import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Image as ImageIcon, FileText, Check } from 'lucide-react';
import { useStore } from '../store';
import type { Decision } from '../types';

export function FloatingDock() {
  const { sidebarOpen, openSidebar, addPending, flashTeamUpdate } = useStore();
  const [dragOver, setDragOver] = useState(false);
  const [recent, setRecent] = useState<null | string>(null);

  function handleOpen() {
    openSidebar();
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const name = Array.from(files)
      .map((f) => f.name)
      .join(', ');
    const isImage = Array.from(files).some((f) => f.type.startsWith('image/'));
    const title = isImage ? `Screenshot captured — ${files[0].name}` : `File captured — ${name}`;
    const decision: Decision = {
      id: `d-dock-${Date.now()}`,
      title,
      body: `Dropped into Valcen dock. ${files.length} ${isImage ? 'image' : 'file'}${
        files.length > 1 ? 's' : ''
      }: ${name}. Awaiting your review before it goes to the team.`,
      source: 'Drop dock',
      sourceDetail: 'just now',
      author: 'riya',
      status: 'pending',
      createdAt: 'just now',
      tags: isImage ? ['screenshot'] : ['file'],
    };
    addPending(decision);
    flashTeamUpdate(`Dropped ${isImage ? 'a screenshot' : 'a file'} into Valcen`);
    setRecent(title);
    openSidebar();
    window.setTimeout(() => setRecent(null), 2400);
    window.setTimeout(() => flashTeamUpdate(undefined), 3400);
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: dragOver ? 240 : recent ? 240 : sidebarOpen ? 44 : 170,
        scale: dragOver ? 1.04 : 1,
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[82] overflow-hidden rounded-full glass-strong"
      style={{
        boxShadow: dragOver
          ? '0 24px 60px -18px rgba(232,184,106,0.5), 0 0 0 1px rgba(232,184,106,0.5), 0 0 40px -6px rgba(232,184,106,0.35)'
          : '0 18px 40px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
      }}
    >
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-2 px-3 py-2.5 group"
      >
        <AnimatePresence mode="wait">
          {recent ? (
            <motion.span
              key="done"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #8FBCB9 0%, #E8B86A 100%)',
              }}
            >
              <Check size={11} strokeWidth={3} className="text-[#0A0A0C]" />
            </motion.span>
          ) : (
            <motion.span
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(232,184,106,0.35) 0%, rgba(201,163,227,0.25) 100%)',
                boxShadow: '0 0 0 1px rgba(232,184,106,0.35)',
              }}
            >
              <ArrowDown size={11} className="text-amber-glow" strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!sidebarOpen || dragOver || recent ? (
            <motion.div
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden whitespace-nowrap flex items-center gap-1.5 min-w-0"
            >
              <span className="text-[11.5px] font-medium text-white/92">
                {recent
                  ? 'Captured — review in sidebar'
                  : dragOver
                  ? 'Drop to capture'
                  : 'Drop into Valcen'}
              </span>
              {!recent && !dragOver && (
                <span className="flex items-center gap-0.5 text-white/40 ml-1">
                  <ImageIcon size={10} />
                  <FileText size={10} />
                </span>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
