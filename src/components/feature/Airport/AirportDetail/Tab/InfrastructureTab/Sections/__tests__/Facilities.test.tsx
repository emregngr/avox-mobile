import { render } from '@testing-library/react-native'
import React from 'react'

import { Facilities } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Facilities'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import { formatNumber } from '@/utils/feature/formatNumber'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/utils/feature/formatNumber')

const mockedFormatNumber = formatNumber as jest.MockedFunction<typeof formatNumber>

const mockedAirportRowItem = jest.fn()
const mockedAirportSectionRow = jest.fn()

jest.mock('@/assets/icons/fireStation.svg', () => 'FireStationIcon')
jest.mock('@/assets/icons/tower.svg', () => 'TowerIcon')

jest.mock('@/components/feature/Airport/AirportDetail/AirportRowItem', () => {
  const { View } = require('react-native')
  return {
    AirportRowItem: (props: any) => {
      mockedAirportRowItem(props)
      return <View testID="mocked-row-item" />
    },
  }
})

jest.mock('@/components/feature/Airport/AirportDetail/AirportSectionRow', () => {
  const { View } = require('react-native')
  return {
    AirportSectionRow: (props: any) => {
      mockedAirportSectionRow(props)
      return <View testID="mocked-section-row">{props.children}</View>
    },
  }
})

const mockedFacilities: any = {
  checkinTimeAvg: 15,
  freeWifi: true,
  googleMapsRating: 4.8,
  hasMetro: true,
  loungeCount: 12,
  parkingCapacityVehicles: 40000,
  securityQueueTime: 10,
}

const mockedInfrastructure: any = {
  fireCategory: 'CAT 10',
  towerHeightM: 90,
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => key)

  mockedFormatNumber.mockImplementation(num => (num ? `formatted_${num}` : ''))
})

describe('Facilities Component', () => {
  it('should render the section with the correct title', () => {
    render(<Facilities facilities={mockedFacilities} infrastructure={mockedInfrastructure} />)
    expect(mockedGetLocale).toHaveBeenCalledWith('facilities')
    expect(mockedAirportSectionRow).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'facilities' }),
    )
  })

  it('should render nine row items', () => {
    render(<Facilities facilities={mockedFacilities} infrastructure={mockedInfrastructure} />)
    expect(mockedAirportRowItem).toHaveBeenCalledTimes(9)
  })

  it('should call formatNumber for parking capacity', () => {
    render(<Facilities facilities={mockedFacilities} infrastructure={mockedInfrastructure} />)
    expect(mockedFormatNumber).toHaveBeenCalledWith(40000)
  })

  it('should pass correct props to all AirportRowItems', () => {
    render(<Facilities facilities={mockedFacilities} infrastructure={mockedInfrastructure} />)

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ customIcon: 'TowerIcon', label: 'tower', value: 90 }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        customIcon: 'TowerIcon',
        label: 'fireDepartmentCategory',
        value: 'CAT 10',
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'car-outline',
        label: 'parking',
        value: 'formatted_40000',
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'subway', label: 'metro', value: 'yes' }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'wifi', label: 'wifiStatus', value: 'free' }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'food-fork-drink', label: 'lounges', value: 12 }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'timer-outline', label: 'security', value: '~10' }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'clock-outline', label: 'checkIn', value: '~15' }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'star-outline', label: 'googleRating', value: '4.8 / 5' }),
    )
  })

  it('should display correct status when booleans are false', () => {
    const falseFacilities = { ...mockedFacilities, hasMetro: false, freeWifi: false }
    render(<Facilities facilities={falseFacilities} infrastructure={mockedInfrastructure} />)

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'metro', value: 'no' }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'wifiStatus', value: 'paid' }),
    )
  })

  it('should handle undefined props gracefully', () => {
    render(<Facilities facilities={undefined as any} infrastructure={undefined as any} />)

    expect(mockedAirportRowItem).toHaveBeenCalledTimes(9)
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'tower', value: undefined }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'parking', value: '' }),
    )
  })
})

describe('Facilities Component Snapshot', () => {
  it('should render the Facilities Component successfully', () => {
    const { toJSON } = render(
      <Facilities facilities={mockedFacilities} infrastructure={mockedInfrastructure} />,
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
