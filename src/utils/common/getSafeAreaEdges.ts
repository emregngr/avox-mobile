import DeviceInfo from 'react-native-device-info'

export const getSafeAreaEdges = (): ('top' | 'left' | 'right')[] => {
  const model = DeviceInfo.getModel().toLowerCase()
  const isIPad = model.includes('ipad')

  if (isIPad) {
    return ['left', 'right']
  }

  return ['top', 'left', 'right']
}
