import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import PasswordScreen from '@/app/(account)/password'

const { mockedAuth } = require('@react-native-firebase/auth')

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
    AddPassword: () => <Text>AddPassword Component</Text>,

    ChangePassword: () => <Text>ChangePassword Component</Text>,
  }
})

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

describe('Password Screen', () => {
  it('should render ChangePassword component for a password user', () => {
    mockedAuth.currentUser = {
      providerData: [{ providerId: 'password' }],
    }

    const { getByText, queryByText } = renderWithSafeAreaProvider(<PasswordScreen />)

    expect(getByText('changePassword')).toBeTruthy()
    expect(getByText('ChangePassword Component')).toBeTruthy()
    expect(queryByText('AddPassword Component')).toBeNull()
  })

  it('should render AddPassword component for a non-password user', () => {
    mockedAuth.currentUser = {
      providerData: [{ providerId: 'google.com' }],
    }

    const { getByText, queryByText } = renderWithSafeAreaProvider(<PasswordScreen />)

    expect(getByText('addPassword')).toBeTruthy()
    expect(getByText('AddPassword Component')).toBeTruthy()
    expect(queryByText('ChangePassword Component')).toBeNull()
  })

  it('should call router.back when the header back button is pressed', () => {
    mockedAuth.currentUser = {
      providerData: [{ providerId: 'password' }],
    }

    const { getByTestId } = renderWithSafeAreaProvider(<PasswordScreen />)

    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)

    expect(router.back).toHaveBeenCalledTimes(1)
  })
})

describe('Password Screen Snapshot', () => {
  it('should render the Password Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<PasswordScreen />)

    expect(toJSON()).toMatchSnapshot()
  })
})
