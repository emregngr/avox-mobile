import { Share } from 'react-native'

import { getLocale } from '@/locales/i18next'
import type { AirlineType } from '@/types/feature/airline'
import type { AirportType } from '@/types/feature/airport'
import { Logger } from '@/utils/common/logger'

const BASE_URL = 'https://avox-redirect.vercel.app/'

export const createAirlineLink = (airline: AirlineType): string => {
  const params = new URLSearchParams({
    id: airline.id,
    name: airline.name,
  }).toString()
  return `${BASE_URL}?type=airline-detail&${params}`
}

export const createAirportLink = (airport: AirportType): string => {
  const params = new URLSearchParams({
    id: airport.id,
    name: airport.name,
  }).toString()
  return `${BASE_URL}?type=airport-detail&${params}`
}

export const shareAirline = async (airline: AirlineType): Promise<void> => {
  try {
    const link = createAirlineLink(airline)
    const message = getLocale('shareAirline', {
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

export const shareAirport = async (airport: AirportType): Promise<void> => {
  try {
    const link = createAirportLink(airport)
    const message = getLocale('shareAirport', {
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
