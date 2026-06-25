export interface FirmMeta {
  stage: string;
  check: string;
  geo: string;
}

const FIRM_META: Record<string, FirmMeta> = {
  "sequoia capital": { stage: "Seed–Growth", check: "$1M–$100M+", geo: "Global" },
  "andreessen horowitz": { stage: "Seed–Growth", check: "$1M–$500M+", geo: "US" },
  "a16z": { stage: "Seed–Growth", check: "$1M–$500M+", geo: "US" },
  "accel": { stage: "Early–Growth", check: "$5M–$100M", geo: "Global" },
  "benchmark": { stage: "Series A–B", check: "$5M–$50M", geo: "US" },
  "founders fund": { stage: "Seed–Growth", check: "$500K–$100M+", geo: "US" },
  "kleiner perkins": { stage: "Seed–Growth", check: "$1M–$100M+", geo: "US" },
  "general catalyst": { stage: "Seed–Growth", check: "$1M–$200M+", geo: "Global" },
  "lightspeed venture partners": { stage: "Seed–Growth", check: "$1M–$200M+", geo: "Global" },
  "lightspeed": { stage: "Seed–Growth", check: "$1M–$200M+", geo: "Global" },
  "index ventures": { stage: "Seed–Growth", check: "$1M–$100M+", geo: "Global" },
  "nea": { stage: "Seed–Growth", check: "$1M–$100M+", geo: "US" },
  "greylock": { stage: "Series A–B", check: "$5M–$50M", geo: "US" },
  "battery ventures": { stage: "Series A–Growth", check: "$5M–$100M", geo: "US" },
  "bessemer venture partners": { stage: "Seed–Growth", check: "$1M–$100M+", geo: "Global" },
  "redpoint ventures": { stage: "Seed–Series B", check: "$1M–$50M", geo: "US" },
  "ivp": { stage: "Series B–Growth", check: "$20M–$150M", geo: "US" },
  "insight partners": { stage: "Series B–Growth", check: "$20M–$200M+", geo: "Global" },
  "tiger global": { stage: "Series B–Growth", check: "$25M–$500M+", geo: "Global" },
  "gv": { stage: "Seed–Series B", check: "$1M–$50M", geo: "US" },
  "softbank vision fund": { stage: "Late–Growth", check: "$100M–$1B+", geo: "Global" },
  "coatue management": { stage: "Series B–Growth", check: "$20M–$500M+", geo: "Global" },
  "first round capital": { stage: "Pre-Seed–Series A", check: "$500K–$15M", geo: "US" },
  "union square ventures": { stage: "Seed–Series B", check: "$1M–$30M", geo: "US" },
  "spark capital": { stage: "Seed–Series B", check: "$1M–$30M", geo: "US" },
  "khosla ventures": { stage: "Seed–Growth", check: "$500K–$100M+", geo: "US" },
  "felicis ventures": { stage: "Seed–Series B", check: "$1M–$30M", geo: "US" },
  "lux capital": { stage: "Seed–Series B", check: "$1M–$30M", geo: "US" },
  "true ventures": { stage: "Pre-Seed–Series A", check: "$500K–$10M", geo: "US" },
  "lowercase capital": { stage: "Pre-Seed–Series A", check: "$250K–$5M", geo: "US" },
  "flatiron health": { stage: "Late", check: "$50M+", geo: "US" },
  "general atlantic": { stage: "Growth", check: "$50M–$500M+", geo: "Global" },
  "dragoneer investment group": { stage: "Growth–Late", check: "$50M–$500M+", geo: "Global" },
  "ribbit capital": { stage: "Series A–Growth", check: "$5M–$100M", geo: "Global" },
  "lowercase": { stage: "Pre-Seed–Series A", check: "$250K–$5M", geo: "US" },
  "a capital": { stage: "Seed–Series A", check: "$1M–$15M", geo: "US" },
  "social capital": { stage: "Seed–Growth", check: "$1M–$100M+", geo: "US" },
  "bain capital ventures": { stage: "Series A–Growth", check: "$5M–$100M", geo: "US" },
  "green oaks capital": { stage: "Growth", check: "$50M–$300M", geo: "US" },
  "paradigm": { stage: "Seed–Growth", check: "$1M–$200M+", geo: "Global" },
  "andreessen horowitz bio": { stage: "Series A–Growth", check: "$10M–$200M", geo: "US" },
  "neo": { stage: "Pre-Seed–Seed", check: "$100K–$3M", geo: "US" },
  "box group": { stage: "Pre-Seed–Seed", check: "$100K–$2M", geo: "US" },
  "precursor ventures": { stage: "Pre-Seed", check: "$50K–$500K", geo: "US" },
  "floodgate": { stage: "Pre-Seed–Seed", check: "$250K–$3M", geo: "US" },
  "initialized capital": { stage: "Seed–Series A", check: "$500K–$10M", geo: "US" },
  "y combinator": { stage: "Pre-Seed", check: "$500K", geo: "Global" },
  "techstars": { stage: "Pre-Seed", check: "$120K", geo: "Global" },
};

export function getFirmMeta(firm: string): FirmMeta | null {
  return FIRM_META[firm.toLowerCase()] ?? null;
}
