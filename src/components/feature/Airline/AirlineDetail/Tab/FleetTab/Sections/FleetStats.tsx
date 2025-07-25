import React, { memo, useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'

interface FleetStatsProps {
  airplaneTypeCount: number
  averageAgeYears: number
  totalAirplane: number
}

export const FleetStats = memo(
  ({ airplaneTypeCount, averageAgeYears, totalAirplane }: FleetStatsProps) => {
    const { selectedLocale } = useLocaleStore()

    const localeStrings = useMemo(
      () => ({
        airplaneType: getLocale('airplaneType'),
        averageAgeYears: getLocale('averageAgeYears'),
        totalAirplane: getLocale('totalAirplane'),
      }),
      [selectedLocale],
    )

    return (
      <View className="flex-row p-4 rounded-xl overflow-hidden bg-background-secondary">
        <View className="flex-1 items-center">
          <ThemedText className="mb-1" color="text-100" type="h1">
            {totalAirplane}
          </ThemedText>
          <ThemedText
            color="text-90" lineBreakMode="tail" numberOfLines={2}
            type="body3" center
          >
            {localeStrings.totalAirplane}
          </ThemedText>
        </View>

        <View className="w-px h-12 bg-background-tertiary" />

        <View className="flex-1 items-center">
          <ThemedText className="mb-1" color="text-100" type="h1">
            {averageAgeYears}
          </ThemedText>
          <ThemedText
            color="text-90" lineBreakMode="tail" numberOfLines={2}
            type="body3" center
          >
            {localeStrings.averageAgeYears}
          </ThemedText>
        </View>

        <View className="w-px h-12 bg-background-tertiary" />

        <View className="flex-1 items-center">
          <ThemedText className="mb-1" color="text-100" type="h1">
            {airplaneTypeCount}
          </ThemedText>
          <ThemedText
            color="text-90" lineBreakMode="tail" numberOfLines={2}
            type="body3" center
          >
            {localeStrings.airplaneType}
          </ThemedText>
        </View>
      </View>
    )
  },
)
