import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

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
    it('renders correctly with title and options', () => {
      const { getByText } = render(<FilterSection {...mockedDefaultProps} />)

      expect(getByText('Test Filter Section')).toBeTruthy()
      expect(getByText('Option 1')).toBeTruthy()
      expect(getByText('Option 2')).toBeTruthy()
      expect(getByText('Option 3')).toBeTruthy()
    })

    it('renders nothing when options is empty', () => {
      const { queryByText } = render(<FilterSection {...mockedDefaultProps} options={[]} />)

      expect(queryByText('Test Filter Section')).toBeNull()
    })

    it('renders nothing when options is null/undefined', () => {
      const { queryByText } = render(
        <FilterSection {...mockedDefaultProps} options={undefined as any} />,
      )

      expect(queryByText('Test Filter Section')).toBeNull()
    })

    it('renders with range options', () => {
      const { getByText } = render(
        <FilterSection {...mockedDefaultProps} options={mockedRangeOptions} />,
      )

      expect(getByText('0-10')).toBeTruthy()
      expect(getByText('10-20')).toBeTruthy()
    })
  })

  describe('Multi-select behavior', () => {
    const mockedOnMultiSelectToggle = jest.fn()

    it('calls onMultiSelectToggle when chip is pressed in multi mode', () => {
      const { getByTestId } = render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="multi"
          onMultiSelectToggle={mockedOnMultiSelectToggle}
        />,
      )

      fireEvent.press(getByTestId('filter-chip-Option 1'))

      expect(mockedOnMultiSelectToggle).toHaveBeenCalledWith('testFilter', 'option1')
    })

    it('shows correct selected state for multi-select', () => {
      const localFilters = {
        testFilter: ['option1', 'option3'],
      }

      const { getByTestId } = render(
        <FilterSection {...mockedDefaultProps} handlerType="multi" localFilters={localFilters} />,
      )

      const chip1 = getByTestId('filter-chip-Option 1')
      const chip2 = getByTestId('filter-chip-Option 2')
      const chip3 = getByTestId('filter-chip-Option 3')

      expect(chip1.props.accessibilityState.selected).toBe(true)
      expect(chip2.props.accessibilityState.selected).toBe(false)
      expect(chip3.props.accessibilityState.selected).toBe(true)
    })

    it('handles empty array in localFilters for multi-select', () => {
      const localFilters = {
        testFilter: [],
      }

      const { getByTestId } = render(
        <FilterSection {...mockedDefaultProps} handlerType="multi" localFilters={localFilters} />,
      )

      const chip1 = getByTestId('filter-chip-Option 1')
      expect(chip1.props.accessibilityState.selected).toBe(false)
    })

    it('handles undefined filter key in localFilters for multi-select', () => {
      const localFilters = {}

      const { getByTestId } = render(
        <FilterSection {...mockedDefaultProps} handlerType="multi" localFilters={localFilters} />,
      )

      const chip1 = getByTestId('filter-chip-Option 1')
      expect(chip1.props.accessibilityState.selected).toBe(false)
    })
  })

  describe('Single-select behavior', () => {
    const mockOnSingleSelectToggle = jest.fn()

    it('calls onSingleSelectToggle when chip is pressed in single mode', () => {
      const { getByTestId } = render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="single"
          onSingleSelectToggle={mockOnSingleSelectToggle}
        />,
      )

      fireEvent.press(getByTestId('filter-chip-Option 1'))

      expect(mockOnSingleSelectToggle).toHaveBeenCalledWith('testFilter', 'option1')
    })

    it('shows correct selected state for single-select', () => {
      const localFilters = {
        testFilter: 'option2',
      }

      const { getByTestId } = render(
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
    it('does not crash when onMultiSelectToggle is not provided', () => {
      const { getByTestId } = render(
        <FilterSection
          {...(mockedDefaultProps as any)}
          handlerType="multi"
          onMultiSelectToggle={undefined}
        />,
      )

      expect(() => {
        fireEvent.press(getByTestId('filter-chip-Option 1'))
      }).not.toThrow()
    })

    it('does not crash when onSingleSelectToggle is not provided', () => {
      const { getByTestId } = render(
        <FilterSection
          {...(mockedDefaultProps as any)}
          handlerType="single"
          onSingleSelectToggle={undefined}
        />,
      )

      expect(() => {
        fireEvent.press(getByTestId('filter-chip-Option 1'))
      }).not.toThrow()
    })
  })

  describe('Range options handling', () => {
    it('handles range options correctly with multi-select', () => {
      const mockOnMultiSelectToggle = jest.fn()

      const { getByTestId } = render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="multi"
          onMultiSelectToggle={mockOnMultiSelectToggle}
          options={mockedRangeOptions}
        />,
      )

      fireEvent.press(getByTestId('filter-chip-0-10'))

      expect(mockOnMultiSelectToggle).toHaveBeenCalledWith('testFilter', '0-10')
    })

    it('shows correct selected state for range options', () => {
      const localFilters = {
        testFilter: ['0-10'],
      }

      const { getByTestId } = render(
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
    it('memoizes filteredOptions correctly', () => {
      const { rerender } = render(<FilterSection {...mockedDefaultProps} />)

      rerender(<FilterSection {...mockedDefaultProps} />)

      expect(() => {
        rerender(<FilterSection {...mockedDefaultProps} />)
      }).not.toThrow()
    })

    it('handles options change correctly', () => {
      const { getByText, rerender, queryByText } = render(<FilterSection {...mockedDefaultProps} />)

      expect(getByText('Option 1')).toBeTruthy()

      const newOptions = [{ label: 'New Option', value: 'new' }]
      rerender(<FilterSection {...mockedDefaultProps} options={newOptions} />)

      expect(queryByText('Option 1')).toBeNull()
      expect(getByText('New Option')).toBeTruthy()
    })
  })

  describe('Edge cases', () => {
    it('handles options with undefined/null values', () => {
      const edgeCaseOptions = [
        { label: 'Valid Option', value: 'valid' },
        { label: 'Null Value', value: null as any },
        { label: 'Undefined Value', value: undefined as any },
      ]

      const { getByText } = render(
        <FilterSection {...mockedDefaultProps} options={edgeCaseOptions} />,
      )

      expect(getByText('Valid Option')).toBeTruthy()
      expect(getByText('Null Value')).toBeTruthy()
      expect(getByText('Undefined Value')).toBeTruthy()
    })

    it('handles numeric values', () => {
      const numericOptions = [
        { label: 'Zero', value: 0 },
        { label: 'One', value: 1 },
      ]

      const mockOnMultiSelectToggle = jest.fn()
      const { getByTestId } = render(
        <FilterSection
          {...mockedDefaultProps}
          onMultiSelectToggle={mockOnMultiSelectToggle}
          options={numericOptions}
        />,
      )

      fireEvent.press(getByTestId('filter-chip-Zero'))

      expect(mockOnMultiSelectToggle).toHaveBeenCalledWith('testFilter', '0')
    })

    it('handles boolean values', () => {
      const booleanOptions = [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ]

      const mockOnSingleSelectToggle = jest.fn()
      const { getByTestId } = render(
        <FilterSection
          {...mockedDefaultProps}
          handlerType="single"
          onSingleSelectToggle={mockOnSingleSelectToggle}
          options={booleanOptions as any}
        />,
      )

      fireEvent.press(getByTestId('filter-chip-False'))

      expect(mockOnSingleSelectToggle).toHaveBeenCalledWith('testFilter', 'false')
    })
  })
})
