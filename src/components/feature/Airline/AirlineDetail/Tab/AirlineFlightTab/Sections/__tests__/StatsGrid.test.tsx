import { render } from '@testing-library/react-native'

import { StatsGrid } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/StatsGrid'

const mockedStatsCard = jest.fn()

jest.mock('@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Cards/StatsCard', () => {
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
  it('should render four StatsCard components', async () => {
    const { getAllByTestId } = await render(<StatsGrid {...mockedDefaultProps} />)

    const statsCards = getAllByTestId('mocked-stats-card')
    expect(statsCards.length).toBe(4)
    expect(mockedStatsCard).toHaveBeenCalledTimes(4)
  })

  it('should pass correct props to each StatsCard', async () => {
    await render(<StatsGrid {...mockedDefaultProps} />)

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconName: 'flag-outline',
        label: mockedDefaultProps.localeStrings.totalDestination,
        value: mockedDefaultProps.stats.destinationCount,
      }),
    )

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconName: 'earth',
        label: mockedDefaultProps.localeStrings.country,
        value: mockedDefaultProps.stats.destinationCountries,
      }),
    )

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconName: 'home-outline',
        label: mockedDefaultProps.localeStrings.domesticDestinations,
        value: mockedDefaultProps.stats.domesticConnections,
      }),
    )

    expect(mockedStatsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        iconName: 'earth-arrow-right',
        label: mockedDefaultProps.localeStrings.internationalDestination,
        value: mockedDefaultProps.stats.internationalConnections,
      }),
    )
  })

  it('should throw an error when stats prop is undefined', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const propsWithMissingStats = {
      ...mockedDefaultProps,
      stats: undefined as any,
    }

    await expect(render(<StatsGrid {...propsWithMissingStats} />)).rejects.toThrow(
      "Cannot read properties of undefined (reading 'destinationCount')",
    )

    consoleErrorSpy.mockRestore()
  })
})

describe('StatsGrid Component Snapshot', () => {
  it('should render the StatsGrid Component successfully', async () => {
    const { toJSON } = await render(<StatsGrid {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
