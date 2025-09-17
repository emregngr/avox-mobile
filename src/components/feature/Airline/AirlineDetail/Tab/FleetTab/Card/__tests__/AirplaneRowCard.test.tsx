import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { AirplaneRowCard } from '@/components/feature/Airline/AirlineDetail/Tab/FleetTab/Card/AirplaneRowCard'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import type { AirplaneType } from '@/types/feature/airline'
import { getAirplaneImageKey, getAirplaneImageSource } from '@/utils/feature/getAirplaneImage'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/utils/feature/getAirplaneImage')

const mockedGetAirplaneImageKey = getAirplaneImageKey as jest.MockedFunction<
  typeof getAirplaneImageKey
>
const mockedGetAirplaneImageSource = getAirplaneImageSource as jest.MockedFunction<
  typeof getAirplaneImageSource
>
const mockedOnImagePress = jest.fn()

const mockedAirplane: AirplaneType = {
  type: 'Boeing 737-800',
  count: 50,
  bodyType: 'narrow_body',
  speedKmh: 840,
  rangeKm: 5500,
  capacitySeats: 189,
  capacityTons: 20,
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedGetLocale.mockImplementation((key: string) => key)

  mockedGetAirplaneImageKey.mockReturnValue('b737-key' as any)
  mockedGetAirplaneImageSource.mockReturnValue({ uri: 'mocked-image-uri' } as any)
})

describe('AirplaneRowCard Component', () => {
  it('should render all airplane details correctly', () => {
    const { getByText } = render(
      <AirplaneRowCard
        airplane={mockedAirplane}
        onImagePress={mockedOnImagePress}
        region="Europe"
        testID="airplane-row-card-Boeing 737-800"
        totalAirplane={100}
      />,
    )

    expect(getByText('Boeing 737-800')).toBeTruthy()
    expect(getByText('50')).toBeTruthy()
    expect(getByText('840')).toBeTruthy()
    expect(getByText('189')).toBeTruthy()
    expect(getByText('20')).toBeTruthy()
    expect(getByText('5.5k')).toBeTruthy()
  })

  it('should calculate and display the percentage correctly', () => {
    const { getByText } = render(
      <AirplaneRowCard
        airplane={{ ...mockedAirplane, count: 25 }}
        onImagePress={mockedOnImagePress}
        region="Europe"
        testID="airplane-row-card-Boeing 737-800"
        totalAirplane={80}
      />,
    )

    expect(getByText('31%')).toBeTruthy()
  })

  it('should translate "narrow_body" using getLocale', () => {
    const { getByText } = render(
      <AirplaneRowCard
        airplane={{ ...mockedAirplane, bodyType: 'narrow_body' }}
        onImagePress={mockedOnImagePress}
        region="Europe"
        testID="airplane-row-card-Boeing 737-800"
        totalAirplane={100}
      />,
    )

    expect(mockedGetLocale).toHaveBeenCalledWith('narrowBody')
    expect(getByText('narrowBody')).toBeTruthy()
  })

  it('should call onImagePress with correct arguments when the image is pressed', () => {
    const { getByTestId } = render(
      <AirplaneRowCard
        airplane={mockedAirplane}
        onImagePress={mockedOnImagePress}
        region="Europe"
        testID="airplane-row-card-Boeing 737-800"
        totalAirplane={100}
      />,
    )

    const imageButton = getByTestId('airplane-row-card-Boeing 737-800')
    fireEvent.press(imageButton)

    expect(mockedOnImagePress).toHaveBeenCalledTimes(1)
    expect(mockedOnImagePress).toHaveBeenCalledWith('Boeing 737-800', 'b737-key')
  })

  it('should not render capacity sections if data is undefined', () => {
    const airplaneWithoutCapacity: any = {
      ...mockedAirplane,
      capacitySeats: undefined,
      capacityTons: undefined,
    }

    const { queryByText } = render(
      <AirplaneRowCard
        airplane={airplaneWithoutCapacity}
        onImagePress={mockedOnImagePress}
        region="Europe"
        testID="airplane-row-card-Boeing 737-800"
        totalAirplane={100}
      />,
    )

    expect(queryByText('person')).toBeNull()
    expect(queryByText('ton')).toBeNull()
  })
})

describe('AirplaneRowCard Component Snapshot', () => {
  it('should render the AirplaneRowCard Component successfully', () => {
    const { toJSON } = render(
      <AirplaneRowCard
        airplane={mockedAirplane}
        onImagePress={mockedOnImagePress}
        region="Europe"
        testID="airplane-row-card-Boeing 737-800"
        totalAirplane={100}
      />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
