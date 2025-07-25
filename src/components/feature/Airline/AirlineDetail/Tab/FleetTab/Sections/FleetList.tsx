import React, { useCallback } from 'react'
import type { ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'

import { AirplaneRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Card/AirplaneRowCard'
import type { ThemeColors } from '@/themes'
import type { Airplane } from '@/types/feature/airline'

const ITEMS_PER_PAGE = 3
const itemHeight = 200

interface FleetListProps {
  airplanes: Airplane[]
  colors: ThemeColors
  onImagePress: (airplaneType: string, imageKey: string) => void
  region: string
  totalAirplane: number
}

export const FleetList = ({
  airplanes,
  colors,
  onImagePress,
  region,
  totalAirplane,
}: FleetListProps) => {
  const renderAirplaneItem = useCallback<ListRenderItem<Airplane>>(
    ({ item }) => (
      <AirplaneRowCard
        airplane={item}
        colors={colors}
        onImagePress={onImagePress}
        region={region}
        totalAirplane={totalAirplane}
      />
    ),
    [totalAirplane, region, colors, onImagePress],
  )

  const keyExtractor = useCallback((item: Airplane) => item?.type, [])

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      index,
      length: itemHeight,
      offset: itemHeight * index,
    }),
    [],
  )

  return (
    <FlatList
      data={airplanes}
      getItemLayout={getItemLayout}
      initialNumToRender={ITEMS_PER_PAGE}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={ITEMS_PER_PAGE}
      renderItem={renderAirplaneItem}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      updateCellsBatchingPeriod={200}
      windowSize={5}
      removeClippedSubviews
    />
  )
}
