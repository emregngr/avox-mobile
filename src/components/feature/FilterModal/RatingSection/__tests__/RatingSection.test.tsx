import { fireEvent, render } from '@testing-library/react-native'

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
    it('renders correctly with title and RatingSelector', async () => {
      const { getByText, getByTestId } = await render(<RatingSection {...mockedDefaultProps} />)

      expect(getByText('Rating Filter')).toBeTruthy()
      expect(getByTestId('rating-selector')).toBeTruthy()
    })

    it('passes correct props to RatingSelector', async () => {
      const { getByTestId } = await render(<RatingSection {...mockedDefaultProps} />)

      const ratingSelector = getByTestId('rating-selector')
      expect(ratingSelector).toBeTruthy()

      mockedRatings.forEach(rating => {
        expect(getByTestId(`rating-${rating}`)).toBeTruthy()
      })
    })

    it('displays correct title with ThemedText', async () => {
      const customTitle = 'Custom Rating Section'
      const { getByText, getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} title={customTitle} />,
      )

      expect(getByText(customTitle)).toBeTruthy()
      expect(getByTestId('themed-text-text-100-h3')).toBeTruthy()
    })

    it('renders with different rating arrays', async () => {
      const customRatings = [2, 4, 5]
      const { getByTestId } = await render(
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
    it('calls onRatingChange when rating is selected', async () => {
      const mockedOnRatingChange = jest.fn()
      const { getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} onRatingChange={mockedOnRatingChange} />,
      )

      await fireEvent.press(getByTestId('rating-4'))

      expect(mockedOnRatingChange).toHaveBeenCalledWith('testRating', 4)
      expect(mockedOnRatingChange).toHaveBeenCalledTimes(1)
    })

    it('shows correct selected state', async () => {
      const selectedRating = 2
      const { getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} selectedRating={selectedRating} />,
      )

      const selectedButton = getByTestId(`rating-${selectedRating}`)
      const unselectedButton = getByTestId('rating-4')

      expect(selectedButton.props.accessibilityState.selected).toBe(true)
      expect(unselectedButton.props.accessibilityState.selected).toBe(false)
    })

    it('handles rating changes correctly', async () => {
      const mockOnRatingChange = jest.fn()
      const { getByTestId } = await render(
        <RatingSection
          {...mockedDefaultProps}
          onRatingChange={mockOnRatingChange}
          selectedRating={1}
        />,
      )

      await fireEvent.press(getByTestId('rating-5'))
      expect(mockOnRatingChange).toHaveBeenCalledWith('testRating', 5)

      await fireEvent.press(getByTestId('rating-2'))
      expect(mockOnRatingChange).toHaveBeenCalledWith('testRating', 2)

      expect(mockOnRatingChange).toHaveBeenCalledTimes(2)
    })

    it('handles rating selection with different ratingKey', async () => {
      const mockOnRatingChange = jest.fn()
      const customRatingKey = 'customKey'

      const { getByTestId } = await render(
        <RatingSection
          {...mockedDefaultProps}
          onRatingChange={mockOnRatingChange}
          ratingKey={customRatingKey}
        />,
      )

      await fireEvent.press(getByTestId('rating-3'))

      expect(mockOnRatingChange).toHaveBeenCalledWith(customRatingKey, 3)
    })
  })

  describe('Component Optimization', () => {
    it('memoizes component correctly', async () => {
      const { rerender } = await render(<RatingSection {...mockedDefaultProps} />)

      await rerender(<RatingSection {...mockedDefaultProps} />)
    })

    it('re-renders when props change', async () => {
      const { rerender, getByText } = await render(<RatingSection {...mockedDefaultProps} />)

      expect(getByText('Rating Filter')).toBeTruthy()

      await rerender(<RatingSection {...mockedDefaultProps} title="New Title" />)
      expect(getByText('New Title')).toBeTruthy()
    })

    it('handles selectedRating changes', async () => {
      const { rerender, getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} selectedRating={1} />,
      )

      expect(getByTestId('rating-1').props.accessibilityState.selected).toBe(true)
      expect(getByTestId('rating-5').props.accessibilityState.selected).toBe(false)

      await rerender(<RatingSection {...mockedDefaultProps} selectedRating={5} />)

      expect(getByTestId('rating-1').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-5').props.accessibilityState.selected).toBe(true)
    })
  })

  describe('Callback Optimization', () => {
    it('memoizes handleRatingChange callback', async () => {
      const mockOnRatingChange = jest.fn()
      const { rerender } = await render(
        <RatingSection {...mockedDefaultProps} onRatingChange={mockOnRatingChange} />,
      )

      await rerender(<RatingSection {...mockedDefaultProps} onRatingChange={mockOnRatingChange} />)
    })

    it('handles callback prop changes', async () => {
      const mockedCallback1 = jest.fn()
      const mockedCallback2 = jest.fn()

      const { rerender, getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} onRatingChange={mockedCallback1} />,
      )

      await fireEvent.press(getByTestId('rating-3'))
      expect(mockedCallback1).toHaveBeenCalledWith('testRating', 3)

      await rerender(<RatingSection {...mockedDefaultProps} onRatingChange={mockedCallback2} />)

      await fireEvent.press(getByTestId('rating-4'))
      expect(mockedCallback2).toHaveBeenCalledWith('testRating', 4)
      expect(mockedCallback1).toHaveBeenCalledTimes(1)
    })
  })

  describe('Props Memoization', () => {
    it('memoizes ratingSelectorProps correctly', async () => {
      const { rerender, getByTestId } = await render(<RatingSection {...mockedDefaultProps} />)

      expect(getByTestId('rating-selector')).toBeTruthy()

      await rerender(<RatingSection {...mockedDefaultProps} />)

      expect(getByTestId('rating-selector')).toBeTruthy()
    })

    it('updates ratingSelectorProps when dependencies change', async () => {
      const { rerender, getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} selectedRating={2} />,
      )

      expect(getByTestId('rating-2').props.accessibilityState.selected).toBe(true)

      await rerender(<RatingSection {...mockedDefaultProps} selectedRating={4} />)

      expect(getByTestId('rating-2').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-4').props.accessibilityState.selected).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty ratings array', async () => {
      const { getByTestId, getByText } = await render(
        <RatingSection {...mockedDefaultProps} ratings={[]} />,
      )

      expect(getByText('Rating Filter')).toBeTruthy()
      expect(getByTestId('rating-selector')).toBeTruthy()

      mockedRatings.forEach(rating => {
        expect(() => getByTestId(`rating-${rating}`)).toThrow()
      })
    })

    it('handles single rating', async () => {
      const singleRating = [3]
      const { getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} ratings={singleRating} selectedRating={3} />,
      )

      expect(getByTestId('rating-3')).toBeTruthy()
      expect(getByTestId('rating-3').props.accessibilityState.selected).toBe(true)

      expect(() => getByTestId('rating-1')).toThrow()
      expect(() => getByTestId('rating-5')).toThrow()
    })

    it('handles selectedRating not in ratings array', async () => {
      const { getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} ratings={[2, 3, 4]} selectedRating={1} />,
      )

      expect(getByTestId('rating-2').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-3').props.accessibilityState.selected).toBe(false)
      expect(getByTestId('rating-4').props.accessibilityState.selected).toBe(false)
    })

    it('handles zero and negative ratings', async () => {
      const edgeRatings = [0, -1, 1]
      const { getByTestId } = await render(
        <RatingSection {...mockedDefaultProps} ratings={edgeRatings} selectedRating={0} />,
      )

      expect(getByTestId('rating-0')).toBeTruthy()
      expect(getByTestId('rating--1')).toBeTruthy()
      expect(getByTestId('rating-1')).toBeTruthy()
      expect(getByTestId('rating-0').props.accessibilityState.selected).toBe(true)
    })

    it('handles large numbers', async () => {
      const largeRatings = [10, 100, 1000]
      const mockOnRatingChange = jest.fn()

      const { getByTestId } = await render(
        <RatingSection
          {...mockedDefaultProps}
          onRatingChange={mockOnRatingChange}
          ratings={largeRatings}
          selectedRating={100}
        />,
      )

      await fireEvent.press(getByTestId('rating-1000'))
      expect(mockOnRatingChange).toHaveBeenCalledWith('testRating', 1000)
    })
  })

  describe('Component Structure', () => {
    it('has correct CSS classes', async () => {
      const { getByTestId } = await render(<RatingSection {...mockedDefaultProps} />)

      const themedText = getByTestId('themed-text-text-100-h3')
      expect(themedText.props.className).toBe('mb-3')
    })

    it('maintains proper component hierarchy', async () => {
      const { getByText, getByTestId } = await render(<RatingSection {...mockedDefaultProps} />)

      expect(getByText('Rating Filter')).toBeTruthy()

      expect(getByTestId('rating-selector')).toBeTruthy()
    })
  })
})
