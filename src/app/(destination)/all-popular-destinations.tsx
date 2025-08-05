import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'

import { FullScreenLoading, Header, SafeLayout } from '@/components/common'
import { DestinationCard } from '@/components/feature'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { useHome } from '@/hooks/services/useHome'
import { getLocale } from '@/locales/i18next'
import type { PopularDestination } from '@/types/feature/home'

interface DestinationCardProps {
  item: PopularDestination
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 280
const WINDOW_SIZE = 7

export default function AllPopularDestinations() {
  const { homeData, isLoading } = useHome()
  const { popularDestinations: destinationsData } = homeData ?? {}

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderDestinationCard = useCallback(
    ({ item }: DestinationCardProps) => <DestinationCard destination={item} />,
    [],
  )

  const keyExtractor = useCallback((item: PopularDestination) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (_: ArrayLike<PopularDestination> | null | undefined, index: number) => ({
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
      <Header backIconOnPress={handleBackPress} title={getLocale('popularDestinations')} />
      <FlatList
        columnWrapperClassName="justify-between gap-x-4"
        contentContainerClassName="pt-5 px-4 pb-10 self-center"
        data={destinationsData}
        getItemLayout={getItemLayout}
        initialNumToRender={INITIAL_ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
        numColumns={NUM_COLUMNS}
        renderItem={renderDestinationCard}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={BATCHING_PERIOD}
        windowSize={WINDOW_SIZE}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
