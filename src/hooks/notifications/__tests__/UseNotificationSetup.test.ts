import { act, renderHook } from '@testing-library/react-native'
import { router } from 'expo-router'

import { useNotificationSetup } from '@/hooks/notifications/useNotificationSetup'
import { Logger } from '@/utils/common/logger'

const {
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} = require('@react-native-firebase/messaging')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

describe('useNotificationSetup', () => {
  it('should set up all notification handlers on mount', async () => {
    await renderHook(() => useNotificationSetup())

    expect(setBackgroundMessageHandler).toHaveBeenCalledTimes(1)
    expect(onMessage).toHaveBeenCalledTimes(1)
    expect(onNotificationOpenedApp).toHaveBeenCalledTimes(1)
  })

  it('should call the cleanup functions on unmount', async () => {
    const mockedUnsubscribeMessage = jest.fn()
    const mockedUnsubscribeNotificationOpened = jest.fn()
    onMessage.mockReturnValue(mockedUnsubscribeMessage)
    onNotificationOpenedApp.mockReturnValue(mockedUnsubscribeNotificationOpened)

    const { unmount } = await renderHook(() => useNotificationSetup())

    await unmount()

    expect(mockedUnsubscribeMessage).toHaveBeenCalledTimes(1)
    expect(mockedUnsubscribeNotificationOpened).toHaveBeenCalledTimes(1)
  })

  it('should handle a foreground message correctly', async () => {
    await renderHook(() => useNotificationSetup())

    const onMessageCallback = onMessage.mock.calls[0][1]
    const mockMessage = { data: { info: 'Foreground Test' } }

    await act(() => {
      onMessageCallback(mockMessage)
    })

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
      'Message handled in the foreground!',
      'info',
      mockMessage,
    )
  })

  it('should navigate to airline details when an airline notification is opened', async () => {
    await renderHook(() => useNotificationSetup())

    const onNotificationOpenedCallback = onNotificationOpenedApp.mock.calls[0][1]
    const mockNotification = {
      data: {
        type: 'airline',
        id: '123',
      },
    }

    await act(() => {
      onNotificationOpenedCallback(mockNotification)
    })

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
      'App opened from background!',
      'info',
      mockNotification,
    )

    expect(router.replace).toHaveBeenCalledWith({
      params: { airlineId: '123' },
      pathname: '/airline-detail',
    })
  })

  it('should navigate to airport details when an airport notification is opened', async () => {
    await renderHook(() => useNotificationSetup())

    const onNotificationOpenedCallback = onNotificationOpenedApp.mock.calls[0][1]
    const mockNotification = {
      data: {
        type: 'airport',
        id: '456',
      },
    }

    await act(() => {
      onNotificationOpenedCallback(mockNotification)
    })

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
      'App opened from background!',
      'info',
      mockNotification,
    )

    expect(router.replace).toHaveBeenCalledWith({
      params: { airportId: '456' },
      pathname: '/airport-detail',
    })
  })

  it('should not navigate if notification data is missing type or id', async () => {
    await renderHook(() => useNotificationSetup())

    const onNotificationOpenedCallback = onNotificationOpenedApp.mock.calls[0][1]
    const mockNotification = {
      data: {
        someOtherData: 'value',
      },
    }

    await act(() => {
      onNotificationOpenedCallback(mockNotification)
    })

    expect(router.replace).not.toHaveBeenCalled()
  })

  it('should log an error if notification setup fails', async () => {
    const setupError = new Error('Firebase init failed')
    setBackgroundMessageHandler.mockImplementation(() => {
      throw setupError
    })

    const { unmount } = await renderHook(() => useNotificationSetup())

    await unmount()

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
      'Failed to setup notifications',
      'error',
      setupError,
    )
  })
})
