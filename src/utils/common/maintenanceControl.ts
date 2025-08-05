import { Logger } from '@/utils/common/logger'
import type { defaultConfigs } from '@/utils/common/remoteConfig'
import { getBooleanValue, setFirebaseConfig } from '@/utils/common/remoteConfig'

type ConfigKey = keyof typeof defaultConfigs

const getRemoteMaintenance = (): boolean => getBooleanValue('IS_MAINTENANCE' as ConfigKey) ?? false

export const maintenanceControl = async (): Promise<boolean> => {
  try {
    await setFirebaseConfig()
    return getRemoteMaintenance()
  } catch (error) {
    Logger.breadcrumb('maintenanceControlError', 'error', error as Error)
    return false
  }
}
