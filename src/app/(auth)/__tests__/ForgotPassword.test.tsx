import { fireEvent, render, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import ForgotPassword from '@/app/(auth)/forgot-password'
import { useForgotPassword } from '@/hooks/services/useAuth'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('react-hook-form')

const mockedUseForm = useForm as jest.MockedFunction<typeof useForm>

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity, TextInput } = require('react-native')

  return {
    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    TextInputField: ({ label, editable, ...props }: { label: string; editable: boolean }) => (
      <View>
        <Text>{label}</Text>
        <TextInput {...props} accessibilityLabel={label} editable={editable} />
      </View>
    ),

    ThemedGradientButton: ({
      onPress,
      label,
      disabled,
      loading,
    }: {
      onPress: () => void
      label: string
      disabled: boolean
      loading: boolean
    }) => (
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="submit-button">
        <Text>{loading ? 'Loading...' : label}</Text>
      </TouchableOpacity>
    ),
  }
})

const mockedForgotPassword = jest.fn()

jest.mock('@/hooks/services/useAuth')

const mockedUseForgotPassword = useForgotPassword as jest.MockedFunction<typeof useForgotPassword>

const mockedReset = jest.fn()

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
  mockedUseForgotPassword.mockReturnValue({
    isPending: false,
    mutateAsync: mockedForgotPassword,
  } as any)

  mockedUseForm.mockReturnValue({
    control: {},
    handleSubmit: jest.fn(callback => () => callback({ email: 'test@example.com' })),
    formState: { isValid: true },
    reset: mockedReset,
  } as any)
})

describe('ForgotPassword Screen', () => {
  it('should render correctly and button should be enabled', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<ForgotPassword />)
    const submitButton = getByTestId('submit-button')
    expect(submitButton).toBeTruthy()
    expect(submitButton).not.toBeDisabled()
  })

  it('should disable button when form is invalid after submission attempt', async () => {
    mockedUseForm.mockReturnValue({
      control: {},
      handleSubmit: jest.fn(callback => () => callback({ email: '' })),
      formState: { isValid: false },
      reset: mockedReset,
    } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<ForgotPassword />)
    const submitButton = getByTestId('submit-button')
    expect(submitButton).not.toBeDisabled()
    fireEvent.press(submitButton)
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('should call forgotPassword and reset on submit', async () => {
    const handleSubmitMock = jest.fn(callback => () => callback({ email: 'test@example.com' }))
    mockedUseForm.mockReturnValue({
      control: {},
      handleSubmit: handleSubmitMock,
      formState: { isValid: true },
      reset: mockedReset,
    } as any)
    const { getByTestId } = renderWithSafeAreaProvider(<ForgotPassword />)
    const submitButton = getByTestId('submit-button')
    fireEvent.press(submitButton)
    expect(handleSubmitMock).toHaveBeenCalled()
    expect(mockedForgotPassword).toHaveBeenCalledWith('test@example.com')
    expect(mockedReset).toHaveBeenCalled()
  })

  it('should show loading state and disable button', () => {
    ;(require('@/hooks/services/useAuth').useForgotPassword as jest.Mock).mockReturnValue({
      isPending: true,
      mutateAsync: mockedForgotPassword,
    })

    const { getByTestId, getByText, getByLabelText } = renderWithSafeAreaProvider(
      <ForgotPassword />,
    )
    const submitButton = getByTestId('submit-button')

    expect(submitButton).toBeDisabled()
    expect(getByText('Loading...')).toBeTruthy()

    const emailInput = getByLabelText('email')
    expect(emailInput.props.editable).toBe(false)
  })
})

describe('ForgotPassword Screen Snapshot', () => {
  it('should render the ForgotPassword successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<ForgotPassword />)

    expect(toJSON()).toMatchSnapshot()
  })
})
