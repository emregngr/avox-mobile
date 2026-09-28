import { render } from '@testing-library/react-native'

import { Location } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Location'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import { formatNumber } from '@/utils/feature/formatNumber'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

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

jest.mock('@/utils/feature/formatNumber')

const mockedFormatNumber = formatNumber as jest.MockedFunction<typeof formatNumber>

const mockedOperations: any = {
  country: 'Turkey',
  location: {
    city: 'Istanbul',
    elevationFt: 325,
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedGetLocale.mockImplementation((key: string) => key)

  mockedFormatNumber.mockImplementation(num => (num ? `formatted_${num}` : (undefined as any)))
})

describe('Location Component', () => {
  describe('When full data is provided', () => {
    it('should render the section with the correct title', async () => {
      await render(<Location operations={mockedOperations} />)
      expect(mockedGetLocale).toHaveBeenCalledWith('locationInformation')
      expect(mockedAirportSectionRow).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'locationInformation',
        }),
      )
    })

    it('should render three row items', async () => {
      await render(<Location operations={mockedOperations} />)
      expect(mockedAirportRowItem).toHaveBeenCalledTimes(3)
    })

    it('should call formatNumber with the elevation', async () => {
      await render(<Location operations={mockedOperations} />)
      expect(mockedFormatNumber).toHaveBeenCalledWith(325)
    })

    it('should pass correct props to each AirportRowItem', async () => {
      await render(<Location operations={mockedOperations} />)
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'city-variant-outline',
          label: 'city',
          value: 'Istanbul',
        }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'earth',
          label: 'country',
          value: 'Turkey',
        }),
      )
      expect(mockedAirportRowItem).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'elevation-rise',
          label: 'elevation',
          value: 'formatted_325',
        }),
      )
    })
  })

  describe('When data is incomplete', () => {
    it('should throw an error when operations prop is undefined', async () => {
      await expect(render(<Location operations={undefined as any} />)).rejects.toThrow(
        "Cannot read properties of undefined (reading 'city'",
      )
    })

    it('should throw an error if operations exists but the nested location object is missing', async () => {
      const operationsWithoutLocation = {
        country: 'Turkey',
      }
      await expect(
        render(<Location operations={operationsWithoutLocation as any} />),
      ).rejects.toThrow("Cannot read properties of undefined (reading 'city'")
    })
  })
})

describe('Location Component Snapshot', () => {
  it('should render the Location Component successfully', async () => {
    const { toJSON } = await render(<Location operations={mockedOperations} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
