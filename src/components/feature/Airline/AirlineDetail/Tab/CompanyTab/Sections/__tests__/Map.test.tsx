import { render } from '@testing-library/react-native'
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

    it('renders WebView', async () => {
      const { getByTestId } = await render(<Map airlineData={mockedAirlineData} />)
      expect(getByTestId('mocked-webview')).toBeTruthy()
    })

    it('generates HTML with the correct, evaluated URL', async () => {
      const { getByTestId } = await render(<Map airlineData={mockedAirlineData} />)
      const webView = getByTestId('mocked-webview')
      const html = webView.props.source.html

      const expectedUrl = `src="https://maps.google.com/maps?q=${mockedAirlineData.operations.hub.coordinates.latitude},${mockedAirlineData.operations.hub.coordinates.longitude}&z=12&output=embed"`
      expect(html).toContain(expectedUrl)
    })
  })

  describe('Data Handling (Testing for Crashes)', () => {
    it('renders nothing when airlineData is null', async () => {
      const { toJSON } = await render(<Map airlineData={null as any} />)
      expect(toJSON()).toBeNull()
    })

    it('renders nothing for missing operations', async () => {
      const incompleteData: any = { id: '1', name: 'Test' }
      const { toJSON } = await render(<Map airlineData={incompleteData} />)
      expect(toJSON()).toBeNull()
    })

    it('renders nothing for missing hub', async () => {
      const incompleteData: any = { id: '1', name: 'Test', operations: {} }
      const { toJSON } = await render(<Map airlineData={incompleteData} />)
      expect(toJSON()).toBeNull()
    })

    it('renders nothing for missing coordinates', async () => {
      const incompleteData: any = {
        id: '1',
        name: 'Test',
        operations: { hub: {} },
      }
      const { toJSON } = await render(<Map airlineData={incompleteData} />)
      expect(toJSON()).toBeNull()
    })
  })
})

describe('Map Component Snapshot', () => {
  it('should render the Map Component successfully', async () => {
    const { toJSON } = await render(<Map airlineData={mockedAirlineData} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
