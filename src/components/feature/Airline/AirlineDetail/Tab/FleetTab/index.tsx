import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { FleetHeader } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetHeader'
import { FleetList } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetList'
import { FleetStats } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetStats'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'

interface FleetTabProps {
  airlineData: Airline
}

export const FleetTab = ({ airlineData }: FleetTabProps) => {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { fleet, operations } = airlineData || {}

  const { region } = operations || {}

  const { airplaneTypeCount, airplanes, averageAgeYears, totalAirplane } = fleet || {}

  const sortedAirplanes = useMemo(
    () => airplanes?.sort((a, b) => b.count - a.count) || [],
    [airplanes],
  )

  const regionLower = useMemo(() => region?.toLowerCase(), [region])

  const handleImagePress = useCallback(
    (airplaneType: string, imageKey: string) => {
      router.navigate({
        params: {
          regionLower,
          selectedImageKey: imageKey,
          title: airplaneType,
        },
        pathname: '/image-modal',
      })
    },
    [regionLower],
  )

  const localeStrings = useMemo(
    () => ({
      fleetDetail: getLocale('fleetDetail'),
    }),
    [selectedLocale],
  )

  return (
    <View className="px-4 gap-y-4">
      <FleetStats
        airplaneTypeCount={airplaneTypeCount}
        averageAgeYears={averageAgeYears}
        totalAirplane={totalAirplane}
      />

      <FleetHeader colors={colors} fleetDetailText={localeStrings.fleetDetail} />

      <FleetList
        airplanes={sortedAirplanes}
        colors={colors}
        onImagePress={handleImagePress}
        region={region}
        totalAirplane={totalAirplane}
      />
    </View>
  )
}
