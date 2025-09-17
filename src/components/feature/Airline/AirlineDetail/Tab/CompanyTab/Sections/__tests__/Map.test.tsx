import { render } from '@testing-library/react-native'
import React from 'react'
import { Platform } from 'react-native'

import { Map } from '@/components/feature/Airline/AirlineDetail/Tab/CompanyTab/Sections/Map'
import { useMapActions } from '@/hooks/maps/useMapAction'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

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

const mockedOnMarkerClick = jest.fn()

jest.mock('@/hooks/maps/useMapAction')

const mockedUseMapActions = useMapActions as jest.MockedFunction<typeof useMapActions>

const mockedAirlineData: any = {
  id: '123',
  iataCode: 'TK',
  name: 'Turkish Airlines',
  operations: {
    hub: {
      coordinates: {
        latitude: 41.0082,
        longitude: 28.9784,
      },
    },
    region: 'europe',
  },
}

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({
    selectedLocale: 'en',
  })
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })

  mockedUseMapActions.mockReturnValue({
    onMarkerClick: mockedOnMarkerClick,
  })
})

describe('Map Component', () => {
  describe('Platform: Android', () => {
    beforeAll(() => {
      Platform.OS = 'android'
    })

    it('renders WebView', () => {
      const { getByTestId } = render(<Map airlineData={mockedAirlineData} />)
      expect(getByTestId('mocked-webview')).toBeTruthy()
    })

    it('generates HTML with the correct, evaluated URL', () => {
      const { getByTestId } = render(<Map airlineData={mockedAirlineData} />)
      const webView = getByTestId('mocked-webview')
      const html = webView.props.source.html

      const expectedUrl = `src="https://maps.google.com/maps?q=${mockedAirlineData.operations.hub.coordinates.latitude},${mockedAirlineData.operations.hub.coordinates.longitude}&z=12&output=embed"`
      expect(html).toContain(expectedUrl)
    })
  })

  describe('Data Handling (Testing for Crashes)', () => {
    it('throws an error when airlineData is null', () => {
      expect(() => render(<Map airlineData={null as any} />)).toThrow()
    })

    it('throws an error for missing operations', () => {
      const incompleteData: any = { id: '1', name: 'Test' }
      expect(() => render(<Map airlineData={incompleteData} />)).toThrow(
        "Cannot read properties of undefined (reading 'coordinates')",
      )
    })

    it('throws an error for missing hub', () => {
      const incompleteData: any = { id: '1', name: 'Test', operations: {} }
      expect(() => render(<Map airlineData={incompleteData} />)).toThrow(
        "Cannot read properties of undefined (reading 'coordinates')",
      )
    })

    it('throws an error for missing coordinates', () => {
      const incompleteData: any = {
        id: '1',
        name: 'Test',
        operations: { hub: {} },
      }
      expect(() => render(<Map airlineData={incompleteData} />)).toThrow(
        "Cannot read properties of undefined (reading 'latitude')",
      )
    })
  })
})

describe('Map Component Snapshot', () => {
  it('should render the Map Component successfully', () => {
    const { toJSON } = render(<Map airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
