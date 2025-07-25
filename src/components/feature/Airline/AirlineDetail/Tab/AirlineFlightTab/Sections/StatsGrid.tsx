import React from 'react'
import { View } from 'react-native'

import { StatsCard } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/StatsCard'

interface StatsGridProps {
  iconColor: string
  localeStrings: {
    country: string
    domesticDestinations: string
    internationalDestination: string
    totalDestination: string
  }
  stats: {
    destinationCount: number
    destinationCountries: number
    domesticConnections: number
    internationalConnections: number
  }
}

export const StatsGrid = ({ iconColor, localeStrings, stats }: StatsGridProps) => (
  <>
    <View className="flex-row gap-x-4">
      <StatsCard
        iconColor={iconColor}
        iconName="flag"
        label={localeStrings.totalDestination}
        value={stats.destinationCount}
      />
      <StatsCard
        iconColor={iconColor}
        iconName="earth"
        label={localeStrings.country}
        value={stats.destinationCountries}
      />
    </View>

    <View className="flex-row gap-x-4">
      <StatsCard
        iconColor={iconColor}
        iconName="home"
        label={localeStrings.domesticDestinations}
        value={stats.domesticConnections}
      />
      <StatsCard
        iconColor={iconColor}
        iconName="globe"
        label={localeStrings.internationalDestination}
        value={stats.internationalConnections}
      />
    </View>
  </>
)
