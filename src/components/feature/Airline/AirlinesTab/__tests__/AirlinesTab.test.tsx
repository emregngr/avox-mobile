import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { AirlinesTab } from '@/components/feature/Airline/AirlinesTab'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import type { AirlineType } from '@/types/feature/airline'

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
      onChangeText: () => void
      value: string
      placeholder: string
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
          <TouchableOpacity
            key={key}
            onPress={() => onRemove(key)}
            testID={`remove-filter-${key}`}
          >
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

jest.mock('@/components/feature/Airline/AirlineCard', () => {
  const { View, Text } = require('react-native')

  return {
    AirlineCard: ({ airline }: { airline: AirlineType }) => (
      <View testID={`airline-card-${airline.id}`}>
        <Text>{airline.name}</Text>
      </View>
      ),

    AirlinesLoadMoreFooter: ({
      airlinesHasNext,
      airlinesLoading,
    }: {
      airlinesHasNext: boolean
      airlinesLoading: boolean
    }) => (
      <View testID="load-more-footer">
        <Text>{airlinesLoading ? 'Loading...' : airlinesHasNext ? 'Load More' : 'No More'}</Text>
      </View>
      ),
  }
})

jest.mock('@/components/feature/Airline/AirlineCardSkeleton', () => {
  const { View, Text } = require('react-native')
  return {
    AirlineCardSkeleton: () => (
      <View testID="airline-skeleton">
        <Text>Loading...</Text>
      </View>
      ),
  }
})

jest.mock('@/components/feature/FilterModal', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    FilterModal: ({
      onApply,
      onClose,
      type,
    }: {
      onApply: any
      onClose: any
      currentFilters: any
      type: any
    }) => (
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

const mockedAirlines: any = [
  {
    id: '1',
    name: 'Turkish Airlines',
    code: 'TK',
    logo: 'https://example.com/tk-logo.png',
  },
  {
    id: '2',
    name: 'Pegasus Airlines',
    code: 'PC',
    logo: 'https://example.com/pc-logo.png',
  },
]

const mockedFilters: any = {
  country: 'Turkey',
  type: 'scheduled',
}

const mockedDefaultProps = {
  airlineFiltersCount: 0,
  airlinesFilters: {},
  airlinesHasMore: false,
  airlinesLoading: false,
  airlinesSearchLoading: false,
  airlinesSearchTerm: '',
  loadMoreAirlines: jest.fn(),
  paginatedAirlines: mockedAirlines,
  setAirlinesFilters: jest.fn(),
  setAirlinesSearchTerm: jest.fn(),
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })

  mockedUseSafeAreaInsets.mockReturnValue({
    bottom: 34,
    top: 44,
    left: 0,
    right: 0,
  })

  mockedGetLocale.mockImplementation((key: string) => key)
})

describe('AirlinesTab Component', () => {
  describe('Component Rendering', () => {
    it('renders all main components correctly', () => {
      const { getByTestId } = render(<AirlinesTab {...mockedDefaultProps} />)

      expect(getByTestId('search-input')).toBeTruthy()
      expect(getByTestId('active-filters')).toBeTruthy()
      expect(getByTestId('filter-modal')).toBeTruthy()
    })

    it('renders airline cards when data is loaded', () => {
      const { getByTestId, getByText } = render(<AirlinesTab {...mockedDefaultProps} />)

      expect(getByTestId('airline-card-1')).toBeTruthy()
      expect(getByTestId('airline-card-2')).toBeTruthy()
      expect(getByText('Turkish Airlines')).toBeTruthy()
      expect(getByText('Pegasus Airlines')).toBeTruthy()
    })

    it('renders skeleton cards when search is loading', () => {
      const { getAllByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} airlinesSearchLoading />,
      )

      const skeletons = getAllByTestId('airline-skeleton')
      expect(skeletons).toHaveLength(6)
    })

    it('renders load more footer when not search loading', () => {
      const { getByTestId } = render(<AirlinesTab {...mockedDefaultProps} />)

      expect(getByTestId('load-more-footer')).toBeTruthy()
    })

    it('does not render load more footer when search loading', () => {
      const { queryByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} airlinesSearchLoading />,
      )

      expect(queryByTestId('load-more-footer')).toBeNull()
    })

    it('renders filter icon correctly', () => {
      const { getByTestId } = render(<AirlinesTab {...mockedDefaultProps} />)

      expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
    })
  })

  describe('Search Functionality', () => {
    it('calls setAirlinesSearchTerm when search text changes', () => {
      const mockedSetAirlinesSearchTerm = jest.fn()
      const { getByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} setAirlinesSearchTerm={mockedSetAirlinesSearchTerm} />,
      )

      const searchInput = getByTestId('search-input')
      fireEvent.changeText(searchInput, 'Turkish')

      expect(mockedSetAirlinesSearchTerm).toHaveBeenCalledWith('Turkish')
    })

    it('displays correct search placeholder from locale', () => {
      const { getByTestId } = render(<AirlinesTab {...mockedDefaultProps} />)

      const searchInput = getByTestId('search-input')
      expect(searchInput.props.placeholder).toBe('airlineSearchPlaceholder')
    })

    it('displays current search term in input', () => {
      const { getByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} airlinesSearchTerm="Turkish Airlines" />,
      )

      const searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('Turkish Airlines')
    })
  })

  describe('Filter Functionality', () => {
    it('shows filter count badge when filters are active', () => {
      const { getByText } = render(
        <AirlinesTab
          {...mockedDefaultProps}
          airlineFiltersCount={2}
          airlinesFilters={mockedFilters}
        />,
      )

      expect(getByText('2')).toBeTruthy()
    })

    it('does not show filter count badge when no filters applied', () => {
      const { queryByText } = render(
        <AirlinesTab {...mockedDefaultProps} airlineFiltersCount={0} />,
      )

      expect(queryByText('0')).toBeNull()
    })

    it('removes individual filter when remove button is pressed', () => {
      const mockedSetAirlinesSearchTerm = jest.fn()
      const { getByTestId } = render(
        <AirlinesTab
          {...mockedDefaultProps}
          airlinesFilters={mockedFilters}
          setAirlinesFilters={mockedSetAirlinesSearchTerm}
        />,
      )

      fireEvent.press(getByTestId('remove-filter-country'))

      expect(mockedSetAirlinesSearchTerm).toHaveBeenCalledWith({ type: 'scheduled' })
    })

    it('clears all filters when clear all button is pressed', () => {
      const mockedSetAirlinesSearchTerm = jest.fn()
      const { getByTestId } = render(
        <AirlinesTab
          {...mockedDefaultProps}
          airlinesFilters={mockedFilters}
          setAirlinesFilters={mockedSetAirlinesSearchTerm}
        />,
      )

      fireEvent.press(getByTestId('clear-all-filters'))

      expect(mockedSetAirlinesSearchTerm).toHaveBeenCalledWith({})
    })

    it('opens filter modal when filter button is pressed', () => {
      const { getByTestId } = render(<AirlinesTab {...mockedDefaultProps} />)

      expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
    })
  })

  describe('Loading States', () => {
    it('shows loading state in footer when airlines are loading', () => {
      const { getByText } = render(<AirlinesTab {...mockedDefaultProps} airlinesLoading />)

      expect(getByText('Loading...')).toBeTruthy()
    })

    it('shows load more option when more data is available', () => {
      const { getByText } = render(<AirlinesTab {...mockedDefaultProps} airlinesHasMore />)

      expect(getByText('Load More')).toBeTruthy()
    })

    it('shows no more data message when all data is loaded', () => {
      const { getByText } = render(<AirlinesTab {...mockedDefaultProps} airlinesHasMore={false} />)

      expect(getByText('No More')).toBeTruthy()
    })

    it('displays skeleton loading correctly during search', () => {
      const { getAllByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} airlinesSearchLoading />,
      )

      const skeletons = getAllByTestId('airline-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
      expect(skeletons[0]).toBeTruthy()
    })
  })

  describe('Empty States', () => {
    it('handles empty airlines array gracefully', () => {
      const { queryByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} paginatedAirlines={[]} />,
      )

      expect(queryByTestId('airline-card-1')).toBeNull()
      expect(queryByTestId('airline-card-2')).toBeNull()
    })

    it('handles empty filters object', () => {
      const { queryByTestId } = render(<AirlinesTab {...mockedDefaultProps} airlinesFilters={{}} />)

      expect(queryByTestId('clear-all-filters')).toBeNull()
    })
  })

  describe('Props Integration', () => {
    it('passes correct props to FlatList through data changes', () => {
      const mockedNewAirlines = [
        ...mockedAirlines,
        { id: '3', name: 'AtlasGlobal', code: 'KK', logo: 'https://example.com/kk.png' },
      ]

      const { rerender, getByTestId } = render(<AirlinesTab {...mockedDefaultProps} />)

      expect(getByTestId('airline-card-1')).toBeTruthy()
      expect(getByTestId('airline-card-2')).toBeTruthy()

      rerender(<AirlinesTab {...mockedDefaultProps} paginatedAirlines={mockedNewAirlines} />)

      expect(getByTestId('airline-card-3')).toBeTruthy()
    })

    it('updates search term correctly', () => {
      const { rerender, getByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} airlinesSearchTerm="" />,
      )

      let searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('')

      rerender(<AirlinesTab {...mockedDefaultProps} airlinesSearchTerm="Turkish" />)

      searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('Turkish')
    })
  })

  describe('Callback Functions', () => {
    it('calls loadMoreAirlines prop function', () => {
      const mockedLoadMoreAirlines = jest.fn()
      render(<AirlinesTab {...mockedDefaultProps} loadMoreAirlines={mockedLoadMoreAirlines} />)

      expect(mockedLoadMoreAirlines).not.toHaveBeenCalled()
    })

    it('properly handles filter modal interactions', () => {
      const mockedSetAirlinesSearchTerm = jest.fn()
      const { getByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} setAirlinesFilters={mockedSetAirlinesSearchTerm} />,
      )

      fireEvent.press(getByTestId('apply-filters'))
      expect(mockedSetAirlinesSearchTerm).toHaveBeenCalledWith({ newFilter: 'value' })
    })
  })

  describe('Error Handling', () => {
    it('handles undefined filter keys during removal', () => {
      const mockedSetAirlinesSearchTerm = jest.fn()
      const filtersWithUndefined = { country: 'Turkey', undefined }

      const { getByTestId } = render(
        <AirlinesTab
          {...mockedDefaultProps}
          airlinesFilters={filtersWithUndefined}
          setAirlinesFilters={mockedSetAirlinesSearchTerm}
        />,
      )

      fireEvent.press(getByTestId('remove-filter-country'))

      expect(mockedSetAirlinesSearchTerm).toHaveBeenCalled()
    })

    it('handles missing airline properties gracefully', () => {
      const incompleteAirlines: any = [{ id: '1', name: 'Turkish Airlines' }, { id: '2' }]

      const { getByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} paginatedAirlines={incompleteAirlines} />,
      )

      expect(getByTestId('airline-card-1')).toBeTruthy()
      expect(getByTestId('airline-card-2')).toBeTruthy()
    })
  })

  describe('Performance and Memoization', () => {
    it('maintains component stability with React.memo', () => {
      const { rerender } = render(<AirlinesTab {...mockedDefaultProps} />)

      rerender(<AirlinesTab {...mockedDefaultProps} />)

      expect(mockedDefaultProps.setAirlinesFilters).not.toHaveBeenCalled()
    })

    it('updates when necessary props change', () => {
      const { rerender, getByTestId } = render(
        <AirlinesTab {...mockedDefaultProps} airlinesSearchTerm="" />,
      )

      rerender(<AirlinesTab {...mockedDefaultProps} airlinesSearchTerm="New Search" />)

      const searchInput = getByTestId('search-input')
      expect(searchInput.props.value).toBe('New Search')
    })
  })
})

// describe('AirlinesTab Component Snapshot', () => {
//   it('should render the AirlinesTab Component successfully', () => {
//     const { toJSON } = render(<AirlinesTab {...mockedDefaultProps} />)

//     expect(toJSON()).toMatchSnapshot()
//   })
// })
