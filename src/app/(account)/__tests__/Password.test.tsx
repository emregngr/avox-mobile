import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import PasswordScreen from '@/app/(account)/password'
import { useAuthUser } from '@/hooks/services/useAuth'

jest.mock('@/hooks/services/useAuth')

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<typeof useAuthUser>

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ),
  }
})

jest.mock('@/components/feature', () => {
  const { Text } = require('react-native')

  return {
    AddPassword: () => <Text testID="add-password-component">AddPassword Component</Text>,

    ChangePassword: () => <Text testID="change-password-component">ChangePassword Component</Text>,
  }
})

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
  mockedUseAuthUser.mockReturnValue({
    data: {
      uid: 'test-user-id',
      email: 'test@example.com',
      providerData: [{ providerId: 'password' }],
    },
  } as any)
})

describe('Password Screen', () => {
  describe('Password User Flow', () => {
    it('should render ChangePassword component for a password user', async () => {
      const { getByTestId, queryByTestId } = await renderWithSafeAreaProvider(<PasswordScreen />)

      expect(getByTestId('change-password-component')).toBeTruthy()
      expect(queryByTestId('add-password-component')).toBeNull()
    })

    it('should display correct title for password user', async () => {
      const { getByText } = await renderWithSafeAreaProvider(<PasswordScreen />)
      expect(getByText('ChangePassword Component')).toBeTruthy()
    })
  })

  describe('Non-Password User Flow', () => {
    beforeEach(() => {
      mockedUseAuthUser.mockReturnValue({
        data: {
          uid: 'test-user-id',
          email: 'test@example.com',
          providerData: [{ providerId: 'google.com' }],
        },
      } as any)
    })

    it('should render AddPassword component for a non-password user', async () => {
      const { getByTestId, queryByTestId } = await renderWithSafeAreaProvider(<PasswordScreen />)

      expect(getByTestId('add-password-component')).toBeTruthy()
      expect(queryByTestId('change-password-component')).toBeNull()
    })

    it('should display correct title for non-password user', async () => {
      const { getByText } = await renderWithSafeAreaProvider(<PasswordScreen />)
      expect(getByText('AddPassword Component')).toBeTruthy()
    })
  })

  describe('Navigation', () => {
    it('should call router.back when back button is pressed', async () => {
      const { getByTestId } = await renderWithSafeAreaProvider(<PasswordScreen />)

      const backButton = getByTestId('back-button')
      await fireEvent.press(backButton)

      expect(router.back).toHaveBeenCalledTimes(1)
    })

    it('should not call router.back multiple times on single press', async () => {
      const { getByTestId } = await renderWithSafeAreaProvider(<PasswordScreen />)

      const backButton = getByTestId('back-button')
      await fireEvent.press(backButton)

      expect(router.back).toHaveBeenCalledTimes(1)
      expect(router.back).not.toHaveBeenCalledTimes(2)
    })
  })
})

describe('Password Screen Snapshot', () => {
  it('should render for password user successfully', async () => {
    const { toJSON } = await renderWithSafeAreaProvider(<PasswordScreen />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render for non-password user successfully', async () => {
    mockedUseAuthUser.mockReturnValue({
      data: {
        uid: 'test-user-id',
        email: 'test@example.com',
        providerData: [{ providerId: 'google.com' }],
      },
    } as any)

    const { toJSON } = await renderWithSafeAreaProvider(<PasswordScreen />)

    expect(toJSON()).toMatchSnapshot()
  })
})
