import React from 'react'

import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { RouteRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/RouteRowCard'
import type { AirlineRoute } from '@/types/feature/airline'

interface RoutesListProps {
  iconColor: string
  routes: AirlineRoute[]
  title: string
}

export const RoutesList = ({ iconColor, routes, title }: RoutesListProps) => (
  <AirlineSectionRow title={title}>
    {routes?.map((route, index) => (
      <RouteRowCard
        destinationIata={route.destinationIata}
        iconColor={iconColor}
        key={index}
        origin={route.origin}
      />
    ))}
  </AirlineSectionRow>
)
