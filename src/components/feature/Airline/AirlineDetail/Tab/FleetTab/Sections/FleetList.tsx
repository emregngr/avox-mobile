import React, { useCallback } from 'react'
import type { ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'

import { AirplaneRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Card/AirplaneRowCard'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import type { Airplane } from '@/types/feature/airline'

interface FleetListProps {
  airplanes: Airplane[]
  onImagePress: (airplaneType: string, imageKey: string) => void
  region: string
  totalAirplane: number
}

const INITIAL_ITEMS_PER_PAGE = 4
const MAX_ITEMS_PER_BATCH = 3
const ITEM_HEIGHT = 200
const WINDOW_SIZE = 7

export const FleetList = ({ airplanes, onImagePress, region, totalAirplane }: FleetListProps) => {
  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirplaneItem = useCallback<ListRenderItem<Airplane>>(
    ({ item }) => (
      <AirplaneRowCard
        airplane={item}
        onImagePress={onImagePress}
        region={region}
        totalAirplane={totalAirplane}
      />
    ),
    [],
  )

  const keyExtractor = useCallback((item: Airplane) => item?.type, [])

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      index,
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
    }),
    [],
  )

  return (
    <FlatList
      data={airplanes}
      getItemLayout={getItemLayout}
      initialNumToRender={INITIAL_ITEMS_PER_PAGE}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={MAX_ITEMS_PER_BATCH}
      renderItem={renderAirplaneItem}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      updateCellsBatchingPeriod={BATCHING_PERIOD}
      windowSize={WINDOW_SIZE}
      removeClippedSubviews
    />
  )
}
