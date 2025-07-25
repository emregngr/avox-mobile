import { Ionicons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'
import { cn } from '@/utils/common/cn'

interface AirlineHeaderProps {
  airlineData: Airline
}

export const AirlineHeader = ({ airlineData }: AirlineHeaderProps) => {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { iataCode, icaoCode, operations } = airlineData
  const { hub, region } = operations || {}
  const { address, name: hubName } = hub || {}

  const memoizedData = useMemo(
    () => ({
      address,
      hubName,
      iataCode,
      icaoCode,
      region,
    }),
    [iataCode, icaoCode, region, hubName, address],
  )

  const memoizedClassName = useMemo(() => cn(`bg-${region?.toLowerCase()}`), [region])

  const localeStrings = useMemo(
    () => ({
      continent: getLocale('continent'),
      iata: getLocale('iata'),
      icao: getLocale('icao'),
    }),
    [selectedLocale],
  )

  return (
    <View className={memoizedClassName}>
      <View className="p-4 gap-y-4">
        <View className="flex-row items-center bg-background-primary py-3 rounded-xl overflow-hidden">
          <View className="flex-1 items-center">
            <ThemedText
              color="text-70" lineBreakMode="tail" numberOfLines={1}
              type="body4"
            >
              {localeStrings.iata}
            </ThemedText>
            <ThemedText color="text-100" type="body1">
              {memoizedData.iataCode}
            </ThemedText>
          </View>
          <View className="w-px h-8 bg-background-quaternary" />
          <View className="flex-1 items-center">
            <ThemedText
              color="text-70" lineBreakMode="tail" numberOfLines={1}
              type="body4"
            >
              {localeStrings.icao}
            </ThemedText>
            <ThemedText color="text-100" type="body1">
              {memoizedData.icaoCode}
            </ThemedText>
          </View>
          <View className="w-px h-8 bg-background-quaternary" />
          <View className="flex-1 items-center">
            <ThemedText
              color="text-70" lineBreakMode="tail" numberOfLines={1}
              type="body4"
            >
              {localeStrings.continent}
            </ThemedText>
            <ThemedText color="text-100" type="body1">
              {memoizedData.region}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-center px-5 py-2 rounded-xl overflow-hidden bg-background-primary">
          <Ionicons color={colors?.onPrimary100} name="home" size={20} />
          <View className="mx-4">
            <ThemedText
              color="text-100" ellipsizeMode="tail" numberOfLines={1}
              type="body1"
            >
              {memoizedData.hubName}
            </ThemedText>
            <ThemedText
              color="text-70" ellipsizeMode="tail" numberOfLines={1}
              type="body2"
            >
              {memoizedData.address}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  )
}
