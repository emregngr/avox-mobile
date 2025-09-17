import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import * as StoreReview from 'expo-store-review'
import type { ReactNode } from 'react'
import React from 'react'
import { Alert, AppState } from 'react-native'
import { checkNotifications, openSettings } from 'react-native-permissions'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Settings from '@/app/(settings)/settings'
import { useDeleteUser } from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { Logger } from '@/utils/common/logger'
import { getStringValue } from '@/utils/common/remoteConfig'

const { mockedAuth } = require('@react-native-firebase/auth')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/hooks/services/useUser')

const mockedUseDeleteUser = useDeleteUser as jest.MockedFunction<typeof useDeleteUser>

jest.mock('@/utils/common/remoteConfig')

const mockedGetStringValue = getStringValue as jest.MockedFunction<typeof getStringValue>

jest.mock('@/assets/icons/close', () => 'Close')

jest.mock('@/assets/icons/instagram.svg', () => 'Instagram')

jest.mock('@/assets/icons/tiktok.svg', () => 'Tiktok')

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity, Switch } = require('react-native')

  return {
    Header: ({
      title,
      rightIconOnPress,
      rightIcon,
    }: {
      title: string
      rightIconOnPress?: () => void
      rightIcon?: ReactNode
    }) => (
      <View testID="header">
        <Text testID="header-title">{title}</Text>
        {rightIconOnPress ? (
          <TouchableOpacity onPress={rightIconOnPress} testID="close-button">
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>
    ),

    ProfileItem: ({
      label,
      onPress,
      leftIcon,
      rightIcon = true,
      danger,
      testID,
      customLeftIcon,
    }: {
      label: string
      onPress?: () => void
      leftIcon?: string
      rightIcon?: boolean
      danger?: boolean
      testID?: string
      customLeftIcon?: ReactNode
    }) => (
      <TouchableOpacity onPress={onPress} style={{ opacity: danger ? 0.8 : 1 }} testID={testID}>
        <View>
          <Text testID="item-label">{label}</Text>
          {leftIcon ? <Text testID="item-left-icon">{leftIcon}</Text> : null}
          {customLeftIcon ? <Text testID="item-custom-left-icon">Custom</Text> : null}
          {rightIcon ? <Text testID="item-right-icon">chevron</Text> : null}
        </View>
      </TouchableOpacity>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),

    Switch,
  }
})

const mockedCheckNotifications = checkNotifications as jest.MockedFunction<
  typeof checkNotifications
>

const mockedRemove = jest.fn()
let mockedAddEventListener: jest.SpyInstance
let mockedAlert: jest.SpyInstance

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

  mockedUseDeleteUser.mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue(true),
  } as any)

  mockedAddEventListener = jest
    .spyOn(AppState, 'addEventListener')
    .mockReturnValue({ remove: mockedRemove })

  mockedAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})

  mockedCheckNotifications.mockResolvedValue({ status: 'granted', settings: {} })

  mockedAuth.currentUser = { uid: 'test-user-id', email: 'test@example.com' }

  mockedGetStringValue.mockImplementation((key: string) => {
    if (key === 'TIKTOK_LINK') return 'https://tiktok.com/test'
    if (key === 'INSTAGRAM_LINK') return 'https://instagram.com/test'
    return ''
  })

  mockedGetLocale.mockImplementation((key: string) => key)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Settings Screen', () => {
  it('renders correctly', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Settings />)
    expect(getByTestId('safe-layout')).toBeTruthy()
  })

  it('navigates back when close button is pressed', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Settings />)
    fireEvent.press(getByTestId('close-button'))
    expect(router.back).toHaveBeenCalled()
  })

  it('calls delete user when confirmed', () => {
    const localMockMutateAsync = jest.fn().mockResolvedValue(true)
    mockedUseDeleteUser.mockReturnValue({ mutateAsync: localMockMutateAsync } as any)
    mockedAlert.mockImplementation((title, message, buttons) => {
      buttons?.find((b: any) => b.style === 'destructive')?.onPress?.()
    })
    const { getByTestId } = renderWithSafeAreaProvider(<Settings />)
    fireEvent.press(getByTestId('delete-account-button'))
    expect(localMockMutateAsync).toHaveBeenCalled()
  })

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderWithSafeAreaProvider(<Settings />)
    unmount()
    expect(mockedRemove).toHaveBeenCalled()
  })

  it('navigates to correct pages on item press', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Settings />)
    fireEvent.press(getByTestId('settings-privacy-policy-button'))
    expect(router.navigate).toHaveBeenCalledWith('/settings-privacy-policy')
    fireEvent.press(getByTestId('settings-terms-of-use-button'))
    expect(router.navigate).toHaveBeenCalledWith('/settings-terms-of-use')
    fireEvent.press(getByTestId('faq-button'))
    expect(router.navigate).toHaveBeenCalledWith('/faq')
  })

  it('opens external social media links', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Settings />)
    fireEvent.press(getByTestId('tiktok-button'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://tiktok.com/test')
    fireEvent.press(getByTestId('instagram-button'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://instagram.com/test')
  })

  it('opens app settings when notification switch is toggled', () => {
    const { getByRole } = renderWithSafeAreaProvider(<Settings />)
    const notificationSwitch = getByRole('switch')
    fireEvent(notificationSwitch, 'onValueChange', true)
    expect(openSettings).toHaveBeenCalled()
  })

  it('shows an alert if store review is not available', async () => {
    jest.spyOn(StoreReview, 'isAvailableAsync').mockResolvedValue(false)
    const { getByTestId } = renderWithSafeAreaProvider(<Settings />)
    fireEvent.press(getByTestId('rate-app-button'))
    await act(async () => {})
    expect(mockedAlert).toHaveBeenCalled()
  })

  it('does not render delete account if user is not logged in', () => {
    mockedAuth.currentUser = null
    const { queryByTestId } = renderWithSafeAreaProvider(<Settings />)
    expect(queryByTestId('delete-account-button')).toBeNull()
  })

  it('refetches notification status when app becomes active', () => {
    renderWithSafeAreaProvider(<Settings />)
    expect(mockedCheckNotifications).toHaveBeenCalledTimes(1)
    const appStateChangeHandler = mockedAddEventListener.mock.calls[0][1]
    act(() => {
      appStateChangeHandler('active')
    })
    expect(mockedCheckNotifications).toHaveBeenCalledTimes(2)
  })

  describe('Error Handling', () => {
    it('logs error if remote config fails', async () => {
      mockedGetStringValue.mockImplementation(() => {
        throw new Error('Remote config failed')
      })
      renderWithSafeAreaProvider(<Settings />)
      await waitFor(() => {
        expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
          'getTikTokLinkError',
          'error',
          expect.any(Error),
        )
        expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
          'getInstagramLinkError',
          'error',
          expect.any(Error),
        )
      })
    })

    it('logs error if notification check fails', async () => {
      mockedCheckNotifications.mockRejectedValue(new Error('Permission check failed'))
      renderWithSafeAreaProvider(<Settings />)
      await waitFor(() => {
        expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
          'checkNotificationPermissionError',
          'error',
          expect.any(Error),
        )
      })
    })

    it('logs error if store review request fails', async () => {
      jest.spyOn(StoreReview, 'isAvailableAsync').mockResolvedValue(true)
      jest.spyOn(StoreReview, 'requestReview').mockRejectedValue(new Error('Review failed'))
      const { getByTestId } = renderWithSafeAreaProvider(<Settings />)
      fireEvent.press(getByTestId('rate-app-button'))
      await waitFor(() => {
        expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
          'requestReviewError',
          'error',
          expect.any(Error),
        )
      })
    })
  })
})

describe('Settings Screen Snapshot', () => {
  it('should render the Settings Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Settings />)

    expect(toJSON()).toMatchSnapshot()
  })
})
