import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AirlineCardSkeleton } from '@/components/feature/Airline'
import { AirportCardSkeleton } from '@/components/feature/Airport'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'

interface Skeleton {
  id: string
}

interface SkeletonListProps {
  type: 'airport' | 'airline'
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 500
const WINDOW_SIZE = 7

const skeletonData: Skeleton[] = Array(6)
  .fill(null)
  .map((_, index) => ({ id: `skeleton-${index}` }))

export const FavoriteSkeleton = ({ type }: SkeletonListProps) => {
  const { bottom } = useSafeAreaInsets()

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderItem = useCallback(
    () => (type === 'airport' ? <AirportCardSkeleton /> : <AirlineCardSkeleton />),
    [],
  )

  const keyExtractor = useCallback((item: Skeleton) => item?.id, [])

  const getItemLayout = useCallback(
    (_: ArrayLike<Skeleton> | null | undefined, index: number) => ({
      index,
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
    }),
    [],
  )

  return (
    <FlatList
      className="mt-[52px]"
      columnWrapperClassName="justify-between"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingBottom: bottom + 72 }}
      data={skeletonData}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_ITEMS_PER_PAGE}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
      numColumns={NUM_COLUMNS}
      renderItem={renderItem}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      testID="favorite-skeleton-flatlist"
      updateCellsBatchingPeriod={BATCHING_PERIOD}
      windowSize={WINDOW_SIZE}
      removeClippedSubviews
    />
  )
}
