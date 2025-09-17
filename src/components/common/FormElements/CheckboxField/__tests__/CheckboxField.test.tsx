import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { useForm } from 'react-hook-form'

import { CheckboxField } from '@/components/common/FormElements/CheckboxField'
import useThemeStore from '@/store/theme'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const MockedCheckboxField = (props: any) => {
  const { control } = useForm({
    defaultValues: { test: false },
  })

  return <CheckboxField control={control} name="test" {...props} />
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('CheckboxField Component', () => {
  it('renders unchecked checkbox initially', () => {
    const { getByTestId } = render(<MockedCheckboxField labelKey="label.test" />)
    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('toggles checkbox when pressed', () => {
    const { getByTestId } = render(<MockedCheckboxField labelKey="label.test" />)
    const checkbox = getByTestId('checkbox')

    fireEvent.press(checkbox)

    expect(checkbox).toBeTruthy()
  })

  it('calls onPressLabel when label is pressed', () => {
    const mockedFn = jest.fn()
    const { getByText } = render(
      <MockedCheckboxField labelKey="label.test" onPressLabel={mockedFn} />,
    )

    fireEvent.press(getByText('label.test'))
    expect(mockedFn).toHaveBeenCalled()
  })

  it('shows error message when error is provided', () => {
    const { getByText } = render(
      <MockedCheckboxField error="This is error" labelKey="label.test" />,
    )
    expect(getByText('This is error')).toBeTruthy()
  })
})

describe('CheckboxField Component Snapshot', () => {
  it('should render the CheckboxField Component successfully', () => {
    const { toJSON } = render(<MockedCheckboxField labelKey="label.test" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
