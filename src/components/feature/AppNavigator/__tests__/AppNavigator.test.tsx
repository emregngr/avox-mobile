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
    <View data-screenOptions={screenOptions} testID="MockStack">
      {children}
    </View>
  )

  const MockScreen = (props: { name: string }) => <View testID={`MockStackScreen-${props.name}`} />

  MockedStack.Screen = MockScreen

  return {
    Stack: MockedStack,
  }
})

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('AppNavigator Component', () => {
  it('should render only the "index" screen when isAppReady is false', () => {
    const { getByTestId, queryByTestId } = render(<AppNavigator isAppReady={false} />)

    expect(getByTestId('MockStackScreen-index')).toBeTruthy()
    expect(queryByTestId('MockStackScreen-(auth)')).toBeNull()
    expect(queryByTestId('MockStackScreen-(tabs)')).toBeNull()
  })

  it('should render all screens when isAppReady is true', () => {
    const { getByTestId } = render(<AppNavigator isAppReady />)

    expect(getByTestId('MockStackScreen-index')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(auth)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(tabs)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(onboarding)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(maintenance)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(force-update)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(account)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(settings)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(airline)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(airport)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(breaking-news)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(destination)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(airplane)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-token-expire')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(web-view-modal)')).toBeTruthy()
    expect(getByTestId('MockStackScreen-(image-modal)')).toBeTruthy()
  })

  it('should pass the correct screenOptions prop to the Stack component based on the selected theme', () => {
    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })

    const expectedBackgroundColor = themeColors.dark.background.blur

    const { getByTestId } = render(<AppNavigator isAppReady />)

    const stack = getByTestId('MockStack')
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
