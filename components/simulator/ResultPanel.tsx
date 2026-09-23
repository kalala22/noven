"use client";

import { useState } from "react";
import { PHONE } from "@/lib/simulator/data";
import { fmtH, fmtWh, type Simulation } from "@/lib/simulator/engine";

function waLink(text: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}

function Note({ title, children, tone = "orange" }: { title: string; children: React.ReactNode; tone?: "orange" | "slate" }) {
  const styles =
    tone === "orange"
      ? "border-orange/40 bg-orange/10"
      : "border-white/15 bg-white/5";
  return (
    <div className={`mt-3 rounded-2xl border px-4 py-3 text-xs leading-relaxed sm:text-[0.8rem] ${styles}`}>
      <p className="mb-1 font-semibold text-paper">{title}</p>
      <p className="text-white/75">{children}</p>
    </div>
  );
}

function Metrics({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-6 grid grid-cols-2 gap-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
          <dt className="text-[0.65rem] uppercase tracking-wider text-white/55">{label}</dt>
          <dd className="mt-1 text-base font-bold tabular-nums sm:text-lg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ResultPanel({ sim }: { sim: Simulation }) {
  const [showAll, setShowAll] = useState(false);

  if (sim.status === "empty" || sim.status === "needHours") {
    return (
      <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">03 · Recommandation</p>
        <p className="mt-4 text-lg font-semibold tracking-tight">
          {sim.status === "empty"
            ? "Ajoutez vos appareils ou saisissez votre puissance."
            : "Saisissez l’autonomie souhaitée ou choisissez une valeur dans la liste."}
        </p>
        <p className="mt-2 text-sm text-muted">La station recommandée apparaîtra ici.</p>
      </div>
    );
  }

  if (sim.status === "custom") {
    const { load, margin, hours } = sim;
    const text = `Bonjour NOVEN, le Simulateur EcoFlow indique qu’un dimensionnement personnalisé est nécessaire. Charge continue : ${Math.round(load.w)} W ; pointe : ${Math.round(load.peak)} W ; durée recherchée : ${hours} h.`;
    return (
      <div className="rounded-3xl bg-ink p-6 text-paper sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Solution recommandée</p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Dimensionnement personnalisé NOVEN</h3>
        <p className="mt-2 text-sm text-white/70">Le besoin dépasse les configurations couvertes par ce simulateur.</p>
        <Metrics
          items={[
            ["Charge continue", `${Math.round(load.w)} W`],
            ["Charge dimensionnée", `${Math.round(load.w * (1 + margin))} W`],
            ["Pointe", `${Math.round(load.peak)} W`],
            ["Autonomie", `${hours.toString().replace(".", ",")} h demandées`],
          ]}
        />
        <Note title="Étude nécessaire">
          Cette demande dépasse la capacité, la puissance ou l’autonomie maximale des configurations
          EcoFlow intégrées ici. Contactez NOVEN pour un dimensionnement adapté.
        </Note>
        <a
          href={waLink(text)}
          target="_blank"
          rel="noopener"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-orange px-6 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
        >
          Contacter NOVEN pour dimensionnement
        </a>
      </div>
    );
  }

  const { best, compatible } = sim;
  const capacityExtended = best.config.eb > 0 || (best.family.id === "delta3" && best.config.wh > best.family.baseWh);
  const powerExtended = best.family.id === "deltapro3" && best.config.units > 1;
  const text = `Bonjour NOVEN, je souhaite cette configuration : ${best.family.name} — ${best.config.label} — ${best.config.wh} Wh — charge estimée ${Math.round(best.effectiveW)} W — autonomie ${fmtH(best.runtime)}.`;
  const shown = compatible.slice(0, showAll ? 10 : 4);

  return (
    <div className="grid gap-4">
      <div className="rounded-3xl bg-ink p-6 text-paper sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Solution recommandée</p>
        <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{best.family.name}</h3>
        <p className="mt-2 text-sm font-medium text-white/75">
          {best.config.label} · <span className="text-orange">{fmtWh(best.config.wh)} Wh</span>
        </p>

        <Metrics
          items={[
            ["Charge continue", `${Math.round(best.effectiveW)} W`],
            ["Charge dimensionnée", `${Math.round(best.reqPower)} W`],
            ["Pointe", `${Math.round(best.effectivePeak)} W`],
            ["Autonomie estimée", fmtH(best.runtime)],
          ]}
        />

        {capacityExtended && (
          <Note title="Extension d’autonomie nécessaire">
            {best.config.label}. Capacité installée : {fmtWh(best.config.wh)} Wh.
          </Note>
        )}
        {powerExtended && (
          <Note title="Extension de puissance nécessaire" tone="slate">
            {best.config.units} DELTA Pro 3 en parallèle permettent de viser environ{" "}
            {(best.rated / 1000).toFixed(0)} kW continus. Configuration parallèle 230 V à valider avec
            NOVEN avant commande.
          </Note>
        )}
        {best.trailCanalbox && (
          <Note title="Exception Canalbox">
            Avec le Trail 300 DC, le simulateur retient 4 W pour Canalbox lorsqu’il est alimenté
            directement en DC. Pour les solutions utilisant l’alimentation AC du Canalbox, la valeur de
            référence reste 12 W.
          </Note>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <a
            href={waLink(text)}
            target="_blank"
            rel="noopener"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-orange px-6 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
          >
            Demander cette configuration
          </a>
          <a
            href="#comparer"
            className="flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-paper transition-colors hover:bg-white/10"
          >
            Comparer
          </a>
        </div>
      </div>

      <div id="comparer" className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
        <h3 className="text-base font-bold tracking-tight">Autres options</h3>
        <ul className="mt-4 grid gap-2">
          {shown.map((x) => {
            const isBest = x === best;
            const capExtra = x.config.eb > 0 ? ` · ${x.config.eb} batt. add.` : "";
            const powerExtra =
              x.family.id === "deltapro3" && x.config.units > 1 ? ` · ${x.config.units} unités` : "";
            return (
              <li
                key={`${x.family.id}-${x.config.units}-${x.config.eb}`}
                className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-2xl border px-4 py-3 ${
                  isBest ? "border-orange bg-orange-soft" : "border-line bg-mist"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {x.family.name}
                    {isBest && (
                      <span className="ml-2 rounded-full bg-orange px-2 py-0.5 align-middle text-[0.6rem] font-bold uppercase text-paper">
                        Recommandé
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {fmtWh(x.config.wh)} Wh{capExtra}
                    {powerExtra}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">{fmtH(x.runtime)}</p>
                  <p className={`text-[0.7rem] font-semibold ${x.energyOK ? "text-ok" : "text-warn"}`}>
                    {x.energyOK ? "Objectif atteint" : "Autonomie inférieure"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        {compatible.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="mt-3 w-full rounded-full py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-mist hover:text-ink"
          >
            {showAll ? "Réduire" : "Afficher plus"}
          </button>
        )}
      </div>
    </div>
  );
}
