import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const getSafeAreaEdges = (): ('top' | 'left' | 'right')[] => {
  const isIos = Platform.OS === 'ios'
  const model = DeviceInfo.getModel().toLowerCase()
  const isIPad = model.includes('ipad')

  if (isIos && isIPad) {
    return ['left', 'right']
  }

  return ['top', 'left', 'right']
}
