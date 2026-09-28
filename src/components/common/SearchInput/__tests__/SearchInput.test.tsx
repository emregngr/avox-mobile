import { fireEvent, render } from '@testing-library/react-native'

import { SearchInput } from '@/components/common/SearchInput'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

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
    it('renders correctly with default props', async () => {
      const { getByPlaceholderText } = await render(<SearchInput {...mockedDefaultProps} />)

      expect(getByPlaceholderText('Search...')).toBeTruthy()
    })

    it('renders with custom className', async () => {
      await render(<SearchInput {...mockedDefaultProps} className="custom-class" />)

      expect(require('@/utils/common/cn').cn).toHaveBeenCalledWith(
        'flex-row items-center self-center',
        'custom-class',
      )
    })

    it('displays the correct placeholder text', async () => {
      const { getByPlaceholderText } = await render(
        <SearchInput {...mockedDefaultProps} placeholder="Custom placeholder" />,
      )

      expect(getByPlaceholderText('Custom placeholder')).toBeTruthy()
    })

    it('displays the current value', async () => {
      const { getByDisplayValue } = await render(
        <SearchInput {...mockedDefaultProps} value="test value" />,
      )

      const textInput = getByDisplayValue('test value')
      expect(textInput).toBeTruthy()
    })
  })

  describe('Focus behavior', () => {
    it('shows cancel button when focused', async () => {
      const { getByPlaceholderText, getByTestId } = await render(
        <SearchInput {...mockedDefaultProps} />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      expect(getByTestId('search-cancel-button')).toBeTruthy()
    })

    it('hides cancel button when blurred', async () => {
      const { getByPlaceholderText, queryByTestId } = await render(
        <SearchInput {...mockedDefaultProps} />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')
      await fireEvent(textInput, 'blur')

      expect(queryByTestId('ThemedButtonText')).toBeFalsy()
    })

    it('applies focused styles when input is focused', async () => {
      const { getByPlaceholderText } = await render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      expect(require('@/utils/common/cn').cn).toHaveBeenCalledWith(
        'flex-row items-center px-4 rounded-xl overflow-hidden bg-background-tertiary transition-all duration-300',
        'flex-1',
      )
    })
  })

  describe('Clear functionality', () => {
    it('shows clear button when focused and has value', async () => {
      const { getByPlaceholderText, getByTestId } = await render(
        <SearchInput {...mockedDefaultProps} value="test" />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      expect(getByTestId('search-clear-button')).toBeTruthy()
    })

    it('hides clear button when not focused', async () => {
      const { queryByTestId } = await render(<SearchInput {...mockedDefaultProps} value="test" />)

      expect(queryByTestId('search-clear-button')).toBeFalsy()
    })

    it('hides clear button when focused but no value', async () => {
      const { getByPlaceholderText, queryByTestId } = await render(
        <SearchInput {...mockedDefaultProps} value="" />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      expect(queryByTestId('search-clear-button')).toBeFalsy()
    })

    it('calls onChangeText with empty string when clear button is pressed', async () => {
      const mockedOnChangeText = jest.fn()
      const { getByPlaceholderText, getByTestId } = await render(
        <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} value="test" />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      const clearButton = getByTestId('search-clear-button')
      await fireEvent.press(clearButton)

      expect(mockedOnChangeText).toHaveBeenCalledWith('')
    })
  })

  describe('Cancel functionality', () => {
    it('calls onChangeText with empty string when cancel is pressed', async () => {
      const mockedOnChangeText = jest.fn()
      const { getByPlaceholderText, getByTestId } = await render(
        <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      const cancelButton = getByTestId('search-cancel-button')
      await fireEvent.press(cancelButton)

      expect(mockedOnChangeText).toHaveBeenCalledWith('')
    })

    it('blurs the input when cancel is pressed', async () => {
      const { getByPlaceholderText, getByTestId, queryByTestId } = await render(
        <SearchInput {...mockedDefaultProps} />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      const cancelButton = getByTestId('search-cancel-button')
      await fireEvent.press(cancelButton)

      expect(queryByTestId('ThemedButtonText')).toBeFalsy()
    })
  })

  describe('Text input behavior', () => {
    it('calls onChangeText when text is entered', async () => {
      const mockedOnChangeText = jest.fn()
      const { getByPlaceholderText } = await render(
        <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent.changeText(textInput, 'new text')

      expect(mockedOnChangeText).toHaveBeenCalledWith('new text')
    })

    it('has correct text input properties', async () => {
      const { getByPlaceholderText } = await render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')

      expect(textInput.props.allowFontScaling).toBe(false)
      expect(textInput.props.autoCorrect).toBe(false)
      expect(textInput.props.returnKeyType).toBe('search')
      expect(textInput.props.spellCheck).toBe(false)
      expect(textInput.props.enablesReturnKeyAutomatically).toBe(true)
    })
  })

  describe('Theme integration', () => {
    it('passes keyboard appearance based on selected theme', async () => {
      const { getByPlaceholderText } = await render(<SearchInput {...mockedDefaultProps} />)

      const textInput = getByPlaceholderText('Search...')
      expect(textInput.props.keyboardAppearance).toBe('light')
    })
  })

  describe('Accessibility', () => {
    it('has proper hit slop for touchable elements', async () => {
      const { getByPlaceholderText, getByTestId } = await render(
        <SearchInput {...mockedDefaultProps} value="test" />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      const clearButton = getByTestId('search-clear-button')

      expect(clearButton.props.hitSlop).toBe(10)
    })

    it('cancel button has proper hit slop', async () => {
      const { getByPlaceholderText, getByTestId } = await render(
        <SearchInput {...mockedDefaultProps} />,
      )

      const textInput = getByPlaceholderText('Search...')
      await fireEvent(textInput, 'focus')

      const cancelButton = getByTestId('search-cancel-button')
      expect(cancelButton.props.hitSlop).toBe(10)
    })
  })

  describe('Layout', () => {
    it('sets correct width based on device width', async () => {
      const { root } = await render(<SearchInput {...mockedDefaultProps} />)

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
  it('handles complete user interaction flow', async () => {
    const mockedOnChangeText = jest.fn()
    const { rerender, getByPlaceholderText, getByTestId } = await render(
      <SearchInput {...mockedDefaultProps} onChangeText={mockedOnChangeText} />,
    )

    const textInput = getByPlaceholderText('Search...')

    await fireEvent(textInput, 'focus')
    expect(getByTestId('search-cancel-button')).toBeTruthy()

    await fireEvent.changeText(textInput, 'search query')
    expect(mockedOnChangeText).toHaveBeenCalledWith('search query')

    await rerender(
      <SearchInput
        {...mockedDefaultProps}
        onChangeText={mockedOnChangeText}
        value="search query"
      />,
    )

    await fireEvent(textInput, 'focus')

    expect(getByTestId('search-clear-button')).toBeTruthy()

    await fireEvent.press(getByTestId('search-clear-button'))
    expect(mockedOnChangeText).toHaveBeenCalledWith('')

    await fireEvent.press(getByTestId('search-cancel-button'))
    expect(mockedOnChangeText).toHaveBeenCalledWith('')
  })
})

describe('SearchInput Component Snapshot', () => {
  it('should render the SearchInput Component successfully', async () => {
    const { toJSON } = await render(<SearchInput {...mockedDefaultProps} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
