import { signOut } from '@react-native-firebase/auth'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import * as Network from 'expo-network'
import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency'
import { AppState, PermissionsAndroid, Platform } from 'react-native'
import mobileAds from 'react-native-google-mobile-ads'
import { createMMKV } from 'react-native-mmkv'
import { requestNotifications } from 'react-native-permissions'

import { isProduction } from '@/config/env/environment'
import { useAppSetup } from '@/hooks/app/useAppSetup'
import { useUserSession } from '@/hooks/app/useUserSession'
import { setIsAuthenticated } from '@/store/auth'

jest.mock('@/store/auth')

const mockedSetIsAuthenticated = setIsAuthenticated as jest.MockedFunction<
  typeof setIsAuthenticated
>

jest.mock('@/hooks/app/useUserSession')

const mockedUseUserSession = useUserSession as jest.MockedFunction<typeof useUserSession>

const storage = createMMKV()

const mockedStorageGetString = storage.getString as jest.MockedFunction<typeof storage.getString>
const mockedAddNetworkStateListener = Network.addNetworkStateListener as jest.MockedFunction<
  typeof Network.addNetworkStateListener
>
const mockedGetTrackingPermissionsAsync = getTrackingPermissionsAsync as jest.MockedFunction<
  typeof getTrackingPermissionsAsync
>
const mockedRequestTrackingPermissionsAsync =
  requestTrackingPermissionsAsync as jest.MockedFunction<typeof requestTrackingPermissionsAsync>
const mockedRequestNotifications = requestNotifications as jest.MockedFunction<
  typeof requestNotifications
>

jest.mock('@/config/env/environment')

const mockedIsProduction = isProduction as jest.MockedFunction<typeof isProduction>

const mockedMobileAds = mobileAds as jest.MockedFunction<typeof mobileAds>

const mockedInitialize = jest.fn()

describe('useAppSetup', () => {
  beforeEach(() => {
    mockedMobileAds.mockReturnValue({
      initialize: mockedInitialize,
    } as any)
    mockedAddNetworkStateListener.mockReturnValue({ remove: jest.fn() } as any)
    mockedGetTrackingPermissionsAsync.mockResolvedValue({
      status: PermissionStatus.GRANTED,
    } as any)
    mockedRequestTrackingPermissionsAsync.mockResolvedValue({
      status: PermissionStatus.GRANTED,
    } as any)
    mockedRequestNotifications.mockResolvedValue({} as any)
    jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue('granted' as any)
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any)
  })

  it('should initialize isConnected state as null', async () => {
    const { result } = await renderHook(() => useAppSetup())
    expect(result.current.isConnected).toBeNull()
  })

  describe('Authentication', () => {
    it('should set user as authenticated with a valid token and session', async () => {
      mockedStorageGetString.mockReturnValue('fake-token')
      mockedUseUserSession.mockResolvedValue(true)

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(true)
        expect(signOut).not.toHaveBeenCalled()
      })
    })

    it('should sign out the user and set as unauthenticated with an invalid session', async () => {
      mockedStorageGetString.mockReturnValue('fake-token')
      mockedUseUserSession.mockResolvedValue(false)

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(false)
        expect(signOut).toHaveBeenCalled()
      })
    })
  })

  describe('Mobile Ads', () => {
    beforeEach(() => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = false
    })

    afterEach(() => {
      __DEV__ = true
    })

    it('should initialize mobile ads in production and non-dev environment', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = false

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedMobileAds).toHaveBeenCalled()
        expect(mockedInitialize).toHaveBeenCalled()
      })
    })

    it('should not initialize mobile ads in development environment', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = true

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).not.toHaveBeenCalled()
      })
    })

    it('should not initialize mobile ads in non-production environment', async () => {
      mockedIsProduction.mockReturnValue(false)
      __DEV__ = false

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).not.toHaveBeenCalled()
      })
    })

    it('should handle mobile ads initialization failure gracefully', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = false
      mockedInitialize.mockRejectedValue(new Error('Ads initialization failed'))

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).toHaveBeenCalled()
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Permissions', () => {
    it('should set up a listener to request tracking permissions on iOS if undetermined', async () => {
      Platform.OS = 'ios'
      mockedGetTrackingPermissionsAsync.mockResolvedValue({
        status: PermissionStatus.UNDETERMINED,
      } as any)

      const addEventListenerSpy = jest.spyOn(AppState, 'addEventListener')

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedGetTrackingPermissionsAsync).toHaveBeenCalled()
        expect(addEventListenerSpy).toHaveBeenCalledTimes(2)
      })

      const trackingCallback = addEventListenerSpy.mock.calls?.[1]?.[1] as (
        state: string,
      ) => void | Promise<void>

      await act(async () => {
        await trackingCallback('active')
      })

      await waitFor(() => {
        expect(mockedRequestTrackingPermissionsAsync).toHaveBeenCalled()
      })
    })

    it('should not request tracking permissions on Android, only notification permissions', async () => {
      Platform.OS = 'android'

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedRequestNotifications).toHaveBeenCalledWith(['alert', 'badge', 'sound'])
        expect(PermissionsAndroid.request).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        )
        expect(mockedGetTrackingPermissionsAsync).not.toHaveBeenCalled()
      })
    })
  })

  describe('Listeners and Cleanup', () => {
    it('should update isConnected state when network status changes', async () => {
      const mockedRemove = jest.fn()
      let networkCallback: (state: { isConnected: boolean }) => void
      mockedAddNetworkStateListener.mockImplementation(callback => {
        networkCallback = callback
        return { remove: mockedRemove } as any
      })

      const { result } = await renderHook(() => useAppSetup())

      await act(async () => {
        networkCallback({ isConnected: true })
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })
    })

    it('should remove listeners on unmount', async () => {
      const mockedRemove = jest.fn()
      mockedAddNetworkStateListener.mockReturnValue({ remove: mockedRemove } as any)

      const { unmount } = await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedAddNetworkStateListener).toHaveBeenCalled()
      })

      unmount()

      await waitFor(() => {
        expect(mockedRemove).toHaveBeenCalled()
      })
    })
  })

  describe('App Setup Integration', () => {
    it('should complete all setup steps successfully in production', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = false
      mockedStorageGetString.mockReturnValue('fake-token')
      mockedUseUserSession.mockResolvedValue(true)
      Platform.OS = 'ios'
      mockedGetTrackingPermissionsAsync.mockResolvedValue({
        status: PermissionStatus.GRANTED,
      } as any)

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).toHaveBeenCalled()
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(true)
        expect(mockedGetTrackingPermissionsAsync).toHaveBeenCalled()
        expect(mockedRequestNotifications).toHaveBeenCalled()
      })
    })

    it('should handle partial setup failures and continue with other setup steps', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = false
      mockedInitialize.mockRejectedValue(new Error('Ads failed'))
      mockedStorageGetString.mockReturnValue('fake-token')
      mockedUseUserSession.mockResolvedValue(true)

      await renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).toHaveBeenCalled()
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(false)
      })
    })
  })
})
