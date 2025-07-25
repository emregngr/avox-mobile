import React, { memo, useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import type { TotalAirplane } from '@/types/feature/home'

interface AirplaneCardProps {
  airplane: TotalAirplane
}

export const AirplaneCard = memo(({ airplane }: AirplaneCardProps) => {
  const { count, model } = airplane

  const modelTextProps = useMemo(
    () => ({
      children: model,
      color: 'text-90' as const,
      type: 'h4' as const,
    }),
    [model],
  )

  const countTextProps = useMemo(
    () => ({
      children: count,
      color: 'text-100' as const,
      type: 'h2' as const,
    }),
    [count],
  )

  const cardStyles = useMemo(
    () =>
      'bg-background-primary rounded-xl border border-background-quaternary shadow shadow-background-quaternary flex-row items-center justify-between mb-4 p-4',
    [],
  )

  return (
    <View className={cardStyles}>
      <ThemedText {...modelTextProps} />
      <ThemedText {...countTextProps} />
    </View>
  )
})

AirplaneCard.displayName = 'AirplaneCard'
