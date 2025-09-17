import { render, waitFor } from '@testing-library/react-native'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { MMKV } from 'react-native-mmkv'
import { Notifications } from 'react-native-notifications'

import RootLayout from '@/app/_layout'
import { useAppSetup } from '@/hooks/app/useAppSetup'
import useThemeStore from '@/store/theme'
import { maintenanceControl } from '@/utils/common/maintenanceControl'
import { versionControl } from '@/utils/common/versionControl'

jest.mock('@rozenite/mmkv-plugin', () => ({
  useMMKVDevTools: jest.fn(),
}))
jest.mock('@rozenite/network-activity-plugin', () => ({
  useNetworkActivityDevTools: jest.fn(),
}))
jest.mock('@rozenite/performance-monitor-plugin', () => ({
  usePerformanceMonitorDevTools: jest.fn(),
}))
jest.mock('@rozenite/tanstack-query-plugin', () => ({
  useTanStackQueryDevTools: jest.fn(),
}))

jest.mock('@/hooks/app/useAppSetup')

jest.mock('@/utils/common/maintenanceControl')

jest.mock('@/utils/common/versionControl')

jest.mock('@/components/feature', () => {
  const { View } = require('react-native')

  return {
    AppNavigator: ({ isAppReady }: { isAppReady: boolean }) =>
      isAppReady ? <View testID="app-navigator" /> : null,
  }
})

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedUseAppSetup = useAppSetup as jest.MockedFunction<typeof useAppSetup>
const mockedUseFonts = useFonts as jest.MockedFunction<typeof useFonts>
const mockedMaintenanceControl = maintenanceControl as jest.MockedFunction<
  typeof maintenanceControl
>
const mockedVersionControl = versionControl as jest.MockedFunction<typeof versionControl>

const storage = new MMKV()

const mockedStorageGetString = storage.getString as jest.MockedFunction<typeof storage.getString>

const mockedGetInitialURL = Linking.getInitialURL as jest.MockedFunction<
  typeof Linking.getInitialURL
>
const mockedLinkingParse = Linking.parse as jest.MockedFunction<typeof Linking.parse>
const mockedGetInitialNotification = Notifications.getInitialNotification as jest.MockedFunction<
  typeof Notifications.getInitialNotification
>
const mockedHideAsync = SplashScreen.hideAsync as jest.MockedFunction<typeof SplashScreen.hideAsync>

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedUseAppSetup.mockReturnValue({
    isConnected: true,
    setIsConnected: jest.fn(),
  })

  mockedUseFonts.mockReturnValue([true] as any)

  mockedMaintenanceControl.mockResolvedValue(false)
  mockedVersionControl.mockResolvedValue(false)

  mockedStorageGetString.mockReturnValue('true')

  mockedGetInitialURL.mockResolvedValue(null)
  mockedGetInitialNotification.mockResolvedValue(null as any)
})

describe('RootLayout', () => {
  it('should render AppNavigator and hide splash screen on successful startup', async () => {
    const { getByTestId } = render(<RootLayout />)

    await waitFor(() => {
      expect(getByTestId('app-navigator')).toBeTruthy()
      expect(mockedHideAsync).toHaveBeenCalled()
      expect(router.replace).toHaveBeenCalledWith('/home')
    })
  })

  it('should route to /maintenance if maintenance mode is active', async () => {
    mockedMaintenanceControl.mockResolvedValue(true)
    render(<RootLayout />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/maintenance')
    })
  })

  it('should route to /force-update if version is invalid', async () => {
    mockedVersionControl.mockResolvedValue(true)
    render(<RootLayout />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/force-update')
    })
  })

  it('should route to /onboarding if onboarding has not been seen', async () => {
    mockedStorageGetString.mockReturnValue(null as any)
    render(<RootLayout />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('should handle deep link to airline-detail', async () => {
    mockedGetInitialURL.mockResolvedValue('yourapp://airline?id=1')

    mockedLinkingParse.mockReturnValue({
      hostname: 'airline',
      queryParams: { id: '1' },
    } as any)

    render(<RootLayout />)

    await waitFor(() => {
      expect(mockedLinkingParse).toHaveBeenCalledWith('yourapp://airline?id=1')
      expect(router.replace).toHaveBeenCalledWith({
        params: { airlineId: '1' },
        pathname: '/airline-detail',
      })
    })
  })

  it('should handle deep link to airport-detail', async () => {
    mockedGetInitialURL.mockResolvedValue('yourapp://airport?id=2')

    mockedLinkingParse.mockReturnValue({
      hostname: 'airport',
      queryParams: { id: '2' },
    } as any)

    render(<RootLayout />)

    await waitFor(() => {
      expect(mockedLinkingParse).toHaveBeenCalledWith('yourapp://airport?id=2')
      expect(router.replace).toHaveBeenCalledWith({
        params: { airportId: '2' },
        pathname: '/airport-detail',
      })
    })
  })

  it('should handle deep link parsing error gracefully and go home in dev mode', async () => {
    mockedGetInitialURL.mockResolvedValue('exp://invalid-url-expo-development-client')
    mockedLinkingParse.mockImplementation(() => {
      throw new Error('Invalid URL')
    })

    render(<RootLayout />)

    await waitFor(() => {
      expect(mockedLinkingParse).toHaveBeenCalledWith('exp://invalid-url-expo-development-client')
      expect(router.replace).toHaveBeenCalledWith('/home')
    })
  })

  it('should handle initial notification for an airline', async () => {
    mockedGetInitialNotification.mockResolvedValue({
      payload: { type: 'airline', id: '1' },
    } as any)
    render(<RootLayout />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith({
        params: { airlineId: '1' },
        pathname: '/airline-detail',
      })
    })
  })

  it('should handle initial notification for an airport', async () => {
    mockedGetInitialNotification.mockResolvedValue({
      payload: { type: 'airport', id: '1' },
    } as any)
    render(<RootLayout />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith({
        params: { airportId: '1' },
        pathname: '/airport-detail',
      })
    })
  })

  it('should handle expo development client URL correctly', async () => {
    mockedGetInitialURL.mockResolvedValue('exp://192.168.1.1:8081?expo-development-client')

    render(<RootLayout />)

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/home')
    })
  })
})

describe('RootLayout Snapshot', () => {
  it('should render the RootLayout successfully', () => {
    const { toJSON } = render(<RootLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})
