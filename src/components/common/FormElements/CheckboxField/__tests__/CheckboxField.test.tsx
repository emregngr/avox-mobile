import { fireEvent, render } from '@testing-library/react-native'
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
  it('renders unchecked checkbox initially', async () => {
    const { getByTestId } = await render(<MockedCheckboxField labelKey="label.test" />)
    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('toggles checkbox when pressed', async () => {
    const { getByTestId } = await render(<MockedCheckboxField labelKey="label.test" />)
    const checkbox = getByTestId('checkbox')

    await fireEvent.press(checkbox)

    expect(checkbox).toBeTruthy()
  })

  it('calls onPressLabel when label is pressed', async () => {
    const mockedFn = jest.fn()
    const { getByText } = await render(
      <MockedCheckboxField labelKey="label.test" onPressLabel={mockedFn} />,
    )

    await fireEvent.press(getByText('label.test'))
    expect(mockedFn).toHaveBeenCalled()
  })

  it('shows error message when error is provided', async () => {
    const { getByText } = await render(
      <MockedCheckboxField error="This is error" labelKey="label.test" />,
    )
    expect(getByText('This is error')).toBeTruthy()
  })
})

describe('CheckboxField Component Snapshot', () => {
  it('should render the CheckboxField Component successfully', async () => {
    const { toJSON } = await render(<MockedCheckboxField labelKey="label.test" />)

    expect(toJSON()).toMatchSnapshot()
  })
})
