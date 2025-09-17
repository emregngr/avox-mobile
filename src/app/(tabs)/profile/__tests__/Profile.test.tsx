import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type React from 'react'
import type { ReactNode } from 'react'
import { Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Profile from '@/app/(tabs)/profile'
import { useLogout } from '@/hooks/services/useAuth'
import { useGetUser } from '@/hooks/services/useUser'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
const { mockedAuth } = require('@react-native-firebase/auth')

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/assets/icons/settings.svg', () => 'Settings')

jest.mock('@/hooks/services/useAuth')

const mockedUseLogout = useLogout as jest.MockedFunction<typeof useLogout>

jest.mock('@/hooks/services/useUser')

const mockedUseGetUser = useGetUser as jest.MockedFunction<typeof useGetUser>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { TouchableOpacity, Text, View } = require('react-native')

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
          <TouchableOpacity onPress={rightIconOnPress} testID="settings-button">
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>
    ),

    ProfileItem: ({ label, onPress }: { label: string; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress} testID={`item-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedUserWithPassword = {
  uid: 'user123',
  displayName: 'John Doe',
  photoURL: 'http://example.com/photo.png',
  providerData: [{ providerId: 'password' }],
}

const mockedUserWithoutPassword = {
  uid: 'user456',
  displayName: 'Jane Smith',
  photoURL: null,
  providerData: [{ providerId: 'google.com' }],
}

let mockedAlert: jest.SpyInstance

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

  mockedAuth.currentUser = null

  mockedUseLogout.mockReturnValue({ mutateAsync: jest.fn() } as any)

  mockedUseGetUser.mockReturnValue({ data: null } as any)

  mockedAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
})

describe('Profile Screen', () => {
  describe('When user is logged out', () => {
    it('should render the "Sign In or Register" option', () => {
      const { getByTestId, queryByTestId } = renderWithSafeAreaProvider(<Profile />)
      expect(getByTestId('item-signInOrRegister')).toBeTruthy()
      expect(queryByTestId('item-updateProfile')).toBeNull()
      expect(queryByTestId('item-logout')).toBeNull()
    })

    it('should display default name and photo', () => {
      const { getByText } = renderWithSafeAreaProvider(<Profile />)
      expect(getByText('avox')).toBeTruthy()
    })

    it('should navigate to auth screen on press', () => {
      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      fireEvent.press(getByTestId('item-signInOrRegister'))
      expect(router.replace).toHaveBeenCalledWith({
        params: { tab: 'profile' },
        pathname: '/auth',
      })
    })
  })

  describe('When user is logged in', () => {
    it('should render user-specific  items', () => {
      mockedAuth.currentUser = mockedUserWithPassword
      mockedUseGetUser.mockReturnValue({ data: mockedUserWithPassword } as any)

      const { getByTestId, queryByTestId, getByText } = renderWithSafeAreaProvider(<Profile />)

      expect(getByText('John Doe')).toBeTruthy()
      expect(getByTestId('item-updateProfile')).toBeTruthy()
      expect(getByTestId('item-logout')).toBeTruthy()
      expect(queryByTestId('item-signInOrRegister')).toBeNull()
    })

    it('should show "Change Password" for password users', () => {
      mockedAuth.currentUser = mockedUserWithPassword
      mockedUseGetUser.mockReturnValue({ data: mockedUserWithPassword } as any)

      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      expect(getByTestId('item-changePassword')).toBeTruthy()
    })

    it('should show "Add Password" for non-password users', () => {
      mockedAuth.currentUser = mockedUserWithoutPassword
      mockedUseGetUser.mockReturnValue({ data: mockedUserWithoutPassword } as any)

      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      expect(getByTestId('item-addPassword')).toBeTruthy()
    })

    it('should show a confirmation alert on logout press', () => {
      mockedAuth.currentUser = mockedUserWithPassword
      mockedUseGetUser.mockReturnValue({ data: mockedUserWithPassword } as any)

      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      fireEvent.press(getByTestId('item-logout'))

      expect(mockedAlert).toHaveBeenCalledWith(
        'warning',
        'logoutWarning',
        expect.any(Array),
        expect.any(Object),
      )
    })

    it('should call the logout mutation when confirming the alert', () => {
      mockedAuth.currentUser = mockedUserWithPassword
      mockedUseGetUser.mockReturnValue({ data: mockedUserWithPassword } as any)
      mockedAlert.mockImplementation((title, message, buttons) => {
        const yesButton = buttons.find((b: any) => b.style === 'destructive')
        if (yesButton) {
          yesButton.onPress()
        }
      })

      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      fireEvent.press(getByTestId('item-logout'))

      expect(mockedUseLogout).toHaveBeenCalledTimes(1)
    })
  })

  describe('Navigation', () => {
    it('should navigate to settings on header icon press', () => {
      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      fireEvent.press(getByTestId('settings-button'))
      expect(router.navigate).toHaveBeenCalledWith('/settings')
    })

    it('should navigate to choose-theme on item press', () => {
      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      fireEvent.press(getByTestId('item-chooseTheme'))
      expect(router.navigate).toHaveBeenCalledWith('/choose-theme')
    })

    it('should navigate to choose-language on item press', () => {
      const { getByTestId } = renderWithSafeAreaProvider(<Profile />)
      fireEvent.press(getByTestId('item-chooseLanguage'))
      expect(router.navigate).toHaveBeenCalledWith('/choose-language')
    })
  })
})

describe('Profile Screen Snapshot', () => {
  it('should render the Profile screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Profile />)

    expect(toJSON()).toMatchSnapshot()
  })
})
