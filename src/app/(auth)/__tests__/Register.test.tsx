import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Register from '@/app/(auth)/register'
import { useEmailRegister } from '@/hooks/services/useAuth'
import useFormStore from '@/store/form'
import useLocaleStore from '@/store/locale'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('react-hook-form')

const mockedUseForm = useForm as jest.MockedFunction<typeof useForm>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/form')

const mockedUseFormStore = useFormStore as jest.MockedFunction<typeof useFormStore>

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

    CheckboxField: ({ name, onPressLabel }: { name: string; onPressLabel: () => void }) => (
      <TouchableOpacity onPress={onPressLabel} testID={`checkbox-${name}`} />
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
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="register-button">
        <Text>{loading ? 'Loading...' : label}</Text>
      </TouchableOpacity>
    ),

    ThemedButtonText: ({
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
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={onPress}
        testID={`button-${label}`}
      />
    ),

    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const mockedReset = jest.fn()
const mockedlearForm = jest.fn()
const mockedSetFormValues = jest.fn()

const mockedFormValues = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  privacyPolicy: true,
  termsOfUse: true,
}

jest.mock('@/hooks/services/useAuth')

const mockedUseEmailRegister = useEmailRegister as jest.MockedFunction<typeof useEmailRegister>

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

  mockedUseFormStore.mockReturnValue({
    clearForm: mockedlearForm,
    formValues: {},
    setFormValues: mockedSetFormValues,
  })

  mockedUseEmailRegister.mockReturnValue({
    isPending: false,
    mutateAsync: mockedUseEmailRegister,
  } as any)

  mockedUseLocalSearchParams.mockReturnValue({})

  const mockGetValues = jest.fn((field?: keyof typeof mockedFormValues) => {
    if (field) {
      return mockedFormValues[field]
    }
    return mockedFormValues
  })

  mockedUseForm.mockReturnValue({
    control: {},
    handleSubmit: jest.fn(callback => () => callback(mockedFormValues)),
    formState: { errors: {}, isValid: true },
    getValues: mockGetValues,
    reset: mockedReset,
    setValue: jest.fn(),
    trigger: jest.fn(),
  } as any)
})

describe('Register Screen', () => {
  it('should render correctly', () => {
    const { getAllByText, getByLabelText, getByTestId } = renderWithSafeAreaProvider(<Register />)
    expect(getAllByText('register').length).toBeGreaterThan(0)
    expect(getByLabelText('firstName')).toBeTruthy()
    expect(getByLabelText('lastName')).toBeTruthy()
    expect(getByLabelText('email')).toBeTruthy()
    expect(getByLabelText('password')).toBeTruthy()
    expect(getByTestId('checkbox-privacyPolicy')).toBeTruthy()
    expect(getByTestId('checkbox-termsOfUse')).toBeTruthy()
    expect(getByTestId('register-button')).not.toBeDisabled()
  })

  it('should call register mutation on submit', async () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Register />)
    const registerButton = getByTestId('register-button')
    fireEvent.press(registerButton)

    await waitFor(() => {
      expect(mockedUseEmailRegister).toHaveBeenCalledWith(mockedFormValues)
      expect(mockedlearForm).toHaveBeenCalled()
    })
  })

  it('should disable button when form is invalid after submission attempt', async () => {
    const mockGetValues = jest.fn().mockReturnValue(mockedFormValues)
    mockedUseForm.mockReturnValue({
      control: {},
      handleSubmit: jest.fn(callback => () => callback(mockedFormValues)),
      formState: { errors: {}, isValid: false },
      getValues: mockGetValues,
      reset: mockedReset,
      setValue: jest.fn(),
      trigger: jest.fn(),
    } as any)

    const { getByTestId } = renderWithSafeAreaProvider(<Register />)
    const registerButton = getByTestId('register-button')
    expect(registerButton).not.toBeDisabled()
    fireEvent.press(registerButton)
    await waitFor(() => {
      expect(registerButton).toBeDisabled()
    })
  })

  it('should show loading state and disable inputs', () => {
    ;(require('@/hooks/services/useAuth').useEmailRegister as jest.Mock).mockReturnValue({
      isPending: true,
      mutateAsync: mockedUseEmailRegister,
    })
    const { getByTestId, getByText, getByLabelText } = renderWithSafeAreaProvider(<Register />)
    expect(getByTestId('register-button')).toBeDisabled()
    expect(getByText('Loading...')).toBeTruthy()
    expect(getByLabelText('firstName').props.editable).toBe(false)
  })

  it('should navigate to login', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Register />)
    const loginButton = getByTestId('button-login')
    fireEvent.press(loginButton)
    expect(mockedReset).toHaveBeenCalled()
    expect(mockedlearForm).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith({
      params: { isRegisterParam: 'true' },
      pathname: '/login',
    })
  })

  it('should navigate to privacy policy', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Register />)
    const privacyPolicyCheckbox = getByTestId('checkbox-privacyPolicy')
    fireEvent.press(privacyPolicyCheckbox)
    expect(mockedSetFormValues).toHaveBeenCalledWith(mockedFormValues)
    expect(router.navigate).toHaveBeenCalledWith({
      params: {
        privacyPolicyParam: true,
        termsOfUseParam: true,
      },
      pathname: '/privacy-policy',
    })
  })

  it('should navigate to terms of use', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Register />)
    const termsOfUseCheckbox = getByTestId('checkbox-termsOfUse')
    fireEvent.press(termsOfUseCheckbox)
    expect(mockedSetFormValues).toHaveBeenCalledWith(mockedFormValues)
    expect(router.navigate).toHaveBeenCalledWith({
      params: {
        privacyPolicyParam: true,
        termsOfUseParam: true,
      },
      pathname: '/terms-of-use',
    })
  })

  it('should navigate back to auth screen by default', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Register />)
    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)
    expect(mockedReset).toHaveBeenCalled()
    expect(mockedlearForm).toHaveBeenCalled()
    expect(router.replace).toHaveBeenCalledWith('/auth')
  })

  it('should navigate back to login screen if coming from there', () => {
    mockedUseLocalSearchParams.mockReturnValue({
      isLoginParam: 'true',
    })
    const { getByTestId } = renderWithSafeAreaProvider(<Register />)
    const backButton = getByTestId('back-button')
    fireEvent.press(backButton)
    expect(router.navigate).toHaveBeenCalledWith('/login')
  })
})

describe('Register Screen Snapshot', () => {
  it('should render the Register successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Register />)

    expect(toJSON()).toMatchSnapshot()
  })
})
