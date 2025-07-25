import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface AirlineRowCardProps {
  airline: string
  iconColor: string
}

export const AirlineRowCard = ({ airline, iconColor }: AirlineRowCardProps) => (
  <View className="flex-row items-center py-2">
    <Ionicons color={iconColor} name="airplane" size={20} />

    <ThemedText className="ml-3" color="text-90" type="body2">
      {airline}
    </ThemedText>
  </View>
  )
