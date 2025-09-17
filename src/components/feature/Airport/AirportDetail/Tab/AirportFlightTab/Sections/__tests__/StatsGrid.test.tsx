import { render } from '@testing-library/react-native'
import React from 'react'

import { StatsGrid } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/StatsGrid'

const mockedStatsCard = jest.fn()

jest.mock('@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Cards/StatsCard', () => {
  const { View } = require('react-native')
  return {
    StatsCard: (props: any) => {
      mockedStatsCard(props)
      return <View testID="mocked-stats-card" />
    },
  }
})

const mockedDefaultProps = {
  iconColor: '#FFC107',
  localeStrings: {
    country: 'Countries',
    domesticDestinations: 'Domestic',
    internationalDestination: 'International',
    totalDestination: 'Total Destinations',
  },
  stats: {
    destinationCount: 340,
    destinationCountries: 129,
    domesticConnections: 50,
    internationalConnections: 290,
  },
}

describe('StatsGrid Component', () => {
  it('should render four StatsCard components', () => {
    const { getAllByTestId } = render(<StatsGrid {...mockedDefaultProps} />)

    const statsCards = getAllByTestId('mocked-stats-card')
    expect(statsCards.length).toBe(4)
    expect(mockedStatsCard).toHaveBeenCalledTimes(4)
  })

  it('should pass correct props to each StatsCard', () => {
    render(<StatsGrid {...mockedDefaultProps} />)

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconColor: mockedDefaultProps.iconColor,
        iconName: 'flag-outline',
        label: mockedDefaultProps.localeStrings.totalDestination,
        value: mockedDefaultProps.stats.destinationCount,
      }),
    )

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconColor: mockedDefaultProps.iconColor,
        iconName: 'earth',
        label: mockedDefaultProps.localeStrings.country,
        value: mockedDefaultProps.stats.destinationCountries,
      }),
    )

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconColor: mockedDefaultProps.iconColor,
        iconName: 'home-outline',
        label: mockedDefaultProps.localeStrings.domesticDestinations,
        value: mockedDefaultProps.stats.domesticConnections,
      }),
    )

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconColor: mockedDefaultProps.iconColor,
        iconName: 'earth-arrow-right',
        label: mockedDefaultProps.localeStrings.internationalDestination,
        value: mockedDefaultProps.stats.internationalConnections,
      }),
    )
  })

  it('should throw an error if the stats prop is not provided', () => {
    const propsWithMissingStats = {
      ...mockedDefaultProps,
      stats: undefined as any,
    }

    expect(() => render(<StatsGrid {...propsWithMissingStats} />)).toThrow(
      "Cannot read properties of undefined (reading 'destinationCount')",
    )
  })
})

describe('StatsGrid Component Snapshot', () => {
  it('should render the StatsGrid Component successfully', () => {
    const { toJSON } = render(<StatsGrid {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
