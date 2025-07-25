import React from 'react'

import { AirportSectionRow } from '@/components/feature/Airport/AirportDetail/AirportSectionRow'
import { AirlineRowCard } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/AirlineRowCard'

interface AirlinesListProps {
  airlines: string[]
  iconColor: string,
  title: string
}

export const AirlinesList = ({ airlines, iconColor, title }: AirlinesListProps) => (
  <AirportSectionRow title={title}>
    {airlines?.map((airline, index) => (
      <AirlineRowCard airline={airline} iconColor={iconColor} key={index} />
      ))}
  </AirportSectionRow>
  )
