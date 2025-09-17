import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { ProfileItem } from '@/components/common/ProfileItem'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/assets/icons/right.svg', () => 'Right')

jest.mock('@/components/common/ThemedText', () => {
  const { Text } = require('react-native')

  return {
    ThemedText: ({ children, ...props }: { children: string }) => (
      <Text {...props}>{children}</Text>
    ),
  }
})

const MockedCustomIcon = ({ color, height, width }: any) => {
  const { View } = require('react-native')
  return <View style={{ color, height, width }} testID="custom-icon" />
}

const mockedDefaultProps = {
  label: 'Test Label',
  onPress: jest.fn(),
}

const colors = themeColors.light

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('ProfileItem Component', () => {
  describe('Rendering', () => {
    it('renders with basic props', () => {
      const { getByText } = render(<ProfileItem {...mockedDefaultProps} />)

      expect(getByText('Test Label')).toBeTruthy()
    })

    it('renders with MaterialCommunityIcons when leftIcon is provided', () => {
      const { getByTestId } = render(<ProfileItem {...mockedDefaultProps} leftIcon="account" />)

      expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
    })

    it('renders with custom left icon when customLeftIcon is provided', () => {
      const { getByTestId } = render(
        <ProfileItem {...mockedDefaultProps} customLeftIcon={MockedCustomIcon} />,
      )

      expect(getByTestId('custom-icon')).toBeTruthy()
    })

    it('renders right icon by default', () => {
      const { getByTestId } = render(<ProfileItem {...mockedDefaultProps} />)

      expect(getByTestId('right-icon')).toBeTruthy()
    })

    it('does not render right icon when rightIcon is false', () => {
      const { queryByTestId } = render(<ProfileItem {...mockedDefaultProps} rightIcon={false} />)

      expect(queryByTestId('right-icon')).toBeFalsy()
    })

    it('renders separator when not the last item', () => {
      const { getByTestId } = render(<ProfileItem {...mockedDefaultProps} isLastItem={false} />)

      expect(getByTestId('separator')).toBeTruthy()
    })

    it('does not render separator when isLastItem is true', () => {
      const { queryByTestId } = render(<ProfileItem {...mockedDefaultProps} isLastItem />)

      expect(queryByTestId('separator')).toBeFalsy()
    })
  })

  describe('Styling', () => {
    it('applies danger styling when danger prop is true', () => {
      const { getByTestId } = render(
        <ProfileItem {...mockedDefaultProps} leftIcon="account" danger />,
      )

      const icon = getByTestId('mocked-material-community-icon')
      expect(icon.props.color).toBe(colors?.error)
    })

    it('applies normal styling when danger prop is false', () => {
      const { getByTestId } = render(
        <ProfileItem {...mockedDefaultProps} danger={false} leftIcon="account" />,
      )

      const icon = getByTestId('mocked-material-community-icon')
      expect(icon.props.color).toBe(colors?.onPrimary100)
    })

    it('applies correct icon size', () => {
      const { getByTestId } = render(<ProfileItem {...mockedDefaultProps} leftIcon="account" />)

      const icon = getByTestId('mocked-material-community-icon')
      expect(icon.props.size).toBe(24)
    })
  })

  describe('Interaction', () => {
    it('calls onPress when TouchableOpacity is pressed', () => {
      const mockedOnPress = jest.fn()
      const { getByTestId } = render(
        <ProfileItem {...mockedDefaultProps} onPress={mockedOnPress} />,
      )

      const touchable = getByTestId('profile-item-touchable')
      fireEvent.press(touchable)

      expect(mockedOnPress).toHaveBeenCalledTimes(1)
    })

    it('has correct hitSlop configuration', () => {
      const { getByTestId } = render(<ProfileItem {...mockedDefaultProps} />)

      const touchableOpacity = getByTestId('profile-item-touchable')
      expect(touchableOpacity.props.hitSlop).toEqual({ left: 20, right: 20 })
    })
  })

  describe('Icon Priority', () => {
    it('prioritizes leftIcon over customLeftIcon when both are provided', () => {
      const { getByTestId, queryByTestId } = render(
        <ProfileItem
          {...mockedDefaultProps}
          customLeftIcon={MockedCustomIcon}
          leftIcon="account"
        />,
      )

      expect(getByTestId('mocked-material-community-icon')).toBeTruthy()
      expect(queryByTestId('custom-icon')).toBeFalsy()
    })

    it('uses customLeftIcon when leftIcon is not provided', () => {
      const { getByTestId, queryByTestId } = render(
        <ProfileItem {...mockedDefaultProps} customLeftIcon={MockedCustomIcon} />,
      )

      expect(getByTestId('custom-icon')).toBeTruthy()
      expect(queryByTestId('mocked-material-community-icon')).toBeFalsy()
    })
  })

  describe('Theme Integration', () => {
    it('uses theme colors correctly', () => {
      const { getByTestId } = render(<ProfileItem {...mockedDefaultProps} leftIcon="account" />)

      const icon = getByTestId('mocked-material-community-icon')
      expect(icon.props.color).toBe(colors?.onPrimary100)
    })
  })

  describe('Edge Cases', () => {
    it('handles missing theme colors gracefully', () => {
      const component = render(<ProfileItem {...mockedDefaultProps} />)
      expect(component).toBeTruthy()
    })

    it('handles empty label', () => {
      const { getByText } = render(<ProfileItem {...mockedDefaultProps} label="" />)

      expect(getByText('')).toBeTruthy()
    })
  })
})

describe('ProfileItem Component Snapshot', () => {
  it('renders the ProfileItem Component successfully', () => {
    const { toJSON } = render(<ProfileItem {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
