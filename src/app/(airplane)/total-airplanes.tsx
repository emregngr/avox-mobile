import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'

import { Header, SafeLayout } from '@/components/common'
import { AirplaneCard } from '@/components/feature'
import { getLocale } from '@/locales/i18next'
import type { TotalAirplane } from '@/types/feature/home'

const ITEMS_PER_PAGE = 6

const itemHeight = 50

interface AirplaneCardProps {
  item: TotalAirplane
}

export default function TotalAirplanes() {
  const params = useLocalSearchParams()
  const { airplanes } = params as { airplanes: string }

  const airplanesData = useMemo(() => JSON.parse(airplanes) as TotalAirplane[], [airplanes])

  const sortedAirplanesData = useMemo(
    () => airplanesData.sort((a, b) => b.count - a.count),
    [airplanesData],
  )

  const renderAirplaneCard = useCallback(
    ({ item }: AirplaneCardProps) => <AirplaneCard airplane={item} />,
    [],
  )

  const keyExtractor = useCallback((item: TotalAirplane) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (data: ArrayLike<TotalAirplane> | null | undefined, index: number) => ({
      index,
      length: itemHeight,
      offset: itemHeight * index,
    }),
    [],
  )

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={getLocale('totalAirplanes')} />
      <FlatList
        className="flex-1"
        contentContainerClassName="pt-5 px-4 pb-10"
        data={sortedAirplanesData}
        getItemLayout={getItemLayout}
        initialNumToRender={ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        renderItem={renderAirplaneCard}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={200}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
