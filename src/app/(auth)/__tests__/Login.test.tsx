import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { router, useLocalSearchParams } from 'expo-router'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Login from '@/app/(auth)/login'
import { useEmailLogin } from '@/hooks/services/useAuth'
import useLocaleStore from '@/store/locale'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('react-hook-form')

const mockedUseForm = useForm as jest.MockedFunction<typeof useForm>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

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
      <TouchableOpacity disabled={disabled || loading} onPress={onPress} testID="login-button">
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

jest.mock('@/hooks/services/useAuth')

const mockedUseEmailLogin = useEmailLogin as jest.MockedFunction<typeof useEmailLogin>

const mockedUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>

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
  mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

  mockedUseEmailLogin.mockReturnValue({
    isPending: false,
    mutateAsync: mockedUseEmailLogin,
  } as any)

  mockedUseLocalSearchParams.mockReturnValue({
    isRegisterParam: 'false',
  })

  mockedUseForm.mockReturnValue({
    control: {},
    handleSubmit: jest.fn(
      callback => () => callback({ email: 'test@example.com', password: 'password123' }),
    ),
    formState: { isValid: true },
    reset: mockedReset,
  } as any)
})

describe('Login Screen', () => {
  it('should render correctly', async () => {
    const { getAllByText, getByLabelText, getByTestId } = await renderWithSafeAreaProvider(
      <Login />,
    )
    expect(getAllByText('login').length).toBeGreaterThan(0)
    expect(getByLabelText('email')).toBeTruthy()
    expect(getByLabelText('password')).toBeTruthy()
    expect(getByTestId('login-button')).not.toBeDisabled()
  })

  it('should call login mutation on submit', async () => {
    const handleSubmitMock = jest.fn(
      callback => () => callback({ email: 'test@example.com', password: 'password123' }),
    )
    mockedUseForm.mockReturnValue({
      control: {},
      handleSubmit: handleSubmitMock,
      formState: { isValid: true },
      reset: mockedReset,
    } as any)

    const { getByTestId } = await renderWithSafeAreaProvider(<Login />)
    const loginButton = getByTestId('login-button')
    await fireEvent.press(loginButton)

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalled()
      expect(mockedUseEmailLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should disable button when form is invalid after submission attempt', async () => {
    mockedUseForm.mockReturnValue({
      control: {},
      handleSubmit: jest.fn(callback => () => callback({})),
      formState: { isValid: false },
      reset: mockedReset,
    } as any)

    const { getByTestId } = await renderWithSafeAreaProvider(<Login />)
    const loginButton = getByTestId('login-button')
    expect(loginButton).not.toBeDisabled()

    await fireEvent.press(loginButton)

    await waitFor(() => {
      expect(loginButton).toBeDisabled()
    })
  })

  it('should show loading state and disable inputs', async () => {
    ;(require('@/hooks/services/useAuth').useEmailLogin as jest.Mock).mockReturnValue({
      isPending: true,
      mutateAsync: mockedUseEmailLogin,
    })
    const { getByTestId, getByText, getByLabelText } = await renderWithSafeAreaProvider(<Login />)

    expect(getByTestId('login-button')).toBeDisabled()
    expect(getByText('Loading...')).toBeTruthy()
    expect(getByLabelText('email').props.editable).toBe(false)
    expect(getByLabelText('password').props.editable).toBe(false)
  })

  it('should navigate to forgot-password', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<Login />)
    const forgotPasswordButton = getByTestId('button-forgotPassword')
    await fireEvent.press(forgotPasswordButton)
    expect(mockedReset).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith('/forgot-password')
  })

  it('should navigate to register', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<Login />)
    const createAccountButton = getByTestId('button-createAccount')
    await fireEvent.press(createAccountButton)
    expect(mockedReset).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith({
      params: { isLoginParam: 'true' },
      pathname: '/register',
    })
  })

  it('should navigate back to auth screen by default', async () => {
    const { getByTestId } = await renderWithSafeAreaProvider(<Login />)
    const backButton = getByTestId('back-button')
    await fireEvent.press(backButton)
    expect(mockedReset).toHaveBeenCalled()
    expect(router.replace).toHaveBeenCalledWith('/auth')
  })

  it('should navigate back to register screen if coming from there', async () => {
    ;(require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({
      isRegisterParam: 'true',
    })
    const { getByTestId } = await renderWithSafeAreaProvider(<Login />)
    const backButton = getByTestId('back-button')
    await fireEvent.press(backButton)
    expect(mockedReset).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith('/register')
  })
})

describe('Login Screen Snapshot', () => {
  it('should render the Login successfully', async () => {
    const { toJSON } = await renderWithSafeAreaProvider(<Login />)

    expect(toJSON()).toMatchSnapshot()
  })
})
