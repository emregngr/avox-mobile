import { router } from 'expo-router'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { FlatList, View } from 'react-native'

import {
  OnboardingItem,
  SafeLayout,
  ThemedButtonText,
  ThemedGradientButton,
} from '@/components/common'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { getLocale } from '@/locales/i18next'
import { setIsOnboardingSeen } from '@/store/user'
import type { OnboardingsType, OnboardingType } from '@/types/common/onboarding'
import { cn } from '@/utils/common/cn'
import { responsive } from '@/utils/common/responsive'

interface OnboardingItemProps {
  item: OnboardingType
}
interface DotProps {
  isActive: boolean
}

interface DotsContainerProps {
  currentIndex: number
  length: number
}

const INITIAL_ITEMS_PER_PAGE = 4
const MAX_ITEMS_PER_BATCH = 3
const ITEM_WIDTH = responsive.deviceWidth
const WINDOW_SIZE = 7

export default function Onboarding() {
  const flatListRef = useRef<FlatList>(null)

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const onboardings = useMemo(
    (): OnboardingsType => [
      {
        id: '1',
        image: require('@/assets/images/onboarding/1.webp'),
        text: getLocale('onboardingText1'),
        title: getLocale('onboardingTitle1'),
      },
      {
        id: '2',
        image: require('@/assets/images/onboarding/2.webp'),
        text: getLocale('onboardingText2'),
        title: getLocale('onboardingTitle2'),
      },
      {
        id: '3',
        image: require('@/assets/images/onboarding/3.webp'),
        text: getLocale('onboardingText3'),
        title: getLocale('onboardingTitle3'),
      },
      {
        id: '4',
        image: require('@/assets/images/onboarding/4.webp'),
        text: getLocale('onboardingText4'),
        title: getLocale('onboardingTitle4'),
      },
    ],
    [],
  )

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH)
    setCurrentIndex(index)
  }, [])

  const handlePressNext = useCallback(() => {
    if (currentIndex === onboardings?.length - 1) {
      setIsOnboardingSeen(true)
      router.replace('/home')
    } else {
      flatListRef.current?.scrollToIndex({ animated: true, index: currentIndex + 1 })
    }
  }, [currentIndex, onboardings])

  const handleSkip = useCallback(() => {
    setIsOnboardingSeen(true)
    router.replace('/home')
  }, [])

  const BATCHING_PERIOD = useBatchingPeriod()

  const buttonLabel = useMemo(
    () => (currentIndex === onboardings?.length - 1 ? getLocale('skip') : getLocale('continue')),
    [currentIndex, onboardings?.length],
  )

  const renderItem = useCallback(
    ({ item }: OnboardingItemProps) => <OnboardingItem item={item} />,
    [],
  )

  const keyExtractor = useCallback((item: OnboardingType) => item?.id, [])

  const getItemLayout = useCallback(
    (_: ArrayLike<OnboardingType> | null | undefined, index: number) => ({
      index,
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
    }),
    [],
  )

  return (
    <SafeLayout edges={['bottom']} testID="onboarding-screen" topBlur={false}>
      <ThemedButtonText
        containerStyle="self-end mr-4 mt-6 z-10 p-2 rounded-full overflow-hidden bg-background-quaternary"
        hitSlop={20}
        label={getLocale('skip')}
        onPress={handleSkip}
        testID="onboarding-skip-button"
        textColor="text-100"
        type="h4"
      />

      <FlatList
        bounces={false}
        data={onboardings}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        initialNumToRender={INITIAL_ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
        onScroll={onScroll}
        overScrollMode="never"
        ref={flatListRef}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        testID="onboarding-flatlist"
        updateCellsBatchingPeriod={BATCHING_PERIOD}
        windowSize={WINDOW_SIZE}
        disableIntervalMomentum
        horizontal
        pagingEnabled
      />

      <View className="w-full px-4 pb-6">
        <ThemedGradientButton
          label={buttonLabel}
          onPress={handlePressNext}
          testID={currentIndex === onboardings?.length - 1 ? 'skip-button' : 'continue-button'}
          type="secondary"
        />

        <DotsContainer currentIndex={currentIndex} length={onboardings?.length} />
      </View>
    </SafeLayout>
  )
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

const DotsContainer = memo(({ currentIndex, length }: DotsContainerProps) => {
  const dots = useMemo(
    () => Array.from({ length }, (_, i) => <Dot isActive={i === currentIndex} key={i} />),
    [currentIndex, length],
  )

  return <View className="flex-row justify-center mt-8">{dots}</View>
})

DotsContainer.displayName = 'DotsContainer'
