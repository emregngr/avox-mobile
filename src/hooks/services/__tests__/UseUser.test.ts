import { renderHook } from '@testing-library/react-hooks'
import { router } from 'expo-router'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'

import {
  useAddPassword,
  useChangePassword,
  useDeleteUser,
  useGetUser,
  useRegisterDevice,
  useRegisterDeviceToUser,
  useUpdateUser,
} from '@/hooks/services/useUser'
import { getLocale } from '@/locales/i18next'
import {
  addUserPassword,
  changeUserPassword,
  deleteUserAccount,
  getUser,
  registerDevice,
  registerDeviceToUser,
  updateUser,
} from '@/services/userService'
import { setIsAuthenticated } from '@/store/auth'
import useThemeStore from '@/store/theme'
import { deleteUser } from '@/store/user'

const {
  useQuery,
  useMutation,
  mockedClear,
  mockedGetQueryData,
  mockedCancelQueries,
  mockedSetQueryData,
} = require('@tanstack/react-query')
const { mockedAuth } = require('@react-native-firebase/auth')

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/services/userService')

jest.mock('@/store/auth')

const mockedSetIsAuthenticated = setIsAuthenticated as jest.MockedFunction<
  typeof setIsAuthenticated
>

jest.mock('@/store/user')

const mockedDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>

const mockedMutationFn = jest.fn()
const mockedOnError = jest.fn()
const mockedOnMutate = jest.fn()
const mockedOnSettled = jest.fn()
const mockedOnSuccess = jest.fn()

let mockAlert: jest.SpyInstance

describe('User Hooks', () => {
  beforeEach(() => {
    mockedAuth.currentUser = {
      uid: 'test-user-id',
    }

    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'light',
    })

    mockedGetLocale.mockImplementation((key: string) => key)

    mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
  })

  describe('useGetUser', () => {
    beforeEach(() => {
      useQuery.mockReturnValue({
        data: { id: 'test-user-id', name: 'Test User' },
        error: null,
        isLoading: false,
      } as any)
    })

    it('should call useQuery with correct parameters', () => {
      renderHook(() => useGetUser())

      expect(useQuery).toHaveBeenCalledWith({
        enabled: true,
        queryFn: getUser,
        queryKey: ['userProfile', 'test-user-id'],
      })
    })

    it('should be disabled when no user ID', () => {
      mockedAuth.currentUser = null

      renderHook(() => useGetUser())

      expect(useQuery).toHaveBeenCalledWith({
        enabled: false,
        queryFn: getUser,
        queryKey: ['userProfile', undefined],
      })
    })
  })

  describe('useUpdateUser', () => {
    beforeEach(() => {
      useMutation.mockImplementation(
        ({
          mutationFn,
          onError,
          onMutate,
          onSettled,
          onSuccess,
        }: {
          mutationFn: any
          onError: any
          onMutate: any
          onSettled: any
          onSuccess: any
        }) => {
          mockedMutationFn.mockImplementation(mutationFn)
          mockedOnError.mockImplementation(onError)
          mockedOnMutate.mockImplementation(onMutate)
          mockedOnSettled.mockImplementation(onSettled)
          mockedOnSuccess.mockImplementation(onSuccess)
          return {
            mutate: mockedMutationFn,
            mutateAsync: mockedMutationFn,
          } as any
        },
      )
    })

    it('should call useMutation with correct mutationFn', async () => {
      renderHook(() => useUpdateUser())

      const profileData = { firstName: 'John', lastName: 'Doe' }
      await mockedMutationFn(profileData)

      expect(updateUser).toHaveBeenCalledWith(profileData)
    })

    it('should handle onSuccess correctly', async () => {
      renderHook(() => useUpdateUser())

      await mockedOnSuccess()

      expect(Toast.show).toHaveBeenCalledWith({
        text1: 'successful',
        text2: 'profileUpdatedSuccessfully',
        type: 'success',
      })
      expect(router.back).toHaveBeenCalled()
    })

    it('should handle onError correctly', async () => {
      const error = new Error('Update failed')
      const newProfileData = { firstName: 'John' }
      const context = { previousProfile: { firstName: 'Jane' } }

      renderHook(() => useUpdateUser())

      await mockedOnError(error, newProfileData, context)

      expect(mockedSetQueryData).toHaveBeenCalledWith(
        ['userProfile', 'test-user-id'],
        context.previousProfile,
      )
      expect(mockAlert).toHaveBeenCalledWith('error', 'profileUpdateFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })

    it('should handle onMutate correctly', async () => {
      const newProfileData = { firstName: 'John', lastName: 'Doe' }
      const previousProfile = { firstName: 'Jane', lastName: 'Smith' }

      mockedGetQueryData.mockReturnValue(previousProfile)

      renderHook(() => useUpdateUser())

      const result = await mockedOnMutate(newProfileData)

      expect(mockedCancelQueries).toHaveBeenCalledWith({
        queryKey: ['userProfile', 'test-user-id'],
      })
      expect(mockedSetQueryData).toHaveBeenCalledWith(
        ['userProfile', 'test-user-id'],
        expect.any(Function),
      )
      expect(result).toEqual({ previousProfile })
    })
  })

  describe('useChangePassword', () => {
    beforeEach(() => {
      useMutation.mockImplementation(
        ({ mutationFn, onError, onSuccess }: { mutationFn: any; onError: any; onSuccess: any }) => {
          mockedMutationFn.mockImplementation(mutationFn)
          mockedOnError.mockImplementation(onError)
          mockedOnSuccess.mockImplementation(onSuccess)
          return {
            mutate: mockedMutationFn,
          } as any
        },
      )
    })

    it('should call changeUserPassword with credentials', async () => {
      renderHook(() => useChangePassword())

      const credentials = { currentPassword: '123', newPassword: '456' }
      await mockedMutationFn(credentials)

      expect(changeUserPassword).toHaveBeenCalledWith(credentials)
    })

    it('should show success toast and navigate back on success', async () => {
      renderHook(() => useChangePassword())

      await mockedOnSuccess()

      expect(Toast.show).toHaveBeenCalledWith({
        text1: 'successful',
        text2: 'passwordChangedSuccessfully',
        type: 'success',
      })
      expect(router.back).toHaveBeenCalled()
    })

    it('should show error alert on error', async () => {
      renderHook(() => useChangePassword())

      await mockedOnError()

      expect(mockAlert).toHaveBeenCalledWith('error', 'passwordChangeFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })
  })

  describe('useAddPassword', () => {
    beforeEach(() => {
      useMutation.mockImplementation(
        ({ mutationFn, onError, onSuccess }: { mutationFn: any; onError: any; onSuccess: any }) => {
          mockedMutationFn.mockImplementation(mutationFn)
          mockedOnError.mockImplementation(onError)
          mockedOnSuccess.mockImplementation(onSuccess)
          return {
            mutate: mockedMutationFn,
          } as any
        },
      )
    })

    it('should call addUserPassword with credentials', async () => {
      renderHook(() => useAddPassword())

      const credentials = { password: '123456' }
      await mockedMutationFn(credentials)

      expect(addUserPassword).toHaveBeenCalledWith(credentials)
    })

    it('should show success toast on success', async () => {
      renderHook(() => useAddPassword())

      await mockedOnSuccess()

      expect(Toast.show).toHaveBeenCalledWith({
        text1: 'successful',
        text2: 'passwordAddedSuccessfully',
        type: 'success',
      })
    })

    it('should show error alert on error', async () => {
      renderHook(() => useAddPassword())

      await mockedOnError()

      expect(mockAlert).toHaveBeenCalledWith('error', 'passwordAddFailed', [{ text: 'ok' }], {
        userInterfaceStyle: 'light',
      })
    })
  })

  describe('useDeleteUser', () => {
    beforeEach(() => {
      useMutation.mockImplementation(
        ({ mutationFn, onError, onSuccess }: { mutationFn: any; onError: any; onSuccess: any }) => {
          mockedMutationFn.mockImplementation(mutationFn)
          mockedOnError.mockImplementation(onError)
          mockedOnSuccess.mockImplementation(onSuccess)
          return {
            mutate: mockedMutationFn,
          } as any
        },
      )
    })

    it('should call deleteUserAccount', async () => {
      renderHook(() => useDeleteUser())

      await mockedMutationFn()

      expect(deleteUserAccount).toHaveBeenCalled()
    })

    it('should handle success correctly', async () => {
      renderHook(() => useDeleteUser())

      await mockedOnSuccess()

      expect(mockedDeleteUser).toHaveBeenCalled()
      expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(false)
      expect(mockedClear).toHaveBeenCalled()
      expect(Toast.show).toHaveBeenCalledWith({
        text1: 'successful',
        text2: 'accountDeletedSuccessfully',
        type: 'success',
      })
    })

    it('should show error alert on error', async () => {
      renderHook(() => useDeleteUser())

      await mockedOnError()

      expect(mockAlert).toHaveBeenCalledWith('error', 'accountDeleteFailed', [{ text: 'ok' }])
    })
  })

  describe('useRegisterDevice', () => {
    beforeEach(() => {
      useMutation.mockImplementation(({ mutationFn }: { mutationFn: any }) => {
        mockedMutationFn.mockImplementation(mutationFn)
        return {
          mutate: mockedMutationFn,
        } as any
      })
    })

    it('should call registerDevice', async () => {
      renderHook(() => useRegisterDevice())

      await mockedMutationFn()

      expect(registerDevice).toHaveBeenCalled()
    })
  })

  describe('useRegisterDeviceToUser', () => {
    beforeEach(() => {
      useMutation.mockImplementation(({ mutationFn }: { mutationFn: any }) => {
        mockedMutationFn.mockImplementation(mutationFn)
        return {
          mutate: mockedMutationFn,
        } as any
      })
    })

    it('should call registerDeviceToUser', async () => {
      renderHook(() => useRegisterDeviceToUser())

      await mockedMutationFn()

      expect(registerDeviceToUser).toHaveBeenCalled()
    })
  })
})
