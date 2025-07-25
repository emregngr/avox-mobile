import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { cn } from '@/utils/common/cn'

interface SafetyHeaderProps {
  className?: string
  iconColor: string
  iconName: keyof typeof Ionicons.glyphMap
  title: string
}

export const SafetyHeader = ({
  className = 'mb-4',
  iconColor,
  iconName,
  title,
}: SafetyHeaderProps) => (
  <View className={cn('flex-row items-center', className)}>
    <Ionicons color={iconColor} name={iconName} size={20} />

    <ThemedText className="ml-2.5" color="text-90" type="h4">
      {title}
    </ThemedText>
  </View>
)
