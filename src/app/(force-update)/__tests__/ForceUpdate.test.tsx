import { act, fireEvent, render } from '@testing-library/react-native'
import * as Linking from 'expo-linking'
import type { ReactNode } from 'react'
import React from 'react'
import { Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import ForceUpdate from '@/app/(force-update)/force-update'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/components/common', () => {
  const { TouchableOpacity, Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),

    ThemedButton: ({
      disabled,
      loading,
      label,
      onPress,
    }: {
      disabled: boolean
      loading: boolean
      label: string
      onPress: () => void
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="update-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),

    ThemedGradientButton: ({
      disabled,
      loading,
      label,
      onPress,
    }: {
      disabled: boolean
      loading: boolean
      label: string
      onPress: () => void
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="update-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  }
})

const openURLSpy = jest.spyOn(Linking, 'openURL')

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

describe('ForceUpdate Screen', () => {
  it('should render the title, description, and update button', () => {
    const { getByText, getByTestId } = renderWithSafeAreaProvider(<ForceUpdate />)
    expect(getByText('avox')).toBeTruthy()
    expect(getByText('forceUpdateText')).toBeTruthy()
    expect(getByTestId('update-button')).toBeTruthy()
  })

  it('should open the correct App Store URL on iOS when the button is pressed', async () => {
    Platform.OS = 'ios'
    const { getByTestId } = renderWithSafeAreaProvider(<ForceUpdate />)
    const updateButton = getByTestId('update-button')

    await act(async () => {
      fireEvent.press(updateButton)
    })

    expect(openURLSpy).toHaveBeenCalledWith('https://apps.apple.com/ca/app/avox/6747673276')
  })

  it('should open the correct Play Store URL on Android when the button is pressed', async () => {
    Platform.OS = 'android'
    const { getByTestId } = renderWithSafeAreaProvider(<ForceUpdate />)
    const updateButton = getByTestId('update-button')

    await act(async () => {
      fireEvent.press(updateButton)
    })

    expect(openURLSpy).toHaveBeenCalledWith(
      'https://play.google.com/store/apps/details?id=com.avox',
    )
  })
})

describe('ForceUpdate Screen Snapshot', () => {
  it('should render the ForceUpdate Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<ForceUpdate />)

    expect(toJSON()).toMatchSnapshot()
  })
})
