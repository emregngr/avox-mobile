import { fireEvent, render } from '@testing-library/react-native'
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
    it('should render with default props', async () => {
      const { getByText, getByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} />,
      )

      expect(getByText('Test Button')).toBeTruthy()
      expect(getByTestId('linear-gradient')).toBeTruthy()
      expect(getByTestId('themed-text')).toBeTruthy()
    })

    it('should render with icon when provided', async () => {
      const icon = <View testID="test-icon" />
      const { getByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} icon={icon} />,
      )

      expect(getByTestId('test-icon')).toBeTruthy()
    })
  })

  describe('Button Types', () => {
    it('should render primary button by default', async () => {
      const { getByTestId } = await render(<ThemedGradientButton {...mockedDefaultProps} />)
      const linearGradient = getByTestId('linear-gradient')
      expect(linearGradient.props.colors).toEqual([
        colors.primaryGradientStart,
        colors.primaryGradientEnd,
      ])
    })

    it('should render secondary button when type is secondary', async () => {
      const { getByTestId } = await render(
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
    it('should render disabled colors when disabled is true', async () => {
      const { getByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} disabled />,
      )
      const linearGradient = getByTestId('linear-gradient')
      expect(linearGradient.props.colors).toEqual([
        colors.background.tertiary,
        colors.background.quaternary,
      ])
    })

    it('should use disabled text color when disabled', async () => {
      const { getByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} disabled />,
      )
      const themedText = getByTestId('themed-text')
      expect(themedText.props.color).toBe('text-50')
    })

    it('should not trigger onPress when disabled', async () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = await render(
        <ThemedGradientButton
          {...mockedDefaultProps}
          onPress={mockedOnPressMock}
          testID="button-disabled"
          disabled
        />,
      )
      await fireEvent.press(getByTestId('button-disabled'))
      expect(mockedOnPressMock).not.toHaveBeenCalled()
    })

    it('should be correctly identified as disabled by accessibility tools', async () => {
      const { getByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} testID="button-disabled" disabled />,
      )
      const button = getByTestId('button-disabled')

      expect(button).toBeDisabled()
    })
  })

  describe('Loading State', () => {
    it('should not show text or icon when loading is true', async () => {
      const icon = <View testID="test-icon" />
      const { queryByText, queryByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} icon={icon} loading />,
      )

      expect(queryByText('Test Button')).toBeFalsy()
      expect(queryByTestId('test-icon')).toBeFalsy()
    })

    it('should show ActivityIndicator when loading is true', async () => {
      const { getByTestId } = await render(<ThemedGradientButton {...mockedDefaultProps} loading />)
      const activityIndicator = getByTestId('activity-indicator')

      expect(activityIndicator).toBeTruthy()
      expect(activityIndicator.props.size).toBe('large')
    })

    it('should not trigger onPress when loading', async () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = await render(
        <ThemedGradientButton
          {...mockedDefaultProps}
          onPress={mockedOnPressMock}
          testID="button-loading"
          loading
        />,
      )
      await fireEvent.press(getByTestId('button-loading'))
      expect(mockedOnPressMock).not.toHaveBeenCalled()
    })

    it('should be correctly identified as disabled by accessibility tools when loading', async () => {
      const { getByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} testID="button-loading" loading />,
      )
      const button = getByTestId('button-loading')

      expect(button).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    it('should call onPress when pressed', async () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = await render(
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
    it('should have proper hit slop', async () => {
      const { getByTestId } = await render(
        <ThemedGradientButton {...mockedDefaultProps} testID="button-hitslop" />,
      )
      const button = getByTestId('button-hitslop')
      expect(button.props.hitSlop).toBe(20)
    })

    it('passes through TouchableOpacity props', async () => {
      const { getByTestId } = await render(
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
      const { getByTestId, queryByTestId, rerender } = await render(
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

      await rerender(
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
  it('should render the ThemedGradientButton Component successfully', async () => {
    const { toJSON } = await render(<ThemedGradientButton {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
