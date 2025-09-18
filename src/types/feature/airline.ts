export type ContactInfoType = {
  email: string
  phone: string
}

export type SocialMediaType = {
  instagram: string
  linkedin: string
  tiktok: string
  x: string
}

export type CompanyInfoType = {
  contactInfo: ContactInfoType
  employeeCount: number
  foundingYear: string
  parentCompany: string
  passengerCapacity?: number
  socialMedia: SocialMediaType
  website: string
}

export type CoordinatesType = {
  latitude: number
  longitude: number
}

export type Hub = {
  address: string
  city: string
  coordinates: CoordinatesType
  name: string
}

export type OperationType = {
  alliance: string
  businessModel: string
  businessType: string
  country: string
  hub: Hub
  region: string
  skytraxRating: number
  slogan: string
}

export type AirplaneType = {
  bodyType: string
  capacitySeats?: number
  capacityTons?: number
  count: number
  rangeKm: number
  speedKmh: number
  type: string
}

export type FleetType = {
  airplaneTypeCount: number
  airplanes: AirplaneType[]
  averageAgeYears: number
  totalAirplane: number
}

export type AirlineRouteType = {
  destinationIata: string
  origin: string
}

export type NetworkType = {
  destinationCount: number
  destinationCountries: number
  destinations: string[]
  domesticConnections: number
  internationalConnections: number
  routes: AirlineRouteType[]
}

export type SafetyType = {
  certifications: string[]
  safetyRecord: string
}

export type AirlineType = {
  companyInfo: CompanyInfoType
  environmental: string
  fleet: FleetType
  iataCode: string
  icaoCode: string
  id: string
  isoCountry: string
  isoRegion: string
  logo: string,
  name: string,
  network: NetworkType
  operations: OperationType
  safety: SafetyType
}
