export type SuggestionItem = {
  key: string;
  title: string;
  subtitle?: string;
  tag: string;
};

/** Liste déroulante sous un champ. Le choix se fait au mousedown pour précéder le blur du champ. */
export default function Suggestions({
  id,
  items,
  onPick,
}: {
  id: string;
  items: SuggestionItem[];
  onPick: (key: string) => void;
}) {
  if (!items.length) return null;
  return (
    <ul
      id={id}
      role="listbox"
      className="absolute inset-x-0 top-[calc(100%+6px)] z-40 max-h-72 overflow-auto rounded-2xl border border-line bg-paper p-1.5 shadow-[0_18px_40px_rgba(10,10,10,0.14)]"
    >
      {items.map((it) => (
        <li
          key={it.key}
          role="option"
          aria-selected={false}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(it.key);
          }}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-mist"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{it.title}</p>
            {it.subtitle && <p className="mt-0.5 text-xs text-muted">{it.subtitle}</p>}
          </div>
          <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-[0.65rem] font-semibold text-muted">
            {it.tag}
          </span>
        </li>
      ))}
    </ul>
  );
}
