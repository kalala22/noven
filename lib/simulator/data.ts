export type OutputType = "AC" | "DC";

export type Device = {
  id: string;
  name: string;
  w: number;
  peak: number;
  type: OutputType;
  aliases: string;
};

export type StationConfig = {
  wh: number;
  units: number;
  eb: number;
  label: string;
};

export type Family = {
  id: string;
  name: string;
  baseWh: number;
  rated: number;
  surge: number;
  dcOnly?: boolean;
  multi?: boolean;
  configs?: StationConfig[];
};

export const PHONE = "243825282159";

export const CONTACT = {
  site: "https://noven.cd",
  instagram: "https://instagram.com/novencd",
  facebook: "https://facebook.com/novencd",
  email: "contact@noven.cd",
  phoneDisplay: "+243 825 282 159",
  city: "Kinshasa, RDC",
};

export const DEVICES: Device[] = [
  { id: "canalbox", name: "Canalbox / routeur", w: 12, peak: 18, type: "DC", aliases: "box internet wifi modem" },
  { id: "starlinkmini", name: "Starlink Mini", w: 40, peak: 60, type: "DC", aliases: "star link mini internet" },
  { id: "starlinkstd", name: "Starlink Standard", w: 60, peak: 100, type: "AC", aliases: "star link standard" },
  { id: "phone", name: "Téléphone / smartphone", w: 15, peak: 20, type: "DC", aliases: "gsm smartphone recharge" },
  { id: "tablet", name: "Tablette", w: 20, peak: 30, type: "DC", aliases: "ipad tablette" },
  { id: "laptop", name: "Ordinateur portable", w: 65, peak: 90, type: "DC", aliases: "pc laptop macbook" },
  { id: "desktop", name: "Ordinateur de bureau", w: 150, peak: 220, type: "AC", aliases: "pc fixe desktop" },
  { id: "monitor", name: "Écran PC / moniteur", w: 30, peak: 40, type: "AC", aliases: "ecran moniteur" },
  { id: "led", name: "Lampe LED", w: 10, peak: 10, type: "AC", aliases: "ampoule éclairage" },
  { id: "tv32", name: 'TV 32"', w: 50, peak: 65, type: "AC", aliases: "television télé" },
  { id: "tv43", name: 'TV 43"', w: 75, peak: 90, type: "AC", aliases: "television télé" },
  { id: "tv55", name: 'TV 55"', w: 110, peak: 130, type: "AC", aliases: "television télé" },
  { id: "tv65", name: 'TV 65"', w: 150, peak: 180, type: "AC", aliases: "television télé grand ecran" },
  { id: "decoder", name: "Décodeur TV / Canal+", w: 20, peak: 25, type: "AC", aliases: "decodeur canal plus dstv" },
  { id: "soundbar", name: "Barre de son", w: 40, peak: 60, type: "AC", aliases: "soundbar audio" },
  { id: "ps5", name: "PlayStation 5", w: 200, peak: 250, type: "AC", aliases: "console jeu" },
  { id: "fan", name: "Ventilateur", w: 50, peak: 80, type: "AC", aliases: "fan" },
  { id: "standingfan", name: "Ventilateur sur pied", w: 65, peak: 100, type: "AC", aliases: "fan ventilateur pied" },
  { id: "fridge", name: "Réfrigérateur 120 L", w: 100, peak: 700, type: "AC", aliases: "frigo refrigerateur" },
  { id: "fridge250", name: "Réfrigérateur 250 L", w: 150, peak: 900, type: "AC", aliases: "frigo refrigerateur moyen" },
  { id: "freezer200", name: "Congélateur 200 L", w: 250, peak: 1000, type: "AC", aliases: "congelateur freezer" },
  { id: "freezer300", name: "Congélateur 300 L", w: 300, peak: 1200, type: "AC", aliases: "congelateur freezer" },
  { id: "freezer600", name: "Congélateur 600 L", w: 350, peak: 1600, type: "AC", aliases: "congelateur freezer grand" },
  { id: "cctv", name: "Kit vidéosurveillance / NVR", w: 50, peak: 70, type: "AC", aliases: "camera cctv nvr securite" },
  { id: "pos", name: "Caisse / terminal POS", w: 30, peak: 40, type: "AC", aliases: "caisse pos boutique commerce" },
  { id: "printer", name: "Imprimante laser", w: 500, peak: 1200, type: "AC", aliases: "printer imprimante bureau" },
  { id: "iron", name: "Fer à repasser", w: 800, peak: 800, type: "AC", aliases: "fer repassage" },
  { id: "coffee", name: "Cafetière", w: 900, peak: 900, type: "AC", aliases: "cafe café coffee" },
  { id: "kettle", name: "Bouilloire", w: 1800, peak: 1800, type: "AC", aliases: "kettle eau chaude" },
  { id: "microwave", name: "Micro-ondes", w: 1200, peak: 1500, type: "AC", aliases: "micro onde microwave" },
  { id: "blender", name: "Mixeur / blender", w: 500, peak: 800, type: "AC", aliases: "mixeur blender" },
  { id: "ricecooker", name: "Cuiseur à riz", w: 700, peak: 700, type: "AC", aliases: "rice cooker cuiseur riz" },
  { id: "hotplate", name: "Plaque électrique", w: 1500, peak: 1500, type: "AC", aliases: "rechaud plaque cuisson" },
  { id: "waterdispenser", name: "Fontaine à eau chaud/froid", w: 550, peak: 650, type: "AC", aliases: "fontaine eau distributeur water dispenser" },
  { id: "split9", name: "Split 9 000 BTU inverter", w: 700, peak: 1400, type: "AC", aliases: "climatiseur clim ac" },
  { id: "split12", name: "Split 12 000 BTU inverter", w: 1000, peak: 2000, type: "AC", aliases: "climatiseur clim ac" },
  { id: "split18", name: "Split 18 000 BTU inverter", w: 1600, peak: 3200, type: "AC", aliases: "climatiseur clim ac 18000" },
  { id: "pump750", name: "Pompe à eau 750 W", w: 750, peak: 2250, type: "AC", aliases: "pump pompe" },
  { id: "sewing", name: "Machine à coudre", w: 100, peak: 250, type: "AC", aliases: "couture sewing" },
  { id: "drill", name: "Perceuse 750 W", w: 750, peak: 1400, type: "AC", aliases: "drill outil" },
  { id: "grinder", name: "Meuleuse 1 000 W", w: 1000, peak: 2000, type: "AC", aliases: "grinder disqueuse" },
];

export const FAMILIES: Family[] = [
  { id: "trail", name: "TRAIL 300 DC", baseWh: 288, rated: 300, surge: 300, dcOnly: true, configs: [{ wh: 288, units: 1, eb: 0, label: "Station seule" }] },
  { id: "air1000", name: "DELTA 3 1000 Air", baseWh: 960, rated: 500, surge: 800, configs: [{ wh: 960, units: 1, eb: 0, label: "Station seule" }] },
  { id: "air2000", name: "DELTA 3 2000 Air", baseWh: 1920, rated: 1000, surge: 1500, configs: [{ wh: 1920, units: 1, eb: 0, label: "Station seule" }] },
  {
    id: "delta3", name: "DELTA 3", baseWh: 1024, rated: 1800, surge: 3600, configs: [
      { wh: 1024, units: 1, eb: 0, label: "Station seule" },
      { wh: 2048, units: 1, eb: 1, label: "+ batterie additionnelle" },
      { wh: 5120, units: 1, eb: 2, label: "Configuration étendue" },
    ],
  },
  {
    id: "deltapro", name: "DELTA Pro", baseWh: 3600, rated: 3600, surge: 7200, configs: [
      { wh: 3600, units: 1, eb: 0, label: "Station seule" },
      { wh: 7200, units: 1, eb: 1, label: "+ 1 batterie additionnelle" },
      { wh: 10800, units: 1, eb: 2, label: "+ 2 batteries additionnelles" },
    ],
  },
  { id: "deltapro3", name: "DELTA Pro 3", baseWh: 4096, rated: 4000, surge: 8000, multi: true },
];

/** Texte de présentation de la gamme (affichage uniquement, hors calcul). */
export const RANGE_NOTES: Record<string, { usage: string; extension: string }> = {
  trail: { usage: "Internet, téléphones, ordinateurs portables — sorties DC / USB uniquement.", extension: "Non extensible · non proposé pour Starlink" },
  air1000: { usage: "Box internet, éclairage, TV et petits appareils du quotidien.", extension: "Station seule" },
  air2000: { usage: "Maison connectée : TV, ordinateurs, ventilateurs, petit frigo.", extension: "Station seule" },
  delta3: { usage: "Réfrigérateur, congélateur, électroménager courant.", extension: "Jusqu’à 5 120 Wh avec batteries additionnelles" },
  deltapro: { usage: "Climatisation, pompe à eau, outils et gros électroménager.", extension: "Jusqu’à 10 800 Wh avec 2 batteries additionnelles" },
  deltapro3: { usage: "Maison entière, commerce, bureau — puissance modulable.", extension: "1 à 3 unités en parallèle · jusqu’à 2 batteries par unité" },
};

export type HourChoice = { label: string; value: number; note?: string };

export const HOUR_CHOICES: HourChoice[] = [
  { label: "Je ne sais pas", value: 4, note: "Simulation sur 4 h" },
  { label: "1 h", value: 1 },
  { label: "2 h", value: 2 },
  { label: "4 h", value: 4 },
  { label: "6 h", value: 6 },
  { label: "8 h", value: 8 },
  { label: "10 h", value: 10 },
  { label: "12 h", value: 12 },
  { label: "18 h", value: 18 },
  { label: "24 h", value: 24 },
];

export const MARGINS = [
  { value: 0, label: "0 %" },
  { value: 0.1, label: "10 %" },
  { value: 0.2, label: "20 %" },
  { value: 0.3, label: "30 %" },
];
