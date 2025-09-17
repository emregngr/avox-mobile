import { render } from '@testing-library/react-native'
import React from 'react'

import { Services } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Services'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedAirportSectionRow = jest.fn()

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
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
  services: ['Free Wi-Fi', 'Lounge Access', 'Duty-Free Shopping'],
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedGetLocale.mockReturnValue('Available Services')
})

describe('Services Component', () => {
  describe('When services are available', () => {
    it('should render the section with the correct title', () => {
      const { getByTestId } = render(<Services facilities={mockedFacilities} />)
      expect(mockedGetLocale).toHaveBeenCalledWith('services')
      expect(mockedAirportSectionRow).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Available Services',
        }),
      )
      expect(getByTestId('mocked-section-row')).toBeTruthy()
    })

    it('should render an item for each service in the list', () => {
      const { getAllByTestId, getByText } = render(<Services facilities={mockedFacilities} />)
      expect(getAllByTestId('mocked-material-community-icon').length).toBe(3)
      expect(getByText('Free Wi-Fi')).toBeTruthy()
      expect(getByText('Lounge Access')).toBeTruthy()
      expect(getByText('Duty-Free Shopping')).toBeTruthy()
    })

    it('should pass correct props to icons and text for each service', () => {
      render(<Services facilities={mockedFacilities} />)
    })
  })

  describe('When services are not available', () => {
    it('should render nothing if facilities prop is undefined', () => {
      const { toJSON } = render(<Services facilities={undefined as any} />)
      expect(toJSON()).toBeNull()
    })

    it('should render nothing if services array is missing', () => {
      const { toJSON } = render(<Services facilities={{} as any} />)
      expect(toJSON()).toBeNull()
    })

    it('should render nothing if services array is empty', () => {
      const { toJSON } = render(<Services facilities={{ services: [] } as any} />)
      expect(toJSON()).toBeNull()
    })

    it('should render nothing if services array is null', () => {
      const { toJSON } = render(<Services facilities={{ services: null } as any} />)
      expect(toJSON()).toBeNull()
    })
  })
})

describe('Services Component Snapshot', () => {
  it('should render the Services Component successfully', () => {
    const { toJSON } = render(<Services facilities={mockedFacilities} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
