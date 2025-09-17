import { log, recordError } from '@react-native-firebase/crashlytics'

import type { LogCategory } from '@/utils/common/logger'
import { Logger } from '@/utils/common/logger'

let consoleLogSpy: jest.SpyInstance

beforeEach(() => {
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  consoleLogSpy.mockRestore()
})

describe('Logger', () => {
  describe('breadcrumb', () => {
    describe('in Development (__DEV__ = true)', () => {
      beforeAll(() => {
        __DEV__ = true
      })

      it('should call console.log with all provided arguments', () => {
        const message = 'User navigated to screen'
        const category: LogCategory = 'info'
        const data = { screen: 'Home' }
        Logger.breadcrumb(message, category, data)
        expect(consoleLogSpy).toHaveBeenCalledWith(message, category, data)
      })

      it('should NOT call any crashlytics functions', () => {
        Logger.breadcrumb('Test message', 'debug')
        expect(log).not.toHaveBeenCalled()
        expect(recordError).not.toHaveBeenCalled()
      })
    })

    describe('in Production (__DEV__ = false)', () => {
      beforeAll(() => {
        __DEV__ = false
      })

      it('should call console.log', () => {
        const message = 'API Request'
        const category: LogCategory = 'debug'
        const data = { url: '/users' }
        Logger.breadcrumb(message, category, data)
        expect(consoleLogSpy).toHaveBeenCalledWith(message, category, data)
      })

      it('should call crashlytics.log for non-Error data', () => {
        const message = 'User action'
        const category: LogCategory = 'warning'
        const data = { button: 'delete' }
        Logger.breadcrumb(message, category, data)

        const expectedLogRow = { category, data, message }
        expect(log).toHaveBeenCalledWith(expect.any(Object), JSON.stringify(expectedLogRow))
        expect(recordError).not.toHaveBeenCalled()
      })

      it('should call crashlytics.recordError for Error data', () => {
        const message = 'Failed to fetch data'
        const category: LogCategory = 'error'
        const errorData = new Error('Network request failed')
        Logger.breadcrumb(message, category, errorData)

        expect(recordError).toHaveBeenCalledWith(expect.any(Object), errorData)
        expect(log).not.toHaveBeenCalled()
      })
    })
  })

  describe('log', () => {
    describe('in Development (__DEV__ = true)', () => {
      beforeAll(() => {
        __DEV__ = true
      })

      it('should call console.log with message and data', () => {
        const message = 'Component mounted'
        const data = { component: 'Profile' }
        Logger.log(message, data)
        expect(consoleLogSpy).toHaveBeenCalledWith(message, data)
      })

      it('should NOT call any crashlytics functions', () => {
        Logger.log('Simple log')
        expect(log).not.toHaveBeenCalled()
        expect(recordError).not.toHaveBeenCalled()
      })
    })

    describe('in Production (__DEV__ = false)', () => {
      beforeAll(() => {
        __DEV__ = false
      })

      it('should call console.log', () => {
        const message = 'App initialized'
        Logger.log(message)
        expect(consoleLogSpy).toHaveBeenCalledWith(message, null)
      })

      it('should call crashlytics.log with a hardcoded "info" category for non-Error data', () => {
        const message = 'User logged in'
        const data = { userId: 123 }
        Logger.log(message, data)

        const expectedLogRow = { category: 'info', data, message }
        expect(log).toHaveBeenCalledWith(expect.any(Object), JSON.stringify(expectedLogRow))
        expect(recordError).not.toHaveBeenCalled()
      })

      it('should call crashlytics.recordError for Error data', () => {
        const message = 'An unexpected error occurred'
        const errorData = new Error('Something went wrong')
        Logger.log(message, errorData)

        expect(recordError).toHaveBeenCalledWith(expect.any(Object), errorData)
        expect(log).not.toHaveBeenCalled()
      })
    })
  })
})
