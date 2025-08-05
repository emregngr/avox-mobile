import { Ionicons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airport } from '@/types/feature/airport'

interface AirportHeaderProps {
  airportData: Airport
}

export const AirportHeader = ({ airportData }: AirportHeaderProps) => {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { iataCode, icaoCode, isoCountry, isoRegion, operations } = airportData ?? {}
  const {
    location: { address },
    region,
  } = operations ?? {}

  const backgroundClass = useMemo(() => `bg-${region?.toLowerCase()}`, [region])

  const locationIconColor = useMemo(() => colors?.onPrimary100, [colors])

  const localeStrings = useMemo(
    () => ({
      cont: getLocale('cont'),
      ctry: getLocale('ctry'),
      iata: getLocale('iata'),
      icao: getLocale('icao'),
      reg: getLocale('reg'),
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
              className="uppercase"
              color="text-70"
              lineBreakMode="tail"
              numberOfLines={1}
              type="body4"
            >
              {localeStrings.ctry}
            </ThemedText>
            <ThemedText color="text-100" type="body1">
              {isoCountry}
            </ThemedText>
          </View>

          <View className="w-px h-8 bg-background-quaternary" />

          <View className="flex-1 items-center">
            <ThemedText
              className="uppercase"
              color="text-70"
              lineBreakMode="tail"
              numberOfLines={1}
              type="body4"
            >
              {localeStrings.reg}
            </ThemedText>
            <ThemedText color="text-100" type="body1">
              {isoRegion}
            </ThemedText>
          </View>

          <View className="w-px h-8 bg-background-quaternary" />

          <View className="flex-1 items-center">
            <ThemedText
              className="uppercase"
              color="text-70"
              lineBreakMode="tail"
              numberOfLines={1}
              type="body4"
            >
              {localeStrings.cont}
            </ThemedText>
            <ThemedText color="text-100" type="body1">
              {region}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-center px-5 py-3 rounded-xl overflow-hidden bg-background-primary">
          <Ionicons color={locationIconColor} name="location" size={16} />
          <View className="mx-4">
            <ThemedText
              color="text-100" ellipsizeMode="tail" numberOfLines={1}
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
