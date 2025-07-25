import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import React, { useEffect } from 'react'

import { ENUMS } from '@/enums'
import { setIsAuthenticated } from '@/store/auth'
import { responsive } from '@/utils/common/responsive'

const Icon = require('@/assets/images/icon-ios.png')

export default function TokenExpire() {
  useEffect(() => {
    const goToAuth = async () => {
      await AsyncStorage.removeItem(ENUMS.API_TOKEN)
      setIsAuthenticated(false)
    }
    goToAuth()
  }, [])

  return (
    <Image
      cachePolicy="memory-disk"
      contentFit="contain"
      source={Icon}
      style={{ height: responsive.deviceHeight, width: responsive.deviceWidth }}
      transition={0}
    />
  )
}
