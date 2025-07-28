import type { JSX } from 'react'

import type { Airline } from '@/types/feature/airline'
import type { Airport } from '@/types/feature/airport'

export type BreakingNews = {
  description: string
  id: number
  image: string
  title: string
}

export type PopularDestination = {
  country: string
  distance_km: number
  flight_count: number
  id: number
  route: string
  type: string
}

export type TotalAirplane = {
  count: number
  id: number
  model: string
}

export type Home = {
  breakingNews: BreakingNews[]
  popularAirlines: Airline[]
  popularAirports: Airport[]
  popularDestinations: PopularDestination[]
  totalAirplanes: TotalAirplane[]
}

export type NewsSection = {
  data: BreakingNews[]
  type: 'news'
}

export type DataSection = {
  data: Airline[] | Airport[] | PopularDestination[] | TotalAirplane[]
  isHorizontal: boolean
  onViewAll: () => void
  renderItem: (item: any) => JSX.Element
  title: string
  type: 'airlines' | 'airports' | 'destinations' | 'airplanes'
}

export type Section = NewsSection | DataSection
