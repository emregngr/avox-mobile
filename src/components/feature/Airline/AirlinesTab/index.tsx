import { Ionicons } from '@expo/vector-icons'
import type BottomSheet from '@gorhom/bottom-sheet'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { SearchInput } from '@/components/common/SearchInput'
import { ThemedText } from '@/components/common/ThemedText'
import { ActiveFilters } from '@/components/feature/ActiveFilters'
import { AirlineCard, AirlinesLoadMoreFooter } from '@/components/feature/Airline/AirlineCard'
import { SkeletonAirlineCard } from '@/components/feature/Airline/SkeletonAirlineCard'
import { FilterModal } from '@/components/feature/FilterModal'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'
import { cn } from '@/utils/common/cn'

const ITEMS_PER_PAGE = 6
const itemHeight = 500

const HEADER_HEIGHT = 160
const OPACITY_START_THRESHOLD = 20
const MIN_SCROLL_DELTA = 2

interface AirlinesFilters {
  [key: string]: any
}
interface AirlineCardProps {
  item: Airline
}

const skeletonData = Array(6)
  .fill(null)
  .map((_, index) => ({ id: `skeleton-${index}` }))

const renderAirlineSkeleton = () => <SkeletonAirlineCard />

const renderAirlineCard = ({ item }: AirlineCardProps) => <AirlineCard airline={item} />

const getItemLayout = (data: ArrayLike<Airline> | null | undefined, index: number) => ({
  index,
  length: itemHeight,
  offset: itemHeight * index,
})

interface AirlinesTabProps {
  airlineFiltersCount: number
  airlinesFilters: AirlinesFilters
  airlinesHasMore: boolean
  airlinesLoading: boolean
  airlinesSearchLoading: boolean
  airlinesSearchTerm: string
  loadMoreAirlines: () => void
  paginatedAirlines: Airline[]
  setAirlinesFilters: (filters: AirlinesFilters) => void
  setAirlinesSearchTerm: (term: string) => void
}

export const AirlinesTab = memo(
  ({
    airlineFiltersCount,
    airlinesFilters,
    airlinesHasMore,
    airlinesLoading,
    airlinesSearchLoading,
    airlinesSearchTerm,
    loadMoreAirlines,
    paginatedAirlines,
    setAirlinesFilters,
    setAirlinesSearchTerm,
  }: AirlinesTabProps) => {
    const { selectedTheme } = useThemeStore()

    const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

    const sheetRef = useRef<BottomSheet>(null)

    const scrollY = useSharedValue<number>(0)
    const lastScrollY = useSharedValue<number>(0)
    const headerTranslateY = useSharedValue<number>(0)
    const headerOpacity = useSharedValue<number>(1)
    const headerScale = useSharedValue<number>(1)
    const isScrolling = useSharedValue<boolean>(false)

    const handleOpenPress = useCallback(() => sheetRef?.current?.snapToIndex(1), [])
    const handleClosePress = useCallback(() => sheetRef?.current?.close(), [])

    const handleRemoveAirlineFilter = useCallback(
      (key: string) => {
        const newFilters = { ...airlinesFilters }
        delete newFilters[key]
        setAirlinesFilters(newFilters)
      },
      [airlinesFilters, setAirlinesFilters],
    )

    const handleClearAllFilters = useCallback(() => {
      setAirlinesFilters({})
    }, [setAirlinesFilters])

    const scrollHandler = useAnimatedScrollHandler({
      onBeginDrag: () => {
        isScrolling.value = true
      },

      onEndDrag: () => {
        isScrolling.value = false
        const currentScrollY = scrollY.value

        if (currentScrollY <= OPACITY_START_THRESHOLD) {
          headerTranslateY.value = withSpring(0)
          headerOpacity.value = withTiming(1, {
            duration: 200,
          })
          headerScale.value = withSpring(1)
        }
      },

      onMomentumEnd: () => {
        isScrolling.value = false
        const currentScrollY = scrollY.value

        if (currentScrollY <= OPACITY_START_THRESHOLD) {
          headerTranslateY.value = withSpring(0)
          headerOpacity.value = withTiming(1, {
            duration: 200,
          })
          headerScale.value = withSpring(1)
        }
      },

      onScroll: event => {
        const currentScrollY = event.contentOffset.y
        const scrollDelta = currentScrollY - lastScrollY.value

        if (Math.abs(scrollDelta) < MIN_SCROLL_DELTA) {
          return
        }

        scrollY.value = currentScrollY

        const isScrollingDown = scrollDelta > 0
        const isAtTop = currentScrollY <= OPACITY_START_THRESHOLD

        if (isAtTop) {
          headerTranslateY.value = withSpring(0)

          headerOpacity.value = withTiming(1, {
            duration: 200,
          })

          headerScale.value = withSpring(1)
        } else {
          if (isScrollingDown) {
            const hideProgress = Math.min(
              (currentScrollY - OPACITY_START_THRESHOLD) / HEADER_HEIGHT,
              1,
            )

            headerTranslateY.value = withSpring(-HEADER_HEIGHT * hideProgress * 0.6)

            const opacityProgress = interpolate(
              currentScrollY,
              [OPACITY_START_THRESHOLD, HEADER_HEIGHT],
              [1, 0.3],
              Extrapolation.CLAMP,
            )

            headerOpacity.value = withTiming(opacityProgress, {
              duration: 200,
            })

            headerScale.value = withSpring(0.95)
          } else {
            const currentParallaxOffset = interpolate(
              currentScrollY,
              [0, HEADER_HEIGHT, HEADER_HEIGHT * 2],
              [0, -5, -10],
              Extrapolation.CLAMP,
            )

            headerTranslateY.value = withSpring(-currentParallaxOffset)

            headerOpacity.value = withTiming(1, {
              duration: 150,
            })

            headerScale.value = withSpring(1)
          }
        }

        lastScrollY.value = currentScrollY
      },
    })

    const headerAnimatedStyle = useAnimatedStyle(() => {
      const parallaxOffset = interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT, HEADER_HEIGHT * 2],
        [0, -5, -10],
        Extrapolation.CLAMP,
      )

      return {
        opacity: headerOpacity.value,
        transform: [
          { translateY: headerTranslateY.value + parallaxOffset },
          { scale: headerScale.value },
        ],
      }
    })

    const searchInputStyle = useAnimatedStyle(() => {
      const inputScale = interpolate(
        headerOpacity.value,
        [0, 0.5, 1],
        [0.96, 0.98, 1],
        Extrapolation.CLAMP,
      )

      return {
        marginTop: 44,
        opacity: headerOpacity.value,
        transform: [{ scale: inputScale }],
      }
    })

    const filterButtonStyle = useAnimatedStyle(() => {
      const buttonScale = interpolate(
        headerOpacity.value,
        [0, 0.5, 1],
        [0.92, 0.96, 1],
        Extrapolation.CLAMP,
      )

      return {
        opacity: headerOpacity.value,
        transform: [{ scale: buttonScale }],
      }
    })

    const searchPlaceholder = useMemo(() => getLocale('airlineSearchPlaceholder'), [])

    const hasActiveFilters = useMemo(
      () => Object?.keys(airlinesFilters)?.length > 0,
      [airlinesFilters],
    )

    const filterButtonClassName = useMemo(
      () =>
        cn(
          'w-12 h-12 rounded-xl items-center justify-center',
          hasActiveFilters ? 'bg-background-quaternary' : 'bg-background-tertiary',
        ),
      [hasActiveFilters],
    )

    const filterIconColor = useMemo(
      () => (hasActiveFilters ? colors?.onPrimary100 : colors?.onPrimary70),
      [hasActiveFilters, colors],
    )

    const flatListData = useMemo(
      () => (airlinesSearchLoading ? skeletonData : paginatedAirlines),
      [airlinesSearchLoading, paginatedAirlines],
    )

    const renderItem = useMemo(() => {
      if (airlinesSearchLoading) {
        return renderAirlineSkeleton
      }
      return renderAirlineCard
    }, [airlinesSearchLoading])

    const keyExtractor = useCallback((item: Airline) => item?.id?.toString(), [])

    const listFooterComponent = useMemo(
      () =>
        !airlinesSearchLoading ? (
          <AirlinesLoadMoreFooter
            airlinesHasNext={airlinesHasMore}
            airlinesLoading={airlinesLoading}
            flatAirlinesData={paginatedAirlines}
          />
        ) : null,
      [airlinesSearchLoading, airlinesLoading, paginatedAirlines, airlinesHasMore],
    )

    return (
      <View className="flex-1">
        <Animated.View
          className="absolute top-0 left-0 right-0 z-40 bg-background-primary"
          style={headerAnimatedStyle}
        >
          <Animated.View style={searchInputStyle}>
            <SearchInput
              onChangeText={setAirlinesSearchTerm}
              placeholder={searchPlaceholder}
              value={airlinesSearchTerm}
            />
          </Animated.View>

          <View className="flex-row h-12 mr-6 my-2 items-center">
            <ActiveFilters
              filters={airlinesFilters}
              onClearAll={handleClearAllFilters}
              onRemove={handleRemoveAirlineFilter}
            />
            <Animated.View className="absolute right-0" style={filterButtonStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                className={filterButtonClassName}
                hitSlop={20}
                onPress={handleOpenPress}
              >
                {hasActiveFilters ? (
                  <View className="absolute top-[-3px] right-[-3px] bg-secondary-100 rounded-full overflow-hidden py-[1px] px-[4px] items-center justify-center z-50">
                    <ThemedText color="text-100" type="body3">
                      {airlineFiltersCount}
                    </ThemedText>
                  </View>
                ) : null}
                <Ionicons color={filterIconColor} name="filter" size={24} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.FlatList
          data={
            flatListData as
              | ArrayLike<Airline>
              | SharedValue<ArrayLike<Airline> | null | undefined>
              | null
              | undefined
          }
          alwaysBounceVertical={false}
          bouncesZoom={false}
          className="flex-1"
          columnWrapperClassName="justify-between"
          contentContainerClassName="pt-[148px] px-4 pb-10"
          decelerationRate="normal"
          getItemLayout={getItemLayout}
          initialNumToRender={ITEMS_PER_PAGE}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          keyExtractor={keyExtractor}
          ListFooterComponent={listFooterComponent}
          maxToRenderPerBatch={ITEMS_PER_PAGE}
          numColumns={2}
          onEndReached={loadMoreAirlines}
          onEndReachedThreshold={0.1}
          onScroll={scrollHandler}
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={200}
          windowSize={5}
          disableIntervalMomentum
          removeClippedSubviews
        />

        <FilterModal
          currentFilters={airlinesFilters}
          onApply={setAirlinesFilters}
          onClose={handleClosePress}
          ref={sheetRef}
          type="airlines"
        />
      </View>
    )
  },
)
