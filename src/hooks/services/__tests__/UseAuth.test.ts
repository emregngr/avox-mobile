import { act, renderHook } from '@testing-library/react-native'
import { router } from 'expo-router'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'

import {
  useAppleLogin,
  useEmailLogin,
  useEmailRegister,
  useForgotPassword,
  useGoogleLogin,
  useLogout,
  useUser,
} from '@/hooks/services/useAuth'
import { getLocale } from '@/locales/i18next'
import {
  handleLogout,
  sendPasswordResetLink,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '@/services/authService'
import { login, logout, register, social } from '@/store/auth'
import useThemeStore from '@/store/theme'
import { Logger } from '@/utils/common/logger'

const {
  useQuery,
  useMutation,
  mockedInvalidateQueries,
  mockedSetQueryData,
  mockedRemoveQueries,
} = require('@tanstack/react-query')
const { getIdToken, onAuthStateChanged } = require('@react-native-firebase/auth')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/services/authService')

const mockedSignInWithEmail = signInWithEmail as jest.MockedFunction<typeof signInWithEmail>
const mockedSignUpWithEmail = signUpWithEmail as jest.MockedFunction<typeof signUpWithEmail>
const mockedSignInWithGoogle = signInWithGoogle as jest.MockedFunction<typeof signInWithGoogle>
const mockedSignInWithApple = signInWithApple as jest.MockedFunction<typeof signInWithApple>
const mockedHandleLogout = handleLogout as jest.MockedFunction<typeof handleLogout>
const mockedSendPasswordResetLink = sendPasswordResetLink as jest.MockedFunction<
  typeof sendPasswordResetLink
>

jest.mock('@/store/auth')

const mockedLogin = login as jest.MockedFunction<typeof login>
const mockedRegister = register as jest.MockedFunction<typeof register>
const mockedSocial = social as jest.MockedFunction<typeof social>
const mockedLogout = logout as jest.MockedFunction<typeof logout>

let mockedAlert: jest.SpyInstance

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedGetLocale.mockImplementation((key: string) => key)

  useMutation.mockReturnValue({
    mutateAsync: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
  })

  mockedAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
})

describe('auth hooks', () => {
  describe('useUser', () => {
    it('should resolve user from onAuthStateChanged', async () => {
      const mockUser = { uid: '123', email: 'test@test.com' }

      onAuthStateChanged.mockImplementation((auth: any, callback: any) => {
        callback(mockUser)
        return jest.fn()
      })

      useQuery.mockReturnValue({ data: mockUser })

      const { result } = renderHook(() => useUser())

      expect(result.current.data).toEqual(mockUser)
    })

    it('should handle null user state', async () => {
      onAuthStateChanged.mockImplementation((auth: any, callback: any) => {
        callback(null)
        return jest.fn()
      })

      useQuery.mockReturnValue({ data: null })

      const { result } = renderHook(() => useUser())

      expect(result.current.data).toBeNull()
    })
  })

  describe('useEmailRegister', () => {
    const mockUserCredential = {
      user: { uid: '123', email: 'test@test.com' },
    }

    const mockRegisterData = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    }

    it('should successfully register', async () => {
      const mockToken = 'mocked-token'

      mockedSignUpWithEmail.mockResolvedValue(mockUserCredential as any)
      getIdToken.mockResolvedValue(mockToken)
      mockedRegister.mockResolvedValue(undefined)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async data => {
          const result = await options.mutationFn(data)
          await options.onSuccess(result, data)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useEmailRegister())

      await act(async () => {
        await result.current.mutateAsync(mockRegisterData)
      })

      expect(mockedSignUpWithEmail).toHaveBeenCalledWith(mockRegisterData)
      expect(getIdToken).toHaveBeenCalledWith(mockUserCredential.user, true)
      expect(mockedRegister).toHaveBeenCalledWith({
        ...mockRegisterData,
        token: mockToken,
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] })
    })

    it('should show an alert on register failure', async () => {
      const error = new Error('Register failed')

      useMutation.mockImplementation(() => ({
        mutateAsync: jest.fn().mockRejectedValue(error),
        isLoading: false,
        isError: true,
        error,
      }))

      renderHook(() => useEmailRegister())
      const mutationOptions = useMutation.mock.calls[0][0]

      act(() => {
        mutationOptions.onError(error, mockRegisterData)
      })

      expect(mockedAlert).toHaveBeenCalledWith('error', 'emailRegisterFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })

    it('should handle handleAuthSuccess error', async () => {
      const mockToken = 'mocked-token'
      const authError = new Error('Auth error')

      mockedSignUpWithEmail.mockResolvedValue(mockUserCredential as any)
      getIdToken.mockResolvedValue(mockToken)
      mockedRegister.mockRejectedValue(authError)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async data => {
          const result = await options.mutationFn(data)
          await options.onSuccess(result, data)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useEmailRegister())

      await act(async () => {
        await result.current.mutateAsync(mockRegisterData)
      })

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to handle auth success',
        'error',
        authError,
      )
    })
  })

  describe('useEmailLogin', () => {
    const mockUserCredential = {
      user: { uid: '123', email: 'test@test.com' },
    }

    const mockLoginData = {
      email: 'test@test.com',
      password: 'password123',
    }

    it('should successfully log in', async () => {
      const mockToken = 'mocked-token'

      mockedSignInWithEmail.mockResolvedValue(mockUserCredential as any)
      getIdToken.mockResolvedValue(mockToken)
      mockedLogin.mockResolvedValue(undefined)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async data => {
          const result = await options.mutationFn(data)
          await options.onSuccess(result, data)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useEmailLogin())

      await act(async () => {
        await result.current.mutateAsync(mockLoginData)
      })

      expect(mockedSignInWithEmail).toHaveBeenCalledWith(mockLoginData)
      expect(getIdToken).toHaveBeenCalledWith(mockUserCredential.user, true)
      expect(mockedLogin).toHaveBeenCalledWith({
        ...mockLoginData,
        token: mockToken,
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] })
    })

    it('should show an alert on login failure', async () => {
      const error = new Error('Invalid credentials')

      useMutation.mockImplementation(() => ({
        mutateAsync: jest.fn().mockRejectedValue(error),
        isLoading: false,
        isError: true,
        error,
      }))

      renderHook(() => useEmailLogin())
      const mutationOptions = useMutation.mock.calls[0][0]

      act(() => {
        mutationOptions.onError(error, mockLoginData)
      })

      expect(mockedAlert).toHaveBeenCalledWith('error', 'emailLoginFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })
  })

  describe('useGoogleLogin', () => {
    const mockUserCredential = {
      user: { uid: '123', email: 'test@test.com' },
    }

    it('should handle success on google login', async () => {
      const mockToken = 'mocked-token'

      mockedSignInWithGoogle.mockResolvedValue(mockUserCredential as any)
      getIdToken.mockResolvedValue(mockToken)
      mockedSocial.mockResolvedValue(undefined)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async () => {
          const result = await options.mutationFn()
          await options.onSuccess(result)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useGoogleLogin())

      await act(async () => {
        await result.current.mutateAsync()
      })

      expect(mockedSignInWithGoogle).toHaveBeenCalled()
      expect(getIdToken).toHaveBeenCalledWith(mockUserCredential.user, true)
      expect(mockedSocial).toHaveBeenCalledWith({
        provider: 'google',
        token: mockToken,
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] })
    })

    it('should alert on google login failure', async () => {
      const error = new Error('Google login failed')

      useMutation.mockImplementation(() => ({
        mutateAsync: jest.fn().mockRejectedValue(error),
        isLoading: false,
        isError: true,
        error,
      }))

      renderHook(() => useGoogleLogin())
      const mutationOptions = useMutation.mock.calls[0][0]

      act(() => {
        mutationOptions.onError(error)
      })

      expect(mockedAlert).toHaveBeenCalledWith('error', 'socialLoginFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })
  })

  describe('useAppleLogin', () => {
    const mockUserCredential = {
      user: { uid: '123', email: 'test@test.com' },
    }

    it('should handle success on apple login', async () => {
      const mockToken = 'mocked-token'

      mockedSignInWithApple.mockResolvedValue(mockUserCredential as any)
      getIdToken.mockResolvedValue(mockToken)
      mockedSocial.mockResolvedValue(undefined)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async () => {
          const result = await options.mutationFn()
          await options.onSuccess(result)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useAppleLogin())

      await act(async () => {
        await result.current.mutateAsync()
      })

      expect(mockedSignInWithApple).toHaveBeenCalled()
      expect(getIdToken).toHaveBeenCalledWith(mockUserCredential.user, true)
      expect(mockedSocial).toHaveBeenCalledWith({
        provider: 'apple',
        token: mockToken,
      })
      expect(mockedInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] })
    })

    it('should alert on apple login failure', async () => {
      const error = new Error('Apple login failed')

      useMutation.mockImplementation(() => ({
        mutateAsync: jest.fn().mockRejectedValue(error),
        isLoading: false,
        isError: true,
        error,
      }))

      renderHook(() => useAppleLogin())
      const mutationOptions = useMutation.mock.calls[0][0]

      act(() => {
        mutationOptions.onError(error)
      })

      expect(mockedAlert).toHaveBeenCalledWith('error', 'socialLoginFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })
  })

  describe('useLogout', () => {
    it('should successfully log out', async () => {
      mockedHandleLogout.mockResolvedValue(undefined)
      mockedLogout.mockResolvedValue(undefined)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async () => {
          const result = await options.mutationFn()
          await options.onSuccess(result)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useLogout())

      await act(async () => {
        await result.current.mutateAsync()
      })

      expect(mockedHandleLogout).toHaveBeenCalled()
      expect(mockedLogout).toHaveBeenCalled()
      expect(mockedSetQueryData).toHaveBeenCalledWith(['user'], null)
      expect(mockedRemoveQueries).toHaveBeenCalled()
    })

    it('should show an alert on logout failure', async () => {
      const error = new Error('Logout failed')

      useMutation.mockImplementation(() => ({
        mutateAsync: jest.fn().mockRejectedValue(error),
        isLoading: false,
        isError: true,
        error,
      }))

      renderHook(() => useLogout())
      const mutationOptions = useMutation.mock.calls[0][0]

      act(() => {
        mutationOptions.onError(error)
      })

      expect(mockedAlert).toHaveBeenCalledWith('error', 'logoutFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })
  })

  describe('useForgotPassword', () => {
    const testEmail = 'test@test.com'

    it('should successfully send a password reset link', async () => {
      mockedSendPasswordResetLink.mockResolvedValue(undefined)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async email => {
          const result = await options.mutationFn(email)
          await options.onSuccess(result, email)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useForgotPassword())

      await act(async () => {
        await result.current.mutateAsync(testEmail)
      })

      expect(mockedSendPasswordResetLink).toHaveBeenCalledWith(testEmail)
      expect(Toast.show).toHaveBeenCalledWith({
        text1: 'successful',
        text2: 'passwordResetLinkSent',
        type: 'success',
      })
      expect(router.back).toHaveBeenCalled()
    })

    it('should show an alert on password reset failure', async () => {
      const error = new Error('Reset failed')

      useMutation.mockImplementation(() => ({
        mutateAsync: jest.fn().mockRejectedValue(error),
        isLoading: false,
        isError: true,
        error,
      }))

      renderHook(() => useForgotPassword())
      const mutationOptions = useMutation.mock.calls[0][0]

      act(() => {
        mutationOptions.onError(error, testEmail)
      })

      expect(mockedAlert).toHaveBeenCalledWith(
        'error',
        'passwordResetLinkSentFailed',
        [{ text: 'ok' }],
        { userInterfaceStyle: 'light' },
      )
    })
  })

  describe('handleAuthSuccess error scenarios', () => {
    it('should log error when getIdToken fails', async () => {
      const mockUserCredential = {
        user: { uid: '123', email: 'test@test.com' },
      }
      const tokenError = new Error('Token error')

      mockedSignInWithEmail.mockResolvedValue(mockUserCredential as any)
      getIdToken.mockRejectedValue(tokenError)

      useMutation.mockImplementation((options: any) => ({
        mutateAsync: jest.fn().mockImplementation(async data => {
          const result = await options.mutationFn(data)
          await options.onSuccess(result, data)
          return result
        }),
        isLoading: false,
        isError: false,
        error: null,
      }))

      const { result } = renderHook(() => useEmailLogin())

      await act(async () => {
        await result.current.mutateAsync({
          email: 'test@test.com',
          password: 'password123',
        })
      })

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to handle auth success',
        'error',
        tokenError,
      )
    })
  })

  describe('theme variations', () => {
    it('should use dark theme in alerts when selectedTheme is dark', async () => {
      mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })

      const error = new Error('Login failed')

      useMutation.mockImplementation(() => ({
        mutateAsync: jest.fn().mockRejectedValue(error),
        isLoading: false,
        isError: true,
        error,
      }))

      renderHook(() => useEmailLogin())
      const mutationOptions = useMutation.mock.calls[0][0]

      act(() => {
        mutationOptions.onError(error, { email: 'test@test.com', password: 'password' })
      })

      expect(mockedAlert).toHaveBeenCalledWith('error', 'emailLoginFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'dark',
      })
    })
  })
})
