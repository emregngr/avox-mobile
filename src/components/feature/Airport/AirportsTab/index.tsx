import { MaterialCommunityIcons } from '@expo/vector-icons'
import type BottomSheet from '@gorhom/bottom-sheet'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SearchInput } from '@/components/common/SearchInput'
import { ThemedText } from '@/components/common/ThemedText'
import { ActiveFilters } from '@/components/feature/ActiveFilters'
import { AirportCard, AirportsLoadMoreFooter } from '@/components/feature/Airport/AirportCard'
import { AirportCardSkeleton } from '@/components/feature/Airport/AirportCardSkeleton'
import { FilterModal } from '@/components/feature/FilterModal'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { AirportType } from '@/types/feature/airport'
import { cn } from '@/utils/common/cn'

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const WINDOW_SIZE = 7

const HEADER_HEIGHT = 160
const OPACITY_START_THRESHOLD = 20
const MIN_SCROLL_DELTA = 2

interface AirportsFilters {
  [key: string]: any
}

interface AirportCardProps {
  item: AirportType
}

interface Skeleton {
  id: string
}

const skeletonData: Skeleton[] = Array(6)
  .fill(null)
  .map((_, index) => ({ id: `skeleton-${index}` }))

interface AirportsTabProps {
  airportsFilters: AirportsFilters
  airportsFiltersCount: number
  airportsHasMore: boolean
  airportsLoading: boolean
  airportsSearchLoading: boolean
  airportsSearchTerm: string
  loadMoreAirports: () => void
  paginatedAirports: AirportType[]
  setAirportsFilters: (filters: AirportsFilters) => void
  setAirportsSearchTerm: (term: string) => void
}

export const AirportsTab = memo(
  ({
    airportsFilters,
    airportsFiltersCount,
    airportsHasMore,
    airportsLoading,
    airportsSearchLoading,
    airportsSearchTerm,
    loadMoreAirports,
    paginatedAirports,
    setAirportsFilters,
    setAirportsSearchTerm,
  }: AirportsTabProps) => {
    const { bottom } = useSafeAreaInsets()

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

    const handleRemoveAirportFilter = useCallback(
      (key: string) => {
        const newFilters = { ...airportsFilters }
        delete newFilters[key]
        setAirportsFilters(newFilters)
      },
      [airportsFilters, setAirportsFilters],
    )

    const handleClearAllFilters = useCallback(() => {
      setAirportsFilters({})
    }, [setAirportsFilters])

    const scrollHandler = useAnimatedScrollHandler({
      onBeginDrag: () => {
        'worklet'
        isScrolling.value = true
      },

      onEndDrag: () => {
        'worklet'
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
        'worklet'
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
        'worklet'
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
              duration: 200,
            })

            headerScale.value = withSpring(1)
          }
        }

        lastScrollY.value = currentScrollY
      },
    })

    const headerAnimatedStyle = useAnimatedStyle(() => {
      'worklet'
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
    }, [])

    const searchInputStyle = useAnimatedStyle(() => {
      'worklet'
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
    }, [])

    const filterButtonStyle = useAnimatedStyle(() => {
      'worklet'
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
    }, [])

    const hasActiveFilters = useMemo(
      () => Object?.keys(airportsFilters)?.length > 0,
      [airportsFilters],
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
      () => (airportsSearchLoading ? skeletonData : paginatedAirports),
      [airportsSearchLoading, paginatedAirports],
    )

    const BATCHING_PERIOD = useBatchingPeriod()

    const renderAirportSkeleton = useCallback(() => <AirportCardSkeleton />, [])

    const renderAirportCard = useCallback(
      ({ item }: AirportCardProps) => <AirportCard airport={item} />,
      [],
    )

    const keyExtractor = useCallback((item: AirportType) => item?.id, [])

    const renderItem = useMemo(() => {
      if (airportsSearchLoading) {
        return renderAirportSkeleton
      }
      return renderAirportCard
    }, [airportsSearchLoading])

    const listFooterComponent = useMemo(
      () =>
        !airportsSearchLoading ? (
          <AirportsLoadMoreFooter
            airportsHasNext={airportsHasMore}
            airportsLoading={airportsLoading}
            flatAirportsData={paginatedAirports}
          />
        ) : null,
      [airportsSearchLoading, airportsLoading, paginatedAirports, airportsHasMore],
    )

    return (
      <View className="flex-1">
        <Animated.View
          className="absolute top-0 left-0 right-0 z-40 bg-background-primary"
          style={headerAnimatedStyle}
        >
          <Animated.View style={searchInputStyle}>
            <SearchInput
              onChangeText={setAirportsSearchTerm}
              placeholder={getLocale('airportSearchPlaceholder')}
              value={airportsSearchTerm}
            />
          </Animated.View>

          <View className="flex-row h-12 mr-6 my-2 items-center">
            <ActiveFilters
              filters={airportsFilters}
              onClearAll={handleClearAllFilters}
              onRemove={handleRemoveAirportFilter}
            />
            <Animated.View className="absolute right-0" style={filterButtonStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                className={filterButtonClassName}
                hitSlop={{ bottom: 20, right: 20 }}
                onPress={handleOpenPress}
                testID="filter-button"
              >
                {hasActiveFilters ? (
                  <View className="absolute top-[-3px] right-[-3px] bg-secondary-100 rounded-full overflow-hidden py-[1px] px-[4px] items-center justify-center z-50">
                    <ThemedText color="text-100" type="body3">
                      {airportsFiltersCount}
                    </ThemedText>
                  </View>
                ) : null}
                <MaterialCommunityIcons color={filterIconColor} name="filter-variant" size={24} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.FlatList
          bounces={false}
          bouncesZoom={false}
          columnWrapperClassName="justify-between"
          contentContainerClassName="pt-[148px] px-4"
          contentContainerStyle={{ paddingBottom: bottom + 72 }}
          data={flatListData as AirportType[]}
          initialNumToRender={INITIAL_ITEMS_PER_PAGE}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          keyExtractor={keyExtractor}
          ListFooterComponent={listFooterComponent}
          maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
          numColumns={NUM_COLUMNS}
          onEndReached={loadMoreAirports}
          onEndReachedThreshold={0.1}
          onScroll={scrollHandler}
          overScrollMode="never"
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={BATCHING_PERIOD}
          windowSize={WINDOW_SIZE}
          removeClippedSubviews
        />

        <FilterModal
          currentFilters={airportsFilters}
          onApply={setAirportsFilters}
          onClose={handleClosePress}
          ref={sheetRef}
          type="airports"
        />
      </View>
    )
  },
)
