import React, { useCallback } from 'react'
import { FlatList } from 'react-native'

import { AirlineCardSkeleton } from '@/components/feature/Airline'
import { AirportCardSkeleton } from '@/components/feature/Airport/AirportCardSkeleton'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'

type PopularCardSkeletonProps = {
  type: 'airport' | 'airline'
}

interface Skeleton {
  id: string
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 500
const WINDOW_SIZE = 7

const skeletonData: Skeleton[] = Array(6)
  .fill(null)
  .map((_, index) => ({ id: `skeleton-${index}` }))

export const PopularCardSkeleton = ({ type }: PopularCardSkeletonProps) => {
  const BATCHING_PERIOD = useBatchingPeriod()

  const renderItem = useCallback(
    () => (type === 'airport' ? <AirportCardSkeleton /> : <AirlineCardSkeleton />),
    [],
  )

  const keyExtractor = useCallback((item: Skeleton) => item?.id?.toString(), [])

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
      columnWrapperClassName="justify-between"
      contentContainerClassName="pt-5 px-4 pb-10"
      data={skeletonData}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_ITEMS_PER_PAGE}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
      numColumns={NUM_COLUMNS}
      renderItem={renderItem}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      updateCellsBatchingPeriod={BATCHING_PERIOD}
      windowSize={WINDOW_SIZE}
    />
  )
}
