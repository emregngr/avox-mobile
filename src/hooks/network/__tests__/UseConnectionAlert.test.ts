import { act, renderHook } from '@testing-library/react-native'
import * as Network from 'expo-network'
import type { AlertButton } from 'react-native'
import { Alert } from 'react-native'

import { useConnectionAlert } from '@/hooks/network/useConnectionAlert'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

let mockedGetNetworkStateAsync: jest.MockedFunction<typeof Network.getNetworkStateAsync>

let mockedAlert: jest.SpyInstance

beforeEach(() => {
  jest.useFakeTimers()

  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedGetNetworkStateAsync = Network.getNetworkStateAsync as jest.Mock

  mockedAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useConnectionAlert', () => {
  it('should not show an alert if the connection is active', () => {
    renderHook(() => useConnectionAlert({ isConnected: true }))
    expect(mockedAlert).not.toHaveBeenCalled()
  })

  it('should not show an alert if the connection state is null', () => {
    renderHook(() => useConnectionAlert({ isConnected: null }))
    expect(mockedAlert).not.toHaveBeenCalled()
  })

  it('should show an alert if there is no connection', () => {
    renderHook(() => useConnectionAlert({ isConnected: false }))
    expect(mockedAlert).toHaveBeenCalledTimes(1)
    expect(mockedAlert).toHaveBeenCalledWith(
      'connectionError',
      'connectionErrorDescription',
      expect.any(Array),
      expect.objectContaining({ userInterfaceStyle: 'light' }),
    )
  })

  it('should not show a new alert if one is already visible', () => {
    const { rerender } = renderHook(
      ({ isConnected }: { isConnected: boolean }) => useConnectionAlert({ isConnected }),
      {
        initialProps: { isConnected: false },
      },
    )

    expect(mockedAlert).toHaveBeenCalledTimes(1)

    rerender({ isConnected: false })

    expect(mockedAlert).toHaveBeenCalledTimes(1)
  })

  describe('Alert Button Interactions', () => {
    it('should handle the "Cancel" button press', () => {
      renderHook(() => useConnectionAlert({ isConnected: false }))

      const alertButtons = mockedAlert.mock.calls[0][2]
      const cancelButton = alertButtons?.find((button: AlertButton) => button.text === 'cancel')

      act(() => {
        cancelButton?.onPress?.()
      })

      expect(cancelButton?.onPress).toBeDefined()
    })

    it('should show the alert again on "Retry" if the connection is still down', async () => {
      mockedGetNetworkStateAsync.mockResolvedValue({
        isConnected: false,
        isInternetReachable: false,
      })

      renderHook(() => useConnectionAlert({ isConnected: false }))
      expect(mockedAlert).toHaveBeenCalledTimes(1)

      const alertButtons = mockedAlert.mock.calls[0][2]
      const retryButton = alertButtons?.find((button: AlertButton) => button.text === 'retry')

      await act(async () => {
        await retryButton?.onPress?.()
      })

      act(() => {
        jest.runAllTimers()
      })

      expect(mockedAlert).toHaveBeenCalledTimes(2)
    })

    it('should close the alert and trigger onConnectionChange on "Retry" if connection is restored', async () => {
      const mockedOnConnectionChange = jest.fn()
      mockedGetNetworkStateAsync.mockResolvedValue({
        isConnected: true,
        isInternetReachable: true,
      })

      renderHook(() =>
        useConnectionAlert({ isConnected: false, onConnectionChange: mockedOnConnectionChange }),
      )
      expect(mockedAlert).toHaveBeenCalledTimes(1)

      const alertButtons = mockedAlert.mock.calls[0][2]
      const retryButton = alertButtons?.find((button: AlertButton) => button.text === 'retry')

      await act(async () => {
        await retryButton?.onPress?.()
      })

      expect(mockedAlert).toHaveBeenCalledTimes(1)
      expect(mockedOnConnectionChange).toHaveBeenCalledWith(true)
    })
  })

  describe('checkConnection Function', () => {
    it('should return true when connected', async () => {
      mockedGetNetworkStateAsync.mockResolvedValue({
        isConnected: true,
        isInternetReachable: true,
      })
      const { result } = renderHook(() => useConnectionAlert({ isConnected: true }))

      let connectionStatus
      await act(async () => {
        connectionStatus = await result.current.checkConnection()
      })

      expect(connectionStatus).toBe(true)
    })

    it('should return false when not connected', async () => {
      mockedGetNetworkStateAsync.mockResolvedValue({
        isConnected: false,
        isInternetReachable: false,
      })
      const { result } = renderHook(() => useConnectionAlert({ isConnected: true }))

      let connectionStatus
      await act(async () => {
        connectionStatus = await result.current.checkConnection()
      })

      expect(connectionStatus).toBe(false)
    })
  })
})
