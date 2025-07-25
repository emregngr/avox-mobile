import React, { memo, useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { PopularDestination } from '@/types/feature/home'
import { formatNumber } from '@/utils/feature/formatNumber'

interface DestinationCardProps {
  destination: PopularDestination
}

export const DestinationCard = memo(({ destination }: DestinationCardProps) => {
  const { selectedLocale } = useLocaleStore()

  const { country, distance_km, flight_count, route, type } = destination

  const formattedFlightCount = useMemo(() => formatNumber(flight_count), [flight_count])

  const formattedDistance = useMemo(() => formatNumber(distance_km), [distance_km])

  const localeStrings = useMemo(
    () => ({
      distance: getLocale('distance'),
      flightPerYear: getLocale('flight/year'),
      km: getLocale('km'),
    }),
    [selectedLocale],
  )

  const distanceWithUnit = useMemo(
    () => `${formattedDistance} ${localeStrings.km}`,
    [formattedDistance, localeStrings.km],
  )

  return (
    <View className="w-36 mb-4 bg-background-secondary rounded-xl border border-background-quaternary shadow shadow-background-quaternary">
      <View className="bg-background-primary rounded-xl overflow-hidden relative px-2 border-b border-background-quaternary w-full h-44 justify-center">
        <ThemedText
          className="mx-2" color="tertiary-100" type="h4"
          center
        >
          {route}
        </ThemedText>

        <View className="bg-primary-100 px-2 py-1 rounded-xl overflow-hidden absolute bottom-2 left-2">
          <ThemedText
            color="text-100" ellipsizeMode="tail" numberOfLines={1}
            type="button2"
          >
            {type}
          </ThemedText>
        </View>
      </View>

      <View className="px-3 py-3">
        <View className="h-32 justify-between">
          <ThemedText
            className="mb-2"
            color="text-100"
            ellipsizeMode="tail"
            numberOfLines={2}
            type="body3"
          >
            {country}
          </ThemedText>

          <View className="absolute bottom-10">
            <ThemedText
              color="text-70" ellipsizeMode="tail" numberOfLines={1}
              type="body4"
            >
              {localeStrings.flightPerYear}
            </ThemedText>
            <ThemedText
              color="text-90" ellipsizeMode="tail" numberOfLines={1}
              type="body3"
            >
              {formattedFlightCount}
            </ThemedText>
          </View>

          <View className="absolute bottom-0">
            <ThemedText
              color="text-70" ellipsizeMode="tail" numberOfLines={1}
              type="body4"
            >
              {localeStrings.distance}
            </ThemedText>
            <ThemedText
              color="text-90" ellipsizeMode="tail" numberOfLines={1}
              type="body3"
            >
              {distanceWithUnit}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  )
})

DestinationCard.displayName = 'DestinationCard'
