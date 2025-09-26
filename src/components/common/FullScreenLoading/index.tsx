import LottieView from 'lottie-react-native'
import React from 'react'
import { View } from 'react-native'

export const FullScreenLoading = () => (
  <View
    className="flex-1 items-center justify-center bg-background-primary"
    testID="full-screen-loading"
  >
    <LottieView
      source={require('@/assets/lottie/plane.json')}
      style={{ height: 500, width: 500 }}
      testID="loading-lottie"
      autoPlay
      loop
    />
  </View>
)
