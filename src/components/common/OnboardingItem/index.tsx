import { Image } from 'expo-image'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import type { OnBoardingType } from '@/types/common/onBoarding'

interface OnboardingItemProps {
  item: OnBoardingType
}

const STATIC_STYLES = {
  image: {
    height: '45%' as const,
    marginVertical: 20,
    width: '100%' as const,
  },
}

export const OnboardingItem = ({ item }: OnboardingItemProps) => {
  const { image, text, title } = item
  return (
    <View className="w-screen h-screen bg-background-primary">
      <Image
        cachePolicy="memory-disk"
        contentFit="contain"
        source={image}
        style={STATIC_STYLES.image}
        transition={0}
      />
      <View className="mx-4 z-10">
        <ThemedText
          className="mb-4"
          color="text-100"
          lineBreakMode="tail"
          numberOfLines={2}
          type="h1"
        >
          {title}
        </ThemedText>
        <ThemedText
          color="text-100" lineBreakMode="tail" numberOfLines={4}
          type="h3"
        >
          {text}
        </ThemedText>
      </View>
    </View>
  )
}
