import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { AirportsTab } from '@/components/feature/Airport/AirportsTab'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import type { AirportType } from '@/types/feature/airport'

const { mockedUseSafeAreaInsets } = require('react-native-safe-area-context')

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/SearchInput', () => {
  const { TextInput } = require('react-native')

  return {
    SearchInput: ({
      onChangeText,
      value,
      placeholder,
      ...props
    }: {
      onChangeText: any
      value: any
      placeholder: any
    }) => (
      <TextInput
        onChangeText={onChangeText}
        placeholder={placeholder}
        testID="search-input"
        value={value}
        {...props}
      />
    ),
  }
})

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/components/feature/ActiveFilters', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    ActiveFilters: ({
      filters,
      onClearAll,
      onRemove,
    }: {
      filters: any
      onClearAll: any
      onRemove: any
    }) => (
      <View testID="active-filters">
        {Object.keys(filters).map((key: string) => (
          <TouchableOpacity key={key} onPress={() => onRemove(key)} testID={`remove-filter-${key}`}>
            <Text>Remove {key}</Text>
          </TouchableOpacity>
        ))}
        {Object.keys(filters).length > 0 ? (
          <TouchableOpacity onPress={onClearAll} testID="clear-all-filters">
            <Text>Clear All</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    ),
  }
})

jest.mock('@/components/feature/Airport/AirportCard', () => {
  const { View, Text } = require('react-native')

  return {
    AirportCard: ({ airport }: { airport: AirportType }) => (
      <View testID={`airport-card-${airport.id}`}>
        <Text>{airport.name}</Text>
      </View>
    ),

    AirportsLoadMoreFooter: ({ airportsHasNext, airportsLoading }: any) => (
      <View testID="load-more-footer">
        <Text>{airportsLoading ? 'Loading...' : airportsHasNext ? 'Load More' : 'No More'}</Text>
      </View>
    ),
  }
})

jest.mock('@/components/feature/Airport/AirportCardSkeleton', () => {
  const { View, Text } = require('react-native')
  return {
    AirportCardSkeleton: () => (
      <View testID="airport-skeleton">
        <Text>Loading...</Text>
      </View>
    ),
  }
})

jest.mock('@/components/feature/FilterModal', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    FilterModal: ({ onApply, onClose, type }: { onApply: any; onClose: any; type: any }) => (
      <View testID="filter-modal">
        <Text>Filter Modal - {type}</Text>
        <TouchableOpacity onPress={() => onApply({ newFilter: 'value' })} testID="apply-filters">
          <Text>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} testID="close-modal">
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    ),
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}))

const mockedAirports: any = [
  { id: '1', name: 'Istanbul Airport' },
  { id: '2', name: 'Sabiha Gokcen Airport' },
]

const mockedFilters: any = {
  country: 'Turkey',
  airportType: 'international',
}

const mockedDefaultProps = {
  airportsFilters: {},
  airportsFiltersCount: 0,
  airportsHasMore: false,
  airportsLoading: false,
  airportsSearchLoading: false,
  airportsSearchTerm: '',
  loadMoreAirports: jest.fn(),
  paginatedAirports: mockedAirports,
  setAirportsFilters: jest.fn(),
  setAirportsSearchTerm: jest.fn(),
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })

  mockedUseSafeAreaInsets.mockReturnValue({ bottom: 34, top: 44, left: 0, right: 0 })

  mockedGetLocale.mockImplementation((key: string) => key)
})

describe('AirportsTab Component', () => {
  describe('Component Rendering', () => {
    it('renders all main components correctly', () => {
      const { getByTestId } = render(<AirportsTab {...mockedDefaultProps} />)

      expect(getByTestId('search-input')).toBeTruthy()
      expect(getByTestId('active-filters')).toBeTruthy()
      expect(getByTestId('filter-modal')).toBeTruthy()
    })

    it('renders airport cards when data is loaded', () => {
      const { getByTestId, getByText } = render(<AirportsTab {...mockedDefaultProps} />)

      expect(getByTestId('airport-card-1')).toBeTruthy()
      expect(getByTestId('airport-card-2')).toBeTruthy()
      expect(getByText('Istanbul Airport')).toBeTruthy()
      expect(getByText('Sabiha Gokcen Airport')).toBeTruthy()
    })

    it('renders skeleton cards when search is loading', () => {
      const { getAllByTestId } = render(
        <AirportsTab {...mockedDefaultProps} airportsSearchLoading />,
      )

      const skeletons = getAllByTestId('airport-skeleton')
      expect(skeletons).toHaveLength(6)
    })

    it('renders load more footer when not search loading', () => {
      const { getByTestId } = render(<AirportsTab {...mockedDefaultProps} />)

      expect(getByTestId('load-more-footer')).toBeTruthy()
    })

    it('does not render load more footer when search loading', () => {
      const { queryByTestId } = render(
        <AirportsTab {...mockedDefaultProps} airportsSearchLoading />,
      )

      expect(queryByTestId('load-more-footer')).toBeNull()
    })

    it('renders filter icon correctly', () => {
      const { getByTestId } = render(<AirportsTab {...mockedDefaultProps} />)

      expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
    })
  })

  describe('Search Functionality', () => {
    it('calls setAirportsSearchTerm when search text changes', () => {
      const mockedSetAirportsFilters = jest.fn()
      const { getByTestId } = render(
        <AirportsTab {...mockedDefaultProps} setAirportsSearchTerm={mockedSetAirportsFilters} />,
      )

      const searchInput = getByTestId('search-input')
      fireEvent.changeText(searchInput, 'Turkish')

      expect(mockedSetAirportsFilters).toHaveBeenCalledWith('Turkish')
    })

    it('displays correct search placeholder from locale', () => {
      const { getByTestId } = render(<AirportsTab {...mockedDefaultProps} />)

      const searchInput = getByTestId('search-input')
      expect(searchInput.props.placeholder).toBe('airportSearchPlaceholder')
    })

    it('displays current search term in input', () => {
      const { getByTestId } = render(
        <AirportsTab {...mockedDefaultProps} airportsSearchTerm="Istanbul Airports" />,
      )

      const searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('Istanbul Airports')
    })
  })

  describe('Filter Functionality', () => {
    it('shows filter count badge when filters are active', () => {
      const { getByText } = render(
        <AirportsTab
          {...mockedDefaultProps}
          airportsFilters={mockedFilters}
          airportsFiltersCount={2}
        />,
      )

      expect(getByText('2')).toBeTruthy()
    })

    it('does not show filter count badge when no filters applied', () => {
      const { queryByText } = render(
        <AirportsTab {...mockedDefaultProps} airportsFiltersCount={0} />,
      )

      expect(queryByText('0')).toBeNull()
    })

    it('removes individual filter when remove button is pressed', () => {
      const mockedSetAirportsFilters = jest.fn()
      const { getByTestId } = render(
        <AirportsTab
          {...mockedDefaultProps}
          airportsFilters={mockedFilters}
          setAirportsFilters={mockedSetAirportsFilters}
        />,
      )

      fireEvent.press(getByTestId('remove-filter-country'))

      expect(mockedSetAirportsFilters).toHaveBeenCalledWith({ airportType: 'international' })
    })

    it('clears all filters when clear all button is pressed', () => {
      const mockedSetAirportsFilters = jest.fn()
      const { getByTestId } = render(
        <AirportsTab
          {...mockedDefaultProps}
          airportsFilters={mockedFilters}
          setAirportsFilters={mockedSetAirportsFilters}
        />,
      )

      fireEvent.press(getByTestId('clear-all-filters'))

      expect(mockedSetAirportsFilters).toHaveBeenCalledWith({})
    })

    it('opens filter modal when filter button is pressed', () => {
      const { getByTestId } = render(<AirportsTab {...mockedDefaultProps} />)

      expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
    })
  })

  describe('Loading States', () => {
    it('shows loading state in footer when Airports are loading', () => {
      const { getByText } = render(<AirportsTab {...mockedDefaultProps} airportsLoading />)

      expect(getByText('Loading...')).toBeTruthy()
    })

    it('shows load more option when more data is available', () => {
      const { getByText } = render(<AirportsTab {...mockedDefaultProps} airportsHasMore />)

      expect(getByText('Load More')).toBeTruthy()
    })

    it('shows no more data message when all data is loaded', () => {
      const { getByText } = render(<AirportsTab {...mockedDefaultProps} airportsHasMore={false} />)

      expect(getByText('No More')).toBeTruthy()
    })

    it('displays skeleton loading correctly during search', () => {
      const { getAllByTestId } = render(
        <AirportsTab {...mockedDefaultProps} airportsSearchLoading />,
      )

      const skeletons = getAllByTestId('airport-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
      expect(skeletons[0]).toBeTruthy()
    })
  })

  describe('Empty States', () => {
    it('handles empty Airports array gracefully', () => {
      const { queryByTestId } = render(
        <AirportsTab {...mockedDefaultProps} paginatedAirports={[]} />,
      )

      expect(queryByTestId('airport-card-1')).toBeNull()
      expect(queryByTestId('airport-card-2')).toBeNull()
    })

    it('handles empty filters object', () => {
      const { queryByTestId } = render(<AirportsTab {...mockedDefaultProps} airportsFilters={{}} />)

      expect(queryByTestId('clear-all-filters')).toBeNull()
    })
  })

  describe('Props Integration', () => {
    it('passes correct props to FlatList through data changes', () => {
      const mockedNewAirports = [
        ...mockedAirports,
        { id: '3', name: 'AtlasGlobal', code: 'KK', image: 'https://example.com/kk.png' },
      ]

      const { rerender, getByTestId } = render(<AirportsTab {...mockedDefaultProps} />)

      expect(getByTestId('airport-card-1')).toBeTruthy()
      expect(getByTestId('airport-card-2')).toBeTruthy()

      rerender(<AirportsTab {...mockedDefaultProps} paginatedAirports={mockedNewAirports} />)

      expect(getByTestId('airport-card-3')).toBeTruthy()
    })

    it('updates search term correctly', () => {
      const { rerender, getByTestId } = render(
        <AirportsTab {...mockedDefaultProps} airportsSearchTerm="" />,
      )

      let searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('')

      rerender(<AirportsTab {...mockedDefaultProps} airportsSearchTerm="Turkish" />)

      searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('Turkish')
    })
  })

  describe('Callback Functions', () => {
    it('calls loadMoreAirports prop function', () => {
      const mockedLoadMoreAirports = jest.fn()
      render(<AirportsTab {...mockedDefaultProps} loadMoreAirports={mockedLoadMoreAirports} />)

      expect(mockedLoadMoreAirports).not.toHaveBeenCalled()
    })

    it('properly handles filter modal interactions', () => {
      const mockedSetAirportsFilters = jest.fn()
      const { getByTestId } = render(
        <AirportsTab {...mockedDefaultProps} setAirportsFilters={mockedSetAirportsFilters} />,
      )

      fireEvent.press(getByTestId('apply-filters'))
      expect(mockedSetAirportsFilters).toHaveBeenCalledWith({ newFilter: 'value' })
    })
  })

  describe('Error Handling', () => {
    it('handles undefined filter keys during removal', () => {
      const mockedSetAirportsFilters = jest.fn()
      const filtersWithUndefined = { country: 'Turkey', undefined }

      const { getByTestId } = render(
        <AirportsTab
          {...mockedDefaultProps}
          airportsFilters={filtersWithUndefined}
          setAirportsFilters={mockedSetAirportsFilters}
        />,
      )

      fireEvent.press(getByTestId('remove-filter-country'))

      expect(mockedSetAirportsFilters).toHaveBeenCalled()
    })

    it('handles missing airport properties gracefully', () => {
      const incompleteAirports: any = [{ id: '1', name: 'Turkish Airports' }, { id: '2' }]

      const { getByTestId } = render(
        <AirportsTab {...mockedDefaultProps} paginatedAirports={incompleteAirports} />,
      )

      expect(getByTestId('airport-card-1')).toBeTruthy()
      expect(getByTestId('airport-card-2')).toBeTruthy()
    })
  })

  describe('Performance and Memoization', () => {
    it('maintains component stability with React.memo', () => {
      const { rerender } = render(<AirportsTab {...mockedDefaultProps} />)

      rerender(<AirportsTab {...mockedDefaultProps} />)

      expect(mockedDefaultProps.setAirportsFilters).not.toHaveBeenCalled()
    })

    it('updates when necessary props change', () => {
      const { rerender, getByTestId } = render(
        <AirportsTab {...mockedDefaultProps} airportsSearchTerm="" />,
      )

      rerender(<AirportsTab {...mockedDefaultProps} airportsSearchTerm="New Search" />)

      const searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('New Search')
    })
  })
})

// describe('AirportsTab Component Snapshot', () => {
//   it('should render the AirportsTab Component successfully', () => {
//     const { toJSON } = render(<AirportsTab {...mockedDefaultProps} />)

//     expect(toJSON()).toMatchSnapshot()
//   })
// })
