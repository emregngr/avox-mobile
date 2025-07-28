import React, { useCallback, useMemo } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

import { AirlineFavoriteItemCard } from '@/components/feature/Airline/AirlineFavoriteItemCard'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { Airline } from '@/types/feature/airline'

import { EmptyState } from './EmptyState'
import { SkeletonList } from './SkeletonList'

const ITEMS_PER_PAGE = 6

interface FavoriteAirlinesListProps {
  airlines: Airline[]
  isLoading: boolean
  onRefresh: () => void
}

interface AirlineFavoriteItemCard {
  item: Airline
}

export const FavoriteAirlinesList = ({
  airlines,
  isLoading,
  onRefresh,
}: FavoriteAirlinesListProps) => {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const renderAirlineCard = useCallback(
    ({ item }: AirlineFavoriteItemCard) => <AirlineFavoriteItemCard airline={item} />,
    [],
  )

  if (isLoading) {
    return <SkeletonList type="airline" />
  }

  if (airlines?.length === 0) {
    return (
      <View className="flex-1 mt-14 px-4 pb-10">
        <EmptyState text={getLocale('noFavoriteAirline')} />
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
      data={airlines}
      initialNumToRender={ITEMS_PER_PAGE}
      keyExtractor={(item, index) => `airline-${item?.id || index}`}
      maxToRenderPerBatch={ITEMS_PER_PAGE}
      numColumns={2}
      refreshControl={refreshControl}
      renderItem={renderAirlineCard}
      showsVerticalScrollIndicator={false}
      updateCellsBatchingPeriod={200}
      windowSize={5}
      removeClippedSubviews
    />
  )
}
