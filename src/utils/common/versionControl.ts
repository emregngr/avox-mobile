import compareVersions from 'compare-versions'

import Device from '@/utils/common/device'
import { Logger } from '@/utils/common/logger'
import { getStringValue, setFirebaseConfig } from '@/utils/common/remoteConfig'

const isValidVersion = (version: string): boolean => /^\d+\.\d+\.\d+$/.test(version)

const getRemoteVersion = (): string => getStringValue('MIN_VERSION_SUPPORT') ?? '0.0.0'

export const versionControl = async (): Promise<boolean> => {
  try {
    await setFirebaseConfig()
    const minSupportVersion = getRemoteVersion()
    const currentVersion = Device.getVersion()

    if (!isValidVersion(minSupportVersion) || !isValidVersion(currentVersion)) {
      Logger.breadcrumb('Invalid version format', 'info', {
        currentVersion,
        minSupportVersion,
      })
      return false
    }

    const isUpdateAvailable = compareVersions.compare(currentVersion, minSupportVersion, '<')
    return isUpdateAvailable
  } catch (error) {
    Logger.breadcrumb('versionControlError', 'error', error as Error)
    return false
  }
}
