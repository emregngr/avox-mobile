import type { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { useUserSession } from '@/hooks/app/useUserSession'
import { Logger } from '@/utils/common/logger'

const { getApp, mockedApp } = require('@react-native-firebase/app')
const { getAuth, mockedAuth, getIdToken } = require('@react-native-firebase/auth')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

const mockedUser = {
  uid: 'mocked-uid',
  email: 'mocked-email',
  displayName: 'mocked-display-name',
  photoURL: 'mocked-photo-url',
  isAnonymous: false,
} as FirebaseAuthTypes.User

describe('useUserSession', () => {
  beforeEach(() => {
    getApp.mockReturnValue(mockedApp)
    getAuth.mockReturnValue(mockedAuth)
  })

  describe('when user is not authenticated', () => {
    it('should return false when currentUser is null', async () => {
      mockedAuth.currentUser = null

      const result = await useUserSession()

      expect(result).toBe(false)
      expect(getIdToken).not.toHaveBeenCalled()
      expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
    })

    it('should return false when currentUser is undefined', async () => {
      mockedAuth.currentUser = undefined

      const result = await useUserSession()

      expect(result).toBe(false)
      expect(getIdToken).not.toHaveBeenCalled()
      expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockedAuth.currentUser = mockedUser
    })

    it('should return true when getIdToken succeeds', async () => {
      const mockedToken = 'mocked-id-token'
      getIdToken.mockResolvedValue(mockedToken)

      const result = await useUserSession()

      expect(result).toBe(true)
      expect(getIdToken).toHaveBeenCalledWith(mockedUser, true)
      expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
    })

    it('should return false and log error when getIdToken fails', async () => {
      const error = new Error('Token refresh failed')
      getIdToken.mockRejectedValue(error)

      const result = await useUserSession()

      expect(result).toBe(false)
      expect(getIdToken).toHaveBeenCalledWith(mockedUser, true)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to check user session',
        'error',
        error,
      )
    })

    it('should call getIdToken with force refresh true', async () => {
      getIdToken.mockResolvedValue('mocked-token')

      await useUserSession()

      expect(getIdToken).toHaveBeenCalledWith(mockedUser, true)
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      mockedAuth.currentUser = mockedUser
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed')
      getIdToken.mockRejectedValue(networkError)

      const result = await useUserSession()

      expect(result).toBe(false)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to check user session',
        'error',
        networkError,
      )
    })

    it('should handle auth errors', async () => {
      const authError = new Error('User token expired')
      getIdToken.mockRejectedValue(authError)

      const result = await useUserSession()

      expect(result).toBe(false)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to check user session',
        'error',
        authError,
      )
    })

    it('should handle non-Error objects thrown', async () => {
      const stringError = 'Something went wrong'
      getIdToken.mockRejectedValue(stringError)

      const result = await useUserSession()

      expect(result).toBe(false)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to check user session',
        'error',
        stringError,
      )
    })
  })
})
