import { fireEvent, render } from '@testing-library/react-native'

import { FilterSection } from '@/components/feature/FilterModal/FilterSection'
import type { FilterOptionType, RangeFilterOptionType } from '@/types/feature/filter'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/components/feature/FilterModal/FilterChip', () => {
  const { TouchableOpacity, Text } = require('react-native')
  return {
    FilterChip: ({
      label,
      selected,
      onPress,
    }: {
      label: string
      selected: boolean
      onPress: () => void
    }) => (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        testID={`filter-chip-${label}`}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  }
})

describe('FilterSection', () => {
  const mockedOptions: FilterOptionType[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]

  const mockedRangeOptions: RangeFilterOptionType[] = [
    { label: '0-10', value: '0-10' },
    { label: '10-20', value: '11-20' },
  ]

  const mockedDefaultProps = {
    filterKey: 'testFilter',
    handlerType: 'multi' as const,
    localFilters: {},
    options: mockedOptions,
    title: 'Test Filter Section',
  }

  describe('Rendering', () => {
    it('renders correctly with title and options', async () => {
      const { getByText } = await render(<FilterSection {...mockedDefaultProps} />)

      expect(getByText('Test Filter Section')).toBeTruthy()
      expect(getByText('Option 1')).toBeTruthy()
      expect(getByText('Option 2')).toBeTruthy()
      expect(getByText('Option 3')).toBeTruthy()
    })

    it('renders nothing when options is empty', async () => {
      const { queryByText } = await render(<FilterSection {...mockedDefaultProps} options={[]} />)

      expect(queryByText('Test Filter Section')).toBeNull()
    })

    it('renders nothing when options is null/undefined', async () => {
      const { queryByText } = await render(
        <FilterSection {...mockedDefaultProps} options={undefined as any} />,
      )

      expect(queryByText('Test Filter Section')).toBeNull()
    })

    it('renders with range options', async () => {
      const { getByText } = await render(
        <FilterSection {...mockedDefaultProps} options={mockedRangeOptions} />,
      )

      expect(getByText('0-10')).toBeTruthy()
      expect(getByText('10-20')).toBeTruthy()
    })
  })

  describe('Multi-select behavior', () => {
    const mockedOnMultiSelectToggle = jest.fn()

    it('calls onMultiSelectToggle when chip is pressed in multi mode', async () => {
      const { getByTestId } = await render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="multi"
          onMultiSelectToggle={mockedOnMultiSelectToggle}
        />,
      )

      await fireEvent.press(getByTestId('filter-chip-Option 1'))

      expect(mockedOnMultiSelectToggle).toHaveBeenCalledWith('testFilter', 'option1')
    })

    it('shows correct selected state for multi-select', async () => {
      const localFilters = {
        testFilter: ['option1', 'option3'],
      }

      const { getByTestId } = await render(
        <FilterSection {...mockedDefaultProps} handlerType="multi" localFilters={localFilters} />,
      )

      const chip1 = getByTestId('filter-chip-Option 1')
      const chip2 = getByTestId('filter-chip-Option 2')
      const chip3 = getByTestId('filter-chip-Option 3')

      expect(chip1.props.accessibilityState.selected).toBe(true)
      expect(chip2.props.accessibilityState.selected).toBe(false)
      expect(chip3.props.accessibilityState.selected).toBe(true)
    })

    it('handles empty array in localFilters for multi-select', async () => {
      const localFilters = {
        testFilter: [],
      }

      const { getByTestId } = await render(
        <FilterSection {...mockedDefaultProps} handlerType="multi" localFilters={localFilters} />,
      )

      const chip1 = getByTestId('filter-chip-Option 1')
      expect(chip1.props.accessibilityState.selected).toBe(false)
    })

    it('handles undefined filter key in localFilters for multi-select', async () => {
      const localFilters = {}

      const { getByTestId } = await render(
        <FilterSection {...mockedDefaultProps} handlerType="multi" localFilters={localFilters} />,
      )

      const chip1 = getByTestId('filter-chip-Option 1')
      expect(chip1.props.accessibilityState.selected).toBe(false)
    })
  })

  describe('Single-select behavior', () => {
    const mockOnSingleSelectToggle = jest.fn()

    it('calls onSingleSelectToggle when chip is pressed in single mode', async () => {
      const { getByTestId } = await render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="single"
          onSingleSelectToggle={mockOnSingleSelectToggle}
        />,
      )

      await fireEvent.press(getByTestId('filter-chip-Option 1'))

      expect(mockOnSingleSelectToggle).toHaveBeenCalledWith('testFilter', 'option1')
    })

    it('shows correct selected state for single-select', async () => {
      const localFilters = {
        testFilter: 'option2',
      }

      const { getByTestId } = await render(
        <FilterSection {...mockedDefaultProps} handlerType="single" localFilters={localFilters} />,
      )

      const chip1 = getByTestId('filter-chip-Option 1')
      const chip2 = getByTestId('filter-chip-Option 2')
      const chip3 = getByTestId('filter-chip-Option 3')

      expect(chip1.props.accessibilityState.selected).toBe(false)
      expect(chip2.props.accessibilityState.selected).toBe(true)
      expect(chip3.props.accessibilityState.selected).toBe(false)
    })
  })

  describe('Handler callbacks', () => {
    it('does not crash when onMultiSelectToggle is not provided', async () => {
      const { getByTestId } = await render(
        <FilterSection
          {...(mockedDefaultProps as any)}
          handlerType="multi"
          onMultiSelectToggle={undefined}
        />,
      )

      await fireEvent.press(getByTestId('filter-chip-Option 1'))
    })

    it('does not crash when onSingleSelectToggle is not provided', async () => {
      const { getByTestId } = await render(
        <FilterSection
          {...(mockedDefaultProps as any)}
          handlerType="single"
          onSingleSelectToggle={undefined}
        />,
      )

      await fireEvent.press(getByTestId('filter-chip-Option 1'))
    })
  })

  describe('Range options handling', () => {
    it('handles range options correctly with multi-select', async () => {
      const mockOnMultiSelectToggle = jest.fn()

      const { getByTestId } = await render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="multi"
          onMultiSelectToggle={mockOnMultiSelectToggle}
          options={mockedRangeOptions}
        />,
      )

      await fireEvent.press(getByTestId('filter-chip-0-10'))

      expect(mockOnMultiSelectToggle).toHaveBeenCalledWith('testFilter', '0-10')
    })

    it('shows correct selected state for range options', async () => {
      const localFilters = {
        testFilter: ['0-10'],
      }

      const { getByTestId } = await render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="multi"
          localFilters={localFilters}
          options={mockedRangeOptions}
        />,
      )

      const chip1 = getByTestId('filter-chip-0-10')
      expect(chip1.props.accessibilityState.selected).toBe(true)
    })
  })

  describe('Component optimization', () => {
    it('memoizes filteredOptions correctly', async () => {
      const { rerender } = await render(<FilterSection {...mockedDefaultProps} />)

      await rerender(<FilterSection {...mockedDefaultProps} />)

      await rerender(<FilterSection {...mockedDefaultProps} />)
    })

    it('handles options change correctly', async () => {
      const { getByText, rerender, queryByText } = await render(
        <FilterSection {...mockedDefaultProps} />,
      )

      expect(getByText('Option 1')).toBeTruthy()

      const newOptions = [{ label: 'New Option', value: 'new' }]
      await rerender(<FilterSection {...mockedDefaultProps} options={newOptions} />)

      expect(queryByText('Option 1')).toBeNull()
      expect(getByText('New Option')).toBeTruthy()
    })
  })

  describe('Edge cases', () => {
    it('handles options with undefined/null values', async () => {
      const edgeCaseOptions = [
        { label: 'Valid Option', value: 'valid' },
        { label: 'Null Value', value: null as any },
        { label: 'Undefined Value', value: undefined as any },
      ]

      const { getByText } = await render(
        <FilterSection {...mockedDefaultProps} options={edgeCaseOptions} />,
      )

      expect(getByText('Valid Option')).toBeTruthy()
      expect(getByText('Null Value')).toBeTruthy()
      expect(getByText('Undefined Value')).toBeTruthy()
    })

    it('handles numeric values', async () => {
      const numericOptions = [
        { label: 'Zero', value: 0 },
        { label: 'One', value: 1 },
      ]

      const mockOnMultiSelectToggle = jest.fn()
      const { getByTestId } = await render(
        <FilterSection
          {...mockedDefaultProps}
          onMultiSelectToggle={mockOnMultiSelectToggle}
          options={numericOptions}
        />,
      )

      await fireEvent.press(getByTestId('filter-chip-Zero'))

      expect(mockOnMultiSelectToggle).toHaveBeenCalledWith('testFilter', '0')
    })

    it('handles boolean values', async () => {
      const booleanOptions = [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ]

      const mockOnSingleSelectToggle = jest.fn()
      const { getByTestId } = await render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="single"
          onSingleSelectToggle={mockOnSingleSelectToggle}
          options={booleanOptions as any}
        />,
      )

      await fireEvent.press(getByTestId('filter-chip-False'))

      expect(mockOnSingleSelectToggle).toHaveBeenCalledWith('testFilter', 'false')
    })
  })
})
