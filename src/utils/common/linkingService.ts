import { Share } from 'react-native'

import { getLocale } from '@/locales/i18next'
import type { Airline } from '@/types/feature/airline'
import type { Airport } from '@/types/feature/airport'

export class LinkingService {
  private static baseUrl = 'https://avox-redirect.vercel.app/'

  static createAirlineLink(airline: Airline): string {
    const params = new URLSearchParams({
      id: airline.id.toString(),
      name: airline.name,
    })
    return `${this.baseUrl}?type=airline-detail&${params.toString()}`
  }

  static createAirportLink(airport: Airport): string {
    const params = new URLSearchParams({
      id: airport.id.toString(),
      name: airport.name,
    })
    return `${this.baseUrl}?type=airport-detail&${params.toString()}`
  }

  static async shareAirline(airline: Airline): Promise<void> {
    try {
      const link = this.createAirlineLink(airline)
      const message = getLocale('shareAirlineMessage', {
        airlineName: airline.name,
        iataCode: airline.iataCode,
        link,
      })

      const title = getLocale('shareAirlineTitle', { airlineName: airline.name })

      await Share.share({
        message,
        title,
      })
    } catch (error) {}
  }

  static async shareAirport(airport: Airport): Promise<void> {
    try {
      const link = this.createAirportLink(airport)
      const message = getLocale('shareAirportMessage', {
        airportName: airport.name,
        iataCode: airport.iataCode,
        link,
      })

      const title = getLocale('shareAirportTitle', { airportName: airport.name })

      await Share.share({
        message,
        title,
      })
    } catch (error) {}
  }
}
