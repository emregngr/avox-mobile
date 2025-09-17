import compareVersions from 'compare-versions'

import Device from '@/utils/common/device'
import { Logger } from '@/utils/common/logger'
import { getStringValue, setFirebaseConfig } from '@/utils/common/remoteConfig'
import { versionControl } from '@/utils/common/versionControl'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/utils/common/device')

const mockedDeviceGetVersion = Device.getVersion as jest.MockedFunction<typeof Device.getVersion>

const mockedCompare = compareVersions.compare as jest.MockedFunction<typeof compareVersions.compare>

jest.mock('@/utils/common/remoteConfig')

const mockedGetStringValue = getStringValue as jest.MockedFunction<typeof getStringValue>
const mockedSetFirebaseConfig = setFirebaseConfig as jest.MockedFunction<typeof setFirebaseConfig>

describe('versionControl', () => {
  it('should return true if current version is older than min support version', async () => {
    mockedDeviceGetVersion.mockReturnValue('1.2.0')
    mockedGetStringValue.mockReturnValue('1.3.0')
    mockedCompare.mockReturnValue(true)

    const isUpdateAvailable = await versionControl()

    expect(isUpdateAvailable).toBe(true)
    expect(mockedSetFirebaseConfig).toHaveBeenCalledTimes(1)
    expect(mockedGetStringValue).toHaveBeenCalledWith('MIN_VERSION_SUPPORT')
    expect(mockedCompare).toHaveBeenCalledWith('1.2.0', '1.3.0', '<')
    expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
  })

  it('should return false if current version is equal to min support version', async () => {
    mockedDeviceGetVersion.mockReturnValue('2.0.0')
    mockedGetStringValue('2.0.0')
    mockedCompare.mockReturnValue(false)

    const isUpdateAvailable = await versionControl()

    expect(isUpdateAvailable).toBe(false)
  })

  it('should return false if current version is newer than min support version', async () => {
    mockedDeviceGetVersion.mockReturnValue('2.1.0')
    mockedGetStringValue('2.0.0')
    mockedCompare.mockReturnValue(false)

    const isUpdateAvailable = await versionControl()

    expect(isUpdateAvailable).toBe(false)
  })

  it('should return false and log info if min support version has an invalid format', async () => {
    mockedDeviceGetVersion.mockReturnValue('1.0.0')
    mockedGetStringValue.mockReturnValue('invalid-version')

    const isUpdateAvailable = await versionControl()

    expect(isUpdateAvailable).toBe(false)
    expect(mockedCompare).not.toHaveBeenCalled()
    expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('Invalid version format', 'info', {
      currentVersion: '1.0.0',
      minSupportVersion: 'invalid-version',
    })
  })

  it('should return false and log info if the current device version has an invalid format', async () => {
    mockedDeviceGetVersion.mockReturnValue('invalid')
    mockedGetStringValue.mockReturnValue('1.0.0')

    const isUpdateAvailable = await versionControl()

    expect(isUpdateAvailable).toBe(false)
    expect(mockedCompare).not.toHaveBeenCalled()
    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('Invalid version format', 'info', {
      currentVersion: 'invalid',
      minSupportVersion: '1.0.0',
    })
  })

  it('should return false and log error if setFirebaseConfig fails', async () => {
    const mockError = new Error('Firebase init failed')
    mockedSetFirebaseConfig.mockRejectedValue(mockError)

    const isUpdateAvailable = await versionControl()

    expect(isUpdateAvailable).toBe(false)
    expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('versionControlError', 'error', mockError)

    expect(mockedGetStringValue).not.toHaveBeenCalled()
  })
})
