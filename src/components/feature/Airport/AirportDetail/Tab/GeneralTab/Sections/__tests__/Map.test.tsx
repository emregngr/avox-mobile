import { render } from '@testing-library/react-native'
import { Platform } from 'react-native'

import { Map } from '@/components/feature/Airport/AirportDetail/Tab/GeneralTab/Sections/Map'
import { useMapActions } from '@/hooks/maps/useMapAction'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

const mockedOnMarkerClick = jest.fn()

jest.mock('@/hooks/maps/useMapAction')

const mockedUseMapActions = useMapActions as jest.MockedFunction<typeof useMapActions>

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

const mockedAirportData: any = {
  id: '123',
  iataCode: 'LTFM',
  name: 'Istanbul Airport',
  operations: {
    location: {
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

    it('renders WebView', async () => {
      const { getByTestId } = await render(<Map airportData={mockedAirportData} />)
      expect(getByTestId('mocked-webview')).toBeTruthy()
    })

    it('generates HTML with the correct, evaluated URL', async () => {
      const { getByTestId } = await render(<Map airportData={mockedAirportData} />)
      const webView = getByTestId('mocked-webview')
      const html = webView.props.source.html

      const expectedUrl = `src="https://maps.google.com/maps?q=${mockedAirportData.operations.location.coordinates.latitude},${mockedAirportData.operations.location.coordinates.longitude}&z=12&output=embed"`
      expect(html).toContain(expectedUrl)
    })
  })

  describe('Data Handling (Testing for Crashes)', () => {
    it('renders nothing when AirportInfo is null', async () => {
      const { toJSON } = await render(<Map airportData={null as any} />)
      expect(toJSON()).toBeNull()
    })

    it('renders nothing for missing operations', async () => {
      const incompleteData: any = { id: '1', name: 'Test' }
      const { toJSON } = await render(<Map airportData={incompleteData} />)
      expect(toJSON()).toBeNull()
    })

    it('renders nothing for missing hub', async () => {
      const incompleteData: any = { id: '1', name: 'Test', operations: {} }
      const { toJSON } = await render(<Map airportData={incompleteData} />)
      expect(toJSON()).toBeNull()
    })

    it('renders nothing for missing coordinates', async () => {
      const incompleteData: any = {
        id: '1',
        name: 'Test',
        operations: { location: {} },
      }
      const { toJSON } = await render(<Map airportData={incompleteData} />)
      expect(toJSON()).toBeNull()
    })
  })
})

describe('Map Component Snapshot', () => {
  it('should render the Map Component successfully', async () => {
    const { toJSON } = await render(<Map airportData={mockedAirportData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
