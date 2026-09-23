"use client";

import { useState } from "react";
import { HOUR_CHOICES } from "@/lib/simulator/data";
import { filterHours, parseHours } from "@/lib/simulator/engine";
import Suggestions from "./Suggestions";

export default function HoursPicker({
  text,
  needsAttention,
  onChange,
}: {
  text: string;
  needsAttention: boolean;
  onChange: (text: string, resolved: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const items = open ? filterHours(text) : [];

  function pick(label: string) {
    const choice = HOUR_CHOICES.find((c) => c.label === label);
    if (!choice) return;
    onChange(choice.label, choice.value);
    setOpen(false);
  }

  return (
    <div className="relative">
      <label htmlFor="hours" className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-muted">
        Autonomie souhaitée
        <span className="rounded-full bg-orange px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-paper">
          obligatoire
        </span>
      </label>
      <input
        id="hours"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        role="combobox"
        aria-expanded={items.length > 0}
        aria-controls="hours-suggestions"
        aria-invalid={needsAttention}
        placeholder="Ex. 4 h ou choisir…"
        value={text}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          onChange(e.target.value, parseHours(e.target.value));
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter") {
            e.preventDefault();
            if (parseHours(text) > 0) setOpen(false);
          }
        }}
        className={`h-12 w-full rounded-xl border-2 bg-orange-soft px-4 text-base outline-none transition sm:text-sm ${
          needsAttention ? "border-orange ring-4 ring-orange/15" : "border-orange/70 focus:border-orange"
        }`}
      />
      <Suggestions
        id="hours-suggestions"
        onPick={pick}
        items={items.map((x) => ({ key: x.label, title: x.label, subtitle: x.note, tag: `${x.value} h` }))}
      />
    </div>
  );
}
