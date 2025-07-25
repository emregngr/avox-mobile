import React from 'react'

import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { RouteRowCard } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/RouteRowCard'
import type { AirportRoute } from '@/types/feature/airport'

interface RoutesListProps {
  iconColor: string
  routes: AirportRoute[]
  title: string
}

export const RoutesList = ({ iconColor, routes, title }: RoutesListProps) => (
  <AirportSectionRow title={title}>
    {routes?.map((route, index) => (
      <RouteRowCard
        destinationIata={route.destinationIata}
        frequency={route.frequency}
        iconColor={iconColor}
        key={index}
      />
    ))}
  </AirportSectionRow>
)
