import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'

import { Header, SafeLayout } from '@/components/common'
import { AirportCard, PopularCardSkeleton } from '@/components/feature'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { useHome } from '@/hooks/services/useHome'
import { getLocale } from '@/locales/i18next'
import type { Airport } from '@/types/feature/airport'

interface AirportCardProps {
  item: Airport
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 500
const WINDOW_SIZE = 7

export default function AllPopularAirports() {
  const { homeData, isLoading } = useHome()
  const { popularAirports: airportsData } = homeData ?? {}

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirportCard = useCallback(
    ({ item }: AirportCardProps) => <AirportCard airport={item} />,
    [],
  )

  const keyExtractor = useCallback((item: Airport) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (_: ArrayLike<Airport> | null | undefined, index: number) => ({
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
    return <PopularCardSkeleton type="airport" />
  }

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={getLocale('popularAirports')} />
      <FlatList
        columnWrapperClassName="justify-between"
        contentContainerClassName="pt-5 px-4 pb-10"
        data={airportsData}
        getItemLayout={getItemLayout}
        initialNumToRender={INITIAL_ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
        numColumns={NUM_COLUMNS}
        renderItem={renderAirportCard}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={BATCHING_PERIOD}
        windowSize={WINDOW_SIZE}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
