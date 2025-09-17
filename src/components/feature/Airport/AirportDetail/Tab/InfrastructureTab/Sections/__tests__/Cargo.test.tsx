import { render } from '@testing-library/react-native'
import React from 'react'

import { Cargo } from '@/components/feature/Airport/AirportDetail/Tab/InfrastructureTab/Sections/Cargo'
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

jest.mock('@/components/feature/Airport/AirportDetail/AirportRowItem', () => {
  const { View } = require('react-native')
  return {
    AirportRowItem: (props: any) => {
      mockedAirportRowItem(props)
      return <View testID={`mocked-row-item-${props.icon}`} />
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

const mockedCargoData = {
  annualCargoTonnes: 5500000,
  coldStorage: true,
  dangerousGoods: true,
  terminalCapacityTonnes: 1500000,
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => key)

  mockedFormatNumber.mockImplementation((num: number) =>
    num ? `formatted_${num}` : (undefined as any),
  )
})

describe('Cargo Component', () => {
  describe('When full data is provided', () => {
    it('should render the section with the correct title', () => {
      render(<Cargo cargo={mockedCargoData} />)
      expect(mockedGetLocale).toHaveBeenCalledWith('cargo')
      expect(mockedAirportSectionRow).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'cargo' }),
      )
    })

    it('should render four row items', () => {
      render(<Cargo cargo={mockedCargoData} />)
      expect(mockedAirportRowItem).toHaveBeenCalledTimes(4)
    })

    it('should call formatNumber with correct values', () => {
      render(<Cargo cargo={mockedCargoData} />)
      expect(mockedFormatNumber).toHaveBeenCalledWith(5500000)
      expect(mockedFormatNumber).toHaveBeenCalledWith(1500000)
    })

    it('should pass correct props to each AirportRowItem', () => {
      render(<Cargo cargo={mockedCargoData} />)

      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'cube',
          label: 'annualShipping',
          value: 'formatted_5500000',
        }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'cube-outline',
          label: 'terminalCapacity',
          value: 'formatted_1500000',
        }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'snowflake',
          label: 'coldStorage',
          value: 'existing',
        }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'alert-outline',
          label: 'dangerousGoods',
          value: 'yes',
        }),
      )
    })
  })

  describe('When boolean data varies', () => {
    it('should display correct status when booleans are false', () => {
      const falseData = { ...mockedCargoData, coldStorage: false, dangerousGoods: false }
      render(<Cargo cargo={falseData} />)
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'coldStorage',
          value: 'none',
        }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'dangerousGoods',
          value: 'no',
        }),
      )
    })
  })

  describe('When data is incomplete', () => {
    it('should handle undefined cargo prop gracefully', () => {
      render(<Cargo cargo={undefined as any} />)

      expect(mockedAirportSectionRow).toHaveBeenCalled()
      expect(mockedAirportRowItem).toHaveBeenCalledTimes(4)
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'annualShipping', value: undefined }),
      )
    })
  })
})

describe('Cargo Component Snapshot', () => {
  it('should render the Cargo Component successfully', () => {
    const { toJSON } = render(<Cargo cargo={mockedCargoData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
