// Shared country metadata for frontend components.
// Mirrors the backend countries.mjs list.

export interface CountryMeta {
  code: string;
  name: string;
  cuisine: string;
  emoji: string;
  continent: string;
  difficulty: number;
}

export const COUNTRIES: CountryMeta[] = [
  { code: "IT", name: "Italy",          cuisine: "Italian",       emoji: "🍝", continent: "Europe",   difficulty: 1 },
  { code: "JP", name: "Japan",          cuisine: "Japanese",      emoji: "🍣", continent: "Asia",     difficulty: 2 },
  { code: "IN", name: "India",          cuisine: "Indian",        emoji: "🍛", continent: "Asia",     difficulty: 2 },
  { code: "MX", name: "Mexico",         cuisine: "Mexican",       emoji: "🌮", continent: "Americas", difficulty: 1 },
  { code: "FR", name: "France",         cuisine: "French",        emoji: "🥐", continent: "Europe",   difficulty: 2 },
  { code: "CN", name: "China",          cuisine: "Chinese",       emoji: "🥟", continent: "Asia",     difficulty: 1 },
  { code: "TH", name: "Thailand",       cuisine: "Thai",          emoji: "🍜", continent: "Asia",     difficulty: 2 },
  { code: "GR", name: "Greece",         cuisine: "Greek",         emoji: "🫒", continent: "Europe",   difficulty: 1 },
  { code: "ES", name: "Spain",          cuisine: "Spanish",       emoji: "🥘", continent: "Europe",   difficulty: 1 },
  { code: "MA", name: "Morocco",        cuisine: "Moroccan",      emoji: "🫙", continent: "Africa",   difficulty: 2 },
  { code: "ET", name: "Ethiopia",       cuisine: "Ethiopian",     emoji: "🫓", continent: "Africa",   difficulty: 3 },
  { code: "NG", name: "Nigeria",        cuisine: "Nigerian",      emoji: "🍲", continent: "Africa",   difficulty: 2 },
  { code: "EG", name: "Egypt",          cuisine: "Egyptian",      emoji: "🧆", continent: "Africa",   difficulty: 1 },
  { code: "ZA", name: "South Africa",   cuisine: "South African", emoji: "🥩", continent: "Africa",   difficulty: 2 },
  { code: "SN", name: "Senegal",        cuisine: "Senegalese",    emoji: "🍚", continent: "Africa",   difficulty: 3 },
  { code: "GH", name: "Ghana",          cuisine: "Ghanaian",      emoji: "🍛", continent: "Africa",   difficulty: 2 },
  { code: "TN", name: "Tunisia",        cuisine: "Tunisian",      emoji: "🌶️", continent: "Africa",   difficulty: 2 },
  { code: "KE", name: "Kenya",          cuisine: "Kenyan",        emoji: "🍖", continent: "Africa",   difficulty: 2 },
  { code: "CM", name: "Cameroon",       cuisine: "Cameroonian",   emoji: "🍲", continent: "Africa",   difficulty: 3 },
  { code: "BR", name: "Brazil",         cuisine: "Brazilian",     emoji: "🥩", continent: "Americas", difficulty: 1 },
  { code: "PE", name: "Peru",           cuisine: "Peruvian",      emoji: "🍋", continent: "Americas", difficulty: 3 },
  { code: "AR", name: "Argentina",      cuisine: "Argentine",     emoji: "🥩", continent: "Americas", difficulty: 1 },
  { code: "CO", name: "Colombia",       cuisine: "Colombian",     emoji: "🫘", continent: "Americas", difficulty: 2 },
  { code: "CU", name: "Cuba",           cuisine: "Cuban",         emoji: "🍖", continent: "Americas", difficulty: 2 },
  { code: "JM", name: "Jamaica",        cuisine: "Jamaican",      emoji: "🌶️", continent: "Americas", difficulty: 2 },
  { code: "CL", name: "Chile",          cuisine: "Chilean",       emoji: "🫘", continent: "Americas", difficulty: 2 },
  { code: "US", name: "United States",  cuisine: "American",      emoji: "🍔", continent: "Americas", difficulty: 1 },
  { code: "CA", name: "Canada",         cuisine: "Canadian",      emoji: "🍁", continent: "Americas", difficulty: 1 },
  { code: "TR", name: "Turkey",         cuisine: "Turkish",       emoji: "🥙", continent: "Europe",   difficulty: 2 },
  { code: "LB", name: "Lebanon",        cuisine: "Lebanese",      emoji: "🧆", continent: "Asia",     difficulty: 2 },
  { code: "IR", name: "Iran",           cuisine: "Persian",       emoji: "🍚", continent: "Asia",     difficulty: 3 },
  { code: "IQ", name: "Iraq",           cuisine: "Iraqi",         emoji: "🍖", continent: "Asia",     difficulty: 3 },
  { code: "SA", name: "Saudi Arabia",   cuisine: "Saudi",         emoji: "🍖", continent: "Asia",     difficulty: 2 },
  { code: "VN", name: "Vietnam",        cuisine: "Vietnamese",    emoji: "🍜", continent: "Asia",     difficulty: 2 },
  { code: "KR", name: "South Korea",    cuisine: "Korean",        emoji: "🥢", continent: "Asia",     difficulty: 2 },
  { code: "PH", name: "Philippines",    cuisine: "Filipino",      emoji: "🍖", continent: "Asia",     difficulty: 2 },
  { code: "ID", name: "Indonesia",      cuisine: "Indonesian",    emoji: "🍚", continent: "Asia",     difficulty: 2 },
  { code: "MY", name: "Malaysia",       cuisine: "Malaysian",     emoji: "🍜", continent: "Asia",     difficulty: 2 },
  { code: "SG", name: "Singapore",      cuisine: "Singaporean",   emoji: "🦞", continent: "Asia",     difficulty: 2 },
  { code: "PK", name: "Pakistan",       cuisine: "Pakistani",     emoji: "🍛", continent: "Asia",     difficulty: 2 },
  { code: "BD", name: "Bangladesh",     cuisine: "Bangladeshi",   emoji: "🐟", continent: "Asia",     difficulty: 3 },
  { code: "LK", name: "Sri Lanka",      cuisine: "Sri Lankan",    emoji: "🌴", continent: "Asia",     difficulty: 3 },
  { code: "NP", name: "Nepal",          cuisine: "Nepali",        emoji: "🍲", continent: "Asia",     difficulty: 2 },
  { code: "MM", name: "Myanmar",        cuisine: "Burmese",       emoji: "🍜", continent: "Asia",     difficulty: 3 },
  { code: "KH", name: "Cambodia",       cuisine: "Cambodian",     emoji: "🍚", continent: "Asia",     difficulty: 3 },
  { code: "GB", name: "United Kingdom", cuisine: "British",       emoji: "🫖", continent: "Europe",   difficulty: 1 },
  { code: "DE", name: "Germany",        cuisine: "German",        emoji: "🌭", continent: "Europe",   difficulty: 1 },
  { code: "PT", name: "Portugal",       cuisine: "Portuguese",    emoji: "🐟", continent: "Europe",   difficulty: 1 },
  { code: "PL", name: "Poland",         cuisine: "Polish",        emoji: "🥣", continent: "Europe",   difficulty: 2 },
  { code: "RU", name: "Russia",         cuisine: "Russian",       emoji: "🥣", continent: "Europe",   difficulty: 2 },
  { code: "UA", name: "Ukraine",        cuisine: "Ukrainian",     emoji: "🥣", continent: "Europe",   difficulty: 2 },
  { code: "HU", name: "Hungary",        cuisine: "Hungarian",     emoji: "🫕", continent: "Europe",   difficulty: 2 },
  { code: "RO", name: "Romania",        cuisine: "Romanian",      emoji: "🥩", continent: "Europe",   difficulty: 2 },
  { code: "SE", name: "Sweden",         cuisine: "Swedish",       emoji: "🐟", continent: "Europe",   difficulty: 1 },
  { code: "AU", name: "Australia",      cuisine: "Australian",    emoji: "🦘", continent: "Oceania",  difficulty: 1 },
  { code: "NZ", name: "New Zealand",    cuisine: "Kiwi",          emoji: "🥝", continent: "Oceania",  difficulty: 1 },
  { code: "FJ", name: "Fiji",           cuisine: "Fijian",        emoji: "🐟", continent: "Oceania",  difficulty: 3 },
  { code: "IL", name: "Israel",         cuisine: "Israeli",       emoji: "🧆", continent: "Asia",     difficulty: 1 },
  { code: "GE", name: "Georgia",        cuisine: "Georgian",      emoji: "🥟", continent: "Europe",   difficulty: 3 },
  { code: "UZ", name: "Uzbekistan",     cuisine: "Uzbek",         emoji: "🍚", continent: "Asia",     difficulty: 3 },
  { code: "KZ", name: "Kazakhstan",     cuisine: "Kazakh",        emoji: "🥩", continent: "Asia",     difficulty: 3 },
  { code: "MN", name: "Mongolia",       cuisine: "Mongolian",     emoji: "🥩", continent: "Asia",     difficulty: 3 },
];

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));
const byName = new Map(COUNTRIES.map((c) => [normalizeName(c.name), c]));

const NAME_ALIASES: Record<string, string> = {
  "united states of america": "US",
  "united states": "US",
  "usa": "US",
  "u.s.a.": "US",
  "u.s.": "US",
  "united kingdom": "GB",
  "great britain": "GB",
  "uk": "GB",
  "england": "GB",
  "south korea": "KR",
  "korea": "KR",
  "republic of korea": "KR",
  "dem. rep. korea": "KR",
  "russia": "RU",
  "russian federation": "RU",
  "iran": "IR",
  "iran (islamic republic of)": "IR",
  "viet nam": "VN",
  "vietnam": "VN",
  "myanmar": "MM",
  "burma": "MM",
  "lao pdr": "LA",
  "czech republic": "CZ",
  "czechia": "CZ",
  "bolivia": "BO",
  "tanzania": "TZ",
  "syria": "SY",
  "palestine": "PS",
  "west bank": "PS",
  "n. cyprus": "CY",
  "somaliland": "SO",
  "eswatini": "SZ",
  "swaziland": "SZ",
  "cote d'ivoire": "CI",
  "ivory coast": "CI",
  "democratic republic of the congo": "CD",
  "dem. rep. congo": "CD",
  "congo": "CG",
  "south sudan": "SS",
  "s. sudan": "SS",
  "central african rep.": "CF",
  "eq. guinea": "GQ",
  "solomon is.": "SB",
  "falkland is.": "FK",
  "w. sahara": "EH",
  "bosnia and herz.": "BA",
  "north macedonia": "MK",
  "macedonia": "MK",
};

const aliasByName = new Map(
  Object.entries(NAME_ALIASES).map(([alias, code]) => [normalizeName(alias), code])
);

export function getCountry(code: string): CountryMeta | undefined {
  if (!code) return undefined;
  return byCode.get(code.toUpperCase());
}

export function getCountryByName(name: string): CountryMeta | undefined {
  const key = normalizeName(name);
  if (!key) return undefined;
  const aliasCode = aliasByName.get(key);
  return byName.get(key) ?? (aliasCode ? getCountry(aliasCode) : undefined);
}

/** Map Natural Earth / world-atlas feature props to an ISO-2 code we can use. */
export function resolveMapCountry(props: Record<string, unknown> | undefined | null): { code: string; name: string } | null {
  if (!props) return null;

  const isoCandidates = [
    props.ISO_A2_EH, props.ISO_A2, props.iso_a2, props.ISO_A2_NL, props.WB_A2,
  ]
    .map((v) => String(v || "").toUpperCase())
    .filter((v) => v.length === 2 && v !== "-99" && v !== "XX");

  for (const code of isoCandidates) {
    const meta = getCountry(code);
    if (meta) return { code: meta.code, name: meta.name };
  }

  const names = [props.NAME, props.NAME_LONG, props.ADMIN, props.NAME_EN, props.name]
    .map((v) => String(v || "").trim())
    .filter(Boolean);

  for (const name of names) {
    const meta = getCountryByName(name);
    if (meta) return { code: meta.code, name: meta.name };
  }

  return null;
}

export function getContinents(codes: string[]): Set<string> {
  const continents = new Set<string>();
  for (const code of codes) {
    const c = getCountry(code);
    if (c) continents.add(c.continent);
  }
  return continents;
}
