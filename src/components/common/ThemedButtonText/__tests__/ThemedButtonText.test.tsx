import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import { ThemedButtonText } from '@/components/common/ThemedButtonText'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text testID="themed-text" {...props}>
        {children}
      </Text>
    ),
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}))

const mockedRequiredProps = {
  label: 'Test Button',
  textColor: 'text-100',
}

describe('ThemedButtonText Component', () => {
  it('renders correctly with required props', () => {
    const { getByText, getByTestId } = render(<ThemedButtonText {...mockedRequiredProps} />)

    expect(getByText('Test Button')).toBeTruthy()
    expect(getByTestId('themed-text')).toBeTruthy()
  })

  it('renders with default values', () => {
    const { getByTestId } = render(<ThemedButtonText {...mockedRequiredProps} />)

    const themedText = getByTestId('themed-text')
    expect(themedText).toBeTruthy()
  })

  describe('Props Handling', () => {
    it('applies custom containerStyle', () => {
      const { getByTestId } = render(
        <ThemedButtonText
          {...mockedRequiredProps}
          containerStyle="custom-container-style"
          testID="pressable-button"
        />,
      )

      const pressable = getByTestId('pressable-button')
      expect(pressable).toBeTruthy()
    })

    it('applies custom textStyle', () => {
      const { getByTestId } = render(
        <ThemedButtonText {...mockedRequiredProps} textStyle="custom-text-style" />,
      )

      const themedText = getByTestId('themed-text')
      expect(themedText.props.className).toBe('custom-text-style')
    })

    it('uses custom typography type', () => {
      const { getByTestId } = render(<ThemedButtonText {...mockedRequiredProps} type="h1" />)

      const themedText = getByTestId('themed-text')
      expect(themedText.props.type).toBe('h1')
    })

    it('uses custom textColor', () => {
      const { getByTestId } = render(
        <ThemedButtonText {...mockedRequiredProps} textColor="text-primary" />,
      )

      const themedText = getByTestId('themed-text')
      expect(themedText.props.color).toBe('text-primary')
    })

    it('applies custom hitSlop', () => {
      const { getByTestId } = render(
        <ThemedButtonText {...mockedRequiredProps} hitSlop={30} testID="pressable-button" />,
      )

      const pressable = getByTestId('pressable-button')
      expect(pressable.props.hitSlop).toBe(30)
    })
  })

  describe('Icon Rendering', () => {
    it('renders without icon by default', () => {
      const { queryByTestId } = render(<ThemedButtonText {...mockedRequiredProps} />)

      expect(queryByTestId('test-icon')).toBeFalsy()
    })

    it('renders with icon when provided', () => {
      const icon = <View testID="test-icon" />
      const { getByTestId } = render(<ThemedButtonText {...mockedRequiredProps} icon={icon} />)

      expect(getByTestId('test-icon')).toBeTruthy()
    })
  })

  describe('Press Handling', () => {
    it('calls onPress when pressed', () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = render(
        <ThemedButtonText
          {...mockedRequiredProps}
          onPress={mockedOnPressMock}
          testID="pressable-button"
        />,
      )

      fireEvent.press(getByTestId('pressable-button'))
      expect(mockedOnPressMock).toHaveBeenCalledTimes(1)
    })

    it('does not crash when onPress is not provided', () => {
      const { getByTestId } = render(
        <ThemedButtonText {...mockedRequiredProps} testID="pressable-button" />,
      )

      expect(() => {
        fireEvent.press(getByTestId('pressable-button'))
      }).not.toThrow()
    })
  })

  describe('Rest Props', () => {
    it('passes through additional Pressable props', () => {
      const { getByTestId } = render(
        <ThemedButtonText
          {...mockedRequiredProps}
          accessibilityLabel="Custom accessibility label"
          accessibilityRole="button"
          testID="custom-test-id"
        />,
      )

      const pressable = getByTestId('custom-test-id')
      expect(pressable.props.accessibilityLabel).toBe('Custom accessibility label')
      expect(pressable.props.accessibilityRole).toBe('button')
    })
  })
})

describe('ThemedButtonText Component Snapshot', () => {
  it('should render the ThemedButtonText Component successfully', () => {
    const { toJSON } = render(<ThemedButtonText {...mockedRequiredProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
