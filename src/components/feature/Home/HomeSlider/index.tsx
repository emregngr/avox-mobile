import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { FlatList, View } from 'react-native'

import { BreakingNewsCard } from '@/components/feature/Home/BreakingNewsCard'
import type { BreakingNews } from '@/types/feature/home'
import { cn } from '@/utils/common/cn'
import { responsive } from '@/utils/common/responsive'

const ITEMS_PER_PAGE = 3
const AUTO_SCROLL_INTERVAL = 5000
const RESTART_DELAY = 100

const itemWidth = responsive.deviceWidth

interface HomeSliderProps {
  breakingNews: BreakingNews[]
}
interface BreakingNewsCardProps {
  item: BreakingNews
}

interface DotProps {
  isActive: boolean
}

interface DotsContainerProps {
  breakingNews: BreakingNews[]
  currentIndex: number
}

const Dot = memo(({ isActive }: DotProps) => {
  const dotClassName = useMemo(
    () =>
      cn('w-2 h-2 rounded-full overflow-hidden', isActive ? 'bg-onPrimary-100' : 'bg-onPrimary-50'),
    [isActive],
  )

  return (
    <View className="w-2 h-2 mx-1.5">
      <View className={dotClassName} />
    </View>
  )
})

Dot.displayName = 'Dot'

const DotsContainer = memo(({ breakingNews, currentIndex }: DotsContainerProps) => {
  const dots = useMemo(
    () => breakingNews?.map((_, i) => <Dot isActive={i === currentIndex} key={i} />),
    [breakingNews, currentIndex],
  )

  return <View className="flex-row justify-center mt-4">{dots}</View>
})

DotsContainer.displayName = 'DotsContainer'

export const HomeSlider = memo(({ breakingNews }: HomeSliderProps) => {
  const flatListRef = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const memoizedBreakingNews = useMemo(() => breakingNews || [], [breakingNews])

  const clearAutoScroll = useCallback(() => {
    if (intervalRef?.current) {
      clearInterval(intervalRef?.current)
      intervalRef.current = null
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    clearAutoScroll()

    if (memoizedBreakingNews && memoizedBreakingNews?.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % memoizedBreakingNews?.length

          const targetOffset = nextIndex * itemWidth
          flatListRef?.current?.scrollToOffset({
            animated: true,
            offset: targetOffset,
          })

          return nextIndex
        })
      }, AUTO_SCROLL_INTERVAL)
    }
  }, [memoizedBreakingNews, clearAutoScroll])

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollX = e?.nativeEvent?.contentOffset?.x
      const newIndex = Math?.round(scrollX / itemWidth)

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < memoizedBreakingNews?.length) {
        setCurrentIndex(newIndex)
      }
    },
    [currentIndex, memoizedBreakingNews?.length],
  )

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollX = e?.nativeEvent?.contentOffset?.x
      const newIndex = Math?.round(scrollX / itemWidth)

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < memoizedBreakingNews?.length) {
        setCurrentIndex(newIndex)
      }

      setTimeout(() => {
        startAutoScroll()
      }, RESTART_DELAY)
    },
    [currentIndex, memoizedBreakingNews?.length, startAutoScroll],
  )

  const onScrollBeginDrag = useCallback(() => {
    clearAutoScroll()
  }, [clearAutoScroll])

  const renderItem = useCallback(
    ({ item }: BreakingNewsCardProps) => <BreakingNewsCard item={item} />,
    [],
  )

  const keyExtractor = useCallback((item: BreakingNews) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (data: ArrayLike<BreakingNews> | null | undefined, index: number) => ({
      index,
      length: itemWidth,
      offset: itemWidth * index,
    }),
    [],
  )

  useEffect(() => {
    startAutoScroll()
    return () => clearAutoScroll()
  }, [startAutoScroll, clearAutoScroll])

  const shouldRender = useMemo(
    () => memoizedBreakingNews && memoizedBreakingNews?.length > 0,
    [memoizedBreakingNews],
  )

  if (!shouldRender) {
    return null
  }

  return (
    <View>
      <FlatList
        bounces={false}
        data={memoizedBreakingNews}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        initialNumToRender={ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        ref={flatListRef}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={itemWidth}
        updateCellsBatchingPeriod={200}
        windowSize={5}
        disableIntervalMomentum
        horizontal
        pagingEnabled
        removeClippedSubviews
      />

      <DotsContainer breakingNews={memoizedBreakingNews} currentIndex={currentIndex} />
    </View>
  )
})

HomeSlider.displayName = 'HomeSlider'
