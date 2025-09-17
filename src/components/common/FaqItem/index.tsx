import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Collapsible from 'react-native-collapsible'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import type { FaqItemType } from '@/types/common/faq'

interface FaqItemProps {
  index: number
  isExpanded: boolean
  item: FaqItemType
  toggleExpanded: (index: number) => void
}

export const FaqItem = ({ index, isExpanded, item, toggleExpanded }: FaqItemProps) => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const { description, title } = item
  return (
    <View className="mb-2">
      <TouchableOpacity
        activeOpacity={0.7}
        className="p-4 rounded-xl overflow-hidden bg-background-secondary"
        hitSlop={10}
        onPress={() => toggleExpanded(index)}
        testID={`faq-${item?.id}`}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <ThemedText color="text-100" type="body1">
              {title}
            </ThemedText>
          </View>
          <MaterialCommunityIcons
            color={colors?.onPrimary50}
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
          />
        </View>
      </TouchableOpacity>

      <Collapsible collapsed={!isExpanded}>
        <View className="mt-2 p-4 rounded-xl overflow-hidden bg-background-tertiary">
          <ThemedText color="text-90" type="body2">
            {description}
          </ThemedText>
        </View>
      </Collapsible>
    </View>
  )
}
