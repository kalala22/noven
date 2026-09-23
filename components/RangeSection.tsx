import { FAMILIES, RANGE_NOTES } from "@/lib/simulator/data";
import { fmtWh } from "@/lib/simulator/engine";

export default function RangeSection() {
  return (
    <section id="gamme" className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">La gamme</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
          Six stations EcoFlow, un usage chacune.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Le simulateur choisit parmi ces configurations. Au-delà, NOVEN réalise un
          dimensionnement personnalisé.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FAMILIES.map((f) => {
            const note = RANGE_NOTES[f.id];
            return (
              <li
                key={f.id}
                className="group flex flex-col rounded-3xl border border-line bg-mist p-6 transition-colors hover:border-ink/20 hover:bg-paper"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold tracking-tight">{f.name}</h3>
                  {f.dcOnly && (
                    <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-semibold text-paper">
                      DC
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{note?.usage}</p>

                <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-line pt-5">
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-wider text-muted">Capacité</dt>
                    <dd className="mt-1 text-sm font-bold">{fmtWh(f.baseWh)} Wh</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-wider text-muted">Puissance</dt>
                    <dd className="mt-1 text-sm font-bold">{fmtWh(f.rated)} W</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-wider text-muted">Pointe</dt>
                    <dd className="mt-1 text-sm font-bold">{fmtWh(f.surge)} W</dd>
                  </div>
                </dl>
                <p className="mt-auto pt-5 text-xs font-medium text-ink/70">{note?.extension}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
