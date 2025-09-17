import { fireEvent, render } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import type React from 'react'
import type { ReactNode } from 'react'
import { Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Auth from '@/app/(auth)/auth'
import { useAppleLogin, useGoogleLogin } from '@/hooks/services/useAuth'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const mockedLoginWithGoogle = jest.fn()
const mockedLoginWithApple = jest.fn()

jest.mock('@/hooks/services/useAuth')

const mockedUseGoogleLogin = useGoogleLogin as jest.MockedFunction<typeof useGoogleLogin>
const mockedUseAppleLogin = useAppleLogin as jest.MockedFunction<typeof useAppleLogin>

jest.mock('@/components/common', () => {
  const originalModule = jest.requireActual('@/components/common')

  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    ...originalModule,

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

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    ThemedButton: ({
      testID,
      onPress,
      label,
      loading,
      disabled,
    }: {
      testID: string
      onPress: () => void
      label: string
      loading: boolean
      disabled: boolean
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID={testID}>
        <Text>{loading ? 'loading...' : label}</Text>
      </TouchableOpacity>
    ),

    ThemedGradientButton: ({
      testID,
      label,
      onPress,
      disabled,
      loading,
    }: {
      testID: string
      label: string
      onPress: () => void
      disabled: boolean
      loading: boolean
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID={testID}>
        <Text>{loading ? 'loading...' : label}</Text>
      </TouchableOpacity>
    ),
  }
})

const mockedUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>

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
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedUseGoogleLogin.mockReturnValue({
    isPending: false,
    mutateAsync: mockedLoginWithGoogle,
  } as any)
  mockedUseAppleLogin.mockReturnValue({
    isPending: false,
    mutateAsync: mockedLoginWithApple,
  } as any)

  mockedUseLocalSearchParams.mockReturnValue({})
})

describe('Auth Screen', () => {
  it('should render correctly', () => {
    const { getByText } = renderWithSafeAreaProvider(<Auth />)
    expect(getByText('avox')).toBeTruthy()
  })

  it('should handle close button press to home', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Auth />)
    fireEvent.press(getByTestId('close-button'))
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should handle close button press to profile', () => {
    mockedUseLocalSearchParams.mockReturnValue({ tab: 'profile' })
    const { getByTestId } = renderWithSafeAreaProvider(<Auth />)
    fireEvent.press(getByTestId('close-button'))
    expect(router.replace).toHaveBeenCalledWith('/profile')
  })

  describe('Button Actions', () => {
    it('should call Google login', () => {
      const { getByTestId } = renderWithSafeAreaProvider(<Auth />)
      fireEvent.press(getByTestId('google-signin-button'))
      expect(mockedLoginWithGoogle).toHaveBeenCalledTimes(1)
    })

    it('should call Apple login on iOS', () => {
      Platform.OS = 'ios'
      const { getByTestId } = renderWithSafeAreaProvider(<Auth />)
      fireEvent.press(getByTestId('apple-signin-button'))
      expect(mockedLoginWithApple).toHaveBeenCalledTimes(1)
    })

    it('should navigate to login screen', () => {
      const { getByTestId } = renderWithSafeAreaProvider(<Auth />)
      fireEvent.press(getByTestId('login-button'))
      expect(router.navigate).toHaveBeenCalledWith('/login')
    })

    it('should navigate to register screen', () => {
      const { getByTestId } = renderWithSafeAreaProvider(<Auth />)
      fireEvent.press(getByTestId('register-button'))
      expect(router.navigate).toHaveBeenCalledWith('/register')
    })
  })

  describe('Pending State', () => {
    it('should disable all buttons when a login is pending', () => {
      mockedUseGoogleLogin.mockReturnValue({
        isPending: true,
        mutateAsync: mockedLoginWithGoogle,
      } as any)

      const { getByTestId } = renderWithSafeAreaProvider(<Auth />)

      const appleButton = getByTestId('apple-signin-button')
      const googleButton = getByTestId('google-signin-button')
      const loginButton = getByTestId('login-button')
      const registerButton = getByTestId('register-button')

      expect(appleButton.props.accessibilityState.disabled).toBe(true)
      expect(googleButton.props.accessibilityState.disabled).toBe(true)
      expect(loginButton.props.accessibilityState.disabled).toBe(true)
      expect(registerButton.props.accessibilityState.disabled).toBe(true)
    })
  })
})

describe('Auth Screen Snapshot', () => {
  it('should render the Auth Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Auth />)

    expect(toJSON()).toMatchSnapshot()
  })
})
