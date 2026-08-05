export type AvatarTone = 'active' | 'pending';

export interface AvatarProps {
  /** Full name; the first character is used as the initial shown. */
  name: string;
  tone?: AvatarTone;
}

const TONE_CLASSES: Record<AvatarTone, string> = {
  active: 'bg-brand-brown',
  pending: 'bg-brand-bronze',
};

/** Circular initial avatar — member list rows and the login mark. */
export function Avatar({ name, tone = 'active' }: AvatarProps) {
  return (
    <div
      role="img"
      aria-label={name}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white font-heading ${TONE_CLASSES[tone]}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
