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

export type AirportInfoType = {
  contactInfo: ContactInfoType
  employeeCount: number
  foundingYear: string
  socialMedia: SocialMediaType
  website: string
}

export type CoordinatesType = {
  latitude: number
  longitude: number
}

export type LocationType = {
  address: string
  city: string
  coordinates: CoordinatesType
  elevationFt: number
}

export type OperationType = {
  airportType: string
  country: string
  is24Hour: boolean
  location: LocationType
  region: string
  scheduledService: boolean
}

export type RunWaysType = {
  ilsCategory: string
  lengthM: number
  pcn: string
  surface: string
}

export type InfrastructureType = {
  airportAreaHectares: number
  apronCount: number
  baggageCapacity: number
  fireCategory: string
  passengerCapacity: number
  runwayCount: number
  runways: RunWaysType
  terminalAreaHectares: number
  terminalCount: number
  towerHeightM: number
}

export type FacilitiesType = {
  checkinTimeAvg: number
  freeWifi: boolean
  googleMapsRating: number
  hasMetro: boolean
  loungeCount: number
  parkingCapacityVehicles: number
  securityQueueTime: number
  services: string[]
}

export type AirportRouteType = {
  destinationIata: string
  frequency: string
}

export type FlightOperationsType = {
  airlines: string[]
  destinationCount: number
  destinationCountries: number
  domesticConnections: number
  internationalConnections: number
  routes: AirportRouteType[]
}

export type CargoType = {
  annualCargoTonnes: number
  coldStorage: boolean
  dangerousGoods: boolean
  terminalCapacityTonnes: number
}

export type AttractionCoordinatesType = {
  attractionLatitude: number
  attractionLongitude: number
}

export type NearbyAttractionType = {
  attractionCoordinates: AttractionCoordinatesType
  attractionId: string
  attractionName: string
  description: string
  distanceKm: number
}

export type SafetyType = {
  certifications: string[]
}

export type AirportType = {
  airportInfo: AirportInfoType
  cargo: CargoType
  facilities: FacilitiesType
  flightOperations: FlightOperationsType
  iataCode: string
  icaoCode: string
  id: string
  image: string,
  infrastructure: InfrastructureType,
  isoCountry: string,
  isoRegion: string,
  name: string,
  nearbyAttractions: NearbyAttractionType[]
  operations: OperationType
  safety: SafetyType
}
