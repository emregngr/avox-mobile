import { Ionicons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'

interface AirlineHeaderProps {
  airlineData: Airline
}

export const AirlineHeader = ({ airlineData }: AirlineHeaderProps) => {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { iataCode, icaoCode, operations } = airlineData
  const { hub, region } = operations ?? {}
  const { address, name: hubName } = hub ?? {}

  const backgroundClass = useMemo(() => `bg-${region?.toLowerCase()}`, [region])

  const homeIconColor = useMemo(() => colors?.onPrimary100, [colors])

  const localeStrings = useMemo(
    () => ({
      continent: getLocale('continent'),
      iata: getLocale('iata'),
      icao: getLocale('icao'),
    }),
    [selectedLocale],
  )

  return (
    <View className={backgroundClass}>
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
              {iataCode}
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
              {icaoCode}
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
              {region}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-center px-5 py-3 rounded-xl overflow-hidden bg-background-primary">
          <Ionicons color={homeIconColor} name="home" size={20} />
          <View className="mx-4">
            <ThemedText
              color="text-100" ellipsizeMode="tail" numberOfLines={1}
              type="body1"
            >
              {hubName}
            </ThemedText>
            <ThemedText
              color="text-70" ellipsizeMode="tail" numberOfLines={1}
              type="body2"
            >
              {address}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  )
}
