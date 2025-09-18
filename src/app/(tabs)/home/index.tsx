import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { FullScreenLoading } from '@/components/common'
import {
  AirplaneCard,
  DestinationCard,
  HomeAirlineCard,
  HomeAirportCard,
  NewsSection,
  SectionScroll,
} from '@/components/feature'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { useHome } from '@/hooks/services/useHome'
import { useRegisterDevice, useRegisterDeviceToUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useAuthStore from '@/store/auth'
import type { AirlineType } from '@/types/feature/airline'
import type { AirportType } from '@/types/feature/airport'
import type { PopularDestinationType, SectionType, TotalAirplaneType } from '@/types/feature/home'

interface SectionProps {
  item: SectionType
}

export default function Home() {
  const { bottom, top } = useSafeAreaInsets()

  const { homeData, isLoading } = useHome()
  const { breakingNews, popularAirlines, popularAirports, popularDestinations, totalAirplanes } =
    homeData ?? {}

  const { isAuthenticated } = useAuthStore()

  const { mutateAsync: handleAddDevice } = useRegisterDevice()
  const { mutateAsync: handleRegisterDeviceToUser } = useRegisterDeviceToUser()

  useEffect(() => {
    handleAddDevice()
  }, [handleAddDevice])

  useEffect(() => {
    if (isAuthenticated) {
      handleRegisterDeviceToUser()
    }
  }, [isAuthenticated, handleRegisterDeviceToUser])

  const getRandomItems = useCallback(<T, >(array: T[] | undefined, count = 10): T[] => {
    if (!array || array.length === 0) return []
    if (array.length <= count) return array
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }, [])

  const randomizedData = useMemo(
    () => ({
      popularAirlines: getRandomItems(popularAirlines, 10),
      popularAirports: getRandomItems(popularAirports, 10),
      popularDestinations: getRandomItems(popularDestinations, 10),
      totalAirplanes: getRandomItems(totalAirplanes, 10),
    }),
    [getRandomItems, popularAirlines, popularAirports, popularDestinations, totalAirplanes],
  )

  const navigateToAllAirlines = useCallback(() => {
    router.navigate('/all-popular-airlines')
  }, [])

  const navigateToAllAirports = useCallback(() => {
    router.navigate('/all-popular-airports')
  }, [])

  const navigateToAllDestinations = useCallback(() => {
    router.navigate('/all-popular-destinations')
  }, [])

  const navigateToAllAirplanes = useCallback(() => {
    router.navigate('/total-airplanes')
  }, [])

  const sections = useMemo(
    (): SectionType[] => [
      {
        data: breakingNews ?? [],
        type: 'news',
      },
      {
        data: randomizedData.popularAirlines,
        isHorizontal: true,
        onViewAll: navigateToAllAirlines,
        renderItem: (item: AirlineType) => <HomeAirlineCard airline={item} />,
        title: getLocale('popularAirlines'),
        type: 'airlines',
      },
      {
        data: randomizedData.popularAirports,
        isHorizontal: true,
        onViewAll: navigateToAllAirports,
        renderItem: (item: AirportType) => <HomeAirportCard airport={item} />,
        title: getLocale('popularAirports'),
        type: 'airports',
      },
      {
        data: randomizedData.popularDestinations,
        isHorizontal: true,
        onViewAll: navigateToAllDestinations,
        renderItem: (item: PopularDestinationType) => <DestinationCard destination={item} />,
        title: getLocale('popularDestinations'),
        type: 'destinations',
      },
      {
        data: randomizedData.totalAirplanes,
        isHorizontal: false,
        onViewAll: navigateToAllAirplanes,
        renderItem: (item: TotalAirplaneType) => <AirplaneCard airplane={item} />,
        title: getLocale('totalAirplanes'),
        type: 'airplanes',
      },
    ],
    [
      breakingNews,
      randomizedData,
      navigateToAllAirlines,
      navigateToAllAirports,
      navigateToAllDestinations,
      navigateToAllAirplanes,
    ],
  )

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderSection = useCallback(({ item: section }: SectionProps) => {
    if (section.type === 'news') {
      return <NewsSection breakingNews={section.data} />
    }

    return (
      <SectionScroll
        keyExtractor={(
          item: AirlineType | AirportType | PopularDestinationType | TotalAirplaneType,
        ) => item?.id}
        data={section.data}
        isHorizontal={section.isHorizontal}
        onViewAll={section.onViewAll}
        renderItemProp={section.renderItem}
        title={section.title}
        showViewAll
      />
    )
  }, [])

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <FlatList
      className="bg-background-primary"
      contentContainerStyle={{ paddingBottom: bottom + 40, paddingTop: top }}
      data={sections}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      renderItem={renderSection}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      testID="home-screen"
      updateCellsBatchingPeriod={BATCHING_PERIOD}
    />
  )
}
