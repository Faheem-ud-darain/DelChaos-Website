/** A person's initials in a circle. The previews use made-up people, so there are no photos to load. */
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.38 }} className="inline-flex shrink-0 items-center justify-center rounded-full bg-surface-2 font-semibold text-fg">
      {initials}
    </span>
  );
}
