"use client";

import { useState } from "react";
import { findDevice, resolveDevice, searchDevices } from "@/lib/simulator/engine";
import Suggestions from "./Suggestions";

export default function DevicePicker({
  selected,
  onAdd,
  onChangeQty,
}: {
  selected: Record<string, number>;
  onAdd: (id: string, qty: number) => void;
  onChangeQty: (id: string, delta: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [chosen, setChosen] = useState<string | null>(null);
  const [qty, setQty] = useState("1");
  const [open, setOpen] = useState(false);

  const suggestions = open ? searchDevices(search) : [];
  const entries = Object.entries(selected);

  function pick(id: string) {
    const d = findDevice(id);
    if (!d) return;
    setChosen(id);
    setSearch(d.name);
    setOpen(false);
  }

  function add() {
    const id = chosen ?? resolveDevice(search)?.id;
    if (!id) return;
    onAdd(id, Math.max(1, Number(qty) || 1));
    setChosen(null);
    setSearch("");
    setQty("1");
  }

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-2 sm:grid-cols-[minmax(0,1fr)_5rem_auto] sm:items-end">
        <div className="relative col-span-2 sm:col-span-1">
          <label htmlFor="device-search" className="mb-1.5 block text-xs font-semibold text-muted">
            Appareil
          </label>
          <input
            id="device-search"
            autoComplete="off"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls="device-suggestions"
            placeholder="Ex. Starlink, frigo, split…"
            value={search}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onChange={(e) => {
              setSearch(e.target.value);
              setChosen(null);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
                setOpen(false);
              }
              if (e.key === "Escape") setOpen(false);
            }}
            className="h-12 w-full rounded-xl border border-line bg-paper px-4 text-base outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5 sm:text-sm"
          />
          <Suggestions
            id="device-suggestions"
            onPick={pick}
            items={suggestions.map((d) => ({
              key: d.id,
              title: d.name,
              subtitle: `${d.w} W · pointe ${d.peak} W`,
              tag: d.type,
            }))}
          />
        </div>
        <div>
          <label htmlFor="device-qty" className="mb-1.5 block text-xs font-semibold text-muted">
            Qté
          </label>
          <input
            id="device-qty"
            type="number"
            min={1}
            inputMode="numeric"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="h-12 w-full rounded-xl border border-line bg-paper px-3 text-center text-base outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5 sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="h-12 self-end rounded-xl bg-ink px-6 text-sm font-semibold text-paper transition-colors hover:bg-anth"
        >
          Ajouter
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm text-muted">
          Aucun appareil ajouté.
        </p>
      ) : (
        <ul className="mt-4 grid gap-2">
          {entries.map(([id, q]) => {
            const d = findDevice(id);
            if (!d) return null;
            return (
              <li
                key={id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-mist px-3 py-2.5 sm:px-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{d.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {d.w * q} W · pointe {d.peak * q} W
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`Retirer un ${d.name}`}
                    onClick={() => onChangeQty(id, -1)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-lg font-semibold transition-colors hover:border-ink"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">{q}</span>
                  <button
                    type="button"
                    aria-label={`Ajouter un ${d.name}`}
                    onClick={() => onChangeQty(id, 1)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-lg font-semibold transition-colors hover:border-ink"
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
