import { renderHook, waitFor } from '@testing-library/react-native'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { useBatchingPeriod } from '@/hooks/batchingPeriod/useBatchingPeriod'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

const BATCHING_PERIODS = {
  FAST: 100,
  MEDIUM: 150,
  SLOW: 200,
} as const

const mockedGetTotalMemory = DeviceInfo.getTotalMemory as jest.MockedFunction<
  typeof DeviceInfo.getTotalMemory
>

beforeEach(() => {
  Platform.OS = 'android'
})

describe('useBatchingPeriod', () => {
  it('should return the initial batching period (MEDIUM) before async logic resolves', () => {
    const { result } = renderHook(() => useBatchingPeriod())
    expect(result.current).toBe(BATCHING_PERIODS.MEDIUM)
  })

  it('should return FAST period for iOS devices', async () => {
    Platform.OS = 'ios'
    const { result } = renderHook(() => useBatchingPeriod())

    await waitFor(() => expect(result.current).toBe(BATCHING_PERIODS.FAST))

    expect(mockedGetTotalMemory).not.toHaveBeenCalled()
  })

  it('should return SLOW period for Android devices with low memory', async () => {
    mockedGetTotalMemory.mockResolvedValue(2 * 1024 * 1024 * 1024)

    const { result } = renderHook(() => useBatchingPeriod())

    await waitFor(() => expect(result.current).toBe(BATCHING_PERIODS.SLOW))
    expect(mockedGetTotalMemory).toHaveBeenCalledTimes(1)
  })

  it('should return MEDIUM period for Android devices with medium memory', async () => {
    mockedGetTotalMemory.mockResolvedValue(4 * 1024 * 1024 * 1024)

    const { result } = renderHook(() => useBatchingPeriod())

    await waitFor(() => expect(result.current).toBe(BATCHING_PERIODS.MEDIUM))
    expect(mockedGetTotalMemory).toHaveBeenCalledTimes(1)
  })

  it('should return FAST period for Android devices with high memory', async () => {
    mockedGetTotalMemory.mockResolvedValue(8 * 1024 * 1024 * 1024)

    const { result } = renderHook(() => useBatchingPeriod())

    await waitFor(() => expect(result.current).toBe(BATCHING_PERIODS.FAST))
    expect(mockedGetTotalMemory).toHaveBeenCalledTimes(1)
  })

  it('should return MEDIUM period and log an error if memory check fails', async () => {
    const mockedError = new Error('Failed to get total memory')
    mockedGetTotalMemory.mockRejectedValue(mockedError)

    const { result } = renderHook(() => useBatchingPeriod())

    await waitFor(() => expect(result.current).toBe(BATCHING_PERIODS.MEDIUM))

    expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
      'getBatchingPeriodError',
      'error',
      mockedError,
    )
    expect(mockedGetTotalMemory).toHaveBeenCalledTimes(1)
  })
})
