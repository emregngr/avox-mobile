import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common'

interface EmptyStateProps {
  text: string
}

export const EmptyState = ({ text }: EmptyStateProps) => (
  <View className="flex-1 items-center justify-center px-4 min-h-full">
    <ThemedText color="text-100" type="h1">
      {text}
    </ThemedText>
  </View>
)
