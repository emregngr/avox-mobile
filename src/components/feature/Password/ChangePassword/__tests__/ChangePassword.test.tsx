import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { ChangePassword } from '@/components/feature/Password/ChangePassword'
import { useChangePassword } from '@/hooks/services/useUser'

jest.mock('@/locales/i18next', () => ({
  getLocale: (key: string) => key,
}))

jest.mock('@/hooks/services/useUser')

const mockedUseChangePassword = useChangePassword as jest.MockedFunction<typeof useChangePassword>

let mockedMutateAsync: jest.Mock

beforeEach(() => {
  mockedMutateAsync = jest.fn().mockResolvedValue({})

  mockedUseChangePassword.mockReturnValue({
    isPending: false,
    mutateAsync: mockedMutateAsync,
  } as any)
})

describe('ChangePassword Component', () => {
  const setup = () => {
    const utils = render(<ChangePassword />)
    const currentPasswordInput = utils.getByPlaceholderText('currentPasswordPlaceholder')
    const newPasswordInput = utils.getByPlaceholderText('newPasswordPlaceholder')
    const confirmPasswordInput = utils.getByPlaceholderText('confirmNewPasswordPlaceholder')
    const submitButton = utils.getByTestId('change-password-submit-button')
    return {
      currentPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      submitButton,
      ...utils,
    }
  }

  it('should render all form fields and the submit button correctly', () => {
    const { currentPasswordInput, newPasswordInput, confirmPasswordInput, submitButton } = setup()

    expect(currentPasswordInput).toBeTruthy()
    expect(newPasswordInput).toBeTruthy()
    expect(confirmPasswordInput).toBeTruthy()
    expect(submitButton).toBeTruthy()
    expect(submitButton).toBeEnabled()
  })

  it('should show an error if the new password is the same as the current password', async () => {
    const {
      currentPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      submitButton,
      getByText,
    } = setup()
    const samePassword = 'password123'

    fireEvent.changeText(currentPasswordInput, samePassword)
    fireEvent.changeText(newPasswordInput, samePassword)
    fireEvent.changeText(confirmPasswordInput, samePassword)
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('newPasswordCannotBeSame')).toBeTruthy()
    })
    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should show an error if the new passwords do not match', async () => {
    const {
      currentPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      submitButton,
      getByText,
    } = setup()

    fireEvent.changeText(currentPasswordInput, 'oldPassword123')
    fireEvent.changeText(newPasswordInput, 'newPassword456')
    fireEvent.changeText(confirmPasswordInput, 'newPassword789')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('passwordsDoNotMatch')).toBeTruthy()
    })
    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should show errors if passwords are too short', async () => {
    const { submitButton, getAllByText } = setup()
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getAllByText('minPassword')).toHaveLength(3)
    })
    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should call mutation with correct data on successful submission', async () => {
    const { currentPasswordInput, newPasswordInput, confirmPasswordInput, submitButton } = setup()
    const oldPassword = 'current-password'
    const newPassword = 'brand-new-password'

    fireEvent.changeText(currentPasswordInput, oldPassword)
    fireEvent.changeText(newPasswordInput, newPassword)
    fireEvent.changeText(confirmPasswordInput, newPassword)
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockedMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockedMutateAsync).toHaveBeenCalledWith({
        currentPassword: oldPassword,
        newPassword,
      })
    })
  })

  it('should disable inputs and show loading state on button when pending', () => {
    mockedUseChangePassword.mockReturnValue({
      isPending: true,
      mutateAsync: mockedMutateAsync,
    } as any)

    const {
      currentPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      submitButton,
      queryByTestId,
    } = setup()

    expect(currentPasswordInput).toBeDisabled()
    expect(newPasswordInput).toBeDisabled()
    expect(confirmPasswordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
    expect(queryByTestId('activity-indicator')).toBeTruthy()
  })

  it('should disable the button after an invalid submission attempt and re-enable it on valid input', async () => {
    const { currentPasswordInput, newPasswordInput, confirmPasswordInput, submitButton } = setup()

    expect(submitButton).toBeEnabled()

    fireEvent.changeText(newPasswordInput, 'short')
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })

    fireEvent.changeText(currentPasswordInput, 'a-valid-current-password')
    fireEvent.changeText(newPasswordInput, 'long-enough-new-password')
    fireEvent.changeText(confirmPasswordInput, 'long-enough-new-password')

    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })
  })
})

describe('ChangePassword Component Snapshot', () => {
  it('should render the ChangePassword Component successfully', () => {
    const { toJSON } = render(<ChangePassword />)

    expect(toJSON()).toMatchSnapshot()
  })
})
