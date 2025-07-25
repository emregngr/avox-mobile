import type { ReactNode } from 'react'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'

interface AirlineSectionRowProps {
  children: ReactNode
  title: string
}

export const AirlineSectionRow = ({ children, title }: AirlineSectionRowProps) => {
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
