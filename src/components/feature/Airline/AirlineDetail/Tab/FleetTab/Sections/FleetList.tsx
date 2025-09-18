import React, { useCallback } from 'react'
import { FlatList } from 'react-native'

import { AirplaneRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Card/AirplaneRowCard'
import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import type { AirplaneType } from '@/types/feature/airline'

interface FleetListProps {
  airplanes: AirplaneType[]
  onImagePress: (airplaneType: string, imageKey: string) => void
  region: string
  totalAirplane: number
}

interface AirplaneRowCardProps {
  item: AirplaneType
}

const INITIAL_ITEMS_PER_PAGE = 4
const MAX_ITEMS_PER_BATCH = 3
const ITEM_HEIGHT = 200
const WINDOW_SIZE = 7

export const FleetList = ({ airplanes, onImagePress, region, totalAirplane }: FleetListProps) => {
  const BATCHING_PERIOD = useBatchingPeriod()

  const renderAirplaneItem = useCallback(
    ({ item }: AirplaneRowCardProps) => (
      <AirplaneRowCard
        airplane={item}
        onImagePress={onImagePress}
        region={region}
        testID={`airplane-row-card-${item?.type}`}
        totalAirplane={totalAirplane}
      />
    ),
    [onImagePress, region, totalAirplane],
  )

  const keyExtractor = useCallback((item: AirplaneType) => item?.type, [])

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
      testID="fleet-list"
      updateCellsBatchingPeriod={BATCHING_PERIOD}
      windowSize={WINDOW_SIZE}
      removeClippedSubviews
    />
  )
}
