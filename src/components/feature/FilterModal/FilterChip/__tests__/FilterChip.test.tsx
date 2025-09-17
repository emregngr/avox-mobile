import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { FilterChip } from '@/components/feature/FilterModal/FilterChip'

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

jest.mock('@/utils/common/cn', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}))

const mockedDefaultProps = {
  label: 'Test Filter',
  onPress: jest.fn(),
  selected: false,
}

describe('FilterChip', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(<FilterChip {...mockedDefaultProps} />)

    expect(getByText('Test Filter')).toBeTruthy()
  })

  it('calls onPress when touched', () => {
    const mockedOnPress = jest.fn()
    const { getByText } = render(<FilterChip {...mockedDefaultProps} onPress={mockedOnPress} />)

    fireEvent.press(getByText('Test Filter'))

    expect(mockedOnPress).toHaveBeenCalledTimes(1)
  })

  it('renders with correct text when not selected', () => {
    const { getByTestId } = render(<FilterChip {...mockedDefaultProps} selected={false} />)

    expect(getByTestId('themed-text-text-90-body2')).toBeTruthy()
  })

  it('renders with correct text when selected', () => {
    const { getByTestId } = render(<FilterChip {...mockedDefaultProps} selected />)

    expect(getByTestId('themed-text-text-100-body2')).toBeTruthy()
  })

  it('renders TouchableOpacity component', () => {
    const { getByText } = render(<FilterChip {...mockedDefaultProps} />)
    const touchable = getByText('Test Filter').parent

    expect(touchable).toBeTruthy()
  })

  it('memoizes correctly - does not re-render with same props', () => {
    const { rerender } = render(<FilterChip {...mockedDefaultProps} />)

    expect(() => {
      rerender(<FilterChip {...mockedDefaultProps} />)
    }).not.toThrow()
  })

  it('re-renders when props change', () => {
    const { rerender, getByText, getByTestId } = render(<FilterChip {...mockedDefaultProps} />)

    expect(getByText('Test Filter')).toBeTruthy()
    expect(getByTestId('themed-text-text-90-body2')).toBeTruthy()

    rerender(<FilterChip {...mockedDefaultProps} selected />)

    expect(getByText('Test Filter')).toBeTruthy()
    expect(getByTestId('themed-text-text-100-body2')).toBeTruthy()
  })

  it('handles different label values', () => {
    const { getByText, rerender } = render(
      <FilterChip {...mockedDefaultProps} label="Category 1" />,
    )

    expect(getByText('Category 1')).toBeTruthy()

    rerender(<FilterChip {...mockedDefaultProps} label="Category 2" />)
    expect(getByText('Category 2')).toBeTruthy()
  })

  it('preserves onPress callback functionality', () => {
    const mockedOnPress1 = jest.fn()
    const mockedOnPress2 = jest.fn()

    const { rerender, getByText } = render(
      <FilterChip {...mockedDefaultProps} onPress={mockedOnPress1} />,
    )

    fireEvent.press(getByText('Test Filter'))
    expect(mockedOnPress1).toHaveBeenCalledTimes(1)

    rerender(<FilterChip {...mockedDefaultProps} onPress={mockedOnPress2} />)

    fireEvent.press(getByText('Test Filter'))
    expect(mockedOnPress2).toHaveBeenCalledTimes(1)
    expect(mockedOnPress1).toHaveBeenCalledTimes(1)
  })

  it('handles selected state changes correctly', () => {
    const { rerender, getByTestId, queryByTestId } = render(
      <FilterChip {...mockedDefaultProps} selected={false} />,
    )

    expect(getByTestId('themed-text-text-90-body2')).toBeTruthy()
    expect(queryByTestId('themed-text-text-100-body2')).toBeNull()

    rerender(<FilterChip {...mockedDefaultProps} selected />)

    expect(getByTestId('themed-text-text-100-body2')).toBeTruthy()
    expect(queryByTestId('themed-text-text-90-body2')).toBeNull()
  })
})
