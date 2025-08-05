import React, { useCallback, useMemo } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

import { AirportFavoriteItemCard } from '@/components/feature/Favorites/AirportFavoriteItemCard'
import { EmptyState } from '@/components/feature/Favorites/EmptyState'
import { FavoriteSkeleton } from '@/components/feature/Favorites/FavoriteSkeleton'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airport } from '@/types/feature/airport'

interface FavoriteAirportsListProps {
  airports: Airport[]
  isLoading: boolean
  onRefresh: () => void
}

interface AirportFavoriteItemCard {
  item: Airport
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 500
const WINDOW_SIZE = 7

export const FavoriteAirports = ({ airports, isLoading, onRefresh }: FavoriteAirportsListProps) => {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirportCard = useCallback(
    ({ item }: AirportFavoriteItemCard) => <AirportFavoriteItemCard airport={item} />,
    [],
  )

  const keyExtractor = useCallback((item: Airport) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (_: ArrayLike<Airport> | null | undefined, index: number) => ({
      index,
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
    }),
    [],
  )

  if (isLoading) {
    return <FavoriteSkeleton type="airport" />
  }

  if (airports?.length === 0) {
    return (
      <View className="flex-1 mt-[52px] px-4 pb-10">
        <EmptyState text={getLocale('noFavoriteAirport')} />
      </View>
    )
  }

  const refreshControl = (
    <RefreshControl
      colors={[colors?.tertiary100]}
      onRefresh={onRefresh}
      progressBackgroundColor={colors?.background?.primary}
      refreshing={isLoading}
      tintColor={colors?.tertiary100}
      title={getLocale('loading')}
      titleColor={colors?.text100}
    />
  )

  return (
    <FlatList
      className="mt-[52px]"
      columnWrapperClassName="justify-between"
      contentContainerClassName="px-4 pb-10"
      data={airports}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_ITEMS_PER_PAGE}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
      numColumns={NUM_COLUMNS}
      refreshControl={refreshControl}
      renderItem={renderAirportCard}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      updateCellsBatchingPeriod={BATCHING_PERIOD}
      windowSize={WINDOW_SIZE}
      removeClippedSubviews
    />
  )
}
