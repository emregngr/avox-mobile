import { requestPermission } from '@react-native-firebase/messaging'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import * as Network from 'expo-network'
import { getTrackingPermissionsAsync, PermissionStatus } from 'expo-tracking-transparency'
import { AppState, PermissionsAndroid, Platform } from 'react-native'
import mobileAds from 'react-native-google-mobile-ads'
import { MMKV } from 'react-native-mmkv'

import { isProduction } from '@/config/env/environment'
import { useAppSetup } from '@/hooks/app/useAppSetup'
import { useUserSession } from '@/hooks/app/useUserSession'
import { setIsAuthenticated } from '@/store/auth'

const { signOut } = require('@react-native-firebase/auth')

jest.mock('@/store/auth')

const mockedSetIsAuthenticated = setIsAuthenticated as jest.MockedFunction<
  typeof setIsAuthenticated
>

jest.mock('@/hooks/app/useUserSession')

const mockedUseUserSession = useUserSession as jest.MockedFunction<typeof useUserSession>

const storage = new MMKV()

const mockedStorageGetString = storage.getString as jest.MockedFunction<typeof storage.getString>
const mockedAddNetworkStateListener = Network.addNetworkStateListener as jest.MockedFunction<
  typeof Network.addNetworkStateListener
>
const mockedGetTrackingPermissionsAsync = getTrackingPermissionsAsync as jest.MockedFunction<
  typeof getTrackingPermissionsAsync
>
const mockedRequestPermission = requestPermission as jest.MockedFunction<typeof requestPermission>

jest.mock('@/config/env/environment')

const mockedIsProduction = isProduction as jest.MockedFunction<typeof isProduction>

const mockedMobileAds = mobileAds as jest.MockedFunction<typeof mobileAds>

const mockedInitialize = jest.fn()

describe('useAppSetup', () => {
  beforeEach(() => {
    mockedMobileAds.mockReturnValue({
      initialize: mockedInitialize,
    } as any)
  })

  it('should initialize isConnected state as null', () => {
    const { result } = renderHook(() => useAppSetup())
    expect(result.current.isConnected).toBeNull()
  })

  describe('Authentication', () => {
    it('should set user as authenticated with a valid token and session', async () => {
      mockedStorageGetString.mockReturnValue('fake-token')
      mockedUseUserSession.mockResolvedValue(true)

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(true)
        expect(signOut).not.toHaveBeenCalled()
      })
    })

    it('should sign out the user and set as unauthenticated with an invalid session', async () => {
      mockedStorageGetString.mockReturnValue('fake-token')
      mockedUseUserSession.mockResolvedValue(false)

      renderHook(() => useAppSetup())

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

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedMobileAds).toHaveBeenCalled()
        expect(mockedInitialize).toHaveBeenCalled()
      })
    })

    it('should not initialize mobile ads in development environment', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = true

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).not.toHaveBeenCalled()
      })
    })

    it('should not initialize mobile ads in non-production environment', async () => {
      mockedIsProduction.mockReturnValue(false)
      __DEV__ = false

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).not.toHaveBeenCalled()
      })
    })

    it('should handle mobile ads initialization failure gracefully', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = false
      mockedInitialize.mockRejectedValue(new Error('Ads initialization failed'))

      renderHook(() => useAppSetup())

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
      const mockedRemove = jest.fn()
      jest.spyOn(AppState, 'addEventListener').mockReturnValueOnce({ remove: mockedRemove })

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedGetTrackingPermissionsAsync).toHaveBeenCalled()
        expect(mockedRequestPermission).toHaveBeenCalled()
      })
    })

    it('should not request tracking permissions on Android, only notification permissions', async () => {
      Platform.OS = 'android'
      jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue('granted')

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedRequestPermission).toHaveBeenCalled()
        expect(PermissionsAndroid.request).toHaveBeenCalled()
        expect(mockedGetTrackingPermissionsAsync).not.toHaveBeenCalled()
      })
    })
  })

  describe('Listeners and Cleanup', () => {
    it.concurrent('should update isConnected state when network status changes', () => {
      const mockedRemove = jest.fn()
      let networkCallback: (state: { isConnected: boolean }) => void
      mockedAddNetworkStateListener.mockImplementation(callback => {
        networkCallback = callback
        return { remove: mockedRemove }
      })

      const { result } = renderHook(() => useAppSetup())

      act(() => {
        networkCallback({ isConnected: true })
      })
      expect(result.current.isConnected).toBe(true)
    })

    it.concurrent('should remove listeners on unmount', () => {
      const mockedRemove = jest.fn()
      mockedAddNetworkStateListener.mockReturnValue({ remove: mockedRemove })

      const { unmount } = renderHook(() => useAppSetup())
      unmount()

      expect(mockedRemove).toHaveBeenCalled()
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

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).toHaveBeenCalled()
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(true)
        expect(mockedRequestPermission).toHaveBeenCalled()
        expect(mockedGetTrackingPermissionsAsync).toHaveBeenCalled()
      })
    })

    it('should handle partial setup failures and continue with other setup steps', async () => {
      mockedIsProduction.mockReturnValue(true)
      __DEV__ = false
      mockedInitialize.mockRejectedValue(new Error('Ads failed'))
      mockedStorageGetString.mockReturnValue('fake-token')
      mockedUseUserSession.mockResolvedValue(true)

      renderHook(() => useAppSetup())

      await waitFor(() => {
        expect(mockedInitialize).toHaveBeenCalled()
        expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(false)
      })
    })
  })
})
