import { MMKV } from 'react-native-mmkv'

import { ENUMS } from '@/enums'
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
import { AnalyticsService } from '@/utils/common/analyticsService'
import Device from '@/utils/common/device'
import { Logger } from '@/utils/common/logger'

const {
  mockedAuth,
  linkWithCredential,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} = require('@react-native-firebase/auth')
const { runTransaction, deleteDoc, getDoc, setDoc } = require('@react-native-firebase/firestore')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

const storage = new MMKV()

const mockedStorageSet = storage.set as jest.MockedFunction<typeof storage.set>

jest.mock('@/utils/common/analyticsService', () => ({
  AnalyticsService: { setUser: jest.fn() },
}))

jest.mock('@/utils/common/device')

const mockedRegisterDevice = Device.registerDevice as jest.MockedFunction<
  typeof Device.registerDevice
>

beforeEach(() => {
  mockedAuth.currentUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'http://example.com/photo.jpg',
    delete: jest.fn().mockResolvedValue(undefined),
  }

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      somethingWentWrong: 'Something went wrong.',
      userNotLoggedIn: 'User not logged in.',
    }
    return translations[key] || key
  })
})

describe('User Service', () => {
  describe('getUser', () => {
    it('should return user profile if firestore doc exists', async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({
          firstName: 'Test',
          lastName: 'User',
          createdAt: '2023-01-01',
        }),
      })

      const userProfile = await getUser()

      expect(userProfile).toEqual({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'http://example.com/photo.jpg',
        firstName: 'Test',
        lastName: 'User',
        createdAt: '2023-01-01',
      })
      expect(mockedStorageSet).toHaveBeenCalledWith(ENUMS.USER_ID, 'test-user-id')
      expect(AnalyticsService.setUser).toHaveBeenCalled()
    })

    it('should return partial profile if doc does not exist', async () => {
      ;(getDoc as jest.Mock).mockResolvedValue({ exists: () => false })

      const userProfile = await getUser()
      expect(userProfile?.firstName).toBeNull()
      expect(userProfile?.lastName).toBeNull()
    })

    it('should return null if no user logged in', async () => {
      mockedAuth.currentUser = null
      expect(await getUser()).toBeNull()
    })

    it('should log and throw if firestore fails', async () => {
      const err = new Error('firestore fail');
(getDoc as jest.Mock).mockRejectedValue(err)
      await expect(getUser()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('Failed to get user', 'error', err)
    })
  })

  describe('updateUser', () => {
    it('should update firestore + profile', async () => {
      await updateUser({ firstName: 'John', lastName: 'Doe', email: 'jd@x.com' })
      expect(setDoc).toHaveBeenCalled()
      expect(updateProfile).toHaveBeenCalled()
    })

    it('should throw if not logged in', async () => {
      mockedAuth.currentUser = null
      await expect(updateUser({ firstName: 'A', lastName: 'B', email: 'c' })).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('userNotLoggedIn')
    })

    it('should log and throw if firestore fails', async () => {
      setDoc.mockRejectedValue(new Error('fail'))
      await expect(updateUser({ firstName: 'A', lastName: 'B', email: 'c' })).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to update user',
        'error',
        expect.any(Error),
      )
    })
  })

  describe('deleteUserAccount', () => {
    it('should delete firestore + auth user', async () => {
      await deleteUserAccount()
      expect(deleteDoc).toHaveBeenCalled()
      expect(mockedAuth.currentUser.delete).toHaveBeenCalled()
    })

    it('should throw if not logged in', async () => {
      mockedAuth.currentUser = null
      await expect(deleteUserAccount()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('userNotLoggedIn')
    })

    it('should log and throw if deleteDoc fails', async () => {
      ;(deleteDoc as jest.Mock).mockRejectedValue(new Error('fail'))
      await expect(deleteUserAccount()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to delete user account',
        'error',
        expect.any(Error),
      )
    })
  })

  describe('changeUserPassword', () => {
    it('should reauth + update password', async () => {
      await changeUserPassword({
        currentPassword: 'old',
        newPassword: 'new',
      })
      expect(reauthenticateWithCredential).toHaveBeenCalled()
      expect(updatePassword).toHaveBeenCalled()
    })

    it('should throw if reauth fails', async () => {
      const err = new Error('reauth fail');
(reauthenticateWithCredential as jest.Mock).mockRejectedValue(err)
      await expect(
        changeUserPassword({ currentPassword: 'old', newPassword: 'new' }),
      ).rejects.toThrow()
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to change user password',
        'error',
        err,
      )
    })

    it('should throw if updatePassword fails', async () => {
      const err = new Error('update fail');
(updatePassword as jest.Mock).mockRejectedValue(err)
      await expect(
        changeUserPassword({ currentPassword: 'old', newPassword: 'new' }),
      ).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to change user password',
        'error',
        err,
      )
    })
  })

  describe('addUserPassword', () => {
    it('should link credential', async () => {
      await addUserPassword({ newPassword: 'pw' })
      expect(linkWithCredential).toHaveBeenCalled()
    })

    it('should log and throw if link fails', async () => {
      const err = new Error('link fail');
(linkWithCredential as jest.Mock).mockRejectedValue(err)
      await expect(addUserPassword({ newPassword: 'pw' })).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to add user password',
        'error',
        err,
      )
    })
  })

  describe('registerDevice', () => {
    it('should register device', async () => {
      mockedRegisterDevice.mockResolvedValue({ unique_id: 'dev-1' } as any)
      await registerDevice()
      expect(setDoc).toHaveBeenCalled()
    })

    it('should throw if no deviceId', async () => {
      mockedRegisterDevice.mockResolvedValue({ unique_id: null } as any)
      await expect(registerDevice()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
    })

    it('should log and throw if setDoc fails', async () => {
      mockedRegisterDevice.mockResolvedValue({ unique_id: 'dev-2' } as any)
      setDoc.mockRejectedValue(new Error('fail'))
      await expect(registerDevice()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to register device',
        'error',
        expect.any(Error),
      )
    })
  })

  describe('registerDeviceToUser', () => {
    it('should register new device', async () => {
      mockedRegisterDevice.mockResolvedValue({ unique_id: 'dev-xyz' } as any)
      runTransaction.mockImplementation(async (_db: any, fn: any) => {
        const tx = {
          get: jest.fn().mockResolvedValue({ data: () => ({ devices: [] }) }),
          set: jest.fn(),
          update: jest.fn(),
        }
        return fn(tx)
      })

      await expect(registerDeviceToUser()).resolves.not.toThrow()
      expect(runTransaction).toHaveBeenCalled()
    })

    it('should update existing device', async () => {
      mockedRegisterDevice.mockResolvedValue({ unique_id: 'dev-xyz' } as any)
      runTransaction.mockImplementation(async (_db: any, fn: any) => {
        const tx = {
          get: jest.fn().mockResolvedValue({
            data: () => ({ devices: [{ unique_id: 'dev-xyz', token: 'old' }] }),
          }),
          set: jest.fn(),
          update: jest.fn(),
        }
        return fn(tx)
      })

      await expect(registerDeviceToUser()).resolves.not.toThrow()
      expect(runTransaction).toHaveBeenCalled()
    })

    it('should throw if not logged in', async () => {
      mockedAuth.currentUser = null
      await expect(registerDeviceToUser()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('userNotLoggedIn')
    })

    it('should log and throw if runTransaction fails', async () => {
      mockedRegisterDevice.mockResolvedValue({ unique_id: 'dev-xyz' } as any)
      runTransaction.mockRejectedValue(new Error('tx fail'))
      await expect(registerDeviceToUser()).rejects.toThrow()
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to register device to user',
        'error',
        expect.any(Error),
      )
    })
  })
})
