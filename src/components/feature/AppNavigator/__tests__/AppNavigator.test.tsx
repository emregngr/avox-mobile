import { render } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import React from 'react'

import { AppNavigator } from '@/components/feature/AppNavigator'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('expo-router', () => {
  const { View } = require('react-native')

  const MockedStack = ({
    children,
    screenOptions,
  }: {
    children: ReactNode
    screenOptions: any
  }) => (
    <View data-screenOptions={screenOptions} testID="MockedStack">
      {children}
    </View>
  )

  const MockedScreen = (props: { name: string }) => (
    <View testID={`MockedStackScreen-${props.name}`} />
  )

  const MockedProtected = ({ children }: { children: ReactNode }) => (
    <View testID="MockedStackProtected">{children}</View>
  )

  MockedStack.Screen = MockedScreen
  MockedStack.Protected = MockedProtected

  return { Stack: MockedStack }
})

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('AppNavigator Component', () => {
  it('should render only the "index" screen when isAppReady is false', () => {
    const { getByTestId, queryByTestId } = render(<AppNavigator isAppReady={false} />)

    expect(getByTestId('MockedStackScreen-index')).toBeTruthy()
    expect(queryByTestId('MockedStackScreen-(auth)')).toBeNull()
    expect(queryByTestId('MockedStackScreen-(tabs)')).toBeNull()
  })

  it('should render all screens when isAppReady is true', () => {
    const { getByTestId } = render(<AppNavigator isAppReady />)

    expect(getByTestId('MockedStackScreen-index')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(auth)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(tabs)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(onboarding)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(maintenance)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(force-update)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(account)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(settings)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(airline)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(airport)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(breaking-news)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(destination)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(airplane)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-token-expire')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(web-view-modal)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-(image-modal)')).toBeTruthy()
    expect(getByTestId('MockedStackScreen-storybook')).toBeTruthy()
  })

  it('should pass the correct screenOptions prop to the Stack component based on the selected theme', () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })

    const expectedBackgroundColor = themeColors.dark.background.blur

    const { getByTestId } = render(<AppNavigator isAppReady />)

    const stack = getByTestId('MockedStack')
    const passedOptions = stack.props['data-screenOptions']

    expect(passedOptions.contentStyle.backgroundColor).toBe(expectedBackgroundColor)
    expect(passedOptions.animation).toBe('slide_from_bottom')
    expect(passedOptions.headerShown).toBe(false)
  })
})

describe('AppNavigator Component Snapshot', () => {
  it('should render the AppNavigator Component successfully', () => {
    const { toJSON } = render(<AppNavigator isAppReady />)

    expect(toJSON()).toMatchSnapshot()
  })
})
