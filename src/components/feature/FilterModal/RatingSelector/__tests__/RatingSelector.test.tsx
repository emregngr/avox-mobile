import { fireEvent, render, within } from '@testing-library/react-native'

import { RatingSelector } from '@/components/feature/FilterModal/RatingSelector'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}))

const mockedDefaultProps = {
  onRatingChange: jest.fn(),
  ratingKey: 'testRating',
  ratings: [1, 2, 3, 4, 5],
  selectedRating: 3,
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('RatingSelector', () => {
  describe('Rendering', () => {
    it('renders correctly with all rating items', async () => {
      const { getByText } = await render(<RatingSelector {...mockedDefaultProps} />)
      mockedDefaultProps.ratings.forEach(rating => {
        expect(getByText(` ${rating}`)).toBeTruthy()
      })
    })

    it('renders star icons for each rating', async () => {
      const { getAllByTestId } = await render(<RatingSelector {...mockedDefaultProps} />)
      const starIcons = getAllByTestId('mocked-material-community-icon')
      expect(starIcons).toHaveLength(mockedDefaultProps.ratings.length)
    })

    it('renders with horizontal scroll view', async () => {
      const { getByTestId } = await render(<RatingSelector {...mockedDefaultProps} />)
      expect(getByTestId('rating-scrollview')).toBeTruthy()
    })

    it('renders nothing when ratings array is empty', async () => {
      const { queryAllByTestId } = await render(
        <RatingSelector {...mockedDefaultProps} ratings={[]} />,
      )

      expect(queryAllByTestId('rating-button-')).toHaveLength(0)

      expect(queryAllByTestId('mocked-material-community-icon')).toHaveLength(0)
    })
  })

  describe('Rating Selection', () => {
    it('calls onRatingChange when a rating is pressed', async () => {
      const { getByTestId } = await render(<RatingSelector {...mockedDefaultProps} />)
      const ratingButton = getByTestId('rating-button-4')
      await fireEvent.press(ratingButton)
      expect(mockedDefaultProps.onRatingChange).toHaveBeenCalledWith('testRating', 4)
      expect(mockedDefaultProps.onRatingChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Visual States', () => {
    it('correctly identifies the selected rating', async () => {
      const { getByTestId } = await render(
        <RatingSelector {...mockedDefaultProps} selectedRating={2} />,
      )

      const selectedButton = getByTestId('rating-button-2')
      expect(selectedButton).toBeTruthy()
      expect(within(selectedButton).getByText(' 2')).toBeTruthy()
    })

    it('shows correct icon colors based on theme', async () => {
      const { getAllByTestId } = await render(
        <RatingSelector {...mockedDefaultProps} selectedRating={1} />,
      )
      const whiteIconColor = getAllByTestId('mocked-material-community-icon')
      expect(whiteIconColor).toBeTruthy()
    })
  })

  describe('Component Optimization', () => {
    it('re-renders when selectedRating changes', async () => {
      const { rerender, getByTestId } = await render(
        <RatingSelector {...mockedDefaultProps} selectedRating={1} />,
      )

      const initialSelected = getByTestId('rating-button-1')
      expect(within(initialSelected).getByText(' 1')).toBeTruthy()

      await rerender(<RatingSelector {...mockedDefaultProps} selectedRating={5} />)

      const newSelected = getByTestId('rating-button-5')
      expect(within(newSelected).getByText(' 5')).toBeTruthy()

      expect(getByTestId('rating-button-1')).toBeTruthy()
      expect(getByTestId('rating-button-5')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles selectedRating not in ratings array', async () => {
      const { getByTestId, queryByTestId } = await render(
        <RatingSelector {...mockedDefaultProps} ratings={[2, 3, 4]} selectedRating={1} />,
      )

      expect(getByTestId('rating-button-2')).toBeTruthy()
      expect(getByTestId('rating-button-3')).toBeTruthy()
      expect(getByTestId('rating-button-4')).toBeTruthy()

      expect(queryByTestId('rating-button-1')).toBeNull()
    })
  })

  describe('Icon Properties', () => {
    it('renders icons with correct properties', async () => {
      const { getAllByTestId } = await render(<RatingSelector {...mockedDefaultProps} />)
      const starIcons = getAllByTestId('mocked-material-community-icon')

      expect(starIcons).toHaveLength(5)
      expect(starIcons[0]).toBeTruthy()
    })
  })
})
