import { render } from '@testing-library/react-native'
import React from 'react'

import { AirportHeader } from '@/components/feature/Airport/AirportDetail/AirportHeader'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedAirportData: any = {
  id: '1',
  name: 'Test Airport',
  iataCode: 'TA',
  icaoCode: 'TST',
  isoCountry: 'TR',
  isoRegion: 'TR-34',
  operations: {
    region: 'Europe',
    location: {
      address: '123 Test St, Test City',
    },
  },
}

const mockedAirportDataWithoutAddress: any = {
  id: '2',
  name: 'NoAddress Airport',
  iataCode: 'NA',
  icaoCode: 'NAA',
  isoCountry: 'US',
  isoRegion: 'US-CA',
  operations: {
    region: 'North America',
    location: {
      address: null,
    },
  },
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => key)
})

describe('AirportHeader Component', () => {
  it('should render IATA, ICAO, country, region, and continent correctly', () => {
    const { getByText } = render(<AirportHeader airportData={mockedAirportData} />)

    expect(getByText('iata')).toBeTruthy()
    expect(getByText('icao')).toBeTruthy()
    expect(getByText('ctry')).toBeTruthy()
    expect(getByText('reg')).toBeTruthy()
    expect(getByText('cont')).toBeTruthy()

    expect(getByText('TA')).toBeTruthy()
    expect(getByText('TST')).toBeTruthy()
    expect(getByText('TR')).toBeTruthy()
    expect(getByText('TR-34')).toBeTruthy()
    expect(getByText('Europe')).toBeTruthy()
  })

  it('should render the address correctly', () => {
    const { getByText } = render(<AirportHeader airportData={mockedAirportData} />)

    expect(getByText('123 Test St, Test City')).toBeTruthy()
  })

  it('should render the location icon', () => {
    const { getByTestId } = render(<AirportHeader airportData={mockedAirportData} />)

    expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
  })

  it('should handle missing address data gracefully', () => {
    const { queryByText } = render(<AirportHeader airportData={mockedAirportDataWithoutAddress} />)

    expect(queryByText('123 Test St, Test City')).toBeNull()
  })

  it('should apply a background class based on the region', () => {
    const { toJSON } = render(<AirportHeader airportData={mockedAirportData} />)
    const tree = toJSON()

    if (tree && !Array.isArray(tree)) {
      expect(tree.props.className).toBe('bg-europe')
    } else {
      fail('Expected a single root element from render.')
    }
  })
})

describe('AirportHeader Component Snapshot', () => {
  it('should render the AirportHeader Component successfully', () => {
    const { toJSON } = render(<AirportHeader airportData={mockedAirportData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('AirportHeader Component Snapshot', () => {
  it('should render the AirportHeader Component with missing address data successfully', () => {
    const { toJSON } = render(<AirportHeader airportData={mockedAirportDataWithoutAddress} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
