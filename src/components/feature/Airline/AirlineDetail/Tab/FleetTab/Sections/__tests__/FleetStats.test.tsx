import { render } from '@testing-library/react-native'
import React from 'react'

import { FleetStats } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Sections/FleetStats'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

const mockedThemedText = jest.fn()

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: (props: { children: string }) => {
      mockedThemedText(props)
      return <Text {...props}>{props.children}</Text>
    },
  }
})

const mockedDefaultProps = {
  totalAirplane: 150,
  averageAgeYears: 12.5,
  airplaneTypeCount: 8,
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: { [key: string]: string } = {
      totalAirplane: 'Total Aircraft',
      averageAgeYears: 'Average Age',
      airplaneType: 'Aircraft Types',
    }
    return translations[key] || key
  })
})

describe('FleetStats Component', () => {
  it('should render all statistics and labels correctly', () => {
    const { getByText } = render(<FleetStats {...mockedDefaultProps} />)

    expect(getByText('150')).toBeTruthy()
    expect(getByText('12.5')).toBeTruthy()
    expect(getByText('8')).toBeTruthy()

    expect(getByText('Total Aircraft')).toBeTruthy()
    expect(getByText('Average Age')).toBeTruthy()
    expect(getByText('Aircraft Types')).toBeTruthy()
  })

  it('should call the localization function with the correct keys', () => {
    render(<FleetStats {...mockedDefaultProps} />)

    expect(mockedGetLocale).toHaveBeenCalledWith('totalAirplane')
    expect(mockedGetLocale).toHaveBeenCalledWith('averageAgeYears')
    expect(mockedGetLocale).toHaveBeenCalledWith('airplaneType')
    expect(mockedGetLocale).toHaveBeenCalledTimes(3)
  })

  it('should not re-render when props are the same', () => {
    const { rerender } = render(<FleetStats {...mockedDefaultProps} />)

    mockedThemedText.mockClear()

    rerender(<FleetStats {...mockedDefaultProps} />)

    expect(mockedThemedText).not.toHaveBeenCalled()
  })

  it('should re-render when props change', () => {
    const { rerender } = render(<FleetStats {...mockedDefaultProps} />)

    mockedThemedText.mockClear()

    rerender(<FleetStats {...mockedDefaultProps} totalAirplane={200} />)

    expect(mockedThemedText).toHaveBeenCalled()
  })
})

describe('FleetStats Component Snapshot', () => {
  it('should render the FleetStats Component successfully', () => {
    const { toJSON } = render(<FleetStats {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
