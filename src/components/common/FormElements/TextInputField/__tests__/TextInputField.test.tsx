import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, TouchableOpacity } from 'react-native'

import { TextInputField } from '@/components/common/FormElements/TextInputField'
import useThemeStore from '@/store/theme'

jest.mock('@/store/theme')

const mockedUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>

const MockedTextInputField = (props: any) => {
  const { control } = useForm({
    defaultValues: { email: '' },
    mode: 'onBlur',
  })
  return (
    <TextInputField
      control={control}
      label="Email"
      name="email"
      placeholder="Enter email"
      {...props}
    />
  )
}

beforeEach(() => {
  mockedUseThemeStore.mockReturnValue({
    selectedTheme: 'light',
  })
})

describe('TextInputField Component', () => {
  it('renders label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(<MockedTextInputField />)
    expect(getByText('Email')).toBeTruthy()
    expect(getByPlaceholderText('Enter email')).toBeTruthy()
  })

  it('updates value on typing', () => {
    const { getByPlaceholderText } = render(<MockedTextInputField />)
    const input = getByPlaceholderText('Enter email')
    fireEvent.changeText(input, 'test@example.com')
    expect(input.props.value).toBe('test@example.com')
  })

  it('shows and clears with close icon when focused and has text', () => {
    const { getByPlaceholderText, queryByTestId, getByTestId } = render(<MockedTextInputField />)
    const input = getByPlaceholderText('Enter email')

    expect(queryByTestId('clear-button')).toBeNull()

    fireEvent.changeText(input, 'hello')
    fireEvent(input, 'focus')

    const clearButton = getByTestId('clear-button')
    expect(clearButton).toBeTruthy()

    fireEvent.press(clearButton)
    expect(input.props.value).toBe('')
  })

  it('toggles password visibility when secureTextEntry + showToggle', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <MockedTextInputField
        name="password"
        placeholder="Enter password"
        secureTextEntry
        showToggle
      />,
    )
    const input = getByPlaceholderText('Enter password')
    const toggle = getByTestId('password-toggle')

    expect(input.props.secureTextEntry).toBe(true)

    fireEvent.press(toggle)
    expect(input.props.secureTextEntry).toBe(false)

    fireEvent.press(toggle)
    expect(input.props.secureTextEntry).toBe(true)
  })

  it('renders error message when error exists', async () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { email: '' },
        mode: 'onBlur',
      })

      return (
        <Controller
          render={() => (
            <TextInputField
              control={control}
              label="Email"
              name="email"
              placeholder="Enter email"
            />
          )}
          control={control}
          name="email"
          rules={{ required: 'This field is required' }}
        />
      )
    }

    const { getByText, getByPlaceholderText } = render(<TestComponent />)

    const input = getByPlaceholderText('Enter email')

    fireEvent.changeText(input, 'test')
    fireEvent.changeText(input, '')
    fireEvent(input, 'blur')

    await waitFor(() => {
      expect(getByText('This field is required')).toBeTruthy()
    })
  })

  it('renders error message after form submission attempt', async () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { email: '' },
      })

      const onSubmit = () => {}

      return (
        <>
          <Controller
            render={() => (
              <TextInputField
                control={methods.control}
                label="Email"
                name="email"
                placeholder="Enter email"
              />
            )}
            control={methods.control}
            name="email"
            rules={{ required: 'This field is required' }}
          />
          <TouchableOpacity onPress={methods.handleSubmit(onSubmit)} testID="submit-button">
            <Text>Submit</Text>
          </TouchableOpacity>
        </>
      )
    }

    const { getByText, getByTestId } = render(<TestComponent />)

    const submitButton = getByTestId('submit-button')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('This field is required')).toBeTruthy()
    })
  })
})

describe('TextInputField Component Snapshot', () => {
  it('should render the TextInputField Component successfully', () => {
    const { toJSON } = render(<MockedTextInputField />)

    expect(toJSON()).toMatchSnapshot()
  })
})
