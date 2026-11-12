import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Image as ImageIcon, ArrowUp, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { DEMO_DECISION_SUGGESTIONS } from '../data/demoData';
import type { Decision } from '../types';

export function DropArea() {
  const { addPending, pendingReview } = useStore();
  const [text, setText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [focused, setFocused] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-focus the input on first render for the demo
  useEffect(() => {
    if (pendingReview.length === 0) {
      taRef.current?.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function submit() {
    const value = text.trim();
    if (!value) return;
    setExtracting(true);
    setText('');
    setTimeout(() => {
      const decision: Decision = {
        id: `d-${Math.random().toString(36).slice(2, 8)}`,
        title: titleize(value),
        body: value,
        source: 'Dropped by you',
        sourceDetail: 'Sidebar · just now',
        author: 'riya',
        status: 'pending',
        createdAt: 'just now',
        tags: inferTags(value),
      };
      addPending(decision);
      setExtracting(false);
    }, 900);
  }

  function useSuggestion(s: string) {
    setText(s);
    taRef.current?.focus();
  }

  const prominent = pendingReview.length === 0 && !text && !extracting;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold">
          Drop something your team should know
        </h3>
        {extracting && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 text-[10.5px] shimmer-text font-semibold"
          >
            <Sparkles size={10} /> extracting
          </motion.span>
        )}
      </div>
      <motion.div
        className="rounded-2xl p-3.5"
        animate={{
          boxShadow: extracting
            ? '0 0 0 1px rgba(232,184,106,0.5), 0 0 42px -8px rgba(232,184,106,0.42)'
            : focused || prominent
            ? '0 0 0 1px rgba(232,184,106,0.35), 0 0 32px -12px rgba(232,184,106,0.25)'
            : '0 0 0 1px rgba(255,255,255,0.08)',
          background: focused || prominent
            ? 'linear-gradient(135deg, rgba(232,184,106,0.06) 0%, rgba(255,255,255,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        }}
        transition={{ duration: 0.3 }}
      >
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={
            prominent
              ? 'e.g. “Shipping defaults to billing on first order”'
              : 'What should your team remember?'
          }
          className="w-full bg-transparent resize-none outline-none text-[14px] text-white/95 placeholder:text-white/35 leading-[1.5] font-medium"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1">
            <IconChip label="Attach"><Paperclip size={12.5} /></IconChip>
            <IconChip label="Screenshot"><ImageIcon size={12.5} /></IconChip>
            <span className="text-[10px] text-white/30 ml-1 font-mono">↵ to share</span>
          </div>
          <motion.button
            onClick={submit}
            disabled={!text.trim() || extracting}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center w-7 h-7 rounded-full font-medium disabled:opacity-25 transition-opacity"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,184,106,0.95) 0%, rgba(201,163,227,0.9) 100%)',
              color: '#1A1A1E',
              boxShadow: text.trim() ? '0 4px 14px -4px rgba(232,184,106,0.6)' : 'none',
            }}
            aria-label="Share"
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>

      {prominent && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-2.5"
        >
          <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1.5">
            Or try one of these
          </div>
          <div className="flex flex-col gap-1.5">
            {DEMO_DECISION_SUGGESTIONS.slice(0, 2).map((s) => (
              <button
                key={s}
                onClick={() => useSuggestion(s)}
                className="text-left text-[12px] px-3 py-2 rounded-xl border border-white/8 bg-white/[0.02] text-white/65 hover:text-white/95 hover:bg-white/[0.05] hover:border-white/15 transition-all leading-[1.45]"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function IconChip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      className="flex items-center justify-center text-white/40 hover:text-white/80 transition-colors w-6 h-6 rounded-md hover:bg-white/[0.05]"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function titleize(s: string): string {
  const first = s.split(/[\n.]/)[0].trim();
  return first.length > 72 ? first.slice(0, 72).trimEnd() + '…' : first;
}

function inferTags(s: string): string[] {
  const t: string[] = [];
  const lower = s.toLowerCase();
  if (/checkout|pay|cart|order/.test(lower)) t.push('checkout');
  if (/auth|login|session|guest/.test(lower)) t.push('auth');
  if (/accessi|a11y|aria|wcag/.test(lower)) t.push('a11y');
  if (/security|pci|csp|script/.test(lower)) t.push('security');
  if (/promo|coupon|discount/.test(lower)) t.push('promo');
  if (/ship|address/.test(lower)) t.push('checkout');
  if (!t.length) t.push('general');
  return Array.from(new Set(t)).slice(0, 3);
}
