export enum AirportBadgeType {
  LargeAirport = 'large_airport',
  MediumAirport = 'medium_airport',
  MegaAirport = 'mega_airport',
  SmallAirport = 'small_airport',
}

export enum AirlineBadgeType {
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

const getAirportBadge = (airportBadgeType: AirportBadgeType): string => {
  const imageMap: AirportImageMap = {
    [AirportBadgeType.SmallAirport]: airportImageFiles.small_airport,
    [AirportBadgeType.MediumAirport]: airportImageFiles.medium_airport,
    [AirportBadgeType.LargeAirport]: airportImageFiles.large_airport,
    [AirportBadgeType.MegaAirport]: airportImageFiles.mega_airport,
  }

  return imageMap?.[airportBadgeType] ?? airportImageFiles.small_airport
}

const getAirlineBadge = (airlineBadgeType: AirlineBadgeType): string => {
  const imageMap: AirlineImageMap = {
    [AirlineBadgeType.Cargo]: airlineImageFiles.cargo,
    [AirlineBadgeType.LowCost]: airlineImageFiles.low_cost,
    [AirlineBadgeType.Regional]: airlineImageFiles.regional,
    [AirlineBadgeType.MajorInternational]: airlineImageFiles.major_international,
  }

  return imageMap?.[airlineBadgeType] ?? airlineImageFiles.cargo
}

export { getAirlineBadge, getAirportBadge }
