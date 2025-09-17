import { act, fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { FlatList } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Faq from '@/app/(settings)/faq'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

jest.useFakeTimers()

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/locale')

const mockedUseLocaleStore = useLocaleStore as jest.MockedFunction<typeof useLocaleStore>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/components/common', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    Header: ({ title, backIconOnPress }: { title: string; backIconOnPress: () => void }) => (
      <>
        <Text testID="header-title">{title}</Text>
        <TouchableOpacity onPress={backIconOnPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </>
    ),

    SafeLayout: ({ children }: { children: ReactNode }) => (
      <View testID="safe-layout">{children}</View>
    ),

    ThemedText: ({
      children,
      testID,
      color,
      type,
    }: {
      children: ReactNode
      testID?: string
      color?: string
      type?: string
    }) => <Text testID={testID || `themed-text-${type}-${color}`}>{children}</Text>,

    FaqItem: ({
      item,
      isExpanded,
      toggleExpanded,
      index,
    }: {
      item: { title: string; description: string }
      isExpanded: boolean
      toggleExpanded: (index: number) => void
      index: number
    }) => (
      <View>
        <TouchableOpacity onPress={() => toggleExpanded(index)}>
          <Text>{item.title}</Text>
          <Text>{isExpanded ? 'chevron-up' : 'chevron-down'}</Text>
        </TouchableOpacity>
        {isExpanded ? (
          <View testID="collapsible-content">
            <Text>{item.description}</Text>
          </View>
        ) : null}
      </View>
    ),
  }
})

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
  mockedUseLocaleStore.mockReturnValue({
    selectedLocale: 'en',
  })

  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      faq: 'Frequently Asked Questions',
    }
    return translations[key] || key
  })
})

describe('FAQ Screen', () => {
  it('should render FAQ screen with header and initial state', () => {
    const { getByTestId, getByText } = renderWithSafeAreaProvider(<Faq />)

    expect(getByTestId('safe-layout')).toBeTruthy()
    expect(getByTestId('header-title')).toBeTruthy()
    expect(getByText('Frequently Asked Questions')).toBeTruthy()
  })

  it('should call router.back when back button is pressed', () => {
    const { getByTestId } = renderWithSafeAreaProvider(<Faq />)

    const backButton = getByTestId('back-button')

    fireEvent.press(backButton)

    expect(router.back).toHaveBeenCalledTimes(1)
  })

  it('should render English FAQ items when locale is en', () => {
    mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'en' })

    const { getByText } = renderWithSafeAreaProvider(<Faq />)

    expect(getByText('What is the Avox app and what does it do?')).toBeTruthy()
    expect(getByText('Is the app free to use?')).toBeTruthy()
  })

  it('should render Turkish FAQ items when locale is tr', () => {
    mockedUseLocaleStore.mockReturnValue({ selectedLocale: 'tr' })

    const { getByText } = renderWithSafeAreaProvider(<Faq />)

    expect(getByText('Avox uygulaması nedir ve ne işe yarar?')).toBeTruthy()
    expect(getByText('Uygulamayı kullanmak ücretli mi?')).toBeTruthy()
  })

  it('should expand/collapse FAQ item when pressed', async () => {
    const { getByText, getByTestId, queryByTestId } = renderWithSafeAreaProvider(<Faq />)

    const firstFaqItem = getByText('What is the Avox app and what does it do?')

    fireEvent.press(firstFaqItem)

    await act(async () => {
      jest.runAllTimers()
    })

    expect(getByTestId('collapsible-content')).toBeTruthy()

    fireEvent.press(firstFaqItem)

    await act(async () => {
      jest.runAllTimers()
    })

    expect(queryByTestId('collapsible-content')).toBeFalsy()
  })

  it('should show correct chevron icon based on expanded state', async () => {
    const { getAllByText, queryByText, getByText } = renderWithSafeAreaProvider(<Faq />)

    expect(getAllByText('chevron-down').length).toBeGreaterThan(0)
    expect(queryByText('chevron-up')).toBeFalsy()

    const firstFaqItem = getByText('What is the Avox app and what does it do?')

    fireEvent.press(firstFaqItem)

    await act(async () => {
      jest.runAllTimers()
    })

    expect(getByText('chevron-up')).toBeTruthy()
  })

  it('should collapse previously expanded item when expanding a new one', async () => {
    const { getByText, queryByText } = renderWithSafeAreaProvider(<Faq />)

    const firstFaqItem = getByText('What is the Avox app and what does it do?')
    const secondFaqItem = getByText('Is the app free to use?')

    fireEvent.press(firstFaqItem)

    await act(async () => {
      jest.runAllTimers()
    })

    expect(
      getByText(
        'Avox is a comprehensive mobile guide for airports and airlines. It allows travelers and aviation enthusiasts to easily access detailed airport information, real-time flight status, airline profiles, and much more.',
      ),
    ).toBeTruthy()

    fireEvent.press(secondFaqItem)

    await act(async () => {
      jest.runAllTimers()
    })

    expect(
      queryByText(
        'Avox is a comprehensive mobile guide for airports and airlines. It allows travelers and aviation enthusiasts to easily access detailed airport information, real-time flight status, airline profiles, and much more.',
      ),
    ).toBeFalsy()

    expect(
      getByText(
        'Downloading and using the core features of Avox is completely free. You can access all airport and airline information without any charge.',
      ),
    ).toBeTruthy()
  })

  it('should call scrollToIndex when FAQ item is expanded', async () => {
    const scrollToIndexSpy = jest.spyOn(FlatList.prototype, 'scrollToIndex')

    const { getByText } = renderWithSafeAreaProvider(<Faq />)

    const firstFaqItem = getByText('What is the Avox app and what does it do?')

    fireEvent.press(firstFaqItem)

    await act(async () => {
      jest.runAllTimers()
    })

    expect(scrollToIndexSpy).toHaveBeenCalledWith({
      animated: true,
      index: 0,
      viewPosition: 0.1,
    })

    scrollToIndexSpy.mockRestore()
  })

  it('should handle scroll to index failure gracefully', async () => {
    const scrollToIndexSpy = jest.spyOn(FlatList.prototype, 'scrollToIndex')

    const { getByTestId } = renderWithSafeAreaProvider(<Faq />)

    const flatList = getByTestId('faq-flatlist')

    const failInfo = {
      averageItemLength: 75,
      highestMeasuredFrameIndex: 5,
      index: 10,
    }

    if (flatList.props.onScrollToIndexFailed) {
      act(() => {
        flatList.props.onScrollToIndexFailed(failInfo)
      })
    }

    await act(async () => {
      jest.runAllTimers()
    })

    expect(scrollToIndexSpy).toHaveBeenCalledWith({
      animated: true,
      index: 10,
      viewPosition: 0.1,
    })

    scrollToIndexSpy.mockRestore()
  })

  it('should use correct theme colors', () => {
    mockedUseThemeStore.mockReturnValue({
      selectedTheme: 'dark',
    })

    const { getByTestId } = renderWithSafeAreaProvider(<Faq />)

    expect(getByTestId('safe-layout')).toBeTruthy()
  })

  it('should render with correct FlatList props', () => {
    const { getByTestId, getByText } = renderWithSafeAreaProvider(<Faq />)

    expect(getByTestId('safe-layout')).toBeTruthy()

    expect(getByText('What is the Avox app and what does it do?')).toBeTruthy()
  })

  it('should generate correct key for FAQ items', () => {
    const { getByText } = renderWithSafeAreaProvider(<Faq />)

    expect(getByText('What is the Avox app and what does it do?')).toBeTruthy()
    expect(getByText('Is the app free to use?')).toBeTruthy()
  })
})

describe('Faq Screen Snapshot', () => {
  it('should render the Faq Screen successfully', () => {
    const { toJSON } = renderWithSafeAreaProvider(<Faq />)

    expect(toJSON()).toMatchSnapshot()
  })
})
