import React, { memo, useCallback, useMemo } from 'react'
import { TouchableOpacity } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { cn } from '@/utils/common/cn'

interface FilterChipProps {
  label: string
  onPress: () => void
  selected: boolean
}

export const FilterChip = memo(({ label, onPress, selected }: FilterChipProps) => {
  const handlePress = useCallback(() => {
    onPress()
  }, [onPress])

  const containerStyle = useMemo(
    () =>
      cn(
        'px-4 py-2 rounded-full overflow-hidden mr-2 mb-2',
        selected ? 'bg-primary-100' : 'bg-background-quaternary',
      ),
    [selected],
  )

  const textColor = useMemo(() => (selected ? 'text-100' : 'text-90'), [selected])

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={containerStyle}
      hitSlop={10}
      onPress={handlePress}
    >
      <ThemedText color={textColor} type="body2">
        {label}
      </ThemedText>
    </TouchableOpacity>
  )
})
