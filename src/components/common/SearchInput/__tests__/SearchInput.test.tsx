import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { SearchInput } from '@/components/common/SearchInput'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

jest.mock('@/assets/icons/close', () => 'Close')

jest.mock('@/components/common/ThemedButtonText', () => {
  const { TouchableOpacity } = require('react-native')

  return {
    ThemedButtonText: (props: any) => <TouchableOpacity {...props} />,
  }
})

jest.mock('@/utils/common/cn', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

jest.mock('@/utils/common/responsive', () => ({
  responsive: {
    deviceWidth: 375,
  },
}))

const mockedDefaultProps = {
  onChangeText: jest.fn(),
  placeholder: 'Search...',
  value: '',
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })

  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      cancel: 'Cancel',
    }
    return translations[key] || key
  })
})

describe('SearchInput Component', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByPlaceholderText } = render(<SearchInput {...mockedDefaultProps} />)

      expect(getByPlaceholderText('Search...')).toBeTruthy()
    })

    it('renders with custom className', () => {
      render(<SearchInput {...mockedDefaultProps} className="custom-class" />)

      expect(require('@/utils/common/cn').cn).toHaveBeenCalledWith(
        'flex-row items-center self-center',
        'custom-class',
      )
    })

    it('displays the correct placeholder text', () => {
      const { getByPlaceholderText } = render(
        <SearchInput {...mockedDefaultProps} placeholder="Custom placeholder" />,
      )

      expect(getByPlaceholderText('Custom placeholder')).toBeTruthy()
    })

    it('displays the current value', () => {
      const { getByDisplayValue } = render(
        <SearchInput {...mockedDefaultProps} value="test value" />,
      )

      const textInput = getByDisplayValue('test value')
      expect(textInput).toBeTruthy()
    })
  })

  describe('Focus behavior', () => {
    it('shows cancel button when focused', () => {
      const { getByPlaceholderText, getByTestId } = render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      expect(getByTestId('search-cancel-button')).toBeTruthy()
    })

    it('hides cancel button when blurred', () => {
      const { getByPlaceholderText, queryByTestId } = render(
        <SearchInput {...mockedDefaultProps} />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')
      fireEvent(textInput, 'blur')

      expect(queryByTestId('ThemedButtonText')).toBeFalsy()
    })

    it('applies focused styles when input is focused', () => {
      const { getByPlaceholderText } = render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      expect(require('@/utils/common/cn').cn).toHaveBeenCalledWith(
        'flex-row items-center px-4 rounded-xl overflow-hidden bg-background-tertiary transition-all duration-300',
        'flex-1',
      )
    })
  })

  describe('Clear functionality', () => {
    it('shows clear button when focused and has value', () => {
      const { getByPlaceholderText, getByTestId } = render(
        <SearchInput {...mockedDefaultProps} value="test" />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      expect(getByTestId('search-clear-button')).toBeTruthy()
    })

    it('hides clear button when not focused', () => {
      const { queryByTestId } = render(<SearchInput {...mockedDefaultProps} value="test" />)

      expect(queryByTestId('search-clear-button')).toBeFalsy()
    })

    it('hides clear button when focused but no value', () => {
      const { getByPlaceholderText, queryByTestId } = render(
        <SearchInput {...mockedDefaultProps} value="" />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      expect(queryByTestId('search-clear-button')).toBeFalsy()
    })

    it('calls onChangeText with empty string when clear button is pressed', () => {
      const mockedOnChangeText = jest.fn()
      const { getByPlaceholderText, getByTestId } = render(
        <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} value="test" />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      const clearButton = getByTestId('search-clear-button')
      fireEvent.press(clearButton)

      expect(mockedOnChangeText).toHaveBeenCalledWith('')
    })
  })

  describe('Cancel functionality', () => {
    it('calls onChangeText with empty string when cancel is pressed', () => {
      const mockedOnChangeText = jest.fn()
      const { getByPlaceholderText, getByTestId } = render(
        <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      const cancelButton = getByTestId('search-cancel-button')
      fireEvent.press(cancelButton)

      expect(mockedOnChangeText).toHaveBeenCalledWith('')
    })

    it('blurs the input when cancel is pressed', () => {
      const { getByPlaceholderText, getByTestId, queryByTestId } = render(
        <SearchInput {...mockedDefaultProps} />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      const cancelButton = getByTestId('search-cancel-button')
      fireEvent.press(cancelButton)

      expect(queryByTestId('ThemedButtonText')).toBeFalsy()
    })
  })

  describe('Text input behavior', () => {
    it('calls onChangeText when text is entered', () => {
      const mockedOnChangeText = jest.fn()
      const { getByPlaceholderText } = render(
        <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent.changeText(textInput, 'new text')

      expect(mockedOnChangeText).toHaveBeenCalledWith('new text')
    })

    it('has correct text input properties', () => {
      const { getByPlaceholderText } = render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')

      expect(textInput.props.allowFontScaling).toBe(false)
      expect(textInput.props.autoCorrect).toBe(false)
      expect(textInput.props.returnKeyType).toBe('search')
      expect(textInput.props.spellCheck).toBe(false)
      expect(textInput.props.enablesReturnKeyAutomatically).toBe(true)
    })
  })

  describe('Theme integration', () => {
    it('passes keyboard appearance based on selected theme', () => {
      const { getByPlaceholderText } = render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')
      expect(textInput.props.keyboardAppearance).toBe('light')
    })
  })

  describe('Accessibility', () => {
    it('has proper hit slop for touchable elements', () => {
      const { getByPlaceholderText, getByTestId } = render(
        <SearchInput {...mockedDefaultProps} value="test" />,
      )

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      const clearButton = getByTestId('search-clear-button')

      const parentElement = clearButton.parent?.parent || clearButton.parent
      expect(parentElement?.props?.hitSlop).toBe(10)
    })

    it('cancel button has proper hit slop', () => {
      const { getByPlaceholderText, getByTestId } = render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')
      fireEvent(textInput, 'focus')

      const cancelButton = getByTestId('search-cancel-button')
      expect(cancelButton.props.hitSlop).toBe(10)
    })
  })

  describe('Layout', () => {
    it('sets correct width based on device width', () => {
      const { root } = render(<SearchInput {...mockedDefaultProps} />)

      const findElementWithWidth = (element: any): any => {
        if (element.props?.style?.width === 343) {
          return element
        }
        if (element.children) {
          for (const child of element.children) {
            const found = findElementWithWidth(child)
            if (found) return found
          }
        }
        return null
      }

      const elementWithWidth = findElementWithWidth(root)
      expect(elementWithWidth).toBeTruthy()
      expect(elementWithWidth.props.style.width).toBe(343)
    })
  })
})

describe('SearchInput Component Integration', () => {
  it('handles complete user interaction flow', () => {
    const mockedOnChangeText = jest.fn()
    const { rerender, getByPlaceholderText, getByTestId } = render(
      <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} />,
    )

    const textInput = getByPlaceholderText('Search...')

    fireEvent(textInput, 'focus')
    expect(getByTestId('search-cancel-button')).toBeTruthy()

    fireEvent.changeText(textInput, 'search query')
    expect(mockedOnChangeText).toHaveBeenCalledWith('search query')

    rerender(
      <SearchInput
        {...mockedDefaultProps}
        onChangeText={mockedOnChangeText}
        value="search query"
      />,
    )

    fireEvent(textInput, 'focus')

    expect(getByTestId('search-clear-button')).toBeTruthy()

    fireEvent.press(getByTestId('search-clear-button'))
    expect(mockedOnChangeText).toHaveBeenCalledWith('')

    fireEvent.press(getByTestId('search-cancel-button'))
    expect(mockedOnChangeText).toHaveBeenCalledWith('')
  })
})

describe('SearchInput Component Snapshot', () => {
  it('should render the SearchInput Component successfully', () => {
    const { toJSON } = render(<SearchInput {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
