import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import React, { useCallback } from 'react'
import { Platform, View } from 'react-native'

import { ThemedGradientButton, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'

const Icon = require('@/assets/images/icon-ios.png')

const STATIC_STYLES = {
  icon: {
    borderRadius: 75,
    height: 150,
    width: 150,
  },
}

export default function ForceUpdate() {
  const handlePress = useCallback(async () => {
    const iosURL = 'https://apps.apple.com/ca/app/avox/6747673276'
    const androidURL = 'https://play.google.com/store/apps/details?id=com.avox'
    await Linking.openURL(Platform.OS === 'ios' ? iosURL : androidURL)
  }, [])

  return (
    <View
      className={'flex-1 justify-center items-center px-4 bg-background-primary'}
      testID="forceUpdate-screen"
    >
      <Image
        cachePolicy="memory-disk"
        contentFit="contain"
        source={Icon}
        style={STATIC_STYLES.icon}
        testID="forceUpdate-icon"
        transition={0}
      />

      <ThemedText
        className="mt-5" color="text-100" testID="app-title"
        type="h1" center
      >
        {getLocale('avox')}
      </ThemedText>

      <ThemedText
        className="my-12" color="text-100" testID="forceUpdate-text"
        type="body1" center
      >
        {getLocale('forceUpdateText')}
      </ThemedText>

      <View className="w-1/2">
        <ThemedGradientButton
          label={getLocale('forceUpdateButton')}
          onPress={handlePress}
          testID="forceUpdate-button"
          type="secondary"
        />
      </View>
    </View>
  )
}
