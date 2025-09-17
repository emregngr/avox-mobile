import { renderHook } from '@testing-library/react-hooks'
import { render } from '@testing-library/react-native'
import type { ToastProps } from 'react-native-toast-message'

import { useToastConfig } from '@/components/common/ToastConfig'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const darkColors = themeColors.dark

const lightColors = themeColors.light

jest.mock('@/utils/common/responsive', () => ({
  responsive: {
    deviceWidth: 375,
  },
}))

jest.mock('react-native-toast-message', () => {
  const { View } = require('react-native')

  return {
    ErrorToast: (props: ToastProps) => <View testID="mocked-error-toast" {...props} />,
    SuccessToast: (props: ToastProps) => <View testID="mocked-success-toast" {...props} />,
  }
})

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({ selectedTheme: 'light' })
})

describe('useToastConfig Component', () => {
  it('should return a config object with success and error render functions', () => {
    const { result } = renderHook(() => useToastConfig())

    expect(result.current).toBeInstanceOf(Object)
    expect(result.current.success).toBeInstanceOf(Function)
    expect(result.current.error).toBeInstanceOf(Function)
  })

  it('should configure SuccessToast with correct props for the light theme', () => {
    const { result } = renderHook(() => useToastConfig())

    const SuccessToastComponent = result.current.success({})
    const { getByTestId } = render(SuccessToastComponent)
    const toast = getByTestId('mocked-success-toast')

    expect(toast.props.text2NumberOfLines).toBe(2)
    expect(toast.props.text1Style.color).toBe(lightColors.text100)
    expect(toast.props.text2Style.color).toBe(lightColors.text90)

    expect(toast.props.style.backgroundColor).toBe(lightColors.background.tertiary)
    expect(toast.props.style.borderLeftColor).toBe(lightColors.success)
    expect(toast.props.style.width).toBe(375 - 32)
  })

  it('should configure ErrorToast with the correct error color', () => {
    const { result } = renderHook(() => useToastConfig())

    const ErrorToastComponent = result.current.error({})
    const { getByTestId } = render(ErrorToastComponent)
    const toast = getByTestId('mocked-error-toast')

    expect(toast.props.style.borderLeftColor).toBe(lightColors.error)
  })

  it('should pass through custom props to the underlying toast component', () => {
    const { result } = renderHook(() => useToastConfig())
    const customProps = { text1: 'Custom Title', text2: 'My custom message.' }

    const SuccessToastComponent = result.current.success(customProps as any)
    const { getByTestId } = render(SuccessToastComponent)
    const toast = getByTestId('mocked-success-toast')

    expect(toast.props.text1).toBe('Custom Title')
    expect(toast.props.text2).toBe('My custom message.')
  })

  it('should update toast styles when the theme changes from light to dark', () => {
    const { result, rerender } = renderHook(() => useToastConfig())

    mockedUseThemeStore.mockReturnValue({ selectedTheme: 'dark' })

    rerender()

    const SuccessToastComponent = result.current.success({})
    const { getByTestId } = render(SuccessToastComponent)
    const toast = getByTestId('mocked-success-toast')

    expect(toast.props.text1Style.color).toBe(darkColors.text100)
    expect(toast.props.style.backgroundColor).toBe(darkColors.background.tertiary)
    expect(toast.props.style.borderLeftColor).toBe(darkColors.success)
  })
})

describe('useToastConfig Component Snapshot', () => {
  it('should render the useToastConfig Component successfully', () => {
    const { result } = renderHook(() => useToastConfig())

    expect(result.current.success({})).toMatchSnapshot()
    expect(result.current.error({})).toMatchSnapshot()
  })
})
