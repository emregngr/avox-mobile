import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'

import { Header, SafeLayout } from '@/components/common'
import { DestinationCard } from '@/components/feature'
import { getLocale } from '@/locales/i18next'
import type { PopularDestination } from '@/types/feature/home'

const ITEMS_PER_PAGE = 6

const itemHeight = 280

interface DestinationCardProps {
  item: PopularDestination
}

export default function AllPopularDestinations() {
  const params = useLocalSearchParams()

  const { destinations } = params as { destinations: string }

  const destinationsData = useMemo(
    () => JSON.parse(destinations) as PopularDestination[],
    [destinations],
  )

  const renderDestinationCard = useCallback(
    ({ item }: DestinationCardProps) => <DestinationCard destination={item} />,
    [],
  )

  const keyExtractor = useCallback((item: PopularDestination) => item?.id?.toString(), [])

  const getItemLayout = useCallback(
    (data: ArrayLike<PopularDestination> | null | undefined, index: number) => ({
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
      <Header backIconOnPress={handleBackPress} title={getLocale('popularDestinations')} />
      <FlatList
        className="flex-1"
        columnWrapperClassName="justify-between gap-x-4"
        contentContainerClassName="pt-5 px-4 pb-10 self-center"
        data={destinationsData}
        getItemLayout={getItemLayout}
        initialNumToRender={ITEMS_PER_PAGE}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        numColumns={2}
        renderItem={renderDestinationCard}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={200}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeLayout>
  )
}
