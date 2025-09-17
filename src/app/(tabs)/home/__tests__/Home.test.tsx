import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Home from '@/app/(tabs)/home'
import { useHome } from '@/hooks/services/useHome'
import { useRegisterDevice, useRegisterDeviceToUser } from '@/hooks/services/useUser'
import { registerDevice, registerDeviceToUser } from '@/services/userService'
import useAuthStore from '@/store/auth'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/auth')

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

jest.mock('@/hooks/services/useHome')

const mockedUseHome = useHome as jest.MockedFunction<typeof useHome>

jest.mock('@/hooks/services/useUser')

const mockedUseRegisterDevice = useRegisterDevice as jest.MockedFunction<typeof useRegisterDevice>

const mockedUseRegisterDeviceToUser = useRegisterDeviceToUser as jest.MockedFunction<
  typeof useRegisterDeviceToUser
>

jest.mock('@/services/userService')

const mockedRegisterDevice = registerDevice as jest.MockedFunction<typeof registerDevice>

const mockedRegisterDeviceToUser = registerDeviceToUser as jest.MockedFunction<
  typeof registerDeviceToUser
>

jest.mock('@/components/common', () => {
  const { View } = require('react-native')

  return {
    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,
  }
})

jest.mock('@/components/feature', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    NewsSection: ({ breakingNews }: { breakingNews: any[] }) => (
      <View testID="news-section">
        <Text>News Count: {breakingNews.length}</Text>
      </View>
    ),

    SectionScroll: ({
      title,
      onViewAll,
      data,
    }: {
      title: string
      onViewAll: () => void
      data: any[]
    }) => (
      <View testID={`section-${title}`}>
        <Text>{title}</Text>
        <TouchableOpacity onPress={onViewAll} testID={`view-all-${title}`}>
          <Text>View All</Text>
        </TouchableOpacity>
        <Text>Item count: {data.length}</Text>
      </View>
    ),
  }
})

const mockedHomeData = {
  breakingNews: [{ id: 1, title: 'Test News' }],
  popularAirlines: [{ id: 'TK', name: 'Turkish Airlines' }],
  popularAirports: [{ id: 'IST', name: 'Istanbul Airport' }],
  popularDestinations: [{ id: 'AYT', name: 'Antalya' }],
  totalAirplanes: [{ id: 'TC-JJA', model: 'A330' }],
}

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
  mockedUseHome.mockReturnValue({
    homeData: null,
    isLoading: true,
  } as any)

  mockedUseRegisterDevice.mockReturnValue({ mutateAsync: mockedRegisterDevice } as any)

  mockedUseRegisterDeviceToUser.mockReturnValue({ mutateAsync: mockedRegisterDeviceToUser } as any)

  mockedUseAuthStore.mockReturnValue({ isAuthenticated: false })
})

describe('Home Screen', () => {
  it('should display FullScreenLoading component while data is loading', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Home />)
    expect(getByTestId('full-screen-loading')).toBeTruthy()
  })

  it('should display all sections with correct titles when data is loaded', () => {
    mockedUseHome.mockReturnValue({ homeData: mockedHomeData, isLoading: false } as any)

    const { getByText, getByTestId } = renderWithSafeAreaProvider(<Home />)

    expect(getByTestId('news-section')).toBeTruthy()
    expect(getByText('popularAirlines')).toBeTruthy()
    expect(getByText('popularAirports')).toBeTruthy()
    expect(getByText('popularDestinations')).toBeTruthy()
    expect(getByText('totalAirplanes')).toBeTruthy()
  })

  it('should call only handleAddDevice when the user is not authenticated', async () => {
    mockedUseHome.mockReturnValue({ homeData: mockedHomeData, isLoading: false } as any)
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: false })

    renderWithSafeAreaProvider(<Home />)

    await waitFor(() => {
      expect(mockedRegisterDevice).toHaveBeenCalledTimes(1)
      expect(mockedRegisterDeviceToUser).not.toHaveBeenCalled()
    })
  })

  it('should call both handleAddDevice and handleRegisterDeviceToUser when the user is authenticated', async () => {
    mockedUseHome.mockReturnValue({ homeData: mockedHomeData, isLoading: false } as any)
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    renderWithSafeAreaProvider(<Home />)

    await waitFor(() => {
      expect(mockedRegisterDevice).toHaveBeenCalledTimes(1)
      expect(mockedRegisterDeviceToUser).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to the correct pages when "View All" buttons are pressed', () => {
    mockedUseHome.mockReturnValue({ homeData: mockedHomeData, isLoading: false } as any)

    const { getByTestId } = renderWithSafeAreaProvider(<Home />)

    fireEvent.press(getByTestId('view-all-popularAirlines'))
    expect(router.navigate).toHaveBeenCalledWith('/all-popular-airlines')

    fireEvent.press(getByTestId('view-all-popularAirports'))
    expect(router.navigate).toHaveBeenCalledWith('/all-popular-airports')

    fireEvent.press(getByTestId('view-all-popularDestinations'))
    expect(router.navigate).toHaveBeenCalledWith('/all-popular-destinations')

    fireEvent.press(getByTestId('view-all-totalAirplanes'))
    expect(router.navigate).toHaveBeenCalledWith('/total-airplanes')

    expect(router.navigate).toHaveBeenCalledTimes(4)
  })
})

describe('Home Screen Snapshot', () => {
  it('should render the Home screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Home />)

    expect(toJSON()).toMatchSnapshot()
  })
})
