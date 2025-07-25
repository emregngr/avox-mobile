export type ContactInfo = {
  email: string
  phone: string
}

export type SocialMedia = {
  instagram: string
  linkedin: string
  tiktok: string
  x: string
}

export type CompanyInfo = {
  contactInfo: ContactInfo
  employeeCount: number
  foundingYear: string
  parentCompany: string
  passengerCapacity?: number
  socialMedia: SocialMedia
  website: string
}

export type Coordinates = {
  latitude: number
  longitude: number
}

export type Hub = {
  address: string
  city: string
  coordinates: Coordinates
  name: string
}

export type Operation = {
  alliance: string
  businessModel: string
  businessType: string
  country: string
  hub: Hub
  region: string
  skytraxRating: number
  slogan: string
}

export type Airplane = {
  bodyType: string
  capacitySeats?: number
  capacityTons?: number
  count: number
  rangeKm: number
  speedKmh: number
  type: string
}

export type Fleet = {
  airplaneTypeCount: number
  airplanes: Airplane[]
  averageAgeYears: number
  totalAirplane: number
}

export type AirlineRoute = {
  destinationIata: string
  origin: string
}

export type Network = {
  destinationCount: number
  destinationCountries: number
  destinations: string[]
  domesticConnections: number
  internationalConnections: number
  routes: AirlineRoute[]
}

export type Safety = {
  certifications: string[]
  safetyRecord: string
}

export type Airline = {
  companyInfo: CompanyInfo
  environmental: string
  fleet: Fleet
  iataCode: string
  icaoCode: string
  id: number
  isoCountry: string
  isoRegion: string
  name: string
  network: Network
  operations: Operation
  safety: Safety
}
