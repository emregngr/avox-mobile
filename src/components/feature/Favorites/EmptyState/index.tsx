import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface EmptyStateProps {
  text: string
}

export const EmptyState = ({ text }: EmptyStateProps) => (
  <View className="flex-1 items-center justify-center px-4 min-h-full">
    <ThemedText color="text-100" type="h1" center>
      {text}
    </ThemedText>
  </View>
)
