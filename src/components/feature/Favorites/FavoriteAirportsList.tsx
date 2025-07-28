import React, { useCallback, useMemo } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

import { AirportFavoriteItemCard } from '@/components/feature/Airport/AirportFavoriteItemCard'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airport } from '@/types/feature/airport'

import { EmptyState } from './EmptyState'
import { SkeletonList } from './SkeletonList'

const ITEMS_PER_PAGE = 6
interface FavoriteAirportsListProps {
  airports: Airport[]
  isLoading: boolean
  onRefresh: () => void
}

interface AirportFavoriteItemCard {
  item: Airport
}

export const FavoriteAirportsList = ({
  airports,
  isLoading,
  onRefresh,
}: FavoriteAirportsListProps) => {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const renderAirportCard = useCallback(
    ({ item }: AirportFavoriteItemCard) => <AirportFavoriteItemCard airport={item} />,
    [],
  )

  if (isLoading) {
    return <SkeletonList type="airport" />
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
      initialNumToRender={ITEMS_PER_PAGE}
      keyExtractor={(item, index) => `airport-${item?.id || index}`}
      maxToRenderPerBatch={ITEMS_PER_PAGE}
      numColumns={2}
      refreshControl={refreshControl}
      renderItem={renderAirportCard}
      showsVerticalScrollIndicator={false}
      updateCellsBatchingPeriod={200}
      windowSize={5}
      removeClippedSubviews
    />
  )
}
