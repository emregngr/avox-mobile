import { render } from '@testing-library/react-native'
import React from 'react'

import { Runway } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Runway'
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

jest.mock('@/assets/icons/runway.svg', () => 'RunwayIcon')

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
  runwayCount: 3,
  runways: {
    ilsCategory: 'CAT IIIb',
    lengthM: 4100,
    pcn: '150/R/A/W/T',
    surface: 'Asphalt',
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => key)

  mockedFormatNumber.mockImplementation(num => (num ? `formatted_${num}` : ''))
})

describe('Runway Component', () => {
  describe('When full data is provided', () => {
    it('should render the section with the correct title', () => {
      render(<Runway infrastructure={mockedInfrastructure} />)
      expect(mockedGetLocale).toHaveBeenCalledWith('trackInformation')
      expect(mockedAirportSectionRow).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'trackInformation' }),
      )
    })

    it('should render five row items', () => {
      render(<Runway infrastructure={mockedInfrastructure} />)
      expect(mockedAirportRowItem).toHaveBeenCalledTimes(5)
    })

    it('should call formatNumber for the runway length', () => {
      render(<Runway infrastructure={mockedInfrastructure} />)
      expect(mockedFormatNumber).toHaveBeenCalledWith(4100)
    })

    it('should pass correct props to each AirportRowItem', () => {
      render(<Runway infrastructure={mockedInfrastructure} />)

      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({ customIcon: 'RunwayIcon', label: 'runway', value: 3 }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'resize', label: 'runwaym', value: 'formatted_4100' }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'layers-outline', label: 'surface', value: 'Asphalt' }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'information-outline',
          label: 'pcn',
          value: '150/R/A/W/T',
        }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'eye', label: 'ilsCategory', value: 'CAT IIIb' }),
      )
    })
  })

  describe('When data is incomplete', () => {
    it('should throw an error if infrastructure prop is undefined', () => {
      expect(() => render(<Runway infrastructure={undefined as any} />)).toThrow(
        "Cannot read properties of undefined (reading 'ilsCategory')",
      )
    })

    it('should throw an error if the nested runways object is missing', () => {
      const partialData = { runwayCount: 2 }
      expect(() => render(<Runway infrastructure={partialData as any} />)).toThrow(
        "Cannot read properties of undefined (reading 'ilsCategory')",
      )
    })
  })
})

describe('Runway Component Snapshot', () => {
  it('should render the Runway Component successfully', () => {
    const { toJSON } = render(<Runway infrastructure={mockedInfrastructure} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
