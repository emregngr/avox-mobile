import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface RouteRowCardProps {
  destinationIata: string
  iconColor: string
  origin: string
}

export const RouteRowCard = ({ destinationIata, iconColor, origin }: RouteRowCardProps) => (
  <View className="flex-row items-center py-3">
    <View className="flex-row items-center px-3 py-2 rounded-full overflow-hidden bg-background-tertiary">
      <ThemedText className="mr-1.5" color="text-90" type="body1">
        {origin}
      </ThemedText>
      <Ionicons color={iconColor} name="location" size={16} />
    </View>

    <View className="flex-1 mx-2.5 relative">
      <Ionicons
        className="absolute top-[-10] self-center"
        color={iconColor}
        name="airplane"
        size={20}
      />
    </View>

    <View className="flex-row items-center px-3 py-2 rounded-full overflow-hidden bg-background-tertiary">
      <Ionicons color={iconColor} name="location" size={16} />
      <ThemedText className="ml-1.5" color="text-90" type="body1">
        {destinationIata}
      </ThemedText>
    </View>
  </View>
)
