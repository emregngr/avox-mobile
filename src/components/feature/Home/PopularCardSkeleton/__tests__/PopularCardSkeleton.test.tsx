import { render } from '@testing-library/react-native'
import React from 'react'

import { PopularCardSkeleton } from '@/components/feature/Home/PopularCardSkeleton'

const { mockedUseSafeAreaInsets } = require('react-native-safe-area-context')

jest.mock('@/components/feature/Airport/AirportCardSkeleton', () => {
  const { View } = require('react-native')
  return {
    AirportCardSkeleton: () => <View testID="airport-skeleton" />,
  }
})

jest.mock('@/components/feature/Airline/AirlineCardSkeleton', () => {
  const { View } = require('react-native')
  return {
    AirlineCardSkeleton: () => <View testID="airline-skeleton" />,
  }
})

beforeEach(() => {
  mockedUseSafeAreaInsets.mockReturnValue({
    top: 20,
    bottom: 34,
    left: 0,
    right: 0,
  })
})

describe('PopularCardSkeleton Component', () => {
  it('should render AirportCardSkeleton components when type is "airport"', () => {
    const { getAllByTestId, queryByTestId } = render(<PopularCardSkeleton type="airport" />)

    const airportSkeletons = getAllByTestId('airport-skeleton')
    expect(airportSkeletons).toHaveLength(6)

    const airlineSkeletons = queryByTestId('airline-skeleton')
    expect(airlineSkeletons).toBeNull()
  })

  it('should render AirlineCardSkeleton components when type is "airline"', () => {
    const { getAllByTestId, queryByTestId } = render(<PopularCardSkeleton type="airline" />)

    const airlineSkeletons = getAllByTestId('airline-skeleton')
    expect(airlineSkeletons).toHaveLength(6)

    const airportSkeletons = queryByTestId('airport-skeleton')
    expect(airportSkeletons).toBeNull()
  })

  it('should pass correct prop values to FlatList component', () => {
    render(<PopularCardSkeleton type="airport" />)

    const { toJSON } = render(<PopularCardSkeleton type="airport" />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should pass correct prop values to FlatList component', () => {
    render(<PopularCardSkeleton type="airline" />)

    const { toJSON } = render(<PopularCardSkeleton type="airline" />)

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('PopularCardSkeleton Component Snapshot', () => {
  it('should render the PopularCardSkeleton Component successfully', () => {
    const { toJSON } = render(<PopularCardSkeleton type="airport" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
