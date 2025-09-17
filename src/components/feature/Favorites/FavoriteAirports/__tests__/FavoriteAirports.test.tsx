import { render } from '@testing-library/react-native'
import React from 'react'

import { FavoriteAirports } from '@/components/feature/Favorites/FavoriteAirports'
import useThemeStore from '@/store/theme'
import type { AirportType } from '@/types/feature/airport'

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

jest.mock('@/components/feature/Favorites/AirportFavoriteItemCard', () => {
  const { Text } = require('react-native')

  return {
    AirportFavoriteItemCard: ({ airport }: { airport: AirportType }) => (
      <Text>{`AirportCard ${airport.name}`}</Text>
    ),
  }
})

const mockedAirports: any = [
  { id: '1', name: 'IST' },
  { id: '2', name: 'SAW' },
]

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('FavoriteAirports Component', () => {
  it('renders skeleton when loading', () => {
    const { getByText } = render(<FavoriteAirports airports={[]} onRefresh={jest.fn()} isLoading />)
    expect(getByText('Skeleton airport')).toBeTruthy()
  })

  it('renders empty state when no airports', () => {
    const { getByText } = render(
      <FavoriteAirports airports={[]} isLoading={false} onRefresh={jest.fn()} />,
    )
    expect(getByText('Empty noFavoriteAirport')).toBeTruthy()
  })

  it('renders airport cards when data is provided', () => {
    const { getByText } = render(
      <FavoriteAirports airports={mockedAirports} isLoading={false} onRefresh={jest.fn()} />,
    )
    expect(getByText('AirportCard IST')).toBeTruthy()
    expect(getByText('AirportCard SAW')).toBeTruthy()
  })
})

describe('FavoriteAirports Component Snapshot', () => {
  it('should render the FavoriteAirports Component successfully', () => {
    const { toJSON } = render(<FavoriteAirports airports={[]} onRefresh={jest.fn()} isLoading />)

    expect(toJSON()).toMatchSnapshot()
  })
})
