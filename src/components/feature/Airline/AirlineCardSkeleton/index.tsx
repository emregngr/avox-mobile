import React, { memo, useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

export const AirlineCardSkeleton = memo(() => {
  const pulse = useSharedValue<number>(0)

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    'worklet'
    return {
      opacity: interpolate(pulse.value, [0, 1], [0.3, 0.7]),
    }
  }, [])

  return (
    <View className="bg-background-secondary rounded-xl mb-4 w-[48%] border border-background-quaternary shadow shadow-background-quaternary">
      <Animated.View
        className="bg-background-primary rounded-t-xl overflow-hidden w-full justify-center"
        style={[{ height: 130 }, animatedStyle]}
      >
        <Animated.View
          className="h-8 w-12 bg-background-quaternary rounded overflow-hidden self-center"
          style={animatedStyle}
        />
        <Animated.View
          className="absolute bottom-1 left-1 w-10 h-10 bg-background-quaternary rounded overflow-hidden"
          style={animatedStyle}
        />
        <Animated.View
          className="absolute bottom-2 right-2 w-14 h-6 bg-background-quaternary rounded-xl overflow-hidden"
          style={animatedStyle}
        />
        <Animated.View
          className="absolute top-2 left-2 w-12 h-6 bg-background-quaternary rounded-xl overflow-hidden"
          style={animatedStyle}
        />
        <Animated.View
          className="absolute top-2 right-2 w-8 h-8 bg-background-quaternary rounded-full overflow-hidden"
          style={animatedStyle}
        />
      </Animated.View>

      <View className="px-3 py-3">
        <View className="h-56 justify-between">
          <Animated.View
            className="h-6 bg-background-quaternary rounded-xl overflow-hidden"
            style={animatedStyle}
          />
          <Animated.View
            className="h-4 bg-background-quaternary rounded-xl overflow-hidden w-3/4 mt-1"
            style={animatedStyle}
          />

          <View className="bg-background-secondary rounded-xl p-2 shadow shadow-background-quaternary mt-2 border border-background-quaternary">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 items-center">
                <Animated.View
                  className="h-6 w-8 bg-background-quaternary rounded mb-1"
                  style={animatedStyle}
                />
                <Animated.View
                  className="h-3 w-10 bg-background-quaternary rounded overflow-hidden"
                  style={animatedStyle}
                />
              </View>
              <View className="w-[1px] h-6 bg-background-quaternary" />
              <View className="flex-1 items-center">
                <Animated.View
                  className="h-6 w-8 bg-background-quaternary rounded overflow-hidden mb-1"
                  style={animatedStyle}
                />
                <Animated.View
                  className="h-3 w-12 bg-background-quaternary rounded overflow-hidden"
                  style={animatedStyle}
                />
              </View>
            </View>

            <View className="my-3 w-[100px] self-center flex flex-row justify-between">
              <View className="h-[1px] w-8 bg-background-quaternary" />
              <View className="h-[1px] w-8 bg-background-quaternary" />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1 items-center">
                <Animated.View
                  className="h-6 w-8 bg-background-quaternary rounded overflow-hidden mb-1"
                  style={animatedStyle}
                />
                <Animated.View
                  className="h-3 w-12 bg-background-quaternary rounded overflow-hidden"
                  style={animatedStyle}
                />
              </View>
              <View className="w-[1px] h-6 bg-background-quaternary" />
              <View className="flex-1 items-center">
                <Animated.View
                  className="h-6 w-6 bg-background-quaternary rounded overflow-hidden mb-1"
                  style={animatedStyle}
                />
                <Animated.View
                  className="h-3 w-10 bg-background-quaternary rounded overflow-hidden"
                  style={animatedStyle}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="h-20 px-3 mb-3">
        <Animated.View
          className="h-3 w-20 bg-background-quaternary rounded overflow-hidden mb-2"
          style={animatedStyle}
        />
        <Animated.View
          className="bg-background-quaternary px-2 py-1 rounded-xl overflow-hidden mt-2 h-8"
          style={animatedStyle}
        />
      </View>
    </View>
  )
})
