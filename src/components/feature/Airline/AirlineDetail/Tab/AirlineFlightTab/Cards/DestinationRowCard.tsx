import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface DestinationRowCardProps {
  destination: string
  iconColor: string
}

export const DestinationRowCard = ({ destination, iconColor }: DestinationRowCardProps) => (
  <View className="flex-row items-center px-3 py-2 rounded-full overflow-hidden mr-2 mb-2 border border-background-quaternary bg-background-tertiary">
    <MaterialCommunityIcons color={iconColor} name="airplane" size={20} />

    <ThemedText className="ml-1.5" color="text-90" type="body2">
      {destination}
    </ThemedText>
  </View>
)
