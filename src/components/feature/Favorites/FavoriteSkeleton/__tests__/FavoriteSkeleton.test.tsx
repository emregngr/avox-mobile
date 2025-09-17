import { render } from '@testing-library/react-native'
import React from 'react'

import { FavoriteSkeleton } from '@/components/feature/Favorites/FavoriteSkeleton'

jest.mock('@/components/feature/Airline/AirlineCardSkeleton', () => {
  const { Text } = require('react-native')
  return {
    AirlineCardSkeleton: () => <Text>Airline Skeleton</Text>,
  }
})

jest.mock('@/components/feature/Airport/AirportCardSkeleton', () => {
  const { Text } = require('react-native')
  return {
    AirportCardSkeleton: () => <Text>Airport Skeleton</Text>,
  }
})

describe('FavoriteSkeleton Component', () => {
  it('renders Airport skeletons when type="airport"', () => {
    const { getAllByText } = render(<FavoriteSkeleton type="airport" />)

    expect(getAllByText('Airport Skeleton')).toHaveLength(6)
  })

  it('renders Airline skeletons when type="airline"', () => {
    const { getAllByText } = render(<FavoriteSkeleton type="airline" />)

    expect(getAllByText('Airline Skeleton')).toHaveLength(6)
  })

  it('has correct keyExtractor', () => {
    const { getByTestId } = render(<FavoriteSkeleton type="airport" />)

    const flatList = getByTestId('favorite-skeleton-flatlist')
    const ids = flatList.props.data.map((item: any) => item.id)

    expect(ids).toEqual([
      'skeleton-0',
      'skeleton-1',
      'skeleton-2',
      'skeleton-3',
      'skeleton-4',
      'skeleton-5',
    ])
  })
})

describe('FavoriteSkeleton Component Snapshot', () => {
  it('should render the FavoriteSkeleton Component successfully', () => {
    const { toJSON } = render(<FavoriteSkeleton type="airport" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
