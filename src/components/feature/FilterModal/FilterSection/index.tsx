import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { FilterChip } from '@/components/feature/FilterModal/FilterChip'
import type { FilterOption, RangeFilterOption } from '@/types/feature/filter'

interface FilterSectionProps {
  filterKey: string
  handlerType: 'multi' | 'single'
  localFilters: any
  onMultiSelectToggle?: (filterKey: string, value: string) => void
  onSingleSelectToggle?: (filterKey: string, value: string | null) => void
  options: (FilterOption | RangeFilterOption)[]
  title: string
}

export const FilterSection = ({
  filterKey,
  handlerType,
  localFilters,
  onMultiSelectToggle,
  onSingleSelectToggle,
  options,
  title,
}: FilterSectionProps) => {
  const filteredOptions = useMemo(() => {
    if (!options || options.length === 0) return []
    return options
  }, [options])

  const handlePress = useCallback(
    (option: FilterOption | RangeFilterOption) => {
      if (handlerType === 'multi') onMultiSelectToggle?.(filterKey, option?.value?.toString())
      else if (handlerType === 'single')
        onSingleSelectToggle?.(filterKey, option?.value?.toString())
    },
    [handlerType, filterKey, onMultiSelectToggle, onSingleSelectToggle],
  )

  if (!options || options?.length === 0) return null

  return (
    <View className="mb-6">
      <ThemedText className="mb-3" color="text-100" type="h3">
        {title}
      </ThemedText>
      <View className="flex-row flex-wrap">
        {filteredOptions?.map(option => (
          <FilterChip
            selected={
              handlerType === 'multi'
                ? (localFilters?.[filterKey] || []).includes?.(option?.value)
                : localFilters?.[filterKey] === option?.value
            }
            key={option?.value?.toString()}
            label={option?.label}
            onPress={() => handlePress(option)}
          />
        ))}
      </View>
    </View>
  )
}
