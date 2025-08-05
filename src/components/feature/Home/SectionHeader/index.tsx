import { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'

interface SectionHeaderProps {
  onViewAll?: () => void
  showViewAll?: boolean
  title: string
}

export const SectionHeader = ({ onViewAll, showViewAll = false, title }: SectionHeaderProps) => {
  const handleViewAllPress = useCallback(() => {
    onViewAll?.()
  }, [onViewAll])

  return (
    <View className="flex-row justify-between items-center mb-6 mx-4">
      <View className="flex-1 mr-4">
        <ThemedText
          color="text-100" lineBreakMode="tail" numberOfLines={2}
          type="h2"
        >
          {title}
        </ThemedText>
      </View>
      {showViewAll ? (
        <TouchableOpacity
          activeOpacity={0.7}
          className="px-4 py-2 rounded-full overflow-hidden bg-background-quaternary border border-background-quaternary"
          hitSlop={20}
          onPress={handleViewAllPress}
        >
          <ThemedText color="text-100" type="body2">
            {getLocale('viewAll')}
          </ThemedText>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
