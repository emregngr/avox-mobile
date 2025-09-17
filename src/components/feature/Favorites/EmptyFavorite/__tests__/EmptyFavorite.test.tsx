import { render } from '@testing-library/react-native'
import React from 'react'

import { EmptyFavorite } from '@/components/feature/Favorites/EmptyFavorite'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 20 }),
}))

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

const colors = themeColors.light

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('EmptyFavorite Component', () => {
  it('renders given text', () => {
    const { getByText } = render(<EmptyFavorite icon="airplane" text="No favorites yet" />)
    expect(getByText('No favorites yet')).toBeTruthy()
  })

  it('renders given icon with correct props', () => {
    const { getByTestId } = render(<EmptyFavorite icon="heart" text="Empty list" />)
    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.name).toBe('heart')
    expect(icon.props.size).toBe(64)
    expect(icon.props.color).toBe(colors.onPrimary100)
  })

  it('applies safe area bottom margin', () => {
    const { getByTestId } = render(<EmptyFavorite icon="star" text="Empty" />)
    const container = getByTestId('EmptyFavoriteContainer')

    expect(container.props.style.marginBottom).toBe(20 + 60)
  })
})

describe('EmptyFavorite Component Snapshot', () => {
  it('should render the EmptyFavorite Component successfully', () => {
    const { toJSON } = render(<EmptyFavorite icon="airplane" text="No favorites yet" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
