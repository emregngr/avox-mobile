import type { ReactNode } from 'react'
import React, { useCallback } from 'react'
import { FlatList, View } from 'react-native'

import { SectionHeader } from '@/components/feature/Home/SectionHeader'
import { cn } from '@/utils/common/cn'

const ITEMS_PER_PAGE = 4
interface SectionScrollProps<T> {
  data: T[]
  isHorizontal: boolean
  keyExtractor: (item: T) => string | number
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
  const renderItem = useCallback(
    ({ index, item }: RenderItemProps<T>) => (
      <View className={cn(`${isHorizontal && index !== data?.length - 1 ? 'mr-4' : ''}`)}>
        {renderItemProp(item, index)}
      </View>
    ),
    [data.length, isHorizontal, renderItemProp],
  )

  return (
    <View className="mb-8">
      <SectionHeader onViewAll={onViewAll as () => void} showViewAll={showViewAll} title={title} />
      <FlatList
        className={cn('flex-1', !isHorizontal ? 'px-4' : '')}
        contentContainerClassName={isHorizontal ? 'px-4' : ''}
        data={data}
        horizontal={isHorizontal}
        initialNumToRender={ITEMS_PER_PAGE}
        keyExtractor={(item: T) => keyExtractor?.(item)?.toString()}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={200}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  )
}
