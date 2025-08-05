export enum AirportType {
  LargeAirport = 'large_airport',
  MediumAirport = 'medium_airport',
  MegaAirport = 'mega_airport',
  SmallAirport = 'small_airport',
}

export enum AirlineType {
  Cargo = 'cargo',
  LowCost = 'low_cost',
  MajorInternational = 'major_international',
  Regional = 'regional',
}

const airportImageFiles = {
  large_airport: require('@/assets/images/badge/large.webp'),
  medium_airport: require('@/assets/images/badge/medium.webp'),
  mega_airport: require('@/assets/images/badge/mega.webp'),
  small_airport: require('@/assets/images/badge/small.webp'),
}

const airlineImageFiles = {
  cargo: require('@/assets/images/badge/small.webp'),
  low_cost: require('@/assets/images/badge/medium.webp'),
  major_international: require('@/assets/images/badge/mega.webp'),
  regional: require('@/assets/images/badge/large.webp'),
}

interface AirportImageMap {
  [key: string]: string
}

interface AirlineImageMap {
  [key: string]: string
}

const getAirportBadge = (airportType: AirportType): string => {
  const imageMap: AirportImageMap = {
    [AirportType.SmallAirport]: airportImageFiles.small_airport,
    [AirportType.MediumAirport]: airportImageFiles.medium_airport,
    [AirportType.LargeAirport]: airportImageFiles.large_airport,
    [AirportType.MegaAirport]: airportImageFiles.mega_airport,
  }

  return imageMap?.[airportType] ?? airportImageFiles.small_airport
}

const getAirlineBadge = (airlineType: AirlineType): string => {
  const imageMap: AirlineImageMap = {
    [AirlineType.Cargo]: airlineImageFiles.cargo,
    [AirlineType.LowCost]: airlineImageFiles.low_cost,
    [AirlineType.Regional]: airlineImageFiles.regional,
    [AirlineType.MajorInternational]: airlineImageFiles.major_international,
  }

  return imageMap?.[airlineType] ?? airlineImageFiles.cargo
}

export { getAirlineBadge, getAirportBadge }
