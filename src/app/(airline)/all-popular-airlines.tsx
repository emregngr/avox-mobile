import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'

import { Header, SafeLayout } from '@/components/common'
import { AirlineCard } from '@/components/feature'
import { getLocale } from '@/locales/i18next'
import type { Airline } from '@/types/feature/airline'

const ITEMS_PER_PAGE = 6

const itemHeight = 500

interface AirlineCardProps {
  item: Airline
}

export default function AllPopularAirports() {
  const params = useLocalSearchParams()
  const { airlines } = params as { airlines: string }
  const airlinesData = useMemo(() => JSON.parse(airlines) as Airline[], [airlines])

  const renderAirlineCard = useCallback(
    ({ item }: AirlineCardProps) => <AirlineCard airline={item} />,
    [],
  )

  const keyExtractor = useCallback((item: Airline) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (data: ArrayLike<Airline> | null | undefined, index: number) => ({
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
      <Header leftIconOnPress={handleBackPress} title={getLocale('popularAirlines')} />
      <FlatList
        className="flex-1"
        columnWrapperClassName="justify-between"
        contentContainerClassName="pt-5 px-4 pb-10"
        data={airlinesData}
        getItemLayout={getItemLayout}
        initialNumToRender={ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        numColumns={2}
        renderItem={renderAirlineCard}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={200}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
