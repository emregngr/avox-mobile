import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { AddPassword } from '@/components/feature/Password/AddPassword'
import { useAddPassword } from '@/hooks/services/useUser'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/hooks/services/useUser')

const mockedUseAddPassword = useAddPassword as jest.MockedFunction<typeof useAddPassword>

let mockedMutateAsync: jest.Mock

beforeEach(() => {
  mockedMutateAsync = jest.fn().mockResolvedValue({})

  mockedUseAddPassword.mockReturnValue({
    isPending: false,
    mutateAsync: mockedMutateAsync,
  } as any)
})

describe('AddPassword Component', () => {
  const setup = () => {
    const utils = render(<AddPassword />)
    const newPasswordInput = utils.getByPlaceholderText('newPasswordPlaceholder')
    const confirmPasswordInput = utils.getByPlaceholderText('confirmNewPasswordPlaceholder')
    const submitButton = utils.getByTestId('add-password-submit-button')
    return {
      newPasswordInput,
      confirmPasswordInput,
      submitButton,
      ...utils,
    }
  }

  it('should render all form fields and the submit button correctly', () => {
    const { newPasswordInput, confirmPasswordInput, submitButton } = setup()

    expect(newPasswordInput).toBeTruthy()
    expect(confirmPasswordInput).toBeTruthy()
    expect(submitButton).toBeTruthy()
    expect(submitButton).toBeEnabled()
  })

  it('should not call mutation if passwords are too short', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton, getAllByText } = setup()

    fireEvent.changeText(newPasswordInput, '123')
    fireEvent.changeText(confirmPasswordInput, '123')
    fireEvent.press(submitButton)

    await waitFor(() => {
      const errorMessages = getAllByText('minPassword')
      expect(errorMessages.length).toBeGreaterThan(0)
    })

    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should not call mutation if passwords do not match', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton, getByText } = setup()

    fireEvent.changeText(newPasswordInput, 'password123')
    fireEvent.changeText(confirmPasswordInput, 'password456')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('passwordsDoNotMatch')).toBeTruthy()
    })

    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should call mutation with the new password on successful submission', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton } = setup()
    const validPassword = 'a-valid-password'

    fireEvent.changeText(newPasswordInput, validPassword)
    fireEvent.changeText(confirmPasswordInput, validPassword)
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockedMutateAsync).toHaveBeenCalledWith({ newPassword: validPassword })
    })
  })

  it('should disable inputs and show loading state on button when pending', () => {
    mockedUseAddPassword.mockReturnValue({
      isPending: true,
      mutateAsync: mockedMutateAsync,
    } as any)

    const { newPasswordInput, confirmPasswordInput, submitButton, queryByTestId } = setup()

    expect(newPasswordInput).toBeDisabled()
    expect(confirmPasswordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
    expect(queryByTestId('activity-indicator')).toBeTruthy()
  })

  it('should disable the button after an invalid submission attempt and re-enable it on valid input', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton } = setup()

    expect(submitButton).toBeEnabled()

    fireEvent.changeText(newPasswordInput, 'short')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })

    fireEvent.changeText(newPasswordInput, 'long-enough-password')
    fireEvent.changeText(confirmPasswordInput, 'long-enough-password')

    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })
  })
})

describe('AddPassword Component Snapshot', () => {
  it('should render the AddPassword Component successfully', () => {
    const { toJSON } = render(<AddPassword />)

    expect(toJSON()).toMatchSnapshot()
  })
})
