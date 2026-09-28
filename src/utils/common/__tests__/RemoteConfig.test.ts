import { fetchAndActivate, getAll, getValue } from '@react-native-firebase/remote-config'

import { Logger } from '@/utils/common/logger'
import {
  defaultConfigs,
  getBooleanValue,
  getStringValue,
  setFirebaseConfig,
} from '@/utils/common/remoteConfig'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>
const mockedFetchAndActivate = fetchAndActivate as jest.MockedFunction<typeof fetchAndActivate>
const mockedGetAll = getAll as jest.MockedFunction<typeof getAll>
const mockedGetValue = getValue as jest.MockedFunction<typeof getValue>

describe('Remote Config Utilities', () => {
  describe('setFirebaseConfig', () => {
    it('should successfully set defaults, settings, and activate', async () => {
      mockedFetchAndActivate.mockResolvedValue(true)
      mockedGetAll.mockReturnValue({ config_key: 'value' } as any)

      const result = await setFirebaseConfig()

      expect(mockedFetchAndActivate).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('REMOTE CONFIG', 'info', {
        activated: true,
        all: { config_key: 'value' },
        default: defaultConfigs,
      })
      expect(result).toBe(true)
    })

    it('should return false and log an error if fetchAndActivate fails', async () => {
      const configError = new Error('Firebase connection failed')
      mockedFetchAndActivate.mockRejectedValue(configError)

      const result = await setFirebaseConfig()

      expect(result).toBe(false)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('remoteConfigError', 'error', configError)
    })
  })

  describe('getBooleanValue', () => {
    it('should return the remote boolean value if source is not default', () => {
      mockedGetValue.mockReturnValue({
        getSource: () => 'remote',
        asBoolean: () => true,
      } as any)

      const result = getBooleanValue('IS_MAINTENANCE')
      expect(result).toBe(true)
      expect(mockedGetValue).toHaveBeenCalledWith(expect.any(Object), 'IS_MAINTENANCE')
    })

    it('should return the default boolean value if source is default', () => {
      mockedGetValue.mockReturnValue({
        getSource: () => 'default',
        asBoolean: () => false,
      } as any)

      const result = getBooleanValue('IS_MAINTENANCE')
      expect(result).toBe(defaultConfigs.IS_MAINTENANCE)
    })

    it('should return the default boolean value if remote value is falsy', () => {
      mockedGetValue.mockReturnValue(null as any)

      const result = getBooleanValue('IS_MAINTENANCE')
      expect(result).toBe(defaultConfigs.IS_MAINTENANCE)
    })
  })

  describe('getStringValue', () => {
    it('should return the remote string value if source is not default', () => {
      mockedGetValue.mockReturnValue({
        getSource: () => 'remote',
        asString: () => '1.2.0',
      } as any)

      const result = getStringValue('MIN_VERSION_SUPPORT')
      expect(result).toBe('1.2.0')
      expect(mockedGetValue).toHaveBeenCalledWith(expect.any(Object), 'MIN_VERSION_SUPPORT')
    })

    it('should return the default string value if source is default', () => {
      mockedGetValue.mockReturnValue({
        getSource: () => 'default',
        asString: () => '0.0.0',
      } as any)

      const result = getStringValue('MIN_VERSION_SUPPORT')
      expect(result).toBe(defaultConfigs.MIN_VERSION_SUPPORT)
    })

    it('should return the default string value if remote value is falsy', () => {
      mockedGetValue.mockReturnValue(null as any)

      const result = getStringValue('MIN_VERSION_SUPPORT')
      expect(result).toBe(defaultConfigs.MIN_VERSION_SUPPORT)
    })
  })
})
