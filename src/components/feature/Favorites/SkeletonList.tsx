import React from 'react'
import { FlatList } from 'react-native'

import { SkeletonAirlineCard } from '@/components/feature/Airline/SkeletonAirlineCard'
import { SkeletonAirportCard } from '@/components/feature/Airport/SkeletonAirportCard'

interface SkeletonListProps {
  type: 'airport' | 'airline'
}

const skeletonData = Array(6)
  .fill(null)
  .map((_, index) => ({ id: `skeleton-${index}` }))

export const SkeletonList = ({ type }: SkeletonListProps) => (
  <FlatList
    className="mt-[52px]"
    columnWrapperClassName="justify-between"
    contentContainerClassName="px-4 pb-10"
    data={skeletonData}
    keyExtractor={item => item.id}
    numColumns={2}
    renderItem={() => (type === 'airport' ? <SkeletonAirportCard /> : <SkeletonAirlineCard />)}
    showsVerticalScrollIndicator={false}
  />
)
