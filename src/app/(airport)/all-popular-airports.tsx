import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'

import { Header, SafeLayout } from '@/components/common'
import { AirportCard } from '@/components/feature'
import { getLocale } from '@/locales/i18next'
import type { Airport } from '@/types/feature/airport'

const ITEMS_PER_PAGE = 6

const itemHeight = 500

interface AirportCardProps {
  item: Airport
}

export default function AllPopularAirports() {
  const params = useLocalSearchParams()
  const { airports } = params as { airports: string }

  const airportsData = useMemo(() => JSON.parse(airports) as Airport[], [airports])

  const renderAirportCard = useCallback(
    ({ item }: AirportCardProps) => <AirportCard airport={item} />,
    [],
  )

  const keyExtractor = useCallback((item: Airport) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (data: ArrayLike<Airport> | null | undefined, index: number) => ({
      index,
      length: itemHeight,
      offset: itemHeight * index,
    }),
    [],
  )

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  return (
    <SafeLayout>
      <Header leftIconOnPress={handleBackPress} title={getLocale('popularAirports')} />
      <FlatList
        className="flex-1"
        columnWrapperClassName="justify-between"
        contentContainerClassName="pt-5 px-4 pb-10"
        data={airportsData}
        getItemLayout={getItemLayout}
        initialNumToRender={ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        numColumns={2}
        renderItem={renderAirportCard}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={200}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
