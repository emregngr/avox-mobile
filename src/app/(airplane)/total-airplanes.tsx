import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'

import { FullScreenLoading, Header, SafeLayout } from '@/components/common'
import { AirplaneCard } from '@/components/feature'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { useHome } from '@/hooks/services/useHome'
import { getLocale } from '@/locales/i18next'
import type { TotalAirplane } from '@/types/feature/home'

interface AirplaneCardProps {
  item: TotalAirplane
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const ITEM_HEIGHT = 50
const WINDOW_SIZE = 7

export default function TotalAirplanes() {
  const { homeData, isLoading } = useHome()
  const { totalAirplanes: airplanesData } = homeData ?? {}

  const sortedAirplanesData = useMemo(
    () => airplanesData?.sort((a, b) => b.count - a.count),
    [airplanesData],
  )

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirplaneCard = useCallback(
    ({ item }: AirplaneCardProps) => <AirplaneCard airplane={item} />,
    [],
  )

  const keyExtractor = useCallback((item: TotalAirplane) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (_: ArrayLike<TotalAirplane> | null | undefined, index: number) => ({
      index,
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
    }),
    [],
  )

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={getLocale('totalAirplanes')} />
      <FlatList
        contentContainerClassName="pt-5 px-4 pb-10"
        data={sortedAirplanesData}
        getItemLayout={getItemLayout}
        initialNumToRender={INITIAL_ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
        renderItem={renderAirplaneCard}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={BATCHING_PERIOD}
        windowSize={WINDOW_SIZE}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
