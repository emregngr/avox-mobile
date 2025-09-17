import { render } from '@testing-library/react-native'
import React from 'react'

import { AirlineHeader } from '@/components/feature/Airline/AirlineDetail/AirlineHeader'
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

const mockedAirlineData: any = {
  id: '1',
  name: 'Test Airline',
  iataCode: 'TA',
  icaoCode: 'TST',
  operations: {
    region: 'Europe',
    hub: {
      name: 'Test Hub Airport',
      address: '123 Test St, Test City',
    },
  },
}

const mockedAirlineDataWithoutHub: any = {
  id: '2',
  name: 'NoHub Airline',
  iataCode: 'NH',
  icaoCode: 'NHB',
  operations: {
    region: 'Asia',
    hub: null,
  },
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => key)
})

describe('AirlineHeader Component', () => {
  it('should render IATA, ICAO, and continent correctly', () => {
    const { getByText } = render(<AirlineHeader airlineData={mockedAirlineData} />)

    expect(getByText('iata')).toBeTruthy()
    expect(getByText('icao')).toBeTruthy()
    expect(getByText('continent')).toBeTruthy()

    expect(getByText('TA')).toBeTruthy()
    expect(getByText('TST')).toBeTruthy()
    expect(getByText('Europe')).toBeTruthy()
  })

  it('should render hub name and address correctly', () => {
    const { getByText } = render(<AirlineHeader airlineData={mockedAirlineData} />)

    expect(getByText('Test Hub Airport')).toBeTruthy()
    expect(getByText('123 Test St, Test City')).toBeTruthy()
  })

  it('should render the home icon', () => {
    const { getByTestId } = render(<AirlineHeader airlineData={mockedAirlineData} />)

    expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
  })

  it('should handle missing hub data gracefully', () => {
    const { queryByText } = render(<AirlineHeader airlineData={mockedAirlineDataWithoutHub} />)

    expect(queryByText('Test Hub Airport')).toBeNull()
    expect(queryByText('123 Test St, Test City')).toBeNull()
  })

  it('should apply a background class based on the region', () => {
    const { toJSON } = render(<AirlineHeader airlineData={mockedAirlineData} />)
    const tree = toJSON()

    if (tree && !Array.isArray(tree)) {
      expect(tree.props.className).toBe('bg-europe')
    } else {
      fail('Expected a single root element from render.')
    }
  })
})

describe('AirlineHeader Component Snapshot', () => {
  it('should render the AirlineHeader Component successfully', () => {
    const { toJSON } = render(<AirlineHeader airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('AirlineHeader Component Snapshot', () => {
  it('should render the AirlineHeader Component with missing hub data successfully', () => {
    const { toJSON } = render(<AirlineHeader airlineData={mockedAirlineDataWithoutHub} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
