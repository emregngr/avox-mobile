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

export type AirportInfo = {
  contactInfo: ContactInfo
  employeeCount: number
  foundingYear: string
  socialMedia: SocialMedia
  website: string
}

export type Coordinates = {
  latitude: number
  longitude: number
}

export type Location = {
  address: string
  city: string
  coordinates: Coordinates
  elevationFt: number
}

export type Operation = {
  airportType: string
  country: string
  is24Hour: true
  location: Location
  region: string
  scheduledService: true
}

export type RunWays = {
  ilsCategory: string
  lengthM: number
  pcn: string
  surface: string
}

export type Infrastructure = {
  airportAreaHectares: number
  apronCount: number
  baggageCapacity: number
  fireCategory: string
  passengerCapacity: number
  runwayCount: number
  runways: RunWays
  terminalAreaHectares: number
  terminalCount: number
  towerHeightM: number
}

export type Facilities = {
  checkinTimeAvg: number
  freeWifi: boolean
  googleMapsRating: number
  hasMetro: boolean
  loungeCount: number
  parkingCapacityVehicles: number
  securityQueueTime: number
  services: string[]
}

export type AirportRoute = {
  destinationIata: string
  frequency: string
}

export type FlightOperations = {
  airlines: string[]
  destinationCount: number
  destinationCountries: number
  domesticConnections: number
  internationalConnections: number
  routes: AirportRoute[]
}

export type Cargo = {
  annualCargoTonnes: number
  coldStorage: boolean
  dangerousGoods: boolean
  terminalCapacityTonnes: number
}

export type AttractionCoordinates = {
  attractionLatitude: number
  attractionLongitude: number
}

export type NearbyAttraction = {
  attractionCoordinates: AttractionCoordinates
  attractionId: number
  attractionName: string
  description: string
  distanceKm: number
}

export type Safety = {
  certifications: string[]
}

export type Airport = {
  airportInfo: AirportInfo
  cargo: Cargo
  facilities: Facilities
  flightOperations: FlightOperations
  iataCode: string
  icaoCode: string
  id: number
  infrastructure: Infrastructure
  isoCountry: string
  isoRegion: string
  name: string
  nearbyAttractions: NearbyAttraction[]
  operations: Operation
  safety: Safety
}
