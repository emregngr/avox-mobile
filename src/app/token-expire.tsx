import { useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { useEffect } from 'react'
import { createMMKV } from 'react-native-mmkv'

import { ENUMS } from '@/enums'
import { setIsAuthenticated } from '@/store/auth'
import { responsive } from '@/utils/common/responsive'

const storage = createMMKV()

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  icon: {
    height: responsive.deviceHeight,
    width: responsive.deviceWidth,
  },
}

export default function TokenExpire() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const goToAuth = async () => {
      storage.remove(ENUMS.API_TOKEN)
      setIsAuthenticated(false)
      queryClient.setQueryData(['user'], null)
      queryClient.removeQueries()
    }
    goToAuth()
  }, [])

  return (
    <Image
      cachePolicy="memory-disk"
      contentFit="contain"
      source={Icon}
      style={STATIC_STYLES.icon}
      testID="token-expire-icon"
      transition={0}
    />
  )
}
