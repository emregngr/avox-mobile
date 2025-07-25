import React, { memo, useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { ThemedText } from '@/components/common/ThemedText'
import { RatingSelector } from '@/components/feature/FilterModal/RatingSelector'

interface RatingSectionProps {
  onRatingChange: (filterKey: string, rating: number) => void
  ratingKey: string
  ratings: number[]
  selectedRating: number
  title: string
}

export const RatingSection = memo(
  ({ onRatingChange, ratingKey, ratings, selectedRating, title }: RatingSectionProps) => {
    const handleRatingChange = useCallback(
      (filterKey: string, rating: number) => {
        onRatingChange(filterKey, rating)
      },
      [onRatingChange],
    )

    const ratingSelectorProps = useMemo(
      () => ({
        onRatingChange: handleRatingChange,
        ratingKey,
        ratings,
        selectedRating,
      }),
      [ratingKey, ratings, selectedRating, handleRatingChange],
    )

    return (
      <View className="mb-6">
        <ThemedText className="mb-3" color="text-100" type="h3">
          {title}
        </ThemedText>
        <RatingSelector {...ratingSelectorProps} />
      </View>
    )
  },
)
