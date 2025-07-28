import {
  fetchAndActivate,
  getAll,
  getRemoteConfig,
  getValue,
  setConfigSettings,
  setDefaults,
} from '@react-native-firebase/remote-config'

import { Logger } from '@/utils/common/logger'

const defaultConfigs: Readonly<Record<string, string | boolean>> = {
  IS_MAINTENANCE: false,
  MIN_VERSION_SUPPORT: '1.0.0',
}

type ConfigKey = keyof typeof defaultConfigs

const remoteConfig = getRemoteConfig()

const setFirebaseConfig = async (): Promise<boolean> => {
  try {
    await setDefaults(remoteConfig, defaultConfigs)
    await setConfigSettings(remoteConfig, {
      minimumFetchIntervalMillis: __DEV__ ? 300 : 3600000,
    })

    const activated = await fetchAndActivate(remoteConfig)

    const log = {
      activated,
      all: getAll(remoteConfig),
      default: defaultConfigs,
    }

    Logger.breadcrumb('REMOTE CONFIG', 'info', log)
    return activated
  } catch (error: any) {
    Logger.breadcrumb('[setFirebaseConfig] error', 'error', error)
    return false
  }
}

const getBooleanValue = (key: ConfigKey): boolean => {
  const remoteValue = getValue(remoteConfig, key)

  if (remoteValue && remoteValue.getSource() !== 'default') {
    return remoteValue.asBoolean()
  }

  return defaultConfigs[key] as boolean
}

const getStringValue = (key: ConfigKey): string => {
  const remoteValue = getValue(remoteConfig, key)

  if (remoteValue && remoteValue.getSource() !== 'default') {
    return remoteValue.asString()
  }

  return defaultConfigs[key] as string
}

export default {
  defaultConfigs,
  getBooleanValue,
  getStringValue,
  setFirebaseConfig,
}
