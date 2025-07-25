import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface RouteRowCardProps {
  destinationIata: string
  frequency: string | number
  iconColor: string
}

export const RouteRowCard = ({ destinationIata, frequency, iconColor }: RouteRowCardProps) => (
  <View className="flex-row justify-between items-center py-2">
    <View className="flex-row items-center">
      <Ionicons color={iconColor} name="airplane" size={20} />
      <ThemedText className="ml-3" color="text-90" type="body2">
        {destinationIata}
      </ThemedText>
    </View>

    <View className="px-2.5 py-1 rounded-xl overflow-hidden bg-background-tertiary">
      <ThemedText color="text-90" type="body3">
        {frequency}
      </ThemedText>
    </View>
  </View>
)
