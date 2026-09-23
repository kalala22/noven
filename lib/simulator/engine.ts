import { DEVICES, FAMILIES, HOUR_CHOICES, type Family, type StationConfig } from "./data";

export type Load = {
  w: number;
  peak: number;
  allDC: boolean;
  canalboxQty: number;
  starlinkQty: number;
};

export type Candidate = {
  family: Family;
  config: StationConfig;
  rated: number;
  surge: number;
  compatiblePower: boolean;
  compatiblePeak: boolean;
  compatibleType: boolean;
  usable: number;
  runtime: number;
  energyOK: boolean;
  reqPower: number;
  effectiveW: number;
  effectivePeak: number;
  trailCanalbox: boolean;
};

export type Simulation =
  | { status: "empty" }
  | { status: "needHours" }
  | { status: "custom"; load: Load; margin: number; hours: number }
  | { status: "ok"; best: Candidate; compatible: Candidate[] };

const RESERVE = 0.9;

export function norm(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function findDevice(id: string) {
  return DEVICES.find((d) => d.id === id);
}

export function searchDevices(query: string) {
  const q = norm(query);
  const arr = DEVICES.filter((d) => !q || norm(d.name + " " + d.aliases).includes(q));
  return (q ? arr : arr.slice(0, 9)).slice(0, 10);
}

/** Résout le texte saisi en appareil : correspondance exacte, puis partielle. */
export function resolveDevice(query: string) {
  const txt = norm(query);
  if (!txt) return undefined;
  return (
    DEVICES.find((d) => norm(d.name) === txt) ??
    DEVICES.find((d) => norm(d.name + " " + d.aliases).includes(txt))
  );
}

export function filterHours(text: string) {
  const q = text.trim().toLowerCase();
  if (!q || q === "je ne sais pas") return HOUR_CHOICES;
  const numeric = q.replace(",", ".").replace(/[^0-9.]/g, "");
  return HOUR_CHOICES.filter(
    (x) => x.label.toLowerCase().includes(q) || (numeric && String(x.value).startsWith(numeric)),
  );
}

export function parseHours(text: string) {
  const numeric = parseFloat(text.trim().replace(",", "."));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

export function loadFromDevices(selected: Record<string, number>): Load {
  let w = 0, peak = 0, allDC = true, canalboxQty = 0, starlinkQty = 0;
  for (const [id, q] of Object.entries(selected)) {
    const d = findDevice(id);
    if (!d) continue;
    w += d.w * q;
    peak += d.peak * q;
    if (d.type !== "DC") allDC = false;
    if (id === "canalbox") canalboxQty += q;
    if (id === "starlinkmini" || id === "starlinkstd") starlinkQty += q;
  }
  return { w, peak, allDC, canalboxQty, starlinkQty };
}

export function loadFromPower(directW: string, directPeak: string, dcOnly: boolean): Load {
  const w = Math.max(0, Number(directW) || 0);
  const peak = Math.max(w, Number(directPeak) || w);
  return { w, peak, allDC: dcOnly, canalboxQty: 0, starlinkQty: 0 };
}

type Dp3Config = StationConfig & { rated: number; surge: number };

function plural(eb: number) {
  return `${eb} batterie${eb > 1 ? "s" : ""} additionnelle${eb > 1 ? "s" : ""}`;
}

export function dp3Configs(): Dp3Config[] {
  const arr: Dp3Config[] = [];
  for (let units = 1; units <= 3; units++) {
    for (let eb = 0; eb <= 2 * units; eb++) {
      arr.push({
        wh: (units + eb) * 4096,
        units,
        eb,
        rated: units * 4000,
        surge: units * 8000,
        label:
          units === 1
            ? eb === 0 ? "Station seule" : `+ ${plural(eb)}`
            : `${units} × DELTA Pro 3${eb ? ` + ${plural(eb)}` : ""}`,
      });
    }
  }
  return arr;
}

export function candidates(L: Load, hours: number, margin: number): Candidate[] {
  const all: Candidate[] = [];
  for (const f of FAMILIES) {
    const isTrail = f.id === "trail";
    const canalQty = L.canalboxQty;

    // Exception NOVEN : avec TRAIL 300 DC, Canalbox est compté à 4 W
    // en alimentation DC directe. Les autres stations conservent 12 W.
    const effectiveW = isTrail ? Math.max(0, L.w - (12 - 4) * canalQty) : L.w;
    const effectivePeak = isTrail ? Math.max(effectiveW, L.peak - (18 - 4) * canalQty) : L.peak;
    const eff = L.allDC ? 0.92 : 0.85;
    const reqPower = effectiveW * (1 + margin);
    const trailBlockedByStarlink = isTrail && L.starlinkQty > 0;

    const push = (config: StationConfig, rated: number, surge: number, compatibleType: boolean, trailCanalbox: boolean) => {
      const usable = config.wh * eff * RESERVE;
      all.push({
        family: f, config, rated, surge,
        compatiblePower: reqPower <= rated,
        compatiblePeak: effectivePeak <= surge,
        compatibleType,
        usable,
        runtime: effectiveW ? usable / effectiveW : 999,
        energyOK: usable >= effectiveW * hours,
        reqPower, effectiveW, effectivePeak, trailCanalbox,
      });
    };

    if (f.multi) {
      dp3Configs().forEach((c) => push(c, c.rated, c.surge, true, false));
    } else {
      const compatibleType = !(f.dcOnly && !L.allDC) && !trailBlockedByStarlink;
      f.configs?.forEach((c) => push(c, f.rated, f.surge, compatibleType, isTrail && canalQty > 0));
    }
  }
  return all;
}

function isCompatible(x: Candidate) {
  return x.compatiblePower && x.compatiblePeak && x.compatibleType;
}

export function rank(list: Candidate[]) {
  return [...list].sort((a, b) => {
    const aOK = isCompatible(a), bOK = isCompatible(b);
    if (aOK !== bOK) return Number(bOK) - Number(aOK);
    if (a.energyOK !== b.energyOK) return Number(b.energyOK) - Number(a.energyOK);
    if (a.config.units !== b.config.units) return a.config.units - b.config.units;
    if (a.config.wh !== b.config.wh) return a.config.wh - b.config.wh;
    return a.rated - b.rated;
  });
}

/** Options compatibles, dédoublonnées, dans l'ordre du classement. */
function uniqueCompatible(list: Candidate[]) {
  const seen = new Set<string>();
  return list.filter(isCompatible).filter((x) => {
    const key = `${x.family.id}-${x.config.units}-${x.config.eb}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function simulate(L: Load, hours: number, margin: number): Simulation {
  if (!(L.w > 0)) return { status: "empty" };
  if (!(hours > 0)) return { status: "needHours" };

  const list = rank(candidates(L, hours, margin));
  const best = list.find((x) => isCompatible(x) && x.energyOK);
  // Si aucune configuration modélisée ne couvre le besoin, ne pas recommander
  // une solution insuffisante : renvoi vers NOVEN pour étude personnalisée.
  if (!best) return { status: "custom", load: L, margin, hours };
  return { status: "ok", best, compatible: uniqueCompatible(list) };
}

export function fmtH(h: number) {
  if (!isFinite(h)) return "—";
  return h < 1 ? `${Math.max(1, Math.round(h * 60))} min` : `${h.toFixed(1).replace(".", ",")} h`;
}

export function fmtWh(wh: number) {
  return wh.toLocaleString("fr-FR");
}
