import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import TotalAirplanes from '@/app/(airplane)/total-airplanes'
import { useHome } from '@/hooks/services/useHome'
import type { TotalAirplaneType } from '@/types/feature/home'

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,

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
  }
})

jest.mock('@/components/feature', () => {
  const { View } = require('react-native')

  return {
    AirplaneCard: ({ airplane }: { airplane: TotalAirplaneType }) => (
      <View testID={`airplane-card-${airplane.id}`} />
    ),
  }
})

jest.mock('@/hooks/services/useHome', () => ({
  useHome: jest.fn(),
}))

const mockedUseHome = useHome as jest.MockedFunction<typeof useHome>

const mockedAirplanes: TotalAirplaneType[] = [
  {
    id: '1',
    model: 'Boeing 737',
    count: 1500,
  },
  {
    id: '2',
    model: 'Airbus A320',
    count: 2000,
  },
] as TotalAirplaneType[]

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

describe('TotalAirplanes Screen', () => {
  it('should display loading screen while loading', () => {
    mockedUseHome.mockReturnValue({ isLoading: true, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<TotalAirplanes />)
    expect(getByTestId('full-screen-loading')).toBeTruthy()
  })

  it('should display the list of airplanes when data is loaded', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { totalAirplanes: mockedAirplanes },
    } as any)
    const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<TotalAirplanes />)
    expect(getByTestId('airplane-card-1')).toBeTruthy()
    expect(getByTestId('airplane-card-2')).toBeTruthy()
    expect(queryByTestId('full-screen-loading')).toBeNull()
  })

  it('should navigate back when the back button is pressed', () => {
    mockedUseHome.mockReturnValue({ isLoading: false, homeData: null } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<TotalAirplanes />)
    fireEvent.press(getByTestId('back-button'))
    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render an empty list without crashing if no airplane data is available', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { totalAirplanes: [] },
    } as any)
    const { queryByTestId } = renderWithSafeAreaProvider(<TotalAirplanes />)
    expect(queryByTestId('airplane-card-1')).toBeNull()
    expect(queryByTestId('full-screen-loading')).toBeNull()
  })

  it('should sort the airplanes by count in descending order', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { totalAirplanes: mockedAirplanes },
    } as any)
    const { getAllByTestId } = renderWithSafeAreaProvider(<TotalAirplanes />)
    const cards = getAllByTestId(/airplane-card-/)

    expect(cards).toHaveLength(2)
    expect(cards[0]!.props.testID).toBe('airplane-card-2')
  })
})

describe('TotalAirplanes Screen Snapshot', () => {
  it('should render the TotalAirplanes Screen successfully', () => {
    mockedUseHome.mockReturnValue({
      isLoading: false,
      homeData: { totalAirplanes: mockedAirplanes },
    } as any)

    const { toJSON } = renderWithSafeAreaProvider(<TotalAirplanes />)

    expect(toJSON()).toMatchSnapshot()
  })
})
