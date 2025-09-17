import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import { ThemedGradientButton } from '@/components/common/ThemedGradientButton'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props} testID="themed-text">
        {children}
      </Text>
    ),
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: (...classes: string[]) => classes.join(' '),
}))

const mockedDefaultProps = {
  label: 'Test Button',
  onPress: jest.fn(),
}

const colors = themeColors.light

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('ThemedGradientButton Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { getByText, getByTestId } = render(<ThemedGradientButton {...mockedDefaultProps} />)

      expect(getByText('Test Button')).toBeTruthy()
      expect(getByTestId('linear-gradient')).toBeTruthy()
      expect(getByTestId('themed-text')).toBeTruthy()
    })

    it('should render with icon when provided', () => {
      const icon = <View testID="test-icon" />
      const { getByTestId } = render(<ThemedGradientButton {...mockedDefaultProps} icon={icon} />)

      expect(getByTestId('test-icon')).toBeTruthy()
    })
  })

  describe('Button Types', () => {
    it('should render primary button by default', () => {
      const { getByTestId } = render(<ThemedGradientButton {...mockedDefaultProps} />)
      const linearGradient = getByTestId('linear-gradient')
      expect(linearGradient.props.colors).toEqual([
        colors.primaryGradientStart,
        colors.primaryGradientEnd,
      ])
    })

    it('should render secondary button when type is secondary', () => {
      const { getByTestId } = render(
        <ThemedGradientButton {...mockedDefaultProps} type="secondary" />,
      )
      const linearGradient = getByTestId('linear-gradient')
      expect(linearGradient.props.colors).toEqual([
        colors.secondaryGradientStart,
        colors.secondaryGradientEnd,
      ])
    })
  })

  describe('Disabled State', () => {
    it('should render disabled colors when disabled is true', () => {
      const { getByTestId } = render(<ThemedGradientButton {...mockedDefaultProps} disabled />)
      const linearGradient = getByTestId('linear-gradient')
      expect(linearGradient.props.colors).toEqual([
        colors.background.tertiary,
        colors.background.quaternary,
      ])
    })

    it('should use disabled text color when disabled', () => {
      const { getByTestId } = render(<ThemedGradientButton {...mockedDefaultProps} disabled />)
      const themedText = getByTestId('themed-text')
      expect(themedText.props.color).toBe('text-50')
    })

    it('should not trigger onPress when disabled', () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = render(
        <ThemedGradientButton
          {...mockedDefaultProps}
          onPress={mockedOnPressMock}
          testID="button-disabled"
          disabled
        />,
      )
      fireEvent.press(getByTestId('button-disabled'))
      expect(mockedOnPressMock).not.toHaveBeenCalled()
    })

    it('should be correctly identified as disabled by accessibility tools', () => {
      const { getByTestId } = render(
        <ThemedGradientButton {...mockedDefaultProps} testID="button-disabled" disabled />,
      )
      const button = getByTestId('button-disabled')

      expect(button).toBeDisabled()
    })
  })

  describe('Loading State', () => {
    it('should not show text or icon when loading is true', () => {
      const icon = <View testID="test-icon" />
      const { queryByText, queryByTestId } = render(
        <ThemedGradientButton {...mockedDefaultProps} icon={icon} loading />,
      )

      expect(queryByText('Test Button')).toBeFalsy()
      expect(queryByTestId('test-icon')).toBeFalsy()
    })

    it('should show ActivityIndicator when loading is true', () => {
      const { getByTestId } = render(<ThemedGradientButton {...mockedDefaultProps} loading />)
      const activityIndicator = getByTestId('activity-indicator')

      expect(activityIndicator).toBeTruthy()
      expect(activityIndicator.props.size).toBe('large')
    })

    it('should not trigger onPress when loading', () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = render(
        <ThemedGradientButton
          {...mockedDefaultProps}
          onPress={mockedOnPressMock}
          testID="button-loading"
          loading
        />,
      )
      fireEvent.press(getByTestId('button-loading'))
      expect(mockedOnPressMock).not.toHaveBeenCalled()
    })

    it('should be correctly identified as disabled by accessibility tools when loading', () => {
      const { getByTestId } = render(
        <ThemedGradientButton {...mockedDefaultProps} testID="button-loading" loading />,
      )
      const button = getByTestId('button-loading')

      expect(button).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    it('should call onPress when pressed', async () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = render(
        <ThemedGradientButton
          {...mockedDefaultProps}
          onPress={mockedOnPressMock}
          testID="button-press"
        />,
      )
      await fireEvent.press(getByTestId('button-press'))
      expect(mockedOnPressMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper hit slop', () => {
      const { getByTestId } = render(
        <ThemedGradientButton {...mockedDefaultProps} testID="button-hitslop" />,
      )
      const button = getByTestId('button-hitslop')
      expect(button.props.hitSlop).toBe(20)
    })

    it('passes through TouchableOpacity props', () => {
      const { getByTestId } = render(
        <ThemedGradientButton
          {...mockedDefaultProps}
          accessibilityLabel="Custom accessibility label"
          testID="custom-test-id"
        />,
      )
      const button = getByTestId('custom-test-id')
      expect(button.props.accessibilityLabel).toBe('Custom accessibility label')
    })
  })

  describe('Integration', () => {
    it('works with real world usage scenario', async () => {
      const mockedHandleSubmit = jest.fn()
      const icon = <View testID="test-icon" />
      const { getByTestId, queryByTestId, rerender } = render(
        <ThemedGradientButton
          icon={icon}
          label="Submit Form"
          onPress={mockedHandleSubmit}
          testID="submit-button"
          type="primary"
        />,
      )

      const button = getByTestId('submit-button')
      expect(button).toBeEnabled()
      expect(getByTestId('test-icon')).toBeTruthy()

      await fireEvent.press(button)
      expect(mockedHandleSubmit).toHaveBeenCalled()

      rerender(
        <ThemedGradientButton
          icon={icon}
          label="Submit Form"
          onPress={mockedHandleSubmit}
          testID="submit-button"
          type="primary"
          loading
        />,
      )

      expect(getByTestId('activity-indicator')).toBeTruthy()
      expect(queryByTestId('test-icon')).toBeFalsy()
      expect(button).toBeDisabled()
    })
  })
})

describe('ThemedGradientButton Component Snapshot', () => {
  it('should render the ThemedGradientButton Component successfully', () => {
    const { toJSON } = render(<ThemedGradientButton {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
