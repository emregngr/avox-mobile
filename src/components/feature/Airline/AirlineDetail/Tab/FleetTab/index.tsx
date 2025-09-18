import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { FleetHeader } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetHeader'
import { FleetList } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetList'
import { FleetStats } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetStats'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { AirlineType } from '@/types/feature/airline'

interface FleetTabProps {
  airlineData: AirlineType
}

export const FleetTab = ({ airlineData }: FleetTabProps) => {
  const { selectedLocale } = useLocaleStore()

  const { fleet, operations } = airlineData ?? {}
  const { region } = operations ?? {}
  const { airplaneTypeCount, airplanes, averageAgeYears, totalAirplane } = fleet ?? {}

  const sortedAirplanes = useMemo(() => airplanes?.sort((a, b) => b.count - a.count), [airplanes])

  const handleImagePress = useCallback((airplaneType: string, imageKey: string) => {
    router.navigate({
      params: {
        selectedImageKey: imageKey,
        title: airplaneType,
      },
      pathname: '/image-modal',
    })
  }, [])

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

      <FleetHeader fleetDetailText={localeStrings.fleetDetail} />

      <FleetList
        airplanes={sortedAirplanes}
        onImagePress={handleImagePress}
        region={region}
        totalAirplane={totalAirplane}
      />
    </View>
  )
}
