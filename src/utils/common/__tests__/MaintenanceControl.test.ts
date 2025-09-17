import { Logger } from '@/utils/common/logger'
import { maintenanceControl } from '@/utils/common/maintenanceControl'
import { getBooleanValue, setFirebaseConfig } from '@/utils/common/remoteConfig'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/utils/common/remoteConfig')

const mockedSetFirebaseConfig = setFirebaseConfig as jest.MockedFunction<typeof setFirebaseConfig>
const mockedGetBooleanValue = getBooleanValue as jest.MockedFunction<typeof getBooleanValue>

describe('maintenanceControl', () => {
  it('should return true when maintenance mode is enabled remotely', async () => {
    mockedSetFirebaseConfig.mockResolvedValue(true)
    mockedGetBooleanValue.mockReturnValue(true)

    const result = await maintenanceControl()

    expect(setFirebaseConfig).toHaveBeenCalledTimes(1)
    expect(getBooleanValue).toHaveBeenCalledWith('IS_MAINTENANCE')
    expect(result).toBe(true)
    expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
  })

  it('should return false when maintenance mode is disabled remotely', async () => {
    mockedSetFirebaseConfig.mockResolvedValue(true)
    mockedGetBooleanValue.mockReturnValue(false)

    const result = await maintenanceControl()

    expect(setFirebaseConfig).toHaveBeenCalledTimes(1)
    expect(getBooleanValue).toHaveBeenCalledWith('IS_MAINTENANCE')
    expect(result).toBe(false)
    expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
  })

  it('should return false and log an error if fetching the config fails', async () => {
    const configError = new Error('Failed to connect to Firebase')
    mockedSetFirebaseConfig.mockRejectedValue(configError)
    const result = await maintenanceControl()

    expect(setFirebaseConfig).toHaveBeenCalledTimes(1)
    expect(result).toBe(false)
    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
      'maintenanceControlError',
      'error',
      configError,
    )
    expect(getBooleanValue).not.toHaveBeenCalled()
  })
})
