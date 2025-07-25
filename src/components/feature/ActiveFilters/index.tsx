import { Ionicons } from '@expo/vector-icons'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { useActiveFilterLabel } from '@/utils/feature/useActiveFilterLabel'

interface ActiveFiltersProps {
  filters: any
  onClearAll: () => void
  onRemove: (key: string) => void
}

export const ActiveFilters = memo(({ filters, onClearAll, onRemove }: ActiveFiltersProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const getActiveFilterLabel = useActiveFilterLabel()

  const scrollViewRef = useRef<ScrollView>(null)

  const getFilterCount = useCallback(() => {
    let count = 0
    if (!filters) return 0
    Object?.entries(filters)?.forEach(([key, value]) => {
      if (Array?.isArray(value)) {
        count += value?.length
      } else if (value !== null && value !== undefined && value !== false) {
        count += 1
      }
    })
    return count
  }, [filters])

  const filterCount = useMemo(() => getFilterCount(), [getFilterCount])

  const filterEntries = useMemo(
    () =>
      Object.entries(filters).filter(
        ([_, value]) => value !== null && value !== undefined && value !== false,
      ),
    [filters],
  )

  const clearText = useMemo(() => getLocale('clear'), [])

  const handleRemove = useCallback(
    (key: string) => {
      const elementIndex = filterEntries.findIndex(([k, _]) => k === key)
      const isInLastThree = elementIndex >= filterEntries?.length - 3

      onRemove(key)

      if (isInLastThree) {
        setTimeout(() => {
          scrollViewRef?.current?.scrollToEnd({ animated: true })
        }, 100)
      }
    },
    [filterEntries, onRemove],
  )

  if (filterCount === 0) return null

  return (
    <View className="mr-12">
      <ScrollView
        contentContainerClassName="flex-row items-center"
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        <View className="flex-row items-center pr-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-error px-3 py-1.5 rounded-full overflow-hidden mr-8 left-6"
            hitSlop={10}
            onPress={onClearAll}
          >
            <ThemedText color="text-100" type="body3">
              {clearText} ({filterCount})
            </ThemedText>
          </TouchableOpacity>

          {filterEntries.map(([key, filterValue]) => (
            <View
              className="bg-secondary-100 px-3 py-1.5 rounded-full overflow-hidden mr-2 flex-row items-center"
              key={key}
            >
              <ThemedText color="text-100" type="body3">
                {getActiveFilterLabel(key, filterValue)}
              </ThemedText>
              <TouchableOpacity
                activeOpacity={0.7}
                className="bg-background-quaternary rounded-full overflow-hidden ml-2"
                hitSlop={10}
                onPress={() => handleRemove(key)}
              >
                <Ionicons color={colors?.onPrimary100} name="close" size={14} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
})
