import { render, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Discover from '@/app/(tabs)/discover'
import { useAirline } from '@/hooks/services/useAirline'
import { useAirport } from '@/hooks/services/useAirport'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/hooks/services/useAirport')

const mockedUseAirport = useAirport as jest.MockedFunction<typeof useAirport>

jest.mock('@/hooks/services/useAirline')

const mockedUseAirline = useAirline as jest.MockedFunction<typeof useAirline>

jest.mock('@/components/common', () => {
  const { View } = require('react-native')

  return {
    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    RenderTabBar: () => <View testID="render-tab-bar" />,
  }
})

jest.mock('@/components/feature', () => {
  const { View, Text } = require('react-native')

  return {
    AirportsTab: ({
      airportsLoading,
      airportsSearchTerm,
      paginatedAirports,
    }: {
      airportsLoading: boolean
      airportsSearchTerm: string
      paginatedAirports: any[]
    }) => (
      <View testID="airports-tab">
        <Text>AirportsLoading: {airportsLoading}</Text>
        <Text>AirportsSearch: {airportsSearchTerm}</Text>
        <Text>AirportsCount: {paginatedAirports?.length ?? 0}</Text>
      </View>
    ),

    AirlinesTab: ({
      airlinesLoading,
      airlinesSearchTerm,
      paginatedAirlines,
    }: {
      airlinesLoading: boolean
      airlinesSearchTerm: string
      paginatedAirlines: any[]
    }) => (
      <View testID="airlines-tab">
        <Text>AirlinesLoading: {airlinesLoading}</Text>
        <Text>AirlinesSearch: {airlinesSearchTerm}</Text>
        <Text>AirlinesCount: {paginatedAirlines?.length ?? 0}</Text>
      </View>
    ),
  }
})

jest.mock('react-native-collapsible-tab-view', () => {
  const { View } = require('react-native')

  const MockContainer = ({
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

  const MockTab = ({ children, name }: { children: ReactNode; name: string }) => (
    <View testID={`tab-content-${name}`}>{children}</View>
  )

  return {
    Tabs: {
      Container: MockContainer,
      Tab: MockTab,
    },
  }
})

const mockedAirportData = {
  filters: {},
  filteredCount: 1,
  hasMore: true,
  isLoading: false,
  isSearchLoading: false,
  searchTerm: 'IST',
  loadMore: jest.fn(),
  paginatedAirports: [{ id: 'IST', name: 'Istanbul Airport' }],
  setFilters: jest.fn(),
  setSearchTerm: jest.fn(),
}

const mockedAirlineData = {
  filters: {},
  filteredCount: 1,
  hasMore: true,
  isLoading: false,
  isSearchLoading: false,
  searchTerm: 'THY',
  loadMore: jest.fn(),
  paginatedAirlines: [{ id: 'TK', name: 'Turkish Airlines' }],
  setFilters: jest.fn(),
  setSearchTerm: jest.fn(),
}

const renderWithSafeAreaProvider = (component: ReactNode) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 375, height: 812 },
      }}
    >
      {component}
    </SafeAreaProvider>,
  )

beforeEach(() => {
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedUseAirport.mockReturnValue(mockedAirportData as any)
  mockedUseAirline.mockReturnValue(mockedAirlineData as any)
})

describe('Discover Screen', () => {
  it('should render the tab container and tab bar correctly', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Discover />)
    expect(getByTestId('tabs-container')).toBeTruthy()
    expect(getByTestId('render-tab-bar')).toBeTruthy()
  })

  it('should render tabs with the correct labels', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Discover />)
    expect(getByTestId('tab-content-airports')).toBeTruthy()
    expect(getByTestId('tab-content-airlines')).toBeTruthy()
  })

  it('should pass correct props from useAirport hook to AirportsTab', async () => {
    const { getByText, getByTestId } = renderWithSafeAreaProvider(<Discover />)

    await waitFor(() => {
      const airportsTab = getByTestId('airports-tab')
      expect(airportsTab).toContainElement(
        getByText(`AirportsSearch: ${mockedAirportData.searchTerm}`),
      )
      expect(airportsTab).toContainElement(
        getByText(`AirportsCount: ${mockedAirportData.paginatedAirports.length}`),
      )
    })
  })

  it('should pass correct props from useAirline hook to AirlinesTab', async () => {
    const { getByText, getByTestId } = renderWithSafeAreaProvider(<Discover />)

    await waitFor(() => {
      const airlinesTab = getByTestId('airlines-tab')
      expect(airlinesTab).toContainElement(
        getByText(`AirlinesSearch: ${mockedAirlineData.searchTerm}`),
      )
      expect(airlinesTab).toContainElement(
        getByText(`AirlinesCount: ${mockedAirlineData.paginatedAirlines.length}`),
      )
    })
  })
})

describe('Discover Screen Snapshot', () => {
  it('should render the Discover screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Discover />)

    expect(toJSON()).toMatchSnapshot()
  })
})
