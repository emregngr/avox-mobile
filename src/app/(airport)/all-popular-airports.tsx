import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header, SafeLayout } from '@/components/common'
import { AirportCard, PopularCardSkeleton } from '@/components/feature'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { useHome } from '@/hooks/services/useHome'
import { getLocale } from '@/locales/i18next'
import type { AirportType } from '@/types/feature/airport'

interface AirportCardProps {
  item: AirportType
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 500
const WINDOW_SIZE = 7

export default function AllPopularAirports() {
  const { bottom, top } = useSafeAreaInsets()

  const { homeData, isLoading } = useHome()
  const { popularAirports: airportsData } = homeData ?? {}

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirportCard = useCallback(
    ({ item }: AirportCardProps) => <AirportCard airport={item} />,
    [],
  )

  const keyExtractor = useCallback((item: AirportType) => item?.id, [])

  const getItemLayout = useCallback(
    (_: ArrayLike<AirportType> | null | undefined, index: number) => ({
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
    <SafeLayout testID="all-popular-airports-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        title={getLocale('popularAirports')}
      />
      <FlatList
        columnWrapperClassName="justify-between"
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 64 }}
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
