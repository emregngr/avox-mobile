import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { FlatList, View } from 'react-native'

import { BreakingNewCard } from '@/components/feature/Home/BreakingNewCard'
import type { BreakingNew } from '@/types/feature/home'
import { cn } from '@/utils/common/cn'
import { responsive } from '@/utils/common/responsive'

const ITEMS_PER_PAGE = 3
const AUTO_SCROLL_INTERVAL = 5000
const RESTART_DELAY = 100

const itemWidth = responsive.deviceWidth

interface HomeSliderProps {
  breakingNews: BreakingNew[]
}
interface BreakingNewCardProps {
  item: BreakingNew
}

interface DotProps {
  index: number
  isActive: boolean
}

interface DotsContainerProps {
  breakingNews: BreakingNew[]
  currentIndex: number
}

const Dot = memo(({ index, isActive }: DotProps) => {
  const dotClassName = useMemo(
    () =>
      cn('w-2 h-2 rounded-full overflow-hidden', isActive ? 'bg-primary-100' : 'bg-onPrimary-100'),
    [isActive],
  )

  return (
    <View className="w-2 h-2 mx-2">
      <View className={dotClassName} />
    </View>
  )
})

Dot.displayName = 'Dot'

const DotsContainer = memo(({ breakingNews, currentIndex }: DotsContainerProps) => {
  const dots = useMemo(
    () =>
      breakingNews?.map((_, index) => (
        <Dot index={index} isActive={index === currentIndex} key={index} />
      )),
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
    ({ item }: BreakingNewCardProps) => <BreakingNewCard item={item} />,
    [],
  )

  const keyExtractor = useCallback((item: BreakingNew) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (data: ArrayLike<BreakingNew> | null | undefined, index: number) => ({
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
        data={memoizedBreakingNews}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        ref={flatListRef}
        renderItem={renderItem}
        bounces={false}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        horizontal={true}
        initialNumToRender={ITEMS_PER_PAGE}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        pagingEnabled={true}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={itemWidth}
        updateCellsBatchingPeriod={200}
        windowSize={5}
      />

      <DotsContainer breakingNews={memoizedBreakingNews} currentIndex={currentIndex} />
    </View>
  )
})

HomeSlider.displayName = 'HomeSlider'
