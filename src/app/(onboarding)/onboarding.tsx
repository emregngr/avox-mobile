import { router } from 'expo-router'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { FlatList, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { OnboardingItem, SafeLayout, ThemedButton, ThemedButtonText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import { setIsOnBoardingSeen } from '@/store/user'
import type { OnBoardingsType, OnBoardingType } from '@/types/common/onBoarding'
import { cn } from '@/utils/common/cn'
import { responsive } from '@/utils/common/responsive'

const ITEMS_PER_PAGE = 3

const itemWidth = responsive.deviceWidth

interface OnboardingItemProps {
  item: OnBoardingType
}
interface DotProps {
  currentIndex: number
  length: number
}

export default function OnBoarding() {
  const insets = useSafeAreaInsets()
  const flatListRef = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const onBoardings = useMemo(
    (): OnBoardingsType => [
      {
        id: 1,
        image: require('@/assets/images/onBoarding/1.webp'),
        text: getLocale('onBoardingText1'),
        title: getLocale('onBoardingTitle1'),
      },
      {
        id: 2,
        image: require('@/assets/images/onBoarding/2.webp'),
        text: getLocale('onBoardingText2'),
        title: getLocale('onBoardingTitle2'),
      },
      {
        id: 3,
        image: require('@/assets/images/onBoarding/3.webp'),
        text: getLocale('onBoardingText3'),
        title: getLocale('onBoardingTitle3'),
      },
      {
        id: 4,
        image: require('@/assets/images/onBoarding/4.webp'),
        text: getLocale('onBoardingText4'),
        title: getLocale('onBoardingTitle4'),
      },
    ],
    [],
  )

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / itemWidth)
    setCurrentIndex(index)
  }, [])

  const handlePressNext = useCallback(() => {
    if (currentIndex === onBoardings?.length - 1) {
      setIsOnBoardingSeen(true)
      router.replace('/home')
    } else {
      flatListRef.current?.scrollToIndex({ animated: true, index: currentIndex + 1 })
    }
  }, [currentIndex, onBoardings])

  const handleSkip = useCallback(() => {
    setIsOnBoardingSeen(true)
    router.replace('/home')
  }, [])

  const renderItem = useCallback(
    ({ item }: OnboardingItemProps) => <OnboardingItem item={item} />,
    [],
  )

  const keyExtractor = useCallback((item: OnBoardingType) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (data: ArrayLike<OnBoardingType> | null | undefined, index: number) => ({
      index,
      length: itemWidth,
      offset: itemWidth * index,
    }),
    [],
  )

  const skipButtonStyle = useMemo(
    () => ({
      top: insets.top + 20,
    }),
    [insets.top],
  )

  const bottomContainerStyle = useMemo(
    () => ({
      paddingBottom: insets.bottom + 20,
    }),
    [insets.bottom],
  )

  const buttonLabel = useMemo(
    () => (currentIndex === onBoardings?.length - 1 ? getLocale('skip') : getLocale('continue')),
    [currentIndex, onBoardings?.length],
  )

  return (
    <View className="flex-1 bg-background-primary">
      <View className="absolute right-4 z-10" style={skipButtonStyle}>
        <ThemedButtonText
          containerStyle="p-2 rounded-full overflow-hidden bg-background-quaternary"
          label={getLocale('skip')}
          onPress={handleSkip}
          textColor="text-100"
          type="h4"
        />
      </View>

      <SafeLayout edges={['top', 'left', 'right', 'bottom']}>
        <FlatList
          bounces={false}
          data={onBoardings}
          decelerationRate="fast"
          getItemLayout={getItemLayout}
          initialNumToRender={ITEMS_PER_PAGE}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={ITEMS_PER_PAGE}
          onScroll={handleScroll}
          ref={flatListRef}
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          updateCellsBatchingPeriod={200}
          windowSize={5}
          disableIntervalMomentum
          horizontal
          pagingEnabled
          removeClippedSubviews
        />
      </SafeLayout>

      <View className="absolute bottom-0 w-full px-4" style={bottomContainerStyle}>
        <ThemedButton label={buttonLabel} onPress={handlePressNext} type="border" />
        <Dot currentIndex={currentIndex} length={onBoardings?.length} />
      </View>
    </View>
  )
}

const Dot = memo(({ currentIndex, length }: DotProps) => {
  const dots = useMemo(
    () =>
      Array.from({ length }, (_, i) => (
        <View className="w-2 h-2 mx-2" key={i}>
          <View
            className={cn(
              'w-2 h-2 rounded-full overflow-hidden',
              i === currentIndex ? 'bg-onPrimary-100' : 'bg-onPrimary-50',
            )}
          />
        </View>
      )),
    [currentIndex, length],
  )

  return <View className="flex-row justify-center mt-8">{dots}</View>
})
