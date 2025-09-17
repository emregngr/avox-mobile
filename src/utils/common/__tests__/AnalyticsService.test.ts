import { logEvent, setUserId, setUserProperties } from '@react-native-firebase/analytics'
import { MMKV } from 'react-native-mmkv'

import { ENUMS } from '@/enums'
import type { UserProfileType } from '@/types/feature/user'
import { AnalyticsService } from '@/utils/common/analyticsService'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

const mockedLogEvent = logEvent as jest.MockedFunction<typeof logEvent>
const mockedSetUserId = setUserId as jest.MockedFunction<typeof setUserId>
const mockedSetUserProperties = setUserProperties as jest.MockedFunction<typeof setUserProperties>

const storage = new MMKV()

const mockedStorageGetString = storage.getString as jest.MockedFunction<typeof storage.getString>

describe('AnalyticsService', () => {
  describe('sendEvent', () => {
    it('should send an event with a user ID from storage', async () => {
      const tag = 'test_event'
      const values = { prop1: 'value1', prop2: 123, prop3: null }
      const userId = 'user-123'

      mockedStorageGetString.mockReturnValue(userId)

      await AnalyticsService.sendEvent(tag, values)

      expect(mockedStorageGetString).toHaveBeenCalledWith(ENUMS.USER_ID)
      expect(mockedLogEvent).toHaveBeenCalledTimes(1)
      expect(mockedLogEvent).toHaveBeenCalledWith(expect.any(Object), tag, {
        prop1: 'value1',
        prop2: '123',
        prop3: '',
        userId,
      })
    })

    it('should send an event with "anonymous" user ID if none is in storage', async () => {
      const tag = 'anonymous_event'
      const values = { source: 'login_page' }

      mockedStorageGetString.mockReturnValue(null as any)

      await AnalyticsService.sendEvent(tag, values)

      expect(mockedLogEvent).toHaveBeenCalledWith(expect.any(Object), tag, {
        source: 'login_page',
        userId: 'anonymous',
      })
    })

    it('should handle null or undefined values gracefully', async () => {
      const tag = 'empty_values_event'
      mockedStorageGetString.mockReturnValue('user-456')

      await AnalyticsService.sendEvent(tag, null)

      expect(mockedLogEvent).toHaveBeenCalledWith(expect.any(Object), tag, {
        userId: 'user-456',
      })
    })

    it('should log an error if logEvent fails', async () => {
      const error = new Error('Firebase network error')
      mockedStorageGetString.mockReturnValue('user-123')
      mockedLogEvent.mockRejectedValue(error)

      await AnalyticsService.sendEvent('failing_event', { key: 'value' })

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('analyticsSendEventError', 'error', error)
    })
  })

  describe('setUser', () => {
    const user: any = {
      uid: 'user-uid-789',
      email: 'test@example.com',
      firstName: 'John',
    }

    it('should set user ID and properties for a valid user', async () => {
      await AnalyticsService.setUser(user)

      expect(mockedSetUserId).toHaveBeenCalledTimes(1)
      expect(mockedSetUserId).toHaveBeenCalledWith(expect.any(Object), user.uid)

      expect(mockedSetUserProperties).toHaveBeenCalledTimes(1)
      expect(mockedSetUserProperties).toHaveBeenCalledWith(expect.any(Object), {
        email: user.email,
        firstName: user.firstName,
      })
    })

    it('should handle a user with missing optional properties', async () => {
      const partialUser: any = {
        uid: 'user-uid-partial',
      }

      await AnalyticsService.setUser(partialUser)

      expect(mockedSetUserId).toHaveBeenCalledWith(expect.any(Object), partialUser.uid)
      expect(mockedSetUserProperties).toHaveBeenCalledWith(expect.any(Object), {
        email: '',
        firstName: '',
      })
    })

    it('should log a warning and do nothing if user has no UID', async () => {
      const userWithoutUid = { email: 'no-uid@example.com', firstName: 'Jane' }

      await AnalyticsService.setUser(userWithoutUid as UserProfileType)

      expect(mockedSetUserId).not.toHaveBeenCalled()
      expect(mockedSetUserProperties).not.toHaveBeenCalled()

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('analyticsNoUserIdError', 'warning', {
        user: userWithoutUid,
      })
    })

    it('should log an error if setUserId fails', async () => {
      const error = new Error('Failed to set user ID')
      mockedSetUserId.mockRejectedValue(error)

      await AnalyticsService.setUser(user)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('analyticsSetUserError', 'error', error)

      expect(mockedSetUserProperties).not.toHaveBeenCalled()
    })

    it('should log an error if setUserProperties fails', async () => {
      const error = new Error('Failed to set user properties')
      mockedSetUserProperties.mockRejectedValue(error)

      await AnalyticsService.setUser(user)

      expect(mockedSetUserId).toHaveBeenCalledTimes(1)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('analyticsSetUserError', 'error', error)
    })
  })
})
