import { render } from '@testing-library/react-native'
import React from 'react'

import { FavoriteAirlines } from '@/components/feature/Favorites/FavoriteAirlines'
import useThemeStore from '@/store/theme'
import type { AirlineType } from '@/types/feature/airline'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/feature/Favorites/FavoriteSkeleton', () => {
  const { Text } = require('react-native')

  return {
    FavoriteSkeleton: ({ type }: { type: string }) => <Text>Skeleton {type}</Text>,
  }
})

jest.mock('@/components/feature/Favorites/EmptyFavorite', () => {
  const { Text } = require('react-native')

  return {
    EmptyFavorite: ({ text }: { text: string }) => <Text>Empty {text}</Text>,
  }
})

jest.mock('@/components/feature/Favorites/AirlineFavoriteItemCard', () => {
  const { Text } = require('react-native')

  return {
    AirlineFavoriteItemCard: ({ airline }: { airline: AirlineType }) => (
      <Text>{`AirlineCard ${airline.name}`}</Text>
    ),
  }
})

const mockedAirlines: any = [
  { id: '1', name: 'THY' },
  { id: '2', name: 'Pegasus' },
]

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('FavoriteAirlines Component', () => {
  it('renders skeleton when loading', () => {
    const { getByText } = render(<FavoriteAirlines airlines={[]} onRefresh={jest.fn()} isLoading />)
    expect(getByText('Skeleton airline')).toBeTruthy()
  })

  it('renders empty state when no airlines', () => {
    const { getByText } = render(
      <FavoriteAirlines airlines={[]} isLoading={false} onRefresh={jest.fn()} />,
    )
    expect(getByText('Empty noFavoriteAirline')).toBeTruthy()
  })

  it('renders airline cards when data is provided', () => {
    const { getByText } = render(
      <FavoriteAirlines airlines={mockedAirlines} isLoading={false} onRefresh={jest.fn()} />,
    )
    expect(getByText('AirlineCard THY')).toBeTruthy()
    expect(getByText('AirlineCard Pegasus')).toBeTruthy()
  })
})

describe('FavoriteAirlines Component Snapshot', () => {
  it('should render the FavoriteAirlines Component successfully', () => {
    const { toJSON } = render(<FavoriteAirlines airlines={[]} onRefresh={jest.fn()} isLoading />)

    expect(toJSON()).toMatchSnapshot()
  })
})
