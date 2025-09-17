import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { FavoriteButton } from '@/components/feature/FavoriteButton'
import { useFavoriteToggle } from '@/hooks/services/useFavoriteToggle'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/hooks/services/useFavoriteToggle')

const mockedUseFavoriteToggle = useFavoriteToggle as jest.MockedFunction<typeof useFavoriteToggle>

const mockedHandleFavoritePress = jest.fn()

const colors = themeColors.light

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })

  mockedUseFavoriteToggle.mockReturnValue({
    isFavorite: false,
    isPending: false,
    handleFavoritePress: mockedHandleFavoritePress,
  })
})

describe('FavoriteButton Component', () => {
  it('should display the correct icon and be enabled when the item is not a favorite', () => {
    mockedUseFavoriteToggle.mockReturnValue({
      isFavorite: false,
      isPending: false,
      handleFavoritePress: mockedHandleFavoritePress,
    })

    const { getByTestId } = render(<FavoriteButton id="123" type="airport" />)
    const button = getByTestId('favorite-button')
    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.color).toBe(colors?.onPrimary100)
    expect(icon.props.name).toBe('heart-outline')
    expect(button).not.toBeDisabled()
  })

  it('should display the correct icon when the item is a favorite', () => {
    mockedUseFavoriteToggle.mockReturnValue({
      isFavorite: true,
      isPending: false,
      handleFavoritePress: mockedHandleFavoritePress,
    })

    const { getByTestId } = render(<FavoriteButton id="123" type="airport" />)
    const icon = getByTestId('mocked-material-community-icon')

    expect(icon.props.color).toBe(colors?.tertiary100)
    expect(icon.props.name).toBe('heart')
  })

  it('should display an ActivityIndicator and be disabled when in a pending state', () => {
    mockedUseFavoriteToggle.mockReturnValue({
      isFavorite: false,
      isPending: true,
      handleFavoritePress: mockedHandleFavoritePress,
    })

    const { getByTestId, queryByTestId } = render(<FavoriteButton id="123" type="airport" />)
    const button = getByTestId('favorite-button')

    expect(getByTestId('activity-indicator')).toBeTruthy()
    expect(queryByTestId('mocked-material-community-icon')).toBeNull()
    expect(button).toBeDisabled()
  })

  it('should call handleFavoritePress function when pressed', async () => {
    mockedUseFavoriteToggle.mockReturnValue({
      isFavorite: false,
      isPending: false,
      handleFavoritePress: mockedHandleFavoritePress,
    })

    const { getByTestId } = render(<FavoriteButton id="123" type="airport" />)
    const button = getByTestId('favorite-button')

    await fireEvent.press(button)

    expect(mockedHandleFavoritePress).toHaveBeenCalledTimes(1)
  })
})

describe('FavoriteButton Component Snapshot', () => {
  it('should render the FavoriteButton Component successfully', () => {
    const { toJSON } = render(<FavoriteButton id="123" type="airport" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
