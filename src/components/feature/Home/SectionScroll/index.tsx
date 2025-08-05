import type { ReactNode } from 'react'
import React, { useCallback } from 'react'
import { FlatList, View } from 'react-native'

import { SectionHeader } from '@/components/feature/Home/SectionHeader'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'

const INITIAL_ITEMS_PER_PAGE = 10
const MAX_ITEMS_PER_BATCH = 10
const WINDOW_SIZE = 7

interface SectionScrollProps<T> {
  data: T[]
  isHorizontal: boolean
  keyExtractor: (item: T) => string
  onViewAll?: () => void
  renderItemProp: (item: T, index: number) => ReactNode
  showViewAll?: boolean
  title: string
}

interface RenderItemProps<T> {
  index: number
  item: T
}

export function SectionScroll<T>({
  data,
  isHorizontal,
  keyExtractor,
  onViewAll,
  renderItemProp,
  showViewAll = false,
  title,
}: SectionScrollProps<T>) {
  const BATCHING_PERIOD = useBatchingPeriod()

  const renderItem = useCallback(
    ({ index, item }: RenderItemProps<T>) => (
      <View className={`${isHorizontal && index !== data?.length - 1 ? 'mr-4' : ''}`}>
        {renderItemProp(item, index)}
      </View>
    ),
    [data.length, isHorizontal, renderItemProp],
  )

  return (
    <View className="mb-8">
      <SectionHeader onViewAll={onViewAll as () => void} showViewAll={showViewAll} title={title} />
      <FlatList
        className={!isHorizontal ? 'px-4' : ''}
        contentContainerClassName={isHorizontal ? 'px-4' : ''}
        data={data}
        horizontal={isHorizontal}
        initialNumToRender={INITIAL_ITEMS_PER_PAGE}
        keyExtractor={(item: T) => keyExtractor?.(item)}
        maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={BATCHING_PERIOD}
        windowSize={WINDOW_SIZE}
      />
    </View>
  )
}
