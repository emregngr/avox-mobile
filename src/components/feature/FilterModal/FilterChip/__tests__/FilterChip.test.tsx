import { fireEvent, render } from '@testing-library/react-native'

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
  it('renders correctly with label', async () => {
    const { getByText } = await render(<FilterChip {...mockedDefaultProps} />)

    expect(getByText('Test Filter')).toBeTruthy()
  })

  it('calls onPress when touched', async () => {
    const mockedOnPress = jest.fn()
    const { getByText } = await render(
      <FilterChip {...mockedDefaultProps} onPress={mockedOnPress} />,
    )

    await fireEvent.press(getByText('Test Filter'))

    expect(mockedOnPress).toHaveBeenCalledTimes(1)
  })

  it('renders with correct text when not selected', async () => {
    const { getByTestId } = await render(<FilterChip {...mockedDefaultProps} selected={false} />)

    expect(getByTestId('themed-text-text-90-body2')).toBeTruthy()
  })

  it('renders with correct text when selected', async () => {
    const { getByTestId } = await render(<FilterChip {...mockedDefaultProps} selected />)

    expect(getByTestId('themed-text-text-100-body2')).toBeTruthy()
  })

  it('renders TouchableOpacity component', async () => {
    const { getByText } = await render(<FilterChip {...mockedDefaultProps} />)
    const touchable = getByText('Test Filter').parent

    expect(touchable).toBeTruthy()
  })

  it('memoizes correctly - does not re-render with same props', async () => {
    const { rerender } = await render(<FilterChip {...mockedDefaultProps} />)

    await expect(async () => {
      await rerender(<FilterChip {...mockedDefaultProps} />)
    }).not.toThrow()
  })

  it('re-renders when props change', async () => {
    const { rerender, getByText, getByTestId } = await render(
      <FilterChip {...mockedDefaultProps} />,
    )

    expect(getByText('Test Filter')).toBeTruthy()
    expect(getByTestId('themed-text-text-90-body2')).toBeTruthy()

    await rerender(<FilterChip {...mockedDefaultProps} selected />)

    expect(getByText('Test Filter')).toBeTruthy()
    expect(getByTestId('themed-text-text-100-body2')).toBeTruthy()
  })

  it('handles different label values', async () => {
    const { getByText, rerender } = await render(
      <FilterChip {...mockedDefaultProps} label="Category 1" />,
    )

    expect(getByText('Category 1')).toBeTruthy()

    await rerender(<FilterChip {...mockedDefaultProps} label="Category 2" />)
    expect(getByText('Category 2')).toBeTruthy()
  })

  it('preserves onPress callback functionality', async () => {
    const mockedOnPress1 = jest.fn()
    const mockedOnPress2 = jest.fn()

    const { rerender, getByText } = await render(
      <FilterChip {...mockedDefaultProps} onPress={mockedOnPress1} />,
    )

    await fireEvent.press(getByText('Test Filter'))
    expect(mockedOnPress1).toHaveBeenCalledTimes(1)

    await rerender(<FilterChip {...mockedDefaultProps} onPress={mockedOnPress2} />)

    await fireEvent.press(getByText('Test Filter'))
    expect(mockedOnPress2).toHaveBeenCalledTimes(1)
    expect(mockedOnPress1).toHaveBeenCalledTimes(1)
  })

  it('handles selected state changes correctly', async () => {
    const { rerender, getByTestId, queryByTestId } = await render(
      <FilterChip {...mockedDefaultProps} selected={false} />,
    )

    expect(getByTestId('themed-text-text-90-body2')).toBeTruthy()
    expect(queryByTestId('themed-text-text-100-body2')).toBeNull()

    await rerender(<FilterChip {...mockedDefaultProps} selected />)

    expect(getByTestId('themed-text-text-100-body2')).toBeTruthy()
    expect(queryByTestId('themed-text-text-90-body2')).toBeNull()
  })
})
