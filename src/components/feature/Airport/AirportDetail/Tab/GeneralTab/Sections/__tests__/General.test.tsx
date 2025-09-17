import { render } from '@testing-library/react-native'
import React from 'react'

import { General } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/General'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import { formatNumber } from '@/utils/feature/formatNumber'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/utils/feature/formatNumber')

const mockedFormatNumber = formatNumber as jest.MockedFunction<typeof formatNumber>

const mockedAirportSectionRow = jest.fn()
const mockedAirportRowItem = jest.fn()

jest.mock('@/components/feature/Airport/AirportDetail/AirportSectionRow', () => {
  const { View } = require('react-native')
  return {
    AirportSectionRow: (props: any) => {
      mockedAirportSectionRow(props)
      return <View testID="airport-section-row">{props.children}</View>
    },
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/AirportRowItem', () => {
  const { Text } = require('react-native')
  return {
    AirportRowItem: (props: any) => {
      mockedAirportRowItem(props)
      return (
        <Text testID={`row-item-${props.icon}`}>
          {props.label}: {props.value}
        </Text>
      )
    },
  }
})

const mockedAirportInfo: any = {
  foundingYear: '1955',
  employeeCount: 12500,
}

const mockedOperations: any = {
  airportType: 'large_airport',
  is24Hour: true,
  scheduledService: true,
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      airportInfo: 'Airport Information',
      airportType: 'Airport Type',
      numberOfEmployees: 'Number of Employees',
      open24Hours: 'Open 24 Hours',
      scheduledService: 'Scheduled Service',
      year: 'years',
      yearOfEstablishment: 'Year of Establishment',
      yes: 'Yes',
      no: 'No',
      large: 'Large',
      small: 'Small',
      medium: 'Medium',
      mega: 'Mega',
    }
    return translations[key] || key
  })

  mockedFormatNumber.mockImplementation(num => num?.toLocaleString('en-US') || '')
})

describe('General Component', () => {
  it('should render the main section with the correct title', () => {
    render(<General airportInfo={mockedAirportInfo} operations={mockedOperations} />)

    expect(mockedAirportSectionRow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Airport Information',
      }),
    )
  })

  it('should render all data rows with correct props', () => {
    render(<General airportInfo={mockedAirportInfo} operations={mockedOperations} />)

    expect(mockedAirportRowItem).toHaveBeenCalledTimes(5)

    const expectedYears = new Date().getFullYear() - 1955
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'calendar',
        label: 'Year of Establishment',
        value: `1955 (${expectedYears} years)`,
      }),
    )

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'account-group-outline',
        label: 'Number of Employees',
        value: '12,500',
      }),
    )

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'airplane',
        label: 'Airport Type',
        value: 'Large',
      }),
    )

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'hours-24',
        label: 'Open 24 Hours',
        value: 'Yes',
      }),
    )

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'calendar-month-outline',
        label: 'Scheduled Service',
        value: 'Yes',
      }),
    )
  })

  it('should correctly call formatNumber for employee count', () => {
    render(<General airportInfo={mockedAirportInfo} operations={mockedOperations} />)
    expect(mockedFormatNumber).toHaveBeenCalledWith(12500)
  })

  it('should handle different airport types correctly', () => {
    const { rerender } = render(
      <General
        airportInfo={mockedAirportInfo}
        operations={{ airportType: 'small_airport' } as any}
      />,
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(expect.objectContaining({ value: 'Small' }))

    rerender(
      <General
        airportInfo={mockedAirportInfo}
        operations={{ airportType: 'unknown_type' } as any}
      />,
    )

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'unknown type' }),
    )
  })

  it('should handle boolean props (is24Hour, scheduledService) correctly when false', () => {
    const falseOperations: any = { is24Hour: false, scheduledService: false }
    render(<General airportInfo={mockedAirportInfo} operations={falseOperations} />)

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Open 24 Hours',
        value: 'No',
      }),
    )

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Scheduled Service',
        value: 'No',
      }),
    )
  })

  it('should handle missing or undefined props gracefully', () => {
    render(<General airportInfo={undefined as any} operations={undefined as any} />)

    expect(mockedAirportSectionRow).toHaveBeenCalled()
    expect(mockedAirportRowItem).toHaveBeenCalledTimes(5)

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Year of Establishment',
        value: 'undefined (0 years)',
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Number of Employees',
        value: '',
      }),
    )
  })

  it('should not recall getLocale on rerender if locale does not change', () => {
    const { rerender } = render(
      <General airportInfo={mockedAirportInfo} operations={mockedOperations} />,
    )

    const initialCallCount = mockedGetLocale.mock.calls.length
    expect(initialCallCount).toBeGreaterThan(0)

    rerender(<General airportInfo={mockedAirportInfo} operations={mockedOperations} />)

    expect(mockedGetLocale.mock.calls.length).toBe(initialCallCount)
  })
})

describe('General Component Snapshot', () => {
  it('should render the General Component successfully', () => {
    const { toJSON } = render(
      <General airportInfo={mockedAirportInfo} operations={mockedOperations} />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
