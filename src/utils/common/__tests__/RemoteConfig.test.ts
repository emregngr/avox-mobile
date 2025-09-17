import { Logger } from '@/utils/common/logger'
import {
  defaultConfigs,
  getBooleanValue,
  getStringValue,
  setFirebaseConfig,
} from '@/utils/common/remoteConfig'

const {
  getValue,
  fetchAndActivate,
  getAll,
  setConfigSettings,
  setDefaults,
} = require('@react-native-firebase/remote-config')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

beforeEach(() => {
  __DEV__ = false
})

describe('Remote Config Utilities', () => {
  describe('setFirebaseConfig', () => {
    it('should successfully set defaults, settings, and activate in production', async () => {
      fetchAndActivate.mockResolvedValue(true)
      getAll.mockReturnValue({ config_key: 'value' })

      const result = await setFirebaseConfig()

      expect(setDefaults).toHaveBeenCalledWith(expect.any(Object), defaultConfigs)
      expect(setConfigSettings).toHaveBeenCalledWith(expect.any(Object), {
        minimumFetchIntervalMillis: 3600000,
      })
      expect(fetchAndActivate).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('REMOTE CONFIG', 'info', {
        activated: true,
        all: { config_key: 'value' },
        default: defaultConfigs,
      })
      expect(result).toBe(true)
    })

    it('should use development fetch interval when __DEV__ is true', async () => {
      __DEV__ = true
      fetchAndActivate.mockResolvedValue(true)

      await setFirebaseConfig()

      expect(setConfigSettings).toHaveBeenCalledWith(expect.any(Object), {
        minimumFetchIntervalMillis: 300,
      })
    })

    it('should return false and log an error if fetchAndActivate fails', async () => {
      const configError = new Error('Firebase connection failed')
      fetchAndActivate.mockRejectedValue(configError)

      const result = await setFirebaseConfig()

      expect(result).toBe(false)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('remoteConfigError', 'error', configError)
    })
  })

  describe('getBooleanValue', () => {
    it('should return the remote boolean value if source is not default', () => {
      getValue.mockReturnValue({
        getSource: () => 'remote',
        asBoolean: () => true,
      })

      const result = getBooleanValue('IS_MAINTENANCE')
      expect(result).toBe(true)
      expect(getValue).toHaveBeenCalledWith(expect.any(Object), 'IS_MAINTENANCE')
    })

    it('should return the default boolean value if source is default', () => {
      getValue.mockReturnValue({
        getSource: () => 'default',
        asBoolean: () => false,
      })

      const result = getBooleanValue('IS_MAINTENANCE')
      expect(result).toBe(defaultConfigs.IS_MAINTENANCE)
    })

    it('should return the default boolean value if remote value is falsy', () => {
      getValue.mockReturnValue(null)

      const result = getBooleanValue('IS_MAINTENANCE')
      expect(result).toBe(defaultConfigs.IS_MAINTENANCE)
    })
  })

  describe('getStringValue', () => {
    it('should return the remote string value if source is not default', () => {
      getValue.mockReturnValue({
        getSource: () => 'remote',
        asString: () => '1.2.0',
      })

      const result = getStringValue('MIN_VERSION_SUPPORT')
      expect(result).toBe('1.2.0')
      expect(getValue).toHaveBeenCalledWith(expect.any(Object), 'MIN_VERSION_SUPPORT')
    })

    it('should return the default string value if source is default', () => {
      getValue.mockReturnValue({
        getSource: () => 'default',
        asString: () => '0.0.0',
      })

      const result = getStringValue('MIN_VERSION_SUPPORT')
      expect(result).toBe(defaultConfigs.MIN_VERSION_SUPPORT)
    })

    it('should return the default string value if remote value is falsy', () => {
      getValue.mockReturnValue(null)

      const result = getStringValue('MIN_VERSION_SUPPORT')
      expect(result).toBe(defaultConfigs.MIN_VERSION_SUPPORT)
    })
  })
})
