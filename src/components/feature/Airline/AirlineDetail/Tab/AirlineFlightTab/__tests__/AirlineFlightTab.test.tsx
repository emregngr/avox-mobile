import { render } from '@testing-library/react-native'
import React from 'react'

import { AirlineFlightTab } from '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedUseGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedStatsGrid = jest.fn()
const mockedDestinationList = jest.fn()
const mockedRoutesList = jest.fn()
const mockedAlliance = jest.fn()

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/Alliance',
  () => {
    const { View, Text } = require('react-native')
    return {
      Alliance: (props: { alliance: string; title: string }) => {
        mockedAlliance(props)
        if (!props.alliance || props.alliance === 'none') return null
        return (
          <View testID="alliance-section">
            <Text testID="alliance-title">{props.title}</Text>
            <Text testID="alliance-value">{props.alliance}</Text>
          </View>
        )
      },
    }
  },
)

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/DestinationList',
  () => {
    const { View, Text } = require('react-native')
    return {
      DestinationList: (props: { destinations: any; title: string }) => {
        mockedDestinationList(props)
        return (
          <View testID="destination-list-section">
            <Text testID="destination-title">{props.title}</Text>
            <Text testID="destination-count">{props.destinations?.length || 0}</Text>
          </View>
        )
      },
    }
  },
)

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/RoutesList',
  () => {
    const { View, Text } = require('react-native')
    return {
      RoutesList: (props: { routes: any; title: string }) => {
        mockedRoutesList(props)
        return (
          <View testID="routes-list-section">
            <Text testID="routes-title">{props.title}</Text>
            <Text testID="routes-count">{props.routes?.length || 0}</Text>
          </View>
        )
      },
    }
  },
)

jest.mock(
  '@/components/feature/Airline/AirlineDetail/Tab/AirlineFlightTab/Sections/StatsGrid',
  () => {
    const { View, Text } = require('react-native')
    return {
      StatsGrid: (props: { localeStrings: any; stats: any }) => {
        mockedStatsGrid(props)
        return (
          <View testID="stats-grid-section">
            <Text testID="destination-count-stat">{props.stats.destinationCount || 0}</Text>
            <Text testID="destination-countries-stat">{props.stats.destinationCountries || 0}</Text>
            <Text testID="domestic-connections-stat">{props.stats.domesticConnections || 0}</Text>
            <Text testID="international-connections-stat">
              {props.stats.internationalConnections || 0}
            </Text>
            <Text testID="country">{props.localeStrings.country}</Text>
            <Text testID="domestic">{props.localeStrings.domesticDestinations}</Text>
            <Text testID="international">{props.localeStrings.internationalDestination}</Text>
            <Text testID="total">{props.localeStrings.totalDestination}</Text>
          </View>
        )
      },
    }
  },
)

const mockedAirlineData: any = {
  network: {
    destinationCount: 150,
    destinationCountries: 45,
    destinations: [
      { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
      { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles' },
      { code: 'LHR', name: 'London Heathrow Airport', city: 'London' },
    ],
    domesticConnections: 80,
    internationalConnections: 70,
    routes: [
      { from: 'JFK', to: 'LAX', frequency: 'Daily' },
      { from: 'JFK', to: 'LHR', frequency: '3x weekly' },
    ],
  },
  operations: {
    alliance: 'Star Alliance',
  },
}

const mockedAirlineDataWithoutAlliance: any = {
  ...mockedAirlineData,
  operations: {
    alliance: 'none',
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedUseGetLocale.mockImplementation((key: string) => key)
})

describe('AirlineFlightTab Component', () => {
  describe('Component Rendering', () => {
    it('renders all main sections when data is provided', () => {
      const { getByTestId } = render(<AirlineFlightTab airlineData={mockedAirlineData} />)
      expect(getByTestId('stats-grid-section')).toBeTruthy()
      expect(getByTestId('destination-list-section')).toBeTruthy()
      expect(getByTestId('routes-list-section')).toBeTruthy()
      expect(getByTestId('alliance-section')).toBeTruthy()
    })

    it('does not render Alliance section when alliance is "none"', () => {
      const { getByTestId, queryByTestId } = render(
        <AirlineFlightTab airlineData={mockedAirlineDataWithoutAlliance} />,
      )
      expect(getByTestId('stats-grid-section')).toBeTruthy()
      expect(getByTestId('destination-list-section')).toBeTruthy()
      expect(getByTestId('routes-list-section')).toBeTruthy()
      expect(queryByTestId('alliance-section')).toBeNull()
    })
  })

  describe('Prop Passing Checks', () => {
    it('should pass correct props to all child components', () => {
      render(<AirlineFlightTab airlineData={mockedAirlineData} />)
      expect(mockedStatsGrid).toHaveBeenCalledWith(
        expect.objectContaining({
          stats: {
            destinationCount: mockedAirlineData.network.destinationCount,
            destinationCountries: mockedAirlineData.network.destinationCountries,
            domesticConnections: mockedAirlineData.network.domesticConnections,
            internationalConnections: mockedAirlineData.network.internationalConnections,
          },
        }),
      )
      expect(mockedDestinationList).toHaveBeenCalledWith(
        expect.objectContaining({
          destinations: mockedAirlineData.network.destinations,
        }),
      )
      expect(mockedRoutesList).toHaveBeenCalledWith(
        expect.objectContaining({
          routes: mockedAirlineData.network.routes,
        }),
      )
      expect(mockedAlliance).toHaveBeenCalledWith(
        expect.objectContaining({
          alliance: mockedAirlineData.operations.alliance,
        }),
      )
    })

    it('should call all components exactly once when data is full', () => {
      render(<AirlineFlightTab airlineData={mockedAirlineData} />)
      expect(mockedStatsGrid).toHaveBeenCalledTimes(1)
      expect(mockedDestinationList).toHaveBeenCalledTimes(1)
      expect(mockedRoutesList).toHaveBeenCalledTimes(1)
      expect(mockedAlliance).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('handles undefined airlineData gracefully', () => {
      const { getByTestId, queryByTestId } = render(
        <AirlineFlightTab airlineData={undefined as any} />,
      )
      expect(getByTestId('stats-grid-section')).toBeTruthy()
      expect(queryByTestId('alliance-section')).toBeNull()
    })

    it('handles missing operations data', () => {
      const dataWithoutOperations: any = {
        network: mockedAirlineData.network,
      }
      const { getByTestId, queryByTestId } = render(
        <AirlineFlightTab airlineData={dataWithoutOperations} />,
      )
      expect(getByTestId('stats-grid-section')).toBeTruthy()
      expect(queryByTestId('alliance-section')).toBeNull()
    })
  })
})

describe('AirlineFlightTab Component Snapshot', () => {
  it('should render the AirlineFlightTab Component successfully', () => {
    const { toJSON } = render(<AirlineFlightTab airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
