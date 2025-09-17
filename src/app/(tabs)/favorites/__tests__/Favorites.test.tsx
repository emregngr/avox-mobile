import { render, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Favorites from '@/app/(tabs)/favorites'
import { useFavoriteDetails } from '@/hooks/services/useFavorite'
import useAuthStore from '@/store/auth'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import type { AirlineType } from '@/types/feature/airline'
import type { AirportType } from '@/types/feature/airport'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/hooks/services/useFavorite')

const mockedUseFavoriteDetails = useFavoriteDetails as jest.MockedFunction<
  typeof useFavoriteDetails
>

jest.mock('@/store/auth')

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { View } = require('react-native')

  return {
    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    RenderTabBar: () => <View testID="render-tab-bar" />,
  }
})

jest.mock('@/components/feature', () => {
  const { View, Text } = require('react-native')

  return {
    FavoriteAirports: ({ airports }: { airports: AirportType[] }) => (
      <View testID="favorite-airports">
        <Text>Airports count: {airports?.length ?? 0}</Text>
      </View>
    ),

    FavoriteAirlines: ({ airlines }: { airlines: AirlineType[] }) => (
      <View testID="favorite-airlines">
        <Text>Airlines count: {airlines?.length ?? 0}</Text>
      </View>
    ),
  }
})

jest.mock('react-native-collapsible-tab-view', () => {
  const { View } = require('react-native')

  const MockedContainer = ({
    children,
    renderTabBar,
  }: {
    children: ReactNode
    renderTabBar: (props: any) => ReactNode
  }) => (
    <View testID="tabs-container">
      {renderTabBar ? renderTabBar({}) : null}
      {children}
    </View>
  )

  const MockedTab = ({ children, name }: { children: ReactNode; name: string }) => (
    <View testID={`tab-content-${name}`}>{children}</View>
  )

  return {
    Tabs: {
      Container: MockedContainer,
      Tab: MockedTab,
    },
  }
})

const mockedAirport = {
  id: 'IST',
  name: 'Istanbul Airport',
  operations: { airportType: 'small_airport' },
}

const mockedAirline = {
  id: 'TK',
  name: 'Turkish Airlines',
  operations: { businessType: 'regional' },
}

const mockedMixedData = [mockedAirport, mockedAirline, { ...mockedAirport, id: 'SAW' }]

const renderWithSafeAreaProvider = (component: ReactNode) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}
    >
      {component}
    </SafeAreaProvider>,
  )

beforeEach(() => {
  mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedUseFavoriteDetails.mockReturnValue({
    favoriteDetails: [],
    isLoading: true,
    refetch: jest.fn(),
  } as any)
})

describe('Favorites Screen', () => {
  it('should display FullScreenLoading component if the user is not authenticated', () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: false })

    const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<Favorites />)

    expect(getByTestId('full-screen-loading')).toBeTruthy()
    expect(queryByTestId('tabs-container')).toBeNull()
  })

  it('should display the tab structure if the user is authenticated and data is loading', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Favorites />)

    expect(getByTestId('tabs-container')).toBeTruthy()
    expect(getByTestId('render-tab-bar')).toBeTruthy()
  })

  it('should filter airports and airlines correctly and pass them to the respective components when data is loaded', async () => {
    mockedUseFavoriteDetails.mockReturnValue({
      data: mockedMixedData,
      isLoading: false,
      refetch: jest.fn(),
    } as any)

    const { getByText } = renderWithSafeAreaProvider(<Favorites />)

    await waitFor(() => {
      expect(getByText('Airports count: 2')).toBeTruthy()

      expect(getByText('Airlines count: 1')).toBeTruthy()
    })
  })

  it('should render the correct tab labels', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Favorites />)

    expect(getByTestId('tab-content-airlines')).toBeTruthy()
    expect(getByTestId('tab-content-airports')).toBeTruthy()
  })

  it('should show that components receive 0 items when there are no favorites', async () => {
    mockedUseFavoriteDetails.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: jest.fn(),
    } as any)

    const { getByText } = renderWithSafeAreaProvider(<Favorites />)

    await waitFor(() => {
      expect(getByText('Airports count: 0')).toBeTruthy()
      expect(getByText('Airlines count: 0')).toBeTruthy()
    })
  })
})

describe('Favorites Screen Snapshot', () => {
  it('should render the Favorites screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Favorites />)

    expect(toJSON()).toMatchSnapshot()
  })
})
