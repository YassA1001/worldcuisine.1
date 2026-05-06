export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  region: string;
  description: string;
  coordinates: [number, number];
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe', description: 'Home of pasta, pizza, and gelato — Italian cuisine is beloved worldwide.', coordinates: [12.56, 41.87] },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia', description: 'Refined, seasonal, and deeply artistic — Japanese cuisine is a philosophy.', coordinates: [138.25, 36.20] },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Americas', description: 'Bold flavors, ancient traditions, and incredible street food culture.', coordinates: [-102.55, 23.63] },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', description: 'The birthplace of haute cuisine — sauces, pastries, and fine dining.', coordinates: [2.35, 46.23] },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia', description: 'Explosive aromas, fresh herbs, and the perfect balance of sweet, sour, and spicy.', coordinates: [100.99, 15.87] },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', description: 'West Africa\'s most vibrant cuisine — rich stews, rice dishes, and bold spices.', coordinates: [8.68, 9.08] },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe', description: 'Mediterranean diet at its finest — olives, lamb, fresh vegetables, and feta.', coordinates: [21.82, 39.07] },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia', description: 'The world\'s oldest culinary tradition — diverse, regional, and endlessly complex.', coordinates: [104.19, 35.86] },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia', description: 'A tapestry of spices, aromas, and regional traditions unlike anywhere else.', coordinates: [78.96, 20.59] },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'Americas', description: 'South America\'s culinary capital — ceviche, quinoa, and Amazonian ingredients.', coordinates: [-75.01, -9.19] },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', description: 'Fresh, herb-laden, and broth-forward — Vietnamese food is health and flavor combined.', coordinates: [108.28, 14.06] },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Middle East', description: 'A melting pot of Middle Eastern and Mediterranean influences.', coordinates: [34.85, 31.05] },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'Americas', description: 'Beef, wine, and empanadas — Argentina\'s cuisine reflects its European roots.', coordinates: [-63.62, -38.42] },
];

export const getCountryByCode = (code: string): CountryInfo | undefined =>
  COUNTRIES.find(c => c.code === code);
