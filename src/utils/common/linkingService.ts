import { Share } from 'react-native'

import { getLocale } from '@/locales/i18next'
import type { Airline } from '@/types/feature/airline'
import type { Airport } from '@/types/feature/airport'
import { Logger } from '@/utils/common/logger'

const BASE_URL = 'https://avox-redirect.vercel.app/'

export const createAirlineLink = (airline: Airline): string => {
  const params = new URLSearchParams({
    id: airline.id.toString(),
    name: airline.name,
  })
  return `${BASE_URL}?type=airline-detail&${params.toString()}`
}

export const createAirportLink = (airport: Airport): string => {
  const params = new URLSearchParams({
    id: airport.id.toString(),
    name: airport.name,
  })
  return `${BASE_URL}?type=airport-detail&${params.toString()}`
}

export const shareAirline = async (airline: Airline): Promise<void> => {
  try {
    const link = createAirlineLink(airline)
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
  } catch (error) {
    Logger.breadcrumb('shareAirlineError', 'error', error as Error)
  }
}

export const shareAirport = async (airport: Airport): Promise<void> => {
  try {
    const link = createAirportLink(airport)
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
  } catch (error) {
    Logger.breadcrumb('shareAirportError', 'error', error as Error)
  }
}
