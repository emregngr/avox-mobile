import React, { useCallback, useMemo } from 'react'
import { FlatList, Platform, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AirlineFavoriteItemCard } from '@/components/feature/Favorites/AirlineFavoriteItemCard'
import { EmptyFavorite } from '@/components/feature/Favorites/EmptyFavorite'
import { FavoriteSkeleton } from '@/components/feature/Favorites/FavoriteSkeleton'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { AirlineType } from '@/types/feature/airline'

interface FavoriteAirlinesListProps {
  airlines: AirlineType[]
  isLoading: boolean
  onRefresh: () => void
}

interface AirlineFavoriteItemCard {
  item: AirlineType
}

const INITIAL_ITEMS_PER_PAGE = 6
const MAX_ITEMS_PER_BATCH = 4
const NUM_COLUMNS = 2
const ITEM_HEIGHT = 500
const WINDOW_SIZE = 7

export const FavoriteAirlines = ({ airlines, isLoading, onRefresh }: FavoriteAirlinesListProps) => {
  const { bottom } = useSafeAreaInsets()

  const extraBottomPadding = Platform.OS === 'ios' ? 72 : 82
  const bottomPadding = bottom + extraBottomPadding

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirlineCard = useCallback(
    ({ item }: AirlineFavoriteItemCard) => <AirlineFavoriteItemCard airline={item} />,
    [],
  )

  const keyExtractor = useCallback((item: AirlineType) => item?.id, [])

  const getItemLayout = useCallback(
    (_: ArrayLike<AirlineType> | null | undefined, index: number) => ({
      index,
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
    }),
    [],
  )

  if (isLoading) {
    return <FavoriteSkeleton type="airline" />
  }

  if (airlines?.length === 0) {
    return <EmptyFavorite icon="airplane" text={getLocale('noFavoriteAirline')} />
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
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      data={airlines}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_ITEMS_PER_PAGE}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
      numColumns={NUM_COLUMNS}
      refreshControl={refreshControl}
      renderItem={renderAirlineCard}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      updateCellsBatchingPeriod={BATCHING_PERIOD}
      windowSize={WINDOW_SIZE}
      removeClippedSubviews
    />
  )
}
