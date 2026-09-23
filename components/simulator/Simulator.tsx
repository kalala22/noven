"use client";

import { useState } from "react";
import { MARGINS } from "@/lib/simulator/data";
import { loadFromDevices, loadFromPower, simulate } from "@/lib/simulator/engine";
import DevicePicker from "./DevicePicker";
import HoursPicker from "./HoursPicker";
import ResultPanel from "./ResultPanel";

type Mode = "devices" | "power";

function StepCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-5 sm:p-7">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="text-xs font-bold tabular-nums text-orange">{step}</span>
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-paper px-4 text-base outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5 sm:text-sm";

export default function Simulator() {
  const [mode, setMode] = useState<Mode>("devices");
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [directW, setDirectW] = useState("300");
  const [directPeak, setDirectPeak] = useState("500");
  const [directType, setDirectType] = useState<"AC" | "DC">("AC");
  const [hoursText, setHoursText] = useState("");
  const [hours, setHours] = useState(0);
  const [margin, setMargin] = useState(0.2);

  const load =
    mode === "power" ? loadFromPower(directW, directPeak, directType === "DC") : loadFromDevices(selected);
  const sim = simulate(load, hours, margin);

  function addDevice(id: string, qty: number) {
    setSelected((s) => ({ ...s, [id]: (s[id] ?? 0) + qty }));
  }

  function changeQty(id: string, delta: number) {
    setSelected((s) => {
      const next = { ...s, [id]: Math.max(0, (s[id] ?? 0) + delta) };
      if (!next[id]) delete next[id];
      return next;
    });
  }

  return (
    <section id="simulateur" className="bg-mist">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">Simulateur</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">Dimensionnez votre station.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          Ce simulateur couvre uniquement : Trail 300DC, DELTA 3 1000 Air, DELTA 3 2000 Air, DELTA 3,
          DELTA Pro et DELTA Pro 3. Le Trail 300DC n’est pas proposé pour les usages Starlink.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-start lg:gap-6">
          <div className="grid gap-4">
            <StepCard step="01" title="Votre besoin">
              <div role="tablist" className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-mist p-1">
                {(
                  [
                    ["devices", "Par appareils"],
                    ["power", "Par puissance"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => setMode(m)}
                    className={`h-10 rounded-full text-sm font-semibold transition-colors ${
                      mode === m ? "bg-ink text-paper shadow-sm" : "text-muted hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {mode === "devices" ? (
                <DevicePicker selected={selected} onAdd={addDevice} onChangeQty={changeQty} />
              ) : (
                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="directW" className="mb-1.5 block text-xs font-semibold text-muted">
                        Puissance continue (W)
                      </label>
                      <input
                        id="directW"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={directW}
                        onChange={(e) => setDirectW(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="directPeak" className="mb-1.5 block text-xs font-semibold text-muted">
                        Pointe / démarrage (W)
                      </label>
                      <input
                        id="directPeak"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={directPeak}
                        onChange={(e) => setDirectPeak(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="directType" className="mb-1.5 block text-xs font-semibold text-muted">
                      Type de sortie nécessaire
                    </label>
                    <select
                      id="directType"
                      value={directType}
                      onChange={(e) => setDirectType(e.target.value as "AC" | "DC")}
                      className="h-12 w-full rounded-xl border-2 border-orange/70 bg-orange-soft px-4 text-base outline-none focus:border-orange sm:text-sm"
                    >
                      <option value="AC">230 V AC</option>
                      <option value="DC">DC / USB uniquement</option>
                    </select>
                  </div>
                </div>
              )}
            </StepCard>

            <StepCard step="02" title="Autonomie & marge">
              <div className="grid gap-4 sm:grid-cols-2">
                <HoursPicker
                  text={hoursText}
                  needsAttention={sim.status === "needHours"}
                  onChange={(text, resolved) => {
                    setHoursText(text);
                    setHours(resolved);
                  }}
                />
                <div>
                  <p id="margin-label" className="mb-1.5 text-xs font-semibold text-muted">
                    Marge de puissance
                  </p>
                  <div
                    role="radiogroup"
                    aria-labelledby="margin-label"
                    className="grid h-12 grid-cols-4 gap-1 rounded-xl bg-mist p-1"
                  >
                    {MARGINS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        role="radio"
                        aria-checked={margin === m.value}
                        onClick={() => setMargin(m.value)}
                        className={`rounded-lg text-sm font-semibold transition-colors ${
                          margin === m.value ? "bg-paper text-ink shadow-sm" : "text-muted hover:text-ink"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepCard>
          </div>

          <div className="lg:sticky lg:top-24" aria-live="polite">
            <ResultPanel sim={sim} />
          </div>
        </div>
      </div>
    </section>
  );
}
