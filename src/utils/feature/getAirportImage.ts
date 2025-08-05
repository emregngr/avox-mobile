import { AirportType } from '@/utils/feature/getBadge'

const imageFiles = {
  large_airport: require('@/assets/images/airport/large_airport.webp'),
  medium_airport: require('@/assets/images/airport/medium_airport.webp'),
  mega_airport: require('@/assets/images/airport/mega_airport.webp'),
  small_airport: require('@/assets/images/airport/small_airport.webp'),
}

interface AirportImageMap {
  [key: string]: string
}

export const getAirportImage = (airportType: AirportType): string => {
  const imageMap: AirportImageMap = {
    [AirportType.SmallAirport]: imageFiles.small_airport,
    [AirportType.MediumAirport]: imageFiles.medium_airport,
    [AirportType.LargeAirport]: imageFiles.large_airport,
    [AirportType.MegaAirport]: imageFiles.mega_airport,
  }

  return imageMap?.[airportType] ?? imageFiles.small_airport
}
