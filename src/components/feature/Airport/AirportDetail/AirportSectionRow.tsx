import type { ReactNode } from 'react'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface AirportSectionRowProps {
  children: ReactNode
  title: string
}

export const AirportSectionRow = ({ children, title }: AirportSectionRowProps) => {
  const memoizedChildren = useMemo(() => children, [children])

  return (
    <View className="p-4 rounded-xl overflow-hidden bg-background-secondary">
      <ThemedText className="mb-4" color="text-100" type="h3">
        {title}
      </ThemedText>
      {memoizedChildren}
    </View>
  )
}
