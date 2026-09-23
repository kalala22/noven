"use client";

import { useState } from "react";

/** Sur petit écran, la liste est repliée derrière un bouton ; à partir de `sm`, elle est toujours visible. */
export default function RangeCollapse({ count, children }: { count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 sm:mt-10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="range-list"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-full items-center justify-between rounded-2xl border border-line bg-mist px-5 text-sm font-semibold transition-colors hover:border-ink/20 sm:hidden"
      >
        {open ? "Masquer la gamme" : `Afficher toute la gamme (${count})`}
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div id="range-list" className={`${open ? "mt-4 block" : "hidden"} sm:mt-0 sm:block`}>
        {children}
      </div>
    </div>
  );
}
