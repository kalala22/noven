import { DEVICES, FAMILIES } from "@/lib/simulator/data";
import { dp3Configs, fmtWh } from "@/lib/simulator/engine";

export default function Hero() {
  const dp3 = dp3Configs();
  const maxWh = Math.max(...dp3.map((c) => c.wh));
  const maxW = Math.max(...dp3.map((c) => c.rated));

  const stats = [
    { value: String(FAMILIES.length), label: "stations couvertes" },
    { value: String(DEVICES.length), label: "appareils référencés" },
    { value: `${fmtWh(maxWh)} Wh`, label: "capacité maximale" },
    { value: `${maxW / 1000} kW`, label: "puissance continue max." },
  ];

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-orange/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
          Simulateur EcoFlow by NOVEN
        </p>
        <h1 className="mt-4 max-w-3xl text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          L’énergie qu’il vous faut,{" "}
          <span className="text-orange">calculée en quelques secondes.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          Solutions au quotidien. Ajoutez vos appareils, indiquez l’autonomie souhaitée : le
          simulateur recommande la station EcoFlow adaptée.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#simulateur"
            className="inline-flex h-12 items-center justify-center rounded-full bg-orange px-7 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
          >
            Lancer la simulation
          </a>
          <a
            href="#gamme"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-semibold text-paper transition-colors hover:bg-white/10"
          >
            Voir la gamme
          </a>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:mt-16 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink px-4 py-5 sm:px-6">
              <dt className="text-[0.7rem] uppercase tracking-wider text-white/50 sm:text-xs">{s.label}</dt>
              <dd className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
