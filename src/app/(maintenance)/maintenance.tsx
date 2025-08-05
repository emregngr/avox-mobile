import { Image } from 'expo-image'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  icon: {
    borderRadius: 75,
    height: 150,
    width: 150,
  },
}

export default function Maintenance() {
  return (
    <View className="flex-1 justify-center items-center px-4 bg-background-primary">
      <Image
        cachePolicy="memory-disk"
        contentFit="contain"
        source={Icon}
        style={STATIC_STYLES.icon}
        transition={0}
      />

      <ThemedText className="mt-5" color="text-100" type="h1">
        {getLocale('avox')}
      </ThemedText>

      <ThemedText
        className="my-12" color="text-100" type="body1"
        center
      >
        {getLocale('maintenanceText')}
      </ThemedText>
    </View>
  )
}
