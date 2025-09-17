import { render } from '@testing-library/react-native'
import React from 'react'

import { AirportFlightTab } from '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedStatsGrid = jest.fn()
const mockedAirlinesList = jest.fn()
const mockedRoutesList = jest.fn()

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/StatsGrid',
  () => {
    const { Text } = require('react-native')
    return {
      StatsGrid: (props: any) => {
        mockedStatsGrid(props)
        return <Text testID="stats-grid-section">StatsGrid</Text>
      },
    }
  },
)

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/AirlinesList',
  () => {
    const { Text } = require('react-native')
    return {
      AirlinesList: (props: any) => {
        mockedAirlinesList(props)
        return <Text testID="airlines-list-section">AirlinesList</Text>
      },
    }
  },
)

jest.mock(
  '@/components/feature/Airport/AirportDetail/Tab/AirportFlightTab/Sections/RoutesList',
  () => {
    const { Text } = require('react-native')
    return {
      RoutesList: (props: any) => {
        mockedRoutesList(props)
        return <Text testID="routes-list-section">RoutesList</Text>
      },
    }
  },
)

const mockedAirportData: any = {
  flightOperations: {
    airlines: [{ airlineId: 'TK', airlineName: 'Turkish Airlines' }],
    destinationCount: 340,
    destinationCountries: 129,
    domesticConnections: 50,
    internationalConnections: 290,
    routes: [{ destinationAirportId: 'ESB', flightCount: 150 }],
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('AirportFlightTab Component', () => {
  it('should render all section components', () => {
    const { getByTestId } = render(<AirportFlightTab airportData={mockedAirportData} />)
    expect(getByTestId('stats-grid-section')).toBeTruthy()
    expect(getByTestId('airlines-list-section')).toBeTruthy()
    expect(getByTestId('routes-list-section')).toBeTruthy()
  })

  it('should pass correct props to StatsGrid component', () => {
    render(<AirportFlightTab airportData={mockedAirportData} />)
    const { flightOperations } = mockedAirportData

    expect(mockedStatsGrid).toHaveBeenCalledWith({
      stats: {
        destinationCount: flightOperations.destinationCount,
        destinationCountries: flightOperations.destinationCountries,
        domesticConnections: flightOperations.domesticConnections,
        internationalConnections: flightOperations.internationalConnections,
      },
      localeStrings: {
        country: 'country',
        domesticDestinations: 'domesticDestinations',
        internationalDestination: 'internationalDestination',
        totalDestination: 'totalDestination',
      },
      iconColor: themeColors.light.onPrimary100,
    })
  })

  it('should pass correct props to AirlinesList component', () => {
    render(<AirportFlightTab airportData={mockedAirportData} />)
    expect(mockedAirlinesList).toHaveBeenCalledWith({
      airlines: mockedAirportData.flightOperations.airlines,
      title: 'airlines',
      iconColor: themeColors.light.onPrimary100,
    })
  })

  it('should pass correct props to RoutesList component', () => {
    render(<AirportFlightTab airportData={mockedAirportData} />)
    expect(mockedRoutesList).toHaveBeenCalledWith({
      routes: mockedAirportData.flightOperations.routes,
      title: 'popularDestinations',
      iconColor: themeColors.light.onPrimary100,
    })
  })

  it('should handle undefined airportData gracefully', () => {
    render(<AirportFlightTab airportData={undefined as any} />)
    expect(mockedStatsGrid).toHaveBeenCalledWith(
      expect.objectContaining({
        stats: {
          destinationCount: undefined,
          destinationCountries: undefined,
          domesticConnections: undefined,
          internationalConnections: undefined,
        },
      }),
    )
    expect(mockedAirlinesList).toHaveBeenCalledWith(
      expect.objectContaining({ airlines: undefined }),
    )
    expect(mockedRoutesList).toHaveBeenCalledWith(expect.objectContaining({ routes: undefined }))
  })

  it('should handle partial flightOperations data (missing routes)', () => {
    const partialData: any = {
      flightOperations: {
        ...mockedAirportData.flightOperations,
        routes: undefined,
      },
    }

    render(<AirportFlightTab airportData={partialData} />)

    expect(mockedAirlinesList).toHaveBeenCalledWith(
      expect.objectContaining({
        airlines: partialData.flightOperations.airlines,
      }),
    )

    expect(mockedRoutesList).toHaveBeenCalledWith(
      expect.objectContaining({
        routes: undefined,
      }),
    )
  })

  it('should call all section components exactly once', () => {
    render(<AirportFlightTab airportData={mockedAirportData} />)
    expect(mockedStatsGrid).toHaveBeenCalledTimes(1)
    expect(mockedAirlinesList).toHaveBeenCalledTimes(1)
    expect(mockedRoutesList).toHaveBeenCalledTimes(1)
  })
})

describe('AirportFlightTab Component Snapshot', () => {
  it('should render the AirportFlightTab Component successfully', () => {
    const { toJSON } = render(<AirportFlightTab airportData={mockedAirportData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
