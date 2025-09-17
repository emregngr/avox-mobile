import { render } from '@testing-library/react-native'
import React from 'react'

import { AirportServices } from '@/components/feature/FilterModal/AirportServices'
import { FilterChip } from '@/components/feature/FilterModal/FilterChip'
import { getAirportServices } from '@/constants/filterModalOptions'
import { getLocale } from '@/locales/i18next'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/constants/filterModalOptions')

const mockedGetAirportServices = getAirportServices as jest.MockedFunction<
  typeof getAirportServices
>

jest.mock('@/components/feature/FilterModal/FilterChip', () => ({
  FilterChip: jest.fn(() => null),
}))

const mockedFilterChip = FilterChip as jest.MockedFunction<typeof FilterChip>

const mockedServices = [
  { label: 'WiFi', value: 'wifi' },
  { label: 'Lounge', value: 'lounge' },
  { label: 'Parking', value: 'parking' },
]

const mockedTitle = 'Additional Services & Facilities'

let mockedOnBooleanToggle: jest.MockedFunction<() => void>

beforeEach(() => {
  mockedOnBooleanToggle = jest.fn()

  mockedGetAirportServices.mockReturnValue(mockedServices)

  mockedGetLocale.mockReturnValue(mockedTitle)
})

describe('AirportServices', () => {
  it('should render the title and all service chips correctly', () => {
    const { getByText } = render(
      <AirportServices localFilters={{}} onBooleanToggle={mockedOnBooleanToggle} />,
    )

    expect(getByText(mockedTitle)).toBeTruthy()
    expect(mockedFilterChip).toHaveBeenCalledTimes(mockedServices.length)

    const calls = mockedFilterChip.mock.calls
    expect(calls?.[0]?.[0].label).toBe('WiFi')
    expect(calls?.[1]?.[0].label).toBe('Lounge')
    expect(calls?.[2]?.[0].label).toBe('Parking')
  })

  it('should call onBooleanToggle with the correct value when a chip is pressed', () => {
    render(<AirportServices localFilters={{}} onBooleanToggle={mockedOnBooleanToggle} />)

    const loungeCall = mockedFilterChip.mock.calls.find(call => call[0].label === 'Lounge')
    const loungeProps = loungeCall?.[0]
    loungeProps?.onPress()

    expect(mockedOnBooleanToggle).toHaveBeenCalledTimes(1)
    expect(mockedOnBooleanToggle).toHaveBeenCalledWith('lounge')
  })

  it('should correctly pass the "selected" prop based on localFilters', () => {
    const localFilters = {
      lounge: true,
      parking: false,
    }

    render(<AirportServices localFilters={localFilters} onBooleanToggle={mockedOnBooleanToggle} />)

    const calls = mockedFilterChip.mock.calls

    expect(calls?.[0]?.[0].label).toBe('WiFi')
    expect(calls?.[0]?.[0].selected).toBe(false)

    expect(calls?.[1]?.[0].label).toBe('Lounge')
    expect(calls?.[1]?.[0].selected).toBe(true)

    expect(calls?.[2]?.[0].label).toBe('Parking')
    expect(calls?.[2]?.[0].selected).toBe(false)
  })

  it('should not refetch services on re-render due to useMemo', () => {
    const { rerender } = render(
      <AirportServices localFilters={{}} onBooleanToggle={mockedOnBooleanToggle} />,
    )

    expect(mockedGetAirportServices).toHaveBeenCalledTimes(1)

    rerender(
      <AirportServices localFilters={{ wifi: true }} onBooleanToggle={mockedOnBooleanToggle} />,
    )

    expect(mockedGetAirportServices).toHaveBeenCalledTimes(1)
  })
})
