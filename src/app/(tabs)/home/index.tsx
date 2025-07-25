import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { FlatList } from 'react-native'

import { FullScreenLoading, SafeLayout } from '@/components/common'
import {
  AirplaneCard,
  DestinationCard,
  HomeAirlineCard,
  HomeAirportCard,
  NewsSection,
  SectionScroll,
} from '@/components/feature'
import { useHome } from '@/hooks/services/useHome'
import { useRegisterDevice, useRegisterDeviceToUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useAuthStore from '@/store/auth'
import type { Airline } from '@/types/feature/airline'
import type { Airport } from '@/types/feature/airport'
import type { PopularDestination, Section, TotalAirplane } from '@/types/feature/home'

interface SectionProps {
  item: Section
}

export default function Home() {
  const { homeData, isLoading } = useHome()
  const { breakingNews, popularAirlines, popularAirports, popularDestinations, totalAirplanes } =
    homeData || {}
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
    router.navigate({
      params: { airlines: JSON.stringify(popularAirlines) },
      pathname: '/all-popular-airlines',
    })
  }, [popularAirlines])

  const navigateToAllAirports = useCallback(() => {
    router.navigate({
      params: { airports: JSON.stringify(popularAirports) },
      pathname: '/all-popular-airports',
    })
  }, [popularAirports])

  const navigateToAllDestinations = useCallback(() => {
    router.navigate({
      params: { destinations: JSON.stringify(popularDestinations) },
      pathname: '/all-popular-destinations',
    })
  }, [popularDestinations])

  const navigateToAllAirplanes = useCallback(() => {
    router.navigate({
      params: { airplanes: JSON.stringify(totalAirplanes) },
      pathname: '/total-airplanes',
    })
  }, [totalAirplanes])

  const sections = useMemo(
    (): Section[] => [
      {
        data: breakingNews || [],
        type: 'news',
      },
      {
        data: randomizedData.popularAirlines,
        isHorizontal: true,
        onViewAll: navigateToAllAirlines,
        renderItem: (item: Airline) => <HomeAirlineCard airline={item} />,
        title: getLocale('popularAirlines'),
        type: 'airlines',
      },
      {
        data: randomizedData.popularAirports,
        isHorizontal: true,
        onViewAll: navigateToAllAirports,
        renderItem: (item: Airport) => <HomeAirportCard airport={item} />,
        title: getLocale('popularAirports'),
        type: 'airports',
      },
      {
        data: randomizedData.popularDestinations,
        isHorizontal: true,
        onViewAll: navigateToAllDestinations,
        renderItem: (item: PopularDestination) => <DestinationCard destination={item} />,
        title: getLocale('popularDestinations'),
        type: 'destinations',
      },
      {
        data: randomizedData.totalAirplanes,
        isHorizontal: false,
        onViewAll: navigateToAllAirplanes,
        renderItem: (item: TotalAirplane) => <AirplaneCard airplane={item} />,
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

  const renderSection = useCallback(({ item: section }: SectionProps) => {
    if (section.type === 'news') {
      return <NewsSection breakingNews={section.data} />
    }

    return (
      <SectionScroll
        keyExtractor={(item: Airline | Airport | PopularDestination | TotalAirplane) =>
          item?.id?.toString()
        }
        data={section.data}
        isHorizontal={section.isHorizontal}
        onViewAll={section.onViewAll}
        renderItemProp={section.renderItem}
        title={section.title}
        showViewAll
      />
    )
  }, [])

  return (
    <SafeLayout>
      {isLoading ? (
        <FullScreenLoading />
      ) : (
        <FlatList
          className="flex-1"
          data={sections}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          renderItem={renderSection}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeLayout>
  )
}
