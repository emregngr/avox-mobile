import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { memo, useCallback, useMemo } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'

interface RatingSelectorProps {
  onRatingChange: (filterKey: string, rating: number) => void
  ratingKey: string
  ratings: number[]
  selectedRating: number
}

export const RatingSelector = memo(
  ({ onRatingChange, ratingKey, ratings, selectedRating }: RatingSelectorProps) => {
    const { selectedTheme } = useThemeStore()

    const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

    const handleRatingPress = useCallback(
      (rating: number) => {
        onRatingChange(ratingKey, rating)
      },
      [onRatingChange, ratingKey],
    )

    const ratingItems = useMemo(
      () =>
        ratings.map(rating => {
          const isSelected = selectedRating === rating

          const containerStyle = cn(
            'flex-row items-center px-3 py-2 rounded-xl overflow-hidden mr-2',
            isSelected ? 'bg-primary-100' : 'bg-background-quaternary',
          )

          const iconColor = isSelected && colors ? colors?.onPrimary100 : colors?.onPrimary70
          const textColor = isSelected && colors ? 'text-100' : 'text-90'

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              className={containerStyle}
              hitSlop={10}
              key={rating}
              onPress={() => handleRatingPress(rating)}
              testID={`rating-button-${rating}`}
            >
              <MaterialCommunityIcons color={iconColor} name="star" size={16} />
              <ThemedText color={textColor} type="body3">
                {` ${rating}`}
              </ThemedText>
            </TouchableOpacity>
          )
        }),
      [ratings, selectedRating, colors, handleRatingPress],
    )

    return (
      <ScrollView showsHorizontalScrollIndicator={false} testID="rating-scrollview" horizontal>
        <View className="flex-row items-center">{ratingItems}</View>
      </ScrollView>
    )
  },
)
