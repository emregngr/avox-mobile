import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import UpdateProfile from '@/app/(account)/update-profile'
import { useGetUser, useUpdateUser } from '@/hooks/services/useUser'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity, TextInput } = require('react-native')
  const { Controller } = require('react-hook-form')

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

    FullScreenLoading: (props: any) => <View {...props} testID="full-screen-loading" />,

    TextInputField: ({
      control,
      name,
      label,
      ...props
    }: {
      control: any
      name: string
      label: string
    }) => (
      <Controller
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }: {
          field: { onChange: (text: string) => void; onBlur: () => void; value: string }
          fieldState: { error?: { message?: string } }
        }) => (
          <View>
            <Text>{label}</Text>
            <TextInput
              onBlur={onBlur} onChangeText={onChange} value={value}
              {...props}
            />
            {error ? <Text>{error.message}</Text> : null}
          </View>
        )}
        control={control}
        name={name}
      />
    ),

    ThemedButton: ({
      label,
      onPress,
      disabled,
      loading,
    }: {
      label: string
      onPress: () => void
      disabled: boolean
      loading: boolean
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="submit-button">
        <Text>{loading ? 'loading...' : label}</Text>
      </TouchableOpacity>
    ),

    ThemedGradientButton: ({
      label,
      onPress,
      disabled,
      loading,
    }: {
      label: string
      onPress: () => void
      disabled: boolean
      loading: boolean
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="submit-button">
        <Text>{loading ? 'loading...' : label}</Text>
      </TouchableOpacity>
    ),
  }
})

jest.mock('@/hooks/services/useUser')

const mockedUseGetUser = useGetUser as jest.MockedFunction<typeof useGetUser>

const mockedUseUpdateUser = useUpdateUser as jest.MockedFunction<typeof useUpdateUser>

const mockedUserProfile = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
}

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

let mockedMutateAsync: jest.Mock

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedMutateAsync = jest.fn().mockResolvedValue({})

  mockedUseGetUser.mockReturnValue({
    data: mockedUserProfile,
    isLoading: false,
  } as any)

  mockedUseUpdateUser.mockReturnValue({
    isPending: false,
    mutateAsync: mockedMutateAsync,
  } as any)
})

describe('UpdateProfile Screen', () => {
  it('should show loading screen while user profile is loading', () => {
    mockedUseGetUser.mockReturnValue({ data: undefined, isLoading: true } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<UpdateProfile />)
    expect(getByTestId('full-screen-loading')).toBeTruthy()
  })

  it('should populate form fields with user data', async () => {
    const { getByTestId } = renderWithSafeAreaProvider(<UpdateProfile />)
    await waitFor(() => {
      expect(getByTestId('firstName').props.value).toBe('John')
      expect(getByTestId('lastName').props.value).toBe('Doe')
      expect(getByTestId('email').props.value).toBe('test@example.com')
    })
  })

  it('should have a disabled submit button when no changes are made', async () => {
    const { getByTestId } = renderWithSafeAreaProvider(<UpdateProfile />)
    await waitFor(() => {
      expect(getByTestId('firstName').props.value).toBe('John')
    })
    const submitButton = getByTestId('submit-button')
    expect(submitButton.props.accessibilityState.disabled).toBe(true)
  })

  it('should enable the submit button after a change is made', async () => {
    const { getByTestId } = renderWithSafeAreaProvider(<UpdateProfile />)
    const firstNameInput = getByTestId('firstName')
    const submitButton = getByTestId('submit-button')
    await waitFor(() => {
      expect(submitButton.props.accessibilityState.disabled).toBe(true)
    })
    fireEvent.changeText(firstNameInput, 'Jane')
    await waitFor(() => {
      expect(submitButton.props.accessibilityState.disabled).toBe(false)
    })
  })

  it('should call updateUser with correct data on successful submission', async () => {
    const { getByTestId } = renderWithSafeAreaProvider(<UpdateProfile />)
    const firstNameInput = getByTestId('firstName')
    const submitButton = getByTestId('submit-button')
    await waitFor(() => {
      expect(getByTestId('firstName').props.value).toBe('John')
    })
    fireEvent.changeText(firstNameInput, 'Jane')
    fireEvent.press(submitButton)
    await waitFor(() => {
      expect(mockedMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
      })
    })
  })

  it('should disable the submit button while updating', () => {
    mockedUseUpdateUser.mockReturnValue({
      isPending: true,
      mutateAsync: mockedMutateAsync,
    } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<UpdateProfile />)
    const submitButton = getByTestId('submit-button')
    expect(submitButton.props.accessibilityState.disabled).toBe(true)
  })

  it('should call router.back when header back button is pressed', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<UpdateProfile />)
    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)
    expect(router.back).toHaveBeenCalledTimes(1)
  })
})

describe('UpdateProfile Screen Snapshot', () => {
  it('should render the UpdateProfile Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<UpdateProfile />)

    expect(toJSON()).toMatchSnapshot()
  })
})
