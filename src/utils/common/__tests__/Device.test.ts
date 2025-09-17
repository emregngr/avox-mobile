import { getCalendars } from 'expo-localization'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import Device from '@/utils/common/device'
import { Logger } from '@/utils/common/logger'

const { getToken } = require('@react-native-firebase/messaging')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

const mockedDeviceInfo = DeviceInfo as jest.Mocked<typeof DeviceInfo>

const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>
const mockedGetCalendars = getCalendars as jest.MockedFunction<typeof getCalendars>

const MOCK_BRAND = 'TestBrand'
const MOCK_BUILD_ID = 'test-build-id-123'
const MOCK_BUILD_NUMBER = '123'
const MOCK_CARRIER = 'TestCarrier'
const MOCK_FCM_TOKEN = 'test-fcm-token'
const MOCK_HOST = 'testhost'
const MOCK_IP = '192.168.1.1'
const MOCK_MODEL = 'TestModel'
const MOCK_SYSTEM_VERSION = '15.0'
const MOCK_TIMEZONE = 'Europe/Istanbul'
const MOCK_UNIQUE_ID = 'test-unique-id'
const MOCK_USER_AGENT = 'TestUserAgent/1.0'
const MOCK_VERSION = '1.0.0'

describe('Device Service', () => {
  describe('getBrand', () => {
    it('should return the device brand', () => {
      mockedDeviceInfo.getBrand.mockReturnValue(MOCK_BRAND)
      expect(Device.getBrand()).toBe(MOCK_BRAND)
    })

    it('should return "unknown" when brand is null or undefined', () => {
      mockedDeviceInfo.getBrand.mockReturnValue(null as any)
      expect(Device.getBrand()).toBe('unknown')
    })

    it('should return "unknown" on error', () => {
      const error = new Error('getBrand failed')
      mockedDeviceInfo.getBrand.mockImplementation(() => {
        throw error
      })
      expect(Device.getBrand()).toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get device brand',
        'warning',
        error,
      )
    })
  })

  describe('getBuildId', () => {
    it('should return the build ID', async () => {
      mockedDeviceInfo.getBuildId.mockResolvedValue(MOCK_BUILD_ID)
      await expect(Device.getBuildId()).resolves.toBe(MOCK_BUILD_ID)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getBuildId failed')
      mockedDeviceInfo.getBuildId.mockRejectedValue(error)
      await expect(Device.getBuildId()).resolves.toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get build ID',
        'warning',
        error,
      )
    })
  })

  describe('getBuildNumber', () => {
    it('should return the build number', async () => {
      mockedDeviceInfo.getBuildNumber.mockReturnValue(MOCK_BUILD_NUMBER)
      await expect(Device.getBuildNumber()).toBe(MOCK_BUILD_NUMBER)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getBuildNumber failed')
      mockedDeviceInfo.getBuildNumber.mockImplementation(() => {
        throw error
      })
      await expect(Device.getBuildNumber()).toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get build number',
        'warning',
        error,
      )
    })
  })

  describe('getCarrier', () => {
    it('should return the carrier', async () => {
      mockedDeviceInfo.getCarrier.mockResolvedValue(MOCK_CARRIER)
      await expect(Device.getCarrier()).resolves.toBe(MOCK_CARRIER)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getCarrier failed')
      mockedDeviceInfo.getCarrier.mockRejectedValue(error)
      await expect(Device.getCarrier()).resolves.toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get carrier info',
        'warning',
        error,
      )
    })
  })

  describe('getFcmToken', () => {
    it('should return the FCM token', async () => {
      mockedGetToken.mockResolvedValue(MOCK_FCM_TOKEN)
      await expect(Device.getFcmToken()).resolves.toBe(MOCK_FCM_TOKEN)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getToken failed')
      mockedGetToken.mockRejectedValue(error)
      await expect(Device.getFcmToken()).resolves.toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get FCM token',
        'warning',
        error,
      )
    })
  })

  describe('getHost', () => {
    it('should return the host', async () => {
      mockedDeviceInfo.getHost.mockResolvedValue(MOCK_HOST)
      await expect(Device.getHost()).resolves.toBe(MOCK_HOST)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getHost failed')
      mockedDeviceInfo.getHost.mockRejectedValue(error)
      await expect(Device.getHost()).resolves.toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get host info',
        'warning',
        error,
      )
    })
  })

  describe('getIpAddress', () => {
    it('should return the IP address', async () => {
      mockedDeviceInfo.getIpAddress.mockResolvedValue(MOCK_IP)
      await expect(Device.getIpAddress()).resolves.toBe(MOCK_IP)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getIpAddress failed')
      mockedDeviceInfo.getIpAddress.mockRejectedValue(error)
      await expect(Device.getIpAddress()).resolves.toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get IP address',
        'warning',
        error,
      )
    })
  })

  describe('getModel', () => {
    it('should return the model', () => {
      mockedDeviceInfo.getModel.mockReturnValue(MOCK_MODEL)
      expect(Device.getModel()).toBe(MOCK_MODEL)
    })

    it('should return "unknown" when model is null or undefined', () => {
      mockedDeviceInfo.getModel.mockReturnValue(null as any)
      expect(Device.getModel()).toBe('unknown')
    })

    it('should return "unknown" on error', () => {
      const error = new Error('getModel failed')
      mockedDeviceInfo.getModel.mockImplementation(() => {
        throw error
      })
      expect(Device.getModel()).toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get device model',
        'warning',
        error,
      )
    })
  })

  describe('getSystemVersion', () => {
    it('should return the system version', () => {
      mockedDeviceInfo.getSystemVersion.mockReturnValue(MOCK_SYSTEM_VERSION)
      expect(Device.getSystemVersion()).toBe(MOCK_SYSTEM_VERSION)
    })

    it('should return "unknown" when system version is null or undefined', () => {
      mockedDeviceInfo.getSystemVersion.mockReturnValue(null as any)
      expect(Device.getSystemVersion()).toBe('unknown')
    })

    it('should return "unknown" on error', () => {
      const error = new Error('getSystemVersion failed')
      mockedDeviceInfo.getSystemVersion.mockImplementation(() => {
        throw error
      })
      expect(Device.getSystemVersion()).toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get system version',
        'warning',
        error,
      )
    })
  })

  describe('getTimezone', () => {
    it('should return timezone from expo-localization', () => {
      mockedGetCalendars.mockReturnValue([{ timeZone: MOCK_TIMEZONE }] as any)
      expect(Device.getTimezone()).toBe(MOCK_TIMEZONE)
    })

    it('should use Intl API as a fallback', () => {
      mockedGetCalendars.mockReturnValue([{ timeZone: null }] as any)
      jest
        .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
        .mockReturnValue({ timeZone: 'America/New_York' } as any)
      expect(Device.getTimezone()).toBe('America/New_York')
    })

    it('should return "unknown" on error', () => {
      const error = new Error('getTimezone failed')
      mockedGetCalendars.mockImplementation(() => {
        throw error
      })
      expect(Device.getTimezone()).toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get timezone',
        'warning',
        error,
      )
    })
  })

  describe('getUniqueId', () => {
    it('should return the unique ID', async () => {
      mockedDeviceInfo.getUniqueId.mockResolvedValue(MOCK_UNIQUE_ID)
      await expect(Device.getUniqueId()).resolves.toBe(MOCK_UNIQUE_ID)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getUniqueId failed')
      mockedDeviceInfo.getUniqueId.mockRejectedValue(error)
      await expect(Device.getUniqueId()).resolves.toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get unique ID',
        'warning',
        error,
      )
    })
  })

  describe('getUserAgent', () => {
    it('should return the user agent', async () => {
      mockedDeviceInfo.getUserAgent.mockResolvedValue(MOCK_USER_AGENT)
      await expect(Device.getUserAgent()).resolves.toBe(MOCK_USER_AGENT)
    })

    it('should return "unknown" on error', async () => {
      const error = new Error('getUserAgent failed')
      mockedDeviceInfo.getUserAgent.mockRejectedValue(error)
      await expect(Device.getUserAgent()).resolves.toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get user agent',
        'warning',
        error,
      )
    })
  })

  describe('getVersion', () => {
    it('should return the version', () => {
      mockedDeviceInfo.getVersion.mockReturnValue(MOCK_VERSION)
      expect(Device.getVersion()).toBe(MOCK_VERSION)
    })

    it('should return "unknown" when version is null or undefined', () => {
      mockedDeviceInfo.getVersion.mockReturnValue(null as any)
      expect(Device.getVersion()).toBe('unknown')
    })

    it('should return "unknown" on error', () => {
      const error = new Error('getVersion failed')
      mockedDeviceInfo.getVersion.mockImplementation(() => {
        throw error
      })
      expect(Device.getVersion()).toBe('unknown')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to get app version',
        'warning',
        error,
      )
    })
  })

  describe('registerDevice', () => {
    beforeEach(() => {
      mockedDeviceInfo.getUniqueId.mockResolvedValue(MOCK_UNIQUE_ID)
      mockedGetToken.mockResolvedValue(MOCK_FCM_TOKEN)
      mockedDeviceInfo.getCarrier.mockResolvedValue(MOCK_CARRIER)
      mockedDeviceInfo.getBuildId.mockResolvedValue(MOCK_BUILD_ID)
      mockedDeviceInfo.getHost.mockResolvedValue(MOCK_HOST)
      mockedDeviceInfo.getIpAddress.mockResolvedValue(MOCK_IP)
      mockedDeviceInfo.getUserAgent.mockResolvedValue(MOCK_USER_AGENT)
      mockedDeviceInfo.getBrand.mockReturnValue(MOCK_BRAND)
      mockedDeviceInfo.getModel.mockReturnValue(MOCK_MODEL)
      mockedDeviceInfo.getSystemVersion.mockReturnValue(MOCK_SYSTEM_VERSION)
      mockedGetCalendars.mockReturnValue([{ timeZone: MOCK_TIMEZONE }] as any)
      Platform.OS = 'android'
    })

    it('should return a complete device parameters object on success', async () => {
      const result = await Device.registerDevice()

      expect(result).toEqual({
        base_os: 'android',
        brand: MOCK_BRAND,
        build_id: MOCK_BUILD_ID,
        carrier: MOCK_CARRIER,
        device_token: MOCK_FCM_TOKEN,
        host: MOCK_HOST,
        ip: MOCK_IP,
        model: MOCK_MODEL,
        system_version: MOCK_SYSTEM_VERSION,
        timezone: MOCK_TIMEZONE,
        unique_id: MOCK_UNIQUE_ID,
        user_agent: MOCK_USER_AGENT,
      })
      expect(mockedLoggerBreadcrumb).not.toHaveBeenCalledWith(
        'Device registration failed',
        'error',
        expect.any(Error),
      )
    })

    it('should return a default object and log an error if a critical promise rejects', async () => {
      const criticalError = new Error('Promise.all failed')
      jest.spyOn(Device, 'getUniqueId').mockRejectedValue(criticalError)

      const result = await Device.registerDevice()

      expect(result).toEqual({
        base_os: 'android',
        brand: 'unknown',
        build_id: 'unknown',
        carrier: 'unknown',
        device_token: null,
        host: 'unknown',
        ip: 'unknown',
        model: 'unknown',
        system_version: 'unknown',
        timezone: null,
        unique_id: 'unknown',
        user_agent: 'unknown',
      })

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Device registration failed',
        'error',
        criticalError,
      )
    })
  })
})
