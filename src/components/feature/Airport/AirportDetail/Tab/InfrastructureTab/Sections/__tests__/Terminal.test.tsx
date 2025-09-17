import { render } from '@testing-library/react-native'
import React from 'react'

import { Terminal } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Terminal'
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

jest.mock('@/assets/icons/apron.svg', () => 'ApronIcon')

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

const mockedInfrastructure: any = {
  airportAreaHectares: 7650,
  apronCount: 143,
  baggageCapacity: 30000,
  passengerCapacity: 90,
  terminalAreaHectares: 140,
  terminalCount: 1,
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => key)

  mockedFormatNumber.mockImplementation(num => (num ? `formatted_${num}` : ''))
})

describe('Terminal Component', () => {
  it('should render the section with the correct title', () => {
    render(<Terminal infrastructure={mockedInfrastructure} />)
    expect(mockedGetLocale).toHaveBeenCalledWith('terminalandCapacity')
    expect(mockedAirportSectionRow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'terminalandCapacity',
      }),
    )
  })

  it('should render six row items', () => {
    render(<Terminal infrastructure={mockedInfrastructure} />)
    expect(mockedAirportRowItem).toHaveBeenCalledTimes(6)
  })

  it('should call formatNumber for relevant fields', () => {
    render(<Terminal infrastructure={mockedInfrastructure} />)
    expect(mockedFormatNumber).toHaveBeenCalledWith(30000)
    expect(mockedFormatNumber).toHaveBeenCalledWith(140)
    expect(mockedFormatNumber).toHaveBeenCalledWith(7650)
  })

  it('should pass correct props to each AirportRowItem', () => {
    render(<Terminal infrastructure={mockedInfrastructure} />)

    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'account-group-outline',
        label: 'numberOfPassengers',
        value: '90 million/year',
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'briefcase-outline',
        label: 'baggageCapacity',
        value: 'formatted_30000 luggage/hour',
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'home-city-outline',
        label: 'terminal',
        value: 1,
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'grid',
        label: 'terminalArea',
        value: 'formatted_140',
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'map-outline',
        label: 'airportArea',
        value: 'formatted_7650',
      }),
    )
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        customIcon: 'ApronIcon',
        label: 'apron',
        value: 143,
      }),
    )
  })

  it('should handle undefined infrastructure prop gracefully', () => {
    render(<Terminal infrastructure={undefined as any} />)
    expect(mockedAirportSectionRow).toHaveBeenCalled()
    expect(mockedAirportRowItem).toHaveBeenCalledTimes(6)
    expect(mockedAirportRowItem).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'numberOfPassengers',
        value: 'undefined million/year',
      }),
    )
  })
})

describe('Terminal Component Snapshot', () => {
  it('should render the Terminal Component successfully', () => {
    const { toJSON } = render(<Terminal infrastructure={mockedInfrastructure} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
