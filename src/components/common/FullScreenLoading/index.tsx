import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export const FullScreenLoading = () => (
  <View
    className="flex-1 items-center justify-center bg-background-primary"
    testID="full-screen-loading"
  >
    <ActivityIndicator className="color-text-100" size="large" testID="loading-indicator" />
  </View>
)
