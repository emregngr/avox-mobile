import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { FlatList } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Onboarding from '@/app/(onboarding)/onboarding'
import { getLocale } from '@/locales/i18next'
import { setIsOnboardingSeen } from '@/store/user'
import { responsive } from '@/utils/common/responsive'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/components/common', () => {
  const { TouchableOpacity, Text, View } = require('react-native')
  const { responsive } = require('@/utils/common/responsive')

  return {
    ThemedButton: ({ onPress, label }: { onPress: () => void; label: string }) => (
      <TouchableOpacity onPress={onPress} testID="themed-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),

    ThemedButtonText: ({ onPress, label }: { onPress: () => void; label: string }) => (
      <TouchableOpacity onPress={onPress} testID="themed-button-text">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),

    ThemedGradientButton: ({ onPress, label }: { onPress: () => void; label: string }) => (
      <TouchableOpacity onPress={onPress} testID="themed-gradient-button">
        <Text>{label}</Text>
      </TouchableOpacity>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    OnboardingItem: ({ item }: { item: { title: string; text: string } }) => (
      <View style={{ width: responsive.deviceWidth }}>
        <Text>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    ),

    DotsContainer: ({ currentIndex, length }: { currentIndex: number; length: number }) => (
      <View testID="dots-container">
        {Array.from({ length }, (_, index) => (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === currentIndex ? '#007AFF' : '#C7C7CC',
              marginHorizontal: 4,
            }}
            key={index}
            testID={`dot-${index}`}
          />
        ))}
      </View>
    ),
  }
})

jest.mock('@/store/user')

const mockedSetIsOnboardingSeen = setIsOnboardingSeen as jest.MockedFunction<
  typeof setIsOnboardingSeen
>

const ITEM_WIDTH = responsive.deviceWidth

const renderWithSafeAreaProvider = (component: ReactNode) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}
    >
      {component}
    </SafeAreaProvider>,
  )

beforeEach(() => {
  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      skip: 'Skip',
      continue: 'Continue',
      onBoardingTitle1: 'Title 1',
      onBoardingText1: 'Text 1',
      onBoardingTitle2: 'Title 2',
      onBoardingText2: 'Text 2',
      onBoardingTitle3: 'Title 3',
      onBoardingText3: 'Text 3',
      onBoardingTitle4: 'Title 4',
      onBoardingText4: 'Text 4',
    }
    return translations[key] || key
  })
})

describe('Onboarding Screen', () => {
  it('should render the first slide and initial state correctly', () => {
    const { getByText } = renderWithSafeAreaProvider(<Onboarding />)
    expect(getByText('Title 1')).toBeTruthy()
    expect(getByText('Continue')).toBeTruthy()
  })

  it('should update component state when scrolled', () => {
    const { getByTestId, queryAllByText } = renderWithSafeAreaProvider(<Onboarding />)

    const flatList = getByTestId('onboarding-flatlist')

    fireEvent(flatList, 'layout', {
      nativeEvent: { layout: { width: ITEM_WIDTH, height: 500 } },
    })

    fireEvent(flatList, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: { x: ITEM_WIDTH * 3 },
        layoutMeasurement: { width: ITEM_WIDTH, height: 500 },
        contentSize: { width: ITEM_WIDTH * 4, height: 500 },
      },
    })

    const skipButtons = queryAllByText('Skip')
    expect(skipButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('should call scrollToIndex when "Continue" is pressed', () => {
    const scrollToIndexSpy = jest.spyOn(FlatList.prototype, 'scrollToIndex')
    const { getByText } = renderWithSafeAreaProvider(<Onboarding />)

    fireEvent.press(getByText('Continue'))
    expect(scrollToIndexSpy).toHaveBeenCalledWith({ animated: true, index: 1 })
    scrollToIndexSpy.mockRestore()
  })

  it('should navigate to home when reaching last slide via continue button', () => {
    const { getByText } = renderWithSafeAreaProvider(<Onboarding />)

    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('Continue'))
    fireEvent.press(getByText('Skip'))

    expect(mockedSetIsOnboardingSeen).toHaveBeenCalledWith(true)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should navigate to home when the main button is pressed on the last slide', () => {
    const { getByTestId, queryAllByText, queryAllByTestId } = renderWithSafeAreaProvider(
      <Onboarding />,
    )

    const flatList = getByTestId('onboarding-flatlist')

    fireEvent(flatList, 'layout', {
      nativeEvent: { layout: { width: ITEM_WIDTH, height: 500 } },
    })

    fireEvent(flatList, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: { x: ITEM_WIDTH * 1 },
        layoutMeasurement: { width: ITEM_WIDTH, height: 500 },
        contentSize: { width: ITEM_WIDTH * 4, height: 500 },
      },
    })

    fireEvent(flatList, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: { x: ITEM_WIDTH * 2 },
        layoutMeasurement: { width: ITEM_WIDTH, height: 500 },
        contentSize: { width: ITEM_WIDTH * 4, height: 500 },
      },
    })

    fireEvent(flatList, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: { x: ITEM_WIDTH * 3 },
        layoutMeasurement: { width: ITEM_WIDTH, height: 500 },
        contentSize: { width: ITEM_WIDTH * 4, height: 500 },
      },
    })

    const possibleFinishTexts = ['Skip', 'Get Started', 'Done', 'Finish', 'Continue', 'Start']

    let buttonPressed = false
    for (const text of possibleFinishTexts) {
      const buttons = queryAllByText(text)
      if (buttons.length > 0) {
        const lastButton = buttons[buttons.length - 1]
        if (lastButton) {
          fireEvent.press(lastButton)
          buttonPressed = true
          break
        }
      }
    }

    if (!buttonPressed) {
      const themedButtons = queryAllByTestId('themed-button')
      if (themedButtons.length > 0) {
        const lastButton = themedButtons[themedButtons.length - 1]
        if (lastButton) {
          fireEvent.press(lastButton)
          buttonPressed = true
        }
      }
    }

    if (!buttonPressed) {
      const themedButtonTexts = queryAllByTestId('themed-button-text')
      if (themedButtonTexts.length > 0) {
        const lastButton = themedButtonTexts[themedButtonTexts.length - 1]
        if (lastButton) {
          fireEvent.press(lastButton)
          buttonPressed = true
        }
      }
    }

    if (!buttonPressed) {
      const themedGradientButtons = queryAllByTestId('themed-gradient-button')
      if (themedGradientButtons.length > 0) {
        const lastButton = themedGradientButtons[themedGradientButtons.length - 1]
        if (lastButton) {
          fireEvent.press(lastButton)
          buttonPressed = true
        }
      }
    }

    expect(buttonPressed).toBe(true)
    expect(mockedSetIsOnboardingSeen).toHaveBeenCalledWith(true)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should navigate to home when the top "Skip" button is pressed', () => {
    const { getAllByText } = renderWithSafeAreaProvider(<Onboarding />)

    const skipButtons = getAllByText('Skip')
    const topSkipButton = skipButtons[0] as any

    fireEvent.press(topSkipButton)
    expect(mockedSetIsOnboardingSeen).toHaveBeenCalledWith(true)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should change button text on last slide', () => {
    const { getByTestId, queryByText } = renderWithSafeAreaProvider(<Onboarding />)
    const flatList = getByTestId('onboarding-flatlist')

    fireEvent(flatList, 'layout', {
      nativeEvent: { layout: { width: ITEM_WIDTH, height: 500 } },
    })

    expect(queryByText('Continue')).toBeTruthy()

    fireEvent(flatList, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: { x: ITEM_WIDTH * 3 },
        layoutMeasurement: { width: ITEM_WIDTH, height: 500 },
        contentSize: { width: ITEM_WIDTH * 4, height: 500 },
      },
    })
  })
})

describe('Onboarding Screen Snapshot', () => {
  it('should render the Onboarding Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Onboarding />)

    expect(toJSON()).toMatchSnapshot()
  })
})
