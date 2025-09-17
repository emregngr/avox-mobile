import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AllPopularDestinations from '@/app/(destination)/all-popular-destinations'
import { useHome } from '@/hooks/services/useHome'
import type { PopularDestinationType } from '@/types/feature/home'

jest.mock('@/hooks/services/useHome', () => ({
  useHome: jest.fn(),
}))

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,
  }
})

jest.mock('@/components/feature', () => {
  const { View } = require('react-native')

  return {
    DestinationCard: ({ destination }: { destination: PopularDestinationType }) => (
      <View testID={`destination-card-${destination.id}`} />
    ),
  }
})

const mockedUseHome = useHome as jest.MockedFunction<typeof useHome>

const mockedDestinationsData: PopularDestinationType[] = [
  {
    id: '1',
    route: 'Jeju (CJU) - Seoul (GMP)',
    country: 'South Korea',
    flight_count: 206680,
    distance_km: 451,
    destinations_type: 'Domestic',
  },
  {
    id: '2',
    route: 'Sapporo (CTS) - Tokyo (HND)',
    country: 'Japan',
    flight_count: 178940,
    distance_km: 831,
    destinations_type: 'Domestic',
  },
]

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

describe('AllPopularDestinations Screen', () => {
  it('should display loading screen while loading', () => {
    mockedUseHome.mockReturnValue({ isLoading: true, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AllPopularDestinations />)
    expect(getByTestId('full-screen-loading')).toBeTruthy()
  })

  it('should display the list of destinations when data is loaded', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { popularDestinations: mockedDestinationsData },
    } as any)
    const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<AllPopularDestinations />)
    expect(getByTestId('destination-card-1')).toBeTruthy()
    expect(getByTestId('destination-card-2')).toBeTruthy()
    expect(queryByTestId('loading')).toBeNull()
  })

  it('should navigate back when the back button is pressed', () => {
    mockedUseHome.mockReturnValue({ isLoading: false, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<AllPopularDestinations />)
    fireEvent.press(getByTestId('back-button'))
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render an empty list without crashing if no destination data is available', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { popularDestinations: [] },
    } as any)
    const { queryByTestId } = renderWithSafeAreaProvider(<AllPopularDestinations />)
    expect(queryByTestId('destination-card-1')).toBeNull()
    expect(queryByTestId('loading')).toBeNull()
  })
})

describe('AllPopularDestinations Screen Snapshot', () => {
  it('should render the AllPopularDestinations Screen successfully', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { popularDestinations: mockedDestinationsData },
    } as any)

    const { toJSON } = renderWithSafeAreaProvider(<AllPopularDestinations />)

    expect(toJSON()).toMatchSnapshot()
  })
})
