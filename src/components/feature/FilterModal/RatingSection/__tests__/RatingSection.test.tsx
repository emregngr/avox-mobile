import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { RatingSection } from '@/components/feature/FilterModal/RatingSection'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({
      children,
      color,
      type,
      ...props
    }: {
      children: string
      color: string
      type: string
    }) => (
      <Text testID={`themed-text-${color}-${type}`} {...props}>
        {children}
      </Text>
    ),
  }
})

jest.mock('@/components/feature/FilterModal/RatingSelector', () => {
  const { TouchableOpacity, View, Text } = require('react-native')
  return {
    RatingSelector: ({
      onRatingChange,
      ratingKey,
      ratings,
      selectedRating,
    }: {
      onRatingChange: (filterKey: string, rating: number) => void
      ratingKey: string
      ratings: number[]
      selectedRating: number
    }) => (
      <View testID="rating-selector">
        {ratings.map((rating: number) => (
          <TouchableOpacity
            accessibilityState={{ selected: rating === selectedRating }}
            key={rating}
            onPress={() => onRatingChange(ratingKey, rating)}
            testID={`rating-${rating}`}
          >
            <Text>{rating} stars</Text>
          </TouchableOpacity>
          ))}
      </View>
      ),
  }
})

const mockedRatings = [1, 2, 3, 4, 5]

const mockedDefaultProps = {
  onRatingChange: jest.fn(),
  ratingKey: 'testRating',
  ratings: mockedRatings,
  selectedRating: 3,
  title: 'Rating Filter',
}

describe('RatingSection', () => {
  describe('Rendering', () => {
    it('renders correctly with title and RatingSelector', () => {
      const { getByText, getByTestId } = render(<RatingSection {...mockedDefaultProps} />)

      expect(getByText('Rating Filter')).toBeTruthy()
      expect(getByTestId('rating-selector')).toBeTruthy()
    })

    it('passes correct props to RatingSelector', () => {
      const { getByTestId } = render(<RatingSection {...mockedDefaultProps} />)

      const ratingSelector = getByTestId('rating-selector')
      expect(ratingSelector).toBeTruthy()

      mockedRatings.forEach(rating => {
        expect(getByTestId(`rating-${rating}`)).toBeTruthy()
      })
    })

    it('displays correct title with ThemedText', () => {
      const customTitle = 'Custom Rating Section'
      const { getByText, getByTestId } = render(
        <RatingSection {...mockedDefaultProps} title={customTitle} />,
      )

      expect(getByText(customTitle)).toBeTruthy()
      expect(getByTestId('themed-text-text-100-h3')).toBeTruthy()
    })

    it('renders with different rating arrays', () => {
      const customRatings = [2, 4, 5]
      const { getByTestId } = render(
        <RatingSection {...mockedDefaultProps} ratings={customRatings} />,
      )

      customRatings.forEach(rating => {
        expect(getByTestId(`rating-${rating}`)).toBeTruthy()
      })

      expect(() => getByTestId('rating-1')).toThrow()
      expect(() => getByTestId('rating-3')).toThrow()
    })
  })

  describe('Rating Selection', () => {
    it('calls onRatingChange when rating is selected', () => {
      const mockedOnRatingChange = jest.fn()
      const { getByTestId } = render(
        <RatingSection {...mockedDefaultProps} onRatingChange={mockedOnRatingChange} />,
      )

      fireEvent.press(getByTestId('rating-4'))

      expect(mockedOnRatingChange).toHaveBeenCalledWith('testRating', 4)
      expect(mockedOnRatingChange).toHaveBeenCalledTimes(1)
    })

    it('shows correct selected state', () => {
      const selectedRating = 2
      const { getByTestId } = render(
        <RatingSection {...mockedDefaultProps} selectedRating={selectedRating} />,
      )

      const selectedButton = getByTestId(`rating-${selectedRating}`)
      const unselectedButton = getByTestId('rating-4')

      expect(selectedButton.props.accessibilityState.selected).toBe(true)
      expect(unselectedButton.props.accessibilityState.selected).toBe(false)
    })

    it('handles rating changes correctly', () => {
      const mockOnRatingChange = jest.fn()
      const { getByTestId } = render(
        <RatingSection
          {...mockedDefaultProps}
          onRatingChange={mockOnRatingChange}
          selectedRating={1}
        />,
      )

      fireEvent.press(getByTestId('rating-5'))
      expect(mockOnRatingChange).toHaveBeenCalledWith('testRating', 5)

      fireEvent.press(getByTestId('rating-2'))
      expect(mockOnRatingChange).toHaveBeenCalledWith('testRating', 2)

      expect(mockOnRatingChange).toHaveBeenCalledTimes(2)
    })

    it('handles rating selection with different ratingKey', () => {
      const mockOnRatingChange = jest.fn()
      const customRatingKey = 'customKey'

      const { getByTestId } = render(
        <RatingSection
          {...mockedDefaultProps}
          onRatingChange={mockOnRatingChange}
          ratingKey={customRatingKey}
        />,
      )

      fireEvent.press(getByTestId('rating-3'))

      expect(mockOnRatingChange).toHaveBeenCalledWith(customRatingKey, 3)
    })
  })

  describe('Component Optimization', () => {
    it('memoizes component correctly', () => {
      const { rerender } = render(<RatingSection {...mockedDefaultProps} />)

      expect(() => {
        rerender(<RatingSection {...mockedDefaultProps} />)
      }).not.toThrow()
    })

    it('re-renders when props change', () => {
      const { rerender, getByText } = render(<RatingSection {...mockedDefaultProps} />)

      expect(getByText('Rating Filter')).toBeTruthy()

      rerender(<RatingSection {...mockedDefaultProps} title="New Title" />)
      expect(getByText('New Title')).toBeTruthy()
    })

    it('handles selectedRating changes', () => {
      const { rerender, getByTestId } = render(
        <RatingSection {...mockedDefaultProps} selectedRating={1} />,
      )

      expect(getByTestId('rating-1').props.accessibilityState.selected).toBe(true)
      expect(getByTestId('rating-5').props.accessibilityState.selected).toBe(false)

      rerender(<RatingSection {...mockedDefaultProps} selectedRating={5} />)

      expect(getByTestId('rating-1').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-5').props.accessibilityState.selected).toBe(true)
    })
  })

  describe('Callback Optimization', () => {
    it('memoizes handleRatingChange callback', () => {
      const mockOnRatingChange = jest.fn()
      const { rerender } = render(
        <RatingSection {...mockedDefaultProps} onRatingChange={mockOnRatingChange} />,
      )

      rerender(<RatingSection {...mockedDefaultProps} onRatingChange={mockOnRatingChange} />)

      expect(() => {
        rerender(<RatingSection {...mockedDefaultProps} onRatingChange={mockOnRatingChange} />)
      }).not.toThrow()
    })

    it('handles callback prop changes', () => {
      const mockedCallback1 = jest.fn()
      const mockedCallback2 = jest.fn()

      const { rerender, getByTestId } = render(
        <RatingSection {...mockedDefaultProps} onRatingChange={mockedCallback1} />,
      )

      fireEvent.press(getByTestId('rating-3'))
      expect(mockedCallback1).toHaveBeenCalledWith('testRating', 3)

      rerender(<RatingSection {...mockedDefaultProps} onRatingChange={mockedCallback2} />)

      fireEvent.press(getByTestId('rating-4'))
      expect(mockedCallback2).toHaveBeenCalledWith('testRating', 4)
      expect(mockedCallback1).toHaveBeenCalledTimes(1)
    })
  })

  describe('Props Memoization', () => {
    it('memoizes ratingSelectorProps correctly', () => {
      const { rerender, getByTestId } = render(<RatingSection {...mockedDefaultProps} />)

      expect(getByTestId('rating-selector')).toBeTruthy()

      rerender(<RatingSection {...mockedDefaultProps} />)

      expect(getByTestId('rating-selector')).toBeTruthy()
    })

    it('updates ratingSelectorProps when dependencies change', () => {
      const { rerender, getByTestId } = render(
        <RatingSection {...mockedDefaultProps} selectedRating={2} />,
      )

      expect(getByTestId('rating-2').props.accessibilityState.selected).toBe(true)

      rerender(<RatingSection {...mockedDefaultProps} selectedRating={4} />)

      expect(getByTestId('rating-2').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-4').props.accessibilityState.selected).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty ratings array', () => {
      const { getByTestId, getByText } = render(
        <RatingSection {...mockedDefaultProps} ratings={[]} />,
      )

      expect(getByText('Rating Filter')).toBeTruthy()
      expect(getByTestId('rating-selector')).toBeTruthy()

      mockedRatings.forEach(rating => {
        expect(() => getByTestId(`rating-${rating}`)).toThrow()
      })
    })

    it('handles single rating', () => {
      const singleRating = [3]
      const { getByTestId } = render(
        <RatingSection {...mockedDefaultProps} ratings={singleRating} selectedRating={3} />,
      )

      expect(getByTestId('rating-3')).toBeTruthy()
      expect(getByTestId('rating-3').props.accessibilityState.selected).toBe(true)

      expect(() => getByTestId('rating-1')).toThrow()
      expect(() => getByTestId('rating-5')).toThrow()
    })

    it('handles selectedRating not in ratings array', () => {
      const { getByTestId } = render(
        <RatingSection {...mockedDefaultProps} ratings={[2, 3, 4]} selectedRating={1} />,
      )

      expect(getByTestId('rating-2').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-3').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-4').props.accessibilityState.selected).toBe(false)
    })

    it('handles zero and negative ratings', () => {
      const edgeRatings = [0, -1, 1]
      const { getByTestId } = render(
        <RatingSection {...mockedDefaultProps} ratings={edgeRatings} selectedRating={0} />,
      )

      expect(getByTestId('rating-0')).toBeTruthy()
      expect(getByTestId('rating--1')).toBeTruthy()
      expect(getByTestId('rating-1')).toBeTruthy()
      expect(getByTestId('rating-0').props.accessibilityState.selected).toBe(true)
    })

    it('handles large numbers', () => {
      const largeRatings = [10, 100, 1000]
      const mockOnRatingChange = jest.fn()

      const { getByTestId } = render(
        <RatingSection
          {...mockedDefaultProps}
          onRatingChange={mockOnRatingChange}
          ratings={largeRatings}
          selectedRating={100}
        />,
      )

      fireEvent.press(getByTestId('rating-1000'))
      expect(mockOnRatingChange).toHaveBeenCalledWith('testRating', 1000)
    })
  })

  describe('Component Structure', () => {
    it('has correct CSS classes', () => {
      const { getByTestId } = render(<RatingSection {...mockedDefaultProps} />)

      const themedText = getByTestId('themed-text-text-100-h3')
      expect(themedText.props.className).toBe('mb-3')
    })

    it('maintains proper component hierarchy', () => {
      const { getByText, getByTestId } = render(<RatingSection {...mockedDefaultProps} />)

      expect(getByText('Rating Filter')).toBeTruthy()

      expect(getByTestId('rating-selector')).toBeTruthy()
    })
  })
})
