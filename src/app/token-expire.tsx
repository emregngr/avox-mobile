import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import React, { useEffect } from 'react'

import { ENUMS } from '@/enums'
import { setIsAuthenticated } from '@/store/auth'
import { responsive } from '@/utils/common/responsive'

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
      await AsyncStorage.removeItem(ENUMS.API_TOKEN)
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
      transition={0}
    />
  )
}
