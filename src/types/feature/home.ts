import type { ReactNode } from 'react'

import type { AirlineType } from '@/types/feature/airline'
import type { AirportType } from '@/types/feature/airport'

export type BreakingNewsType = {
  description: string
  id: string
  image: string
  title: string
}

export type PopularDestinationType = {
  country: string
  destinations_type: string
  distance_km: number
  flight_count: number
  id: string
  route: string
}

export type TotalAirplaneType = {
  count: number
  id: string
  model: string
}

export type HomeType = {
  breakingNews: BreakingNewsType[]
  popularAirlines: AirlineType[]
  popularAirports: AirportType[]
  popularDestinations: PopularDestinationType[]
  totalAirplanes: TotalAirplaneType[]
}

export type NewsSectionType = {
  data: BreakingNewsType[]
  type: 'news'
}

export type DataSectionType = {
  data: AirlineType[] | AirportType[] | PopularDestinationType[] | TotalAirplaneType[]
  isHorizontal: boolean
  onViewAll: () => void
  renderItem: (item: any) => ReactNode
  title: string
  type: 'airlines' | 'airports' | 'destinations' | 'airplanes'
}

export type SectionType = NewsSectionType | DataSectionType
