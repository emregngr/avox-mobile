import { fireEvent, render } from '@testing-library/react-native'
import { View } from 'react-native'

import { ThemedButton } from '@/components/common/ThemedButton'

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}))

const mockedDefaultProps = {
  label: 'Test Button',
  onPress: jest.fn(),
}

describe('ThemedButton Component', () => {
  describe('Rendering', () => {
    it('should render with default props', async () => {
      const { getByTestId, getByText } = await render(<ThemedButton {...mockedDefaultProps} />)

      expect(getByTestId('themed-button')).toBeTruthy()
      expect(getByText('Test Button')).toBeTruthy()
    })

    it('should render with icon when provided', async () => {
      const icon = <View testID="test-icon" />
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} icon={icon} />)

      expect(getByTestId('test-icon')).toBeTruthy()
    })

    it('should not render icon container when no icon is provided', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} />)

      const button = getByTestId('themed-button')
      const children = button.props.children

      expect(Array.isArray(children)).toBeTruthy()
      expect(children.length).toBe(2)
    })
  })

  describe('Button Types', () => {
    it('should render normal type correctly', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} type="normal" />)

      const button = getByTestId('themed-button')
      expect(button.props.style).toMatchObject({
        opacity: expect.any(Number),
      })
    })

    it('should render border type correctly', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} type="border" />)

      const button = getByTestId('themed-button')
      expect(button).toBeTruthy()
    })

    it('should render social type correctly', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} type="social" />)

      const button = getByTestId('themed-button')
      expect(button).toBeTruthy()
    })

    it('should render danger type correctly', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} type="danger" />)

      const button = getByTestId('themed-button')
      expect(button).toBeTruthy()
    })
  })

  describe('Loading State', () => {
    it('should show ActivityIndicator when loading is true', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} loading />)
      const activityIndicator = getByTestId('activity-indicator')

      expect(activityIndicator).toBeTruthy()
      expect(activityIndicator.props.size).toBe('large')
    })

    it('should not show text when loading is true', async () => {
      const { queryByText } = await render(<ThemedButton {...mockedDefaultProps} loading />)

      expect(queryByText('Test Button')).toBeFalsy()
    })

    it('should not show icon when loading is true', async () => {
      const icon = <View testID="test-icon" />
      const { queryByTestId } = await render(
        <ThemedButton {...mockedDefaultProps} icon={icon} loading />,
      )

      expect(queryByTestId('test-icon')).toBeFalsy()
    })

    it('should not trigger onPress when loading', async () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = await render(
        <ThemedButton {...mockedDefaultProps} onPress={mockedOnPressMock} loading />,
      )
      await fireEvent.press(getByTestId('themed-button'))
      expect(mockedOnPressMock).not.toHaveBeenCalled()
    })

    it('should be correctly identified as disabled by accessibility tools when loading', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} loading />)
      const button = getByTestId('themed-button')

      expect(button.props.accessibilityState?.disabled).toBe(true)
    })
  })

  describe('Disabled State', () => {
    it('should be correctly identified as disabled by accessibility tools', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} disabled />)
      const button = getByTestId('themed-button')

      expect(button.props.accessibilityState?.disabled).toBe(true)
    })

    it('should not trigger onPress when disabled', async () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = await render(
        <ThemedButton {...mockedDefaultProps} onPress={mockedOnPressMock} disabled />,
      )
      await fireEvent.press(getByTestId('themed-button'))
      expect(mockedOnPressMock).not.toHaveBeenCalled()
    })
  })

  describe('Interactions', () => {
    it('should call onPress when pressed', async () => {
      const mockedOnPressMock = jest.fn()
      const { getByTestId } = await render(
        <ThemedButton {...mockedDefaultProps} onPress={mockedOnPressMock} />,
      )
      await fireEvent.press(getByTestId('themed-button'))
      expect(mockedOnPressMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper hit slop', async () => {
      const { getByTestId } = await render(<ThemedButton {...mockedDefaultProps} />)
      const button = getByTestId('themed-button')
      expect(button.props.hitSlop).toBe(20)
    })

    it('should pass through TouchableOpacity props', async () => {
      const { getByTestId } = await render(
        <ThemedButton
          {...mockedDefaultProps}
          accessibilityLabel="Custom accessibility label"
          testID="custom-test-id"
        />,
      )
      const button = getByTestId('custom-test-id')
      expect(button.props.accessibilityLabel).toBe('Custom accessibility label')
    })

    it('should apply custom className', async () => {
      const { getByTestId } = await render(
        <ThemedButton {...mockedDefaultProps} className="custom-class" />,
      )

      const button = getByTestId('themed-button')
      expect(button).toBeTruthy()
    })
  })

  describe('Integration', () => {
    it('should work with real world usage scenario', async () => {
      const mockedHandleSubmit = jest.fn()
      const { getByTestId, queryByTestId, rerender } = await render(
        <ThemedButton
          icon={<View testID="submit-icon" />}
          label="Submit Form"
          onPress={mockedHandleSubmit}
          type="normal"
        />,
      )

      const button = getByTestId('themed-button')
      expect(button.props.accessibilityState?.disabled).toBeFalsy()
      expect(getByTestId('submit-icon')).toBeTruthy()

      await fireEvent.press(button)
      expect(mockedHandleSubmit).toHaveBeenCalled()

      await rerender(
        <ThemedButton
          icon={<View testID="submit-icon" />}
          label="Submit Form"
          onPress={mockedHandleSubmit}
          type="normal"
          loading
        />,
      )

      expect(getByTestId('activity-indicator')).toBeTruthy()
      expect(queryByTestId('submit-icon')).toBeFalsy()
      expect(button.props.accessibilityState?.disabled).toBe(true)
    })
  })
})

describe('ThemedButton Component Snapshot', () => {
  it('should render the ThemedButton Component successfully', async () => {
    const { toJSON } = await render(<ThemedButton {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
