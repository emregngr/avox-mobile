import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header, SafeLayout } from '@/components/common'
import { AirlineCard, PopularCardSkeleton } from '@/components/feature'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { useHome } from '@/hooks/services/useHome'
import { getLocale } from '@/locales/i18next'
import type { AirlineType } from '@/types/feature/airline'

interface AirlineCardProps {
  item: AirlineType
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 500
const WINDOW_SIZE = 7

export default function AllPopularAirlines() {
  const { bottom, top } = useSafeAreaInsets()

  const { homeData, isLoading } = useHome()
  const { popularAirlines: airlinesData } = homeData ?? {}

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirlineCard = useCallback(
    ({ item }: AirlineCardProps) => <AirlineCard airline={item} />,
    [],
  )

  const keyExtractor = useCallback((item: AirlineType) => item.id, [])

  const getItemLayout = useCallback(
    (_: ArrayLike<AirlineType> | null | undefined, index: number) => ({
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
    return <PopularCardSkeleton type="airline" />
  }

  return (
    <SafeLayout testID="all-popular-airlines-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        title={getLocale('popularAirlines')}
      />
      <FlatList
        columnWrapperClassName="justify-between"
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 64 }}
        data={airlinesData}
        getItemLayout={getItemLayout}
        initialNumToRender={INITIAL_ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
        numColumns={NUM_COLUMNS}
        renderItem={renderAirlineCard}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={BATCHING_PERIOD}
        windowSize={WINDOW_SIZE}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
