import React from 'react'
import { View } from 'react-native'

import { AirlineSectionRow } from '@/components/feature/Airline/AirlineDetail/AirlineSectionRow'
import { DestinationRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/DestinationRowCard'

interface DestinationListProps {
  destinations: string[]
  iconColor: string
  title: string
}

export const DestinationList = ({ destinations, iconColor, title }: DestinationListProps) => (
  <AirlineSectionRow title={title}>
    <View className="flex-row flex-wrap -mx-1">
      {destinations?.map((destination, index) => (
        <DestinationRowCard destination={destination} iconColor={iconColor} key={index} />
      ))}
    </View>
  </AirlineSectionRow>
)
