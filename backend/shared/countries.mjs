// Cuisine → ISO 3166-1 alpha-2 country code mapping used by both mealsApi and dareApi.
// Each entry also carries a difficulty tier (1=easy, 2=medium, 3=hard) and a continent tag.

export const COUNTRIES = [
  { code: "IT", name: "Italy", cuisine: "Italian", continent: "Europe", difficulty: 1, emoji: "🍝" },
  { code: "JP", name: "Japan", cuisine: "Japanese", continent: "Asia", difficulty: 2, emoji: "🍣" },
  { code: "IN", name: "India", cuisine: "Indian", continent: "Asia", difficulty: 2, emoji: "🍛" },
  { code: "MX", name: "Mexico", cuisine: "Mexican", continent: "Americas", difficulty: 1, emoji: "🌮" },
  { code: "FR", name: "France", cuisine: "French", continent: "Europe", difficulty: 3, emoji: "🥐" },
  { code: "CN", name: "China", cuisine: "Chinese", continent: "Asia", difficulty: 2, emoji: "🥟" },
  { code: "TH", name: "Thailand", cuisine: "Thai", continent: "Asia", difficulty: 2, emoji: "🍜" },
  { code: "GR", name: "Greece", cuisine: "Greek", continent: "Europe", difficulty: 1, emoji: "🫒" },
  { code: "ES", name: "Spain", cuisine: "Spanish", continent: "Europe", difficulty: 2, emoji: "🥘" },
  { code: "MA", name: "Morocco", cuisine: "Moroccan", continent: "Africa", difficulty: 2, emoji: "🫙" },
  { code: "ET", name: "Ethiopia", cuisine: "Ethiopian", continent: "Africa", difficulty: 2, emoji: "🫓" },
  { code: "NG", name: "Nigeria", cuisine: "Nigerian", continent: "Africa", difficulty: 2, emoji: "🍲" },
  { code: "EG", name: "Egypt", cuisine: "Egyptian", continent: "Africa", difficulty: 1, emoji: "🧆" },
  { code: "ZA", name: "South Africa", cuisine: "South African", continent: "Africa", difficulty: 2, emoji: "🥩" },
  { code: "SN", name: "Senegal", cuisine: "Senegalese", continent: "Africa", difficulty: 2, emoji: "🍚" },
  { code: "GH", name: "Ghana", cuisine: "Ghanaian", continent: "Africa", difficulty: 2, emoji: "🍛" },
  { code: "TN", name: "Tunisia", cuisine: "Tunisian", continent: "Africa", difficulty: 2, emoji: "🌶️" },
  { code: "KE", name: "Kenya", cuisine: "Kenyan", continent: "Africa", difficulty: 1, emoji: "🍖" },
  { code: "CM", name: "Cameroon", cuisine: "Cameroonian", continent: "Africa", difficulty: 2, emoji: "🍲" },
  { code: "BR", name: "Brazil", cuisine: "Brazilian", continent: "Americas", difficulty: 1, emoji: "🥩" },
  { code: "PE", name: "Peru", cuisine: "Peruvian", continent: "Americas", difficulty: 3, emoji: "🍋" },
  { code: "AR", name: "Argentina", cuisine: "Argentine", continent: "Americas", difficulty: 1, emoji: "🥩" },
  { code: "CO", name: "Colombia", cuisine: "Colombian", continent: "Americas", difficulty: 1, emoji: "🫘" },
  { code: "CU", name: "Cuba", cuisine: "Cuban", continent: "Americas", difficulty: 1, emoji: "🍖" },
  { code: "JM", name: "Jamaica", cuisine: "Jamaican", continent: "Americas", difficulty: 2, emoji: "🌶️" },
  { code: "CL", name: "Chile", cuisine: "Chilean", continent: "Americas", difficulty: 2, emoji: "🫘" },
  { code: "US", name: "United States", cuisine: "American", continent: "Americas", difficulty: 1, emoji: "🍔" },
  { code: "CA", name: "Canada", cuisine: "Canadian", continent: "Americas", difficulty: 1, emoji: "🍁" },
  { code: "TR", name: "Turkey", cuisine: "Turkish", continent: "Europe", difficulty: 2, emoji: "🥙" },
  { code: "LB", name: "Lebanon", cuisine: "Lebanese", continent: "Asia", difficulty: 2, emoji: "🧆" },
  { code: "IR", name: "Iran", cuisine: "Persian", continent: "Asia", difficulty: 2, emoji: "🍚" },
  { code: "IQ", name: "Iraq", cuisine: "Iraqi", continent: "Asia", difficulty: 2, emoji: "🍖" },
  { code: "SA", name: "Saudi Arabia", cuisine: "Saudi", continent: "Asia", difficulty: 2, emoji: "🍖" },
  { code: "VN", name: "Vietnam", cuisine: "Vietnamese", continent: "Asia", difficulty: 2, emoji: "🍜" },
  { code: "KR", name: "South Korea", cuisine: "Korean", continent: "Asia", difficulty: 2, emoji: "🥢" },
  { code: "PH", name: "Philippines", cuisine: "Filipino", continent: "Asia", difficulty: 2, emoji: "🍖" },
  { code: "ID", name: "Indonesia", cuisine: "Indonesian", continent: "Asia", difficulty: 2, emoji: "🍚" },
  { code: "MY", name: "Malaysia", cuisine: "Malaysian", continent: "Asia", difficulty: 2, emoji: "🍜" },
  { code: "SG", name: "Singapore", cuisine: "Singaporean", continent: "Asia", difficulty: 2, emoji: "🦞" },
  { code: "PK", name: "Pakistan", cuisine: "Pakistani", continent: "Asia", difficulty: 2, emoji: "🍛" },
  { code: "BD", name: "Bangladesh", cuisine: "Bangladeshi", continent: "Asia", difficulty: 2, emoji: "🐟" },
  { code: "LK", name: "Sri Lanka", cuisine: "Sri Lankan", continent: "Asia", difficulty: 2, emoji: "🌴" },
  { code: "NP", name: "Nepal", cuisine: "Nepali", continent: "Asia", difficulty: 2, emoji: "🍲" },
  { code: "MM", name: "Myanmar", cuisine: "Burmese", continent: "Asia", difficulty: 2, emoji: "🍜" },
  { code: "KH", name: "Cambodia", cuisine: "Cambodian", continent: "Asia", difficulty: 2, emoji: "🍚" },
  { code: "GB", name: "United Kingdom", cuisine: "British", continent: "Europe", difficulty: 1, emoji: "🫖" },
  { code: "DE", name: "Germany", cuisine: "German", continent: "Europe", difficulty: 1, emoji: "🌭" },
  { code: "PT", name: "Portugal", cuisine: "Portuguese", continent: "Europe", difficulty: 1, emoji: "🐟" },
  { code: "PL", name: "Poland", cuisine: "Polish", continent: "Europe", difficulty: 1, emoji: "🥣" },
  { code: "RU", name: "Russia", cuisine: "Russian", continent: "Europe", difficulty: 2, emoji: "🥣" },
  { code: "UA", name: "Ukraine", cuisine: "Ukrainian", continent: "Europe", difficulty: 1, emoji: "🥣" },
  { code: "HU", name: "Hungary", cuisine: "Hungarian", continent: "Europe", difficulty: 2, emoji: "🫕" },
  { code: "RO", name: "Romania", cuisine: "Romanian", continent: "Europe", difficulty: 2, emoji: "🥩" },
  { code: "SE", name: "Sweden", cuisine: "Swedish", continent: "Europe", difficulty: 1, emoji: "🐟" },
  { code: "AU", name: "Australia", cuisine: "Australian", continent: "Oceania", difficulty: 1, emoji: "🦘" },
  { code: "NZ", name: "New Zealand", cuisine: "New Zealand", continent: "Oceania", difficulty: 1, emoji: "🥝" },
  { code: "FJ", name: "Fiji", cuisine: "Fijian", continent: "Oceania", difficulty: 2, emoji: "🐟" },
  { code: "IL", name: "Israel", cuisine: "Israeli", continent: "Asia", difficulty: 2, emoji: "🧆" },
  { code: "GE", name: "Georgia", cuisine: "Georgian", continent: "Europe", difficulty: 3, emoji: "🥟" },
  { code: "UZ", name: "Uzbekistan", cuisine: "Uzbek", continent: "Asia", difficulty: 2, emoji: "🍚" },
  { code: "KZ", name: "Kazakhstan", cuisine: "Kazakh", continent: "Asia", difficulty: 2, emoji: "🥩" },
  { code: "MN", name: "Mongolia", cuisine: "Mongolian", continent: "Asia", difficulty: 3, emoji: "🥩" },
];

/** Return a country object by ISO code (case-insensitive). */
export function getCountryByCode(code) {
  return COUNTRIES.find((c) => c.code === code.toUpperCase()) ?? null;
}

/** Return country codes the user has NOT yet stamped. */
export function getUnexploredCodes(stampedCodes = []) {
  const stamped = new Set(stampedCodes.map((c) => c.toUpperCase()));
  return COUNTRIES.filter((c) => !stamped.has(c.code));
}

/** Pick a random country from the unexplored list. Returns null if all explored. */
export function pickRandomUnexplored(stampedCodes = []) {
  const pool = getUnexploredCodes(stampedCodes);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
