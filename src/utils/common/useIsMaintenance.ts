import { Logger } from '@/utils/common/logger'
import remoteConfig from '@/utils/common/remoteConfig'

type ConfigKey = keyof typeof remoteConfig.defaultConfigs

const getRemoteMaintenance = (): boolean =>
  remoteConfig.getBooleanValue('IS_MAINTENANCE' as ConfigKey) ?? false

export const maintenanceControl = async (): Promise<boolean> => {
  try {
    await remoteConfig.setFirebaseConfig()
    return getRemoteMaintenance()
  } catch (error: any) {
    Logger.breadcrumb('[maintenanceControl] error', 'error', error)
    return false
  }
}
