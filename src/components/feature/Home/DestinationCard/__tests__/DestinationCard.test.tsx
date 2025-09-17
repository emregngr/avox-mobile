import { render } from '@testing-library/react-native'
import React from 'react'

import { DestinationCard } from '@/components/feature/Home/DestinationCard'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import type { PopularDestinationType } from '@/types/feature/home'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

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

const mockedDestination: PopularDestinationType = {
  id: '1',
  country: 'Türkiye',
  destinations_type: 'International',
  distance_km: 12345,
  flight_count: 678,
  route: 'IST → JFK',
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => {
    const localeMap: Record<string, string> = {
      distance: 'Distance',
      'flight/year': 'Flights per year',
      km: 'km',
      domestic: 'Domestic',
      international: 'International',
    }
    return localeMap[key] || key
  })
})

describe('DestinationCard', () => {
  it('renders route and country correctly', () => {
    const { getByText } = render(<DestinationCard destination={mockedDestination} />)

    expect(getByText('IST → JFK')).toBeTruthy()
    expect(getByText('Türkiye')).toBeTruthy()
  })

  it('renders formatted flight count and distance with unit', () => {
    const { getByText } = render(<DestinationCard destination={mockedDestination} />)

    expect(getByText('678')).toBeTruthy()
    expect(getByText('12.345 km')).toBeTruthy()
  })

  it('renders localized labels correctly', () => {
    const { getByText } = render(<DestinationCard destination={mockedDestination} />)

    expect(getByText('Flights per year')).toBeTruthy()
    expect(getByText('Distance')).toBeTruthy()
    expect(getByText('International')).toBeTruthy()
  })

  it('should render the DestinationCard successfully', () => {
    render(<DestinationCard destination={mockedDestination} />)

    const { toJSON } = render(<DestinationCard destination={mockedDestination} />)

    expect(toJSON()).toMatchSnapshot()
  })
})

describe('DestinationCard Component Snapshot', () => {
  it('should render the DestinationCard Component successfully', () => {
    const { toJSON } = render(<DestinationCard destination={mockedDestination} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
