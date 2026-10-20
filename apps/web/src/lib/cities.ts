export interface City {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  population: string;
}

export const cities: City[] = [
  { slug: "austin-tx", name: "Austin", state: "Texas", stateCode: "TX", population: "975,000" },
  { slug: "miami-fl", name: "Miami", state: "Florida", stateCode: "FL", population: "450,000" },
  { slug: "dallas-tx", name: "Dallas", state: "Texas", stateCode: "TX", population: "1,300,000" },
  { slug: "phoenix-az", name: "Phoenix", state: "Arizona", stateCode: "AZ", population: "1,600,000" },
  { slug: "los-angeles-ca", name: "Los Angeles", state: "California", stateCode: "CA", population: "3,800,000" },
  { slug: "chicago-il", name: "Chicago", state: "Illinois", stateCode: "IL", population: "2,700,000" },
  { slug: "houston-tx", name: "Houston", state: "Texas", stateCode: "TX", population: "2,300,000" },
  { slug: "atlanta-ga", name: "Atlanta", state: "Georgia", stateCode: "GA", population: "500,000" },
  { slug: "denver-co", name: "Denver", state: "Colorado", stateCode: "CO", population: "715,000" },
  { slug: "seattle-wa", name: "Seattle", state: "Washington", stateCode: "WA", population: "750,000" },
  { slug: "san-antonio-tx", name: "San Antonio", state: "Texas", stateCode: "TX", population: "1,450,000" },
  { slug: "san-diego-ca", name: "San Diego", state: "California", stateCode: "CA", population: "1,380,000" },
  { slug: "tampa-fl", name: "Tampa", state: "Florida", stateCode: "FL", population: "400,000" },
  { slug: "charlotte-nc", name: "Charlotte", state: "North Carolina", stateCode: "NC", population: "900,000" },
  { slug: "nashville-tn", name: "Nashville", state: "Tennessee", stateCode: "TN", population: "690,000" },
  { slug: "las-vegas-nv", name: "Las Vegas", state: "Nevada", stateCode: "NV", population: "660,000" },
  { slug: "orlando-fl", name: "Orlando", state: "Florida", stateCode: "FL", population: "320,000" },
  { slug: "portland-or", name: "Portland", state: "Oregon", stateCode: "OR", population: "650,000" },
  { slug: "columbus-oh", name: "Columbus", state: "Ohio", stateCode: "OH", population: "910,000" },
  { slug: "scottsdale-az", name: "Scottsdale", state: "Arizona", stateCode: "AZ", population: "240,000" },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
