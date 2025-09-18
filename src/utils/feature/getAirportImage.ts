import { AirportBadgeType } from '@/utils/feature/getBadge'

const imageFiles = {
  large_airport: require('@/assets/images/airport/large_airport.webp'),
  medium_airport: require('@/assets/images/airport/medium_airport.webp'),
  mega_airport: require('@/assets/images/airport/mega_airport.webp'),
  small_airport: require('@/assets/images/airport/small_airport.webp'),
}

interface AirportImageMap {
  [key: string]: string
}

export const getAirportImage = (airportBadgeType: AirportBadgeType): string => {
  const imageMap: AirportImageMap = {
    [AirportBadgeType.SmallAirport]: imageFiles.small_airport,
    [AirportBadgeType.MediumAirport]: imageFiles.medium_airport,
    [AirportBadgeType.LargeAirport]: imageFiles.large_airport,
    [AirportBadgeType.MegaAirport]: imageFiles.mega_airport,
  }

  return imageMap?.[airportBadgeType] ?? imageFiles.small_airport
}
