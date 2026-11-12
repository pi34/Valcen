import { TEAMMATES } from '../data/demoData';

export function Avatar({ id, size = 20 }: { id: string; size?: number }) {
  const t = TEAMMATES.find((x) => x.id === id);
  if (!t) return null;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-[10.5px] shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${t.color}CC 0%, ${t.color}66 100%)`,
        color: '#0A0A0C',
        boxShadow: `0 0 0 1px ${t.color}33, 0 1px 2px rgba(0,0,0,0.2)`,
      }}
      title={t.name}
    >
      {t.initial}
    </span>
  );
}

export function AvatarStack({ ids, size = 18 }: { ids: string[]; size?: number }) {
  return (
    <span className="inline-flex items-center -space-x-1.5">
      {ids.map((id, i) => (
        <span
          key={id}
          style={{ zIndex: ids.length - i, boxShadow: '0 0 0 1.5px rgba(10,10,12,0.9)' }}
          className="rounded-full"
        >
          <Avatar id={id} size={size} />
        </span>
      ))}
    </span>
  );
}
