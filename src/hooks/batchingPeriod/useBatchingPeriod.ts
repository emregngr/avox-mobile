import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { Logger } from '@/utils/common/logger'

const MEMORY_THRESHOLDS = {
  LOW: 3 * 1024 * 1024 * 1024,
  MEDIUM: 6 * 1024 * 1024 * 1024,
} as const

const BATCHING_PERIODS = {
  FAST: 100,
  MEDIUM: 150,
  SLOW: 200,
} as const

const getBatchingPeriodNumber = async (): Promise<number> => {
  if (Platform.OS === 'ios') {
    return BATCHING_PERIODS.FAST
  }

  try {
    const totalMemory = await DeviceInfo.getTotalMemory()

    if (totalMemory < MEMORY_THRESHOLDS.LOW) {
      return BATCHING_PERIODS.SLOW
    }

    if (totalMemory < MEMORY_THRESHOLDS.MEDIUM) {
      return BATCHING_PERIODS.MEDIUM
    }

    return BATCHING_PERIODS.FAST
  } catch (error) {
    Logger.breadcrumb('getBatchingPeriodError', 'error', error as Error)
    return BATCHING_PERIODS.MEDIUM
  }
}

export const useBatchingPeriod = (): number => {
  const [batchingPeriod, setBatchingPeriod] = useState<number>(BATCHING_PERIODS.MEDIUM)

  useEffect(() => {
    const fetchBatchingPeriod = async () => {
      const period = await getBatchingPeriodNumber()
      setBatchingPeriod(period)
    }

    fetchBatchingPeriod()
  }, [])

  return batchingPeriod
}
