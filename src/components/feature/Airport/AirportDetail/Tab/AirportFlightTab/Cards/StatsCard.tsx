import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface StatsCardProps {
  iconColor: string
  iconName: keyof typeof Ionicons.glyphMap
  label: string
  value: number | string
}

export const StatsCard = ({ iconColor, iconName, label, value }: StatsCardProps) => (
  <View className="flex-1 p-4 rounded-xl overflow-hidden items-center bg-background-secondary">
    <Ionicons color={iconColor} name={iconName} size={28} />

    <ThemedText className="my-2" color="text-100" type="h1">
      {value}
    </ThemedText>

    <ThemedText
      color="text-90" lineBreakMode="tail" numberOfLines={2}
      type="body3" center
    >
      {label}
    </ThemedText>
  </View>
)
