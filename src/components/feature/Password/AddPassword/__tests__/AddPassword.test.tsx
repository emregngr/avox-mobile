import { fireEvent, render, waitFor } from '@testing-library/react-native'

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
  const setup = async () => {
    const utils = await render(<AddPassword />)
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

  it('should render all form fields and the submit button correctly', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton } = await setup()

    expect(newPasswordInput).toBeTruthy()
    expect(confirmPasswordInput).toBeTruthy()
    expect(submitButton).toBeTruthy()
    expect(submitButton).toBeEnabled()
  })

  it('should not call mutation if passwords are too short', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton, getAllByText } = await setup()

    await fireEvent.changeText(newPasswordInput, '123')
    await fireEvent.changeText(confirmPasswordInput, '123')
    await fireEvent.press(submitButton)

    await waitFor(() => {
      const errorMessages = getAllByText('minPassword')
      expect(errorMessages.length).toBeGreaterThan(0)
    })

    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should not call mutation if passwords do not match', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton, getByText } = await setup()

    await fireEvent.changeText(newPasswordInput, 'password123')
    await fireEvent.changeText(confirmPasswordInput, 'password456')
    await fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('passwordsDoNotMatch')).toBeTruthy()
    })

    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should call mutation with the new password on successful submission', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton } = await setup()
    const validPassword = 'a-valid-password'

    await fireEvent.changeText(newPasswordInput, validPassword)
    await fireEvent.changeText(confirmPasswordInput, validPassword)
    await fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockedMutateAsync).toHaveBeenCalledWith({ newPassword: validPassword })
    })
  })

  it('should disable inputs and show loading state on button when pending', async () => {
    mockedUseAddPassword.mockReturnValue({
      isPending: true,
      mutateAsync: mockedMutateAsync,
    } as any)

    const { newPasswordInput, confirmPasswordInput, submitButton, queryByTestId } = await setup()

    expect(newPasswordInput).toBeDisabled()
    expect(confirmPasswordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
    expect(queryByTestId('activity-indicator')).toBeTruthy()
  })

  it('should disable the button after an invalid submission attempt and re-enable it on valid input', async () => {
    const { newPasswordInput, confirmPasswordInput, submitButton } = await setup()

    expect(submitButton).toBeEnabled()

    await fireEvent.changeText(newPasswordInput, 'short')
    await fireEvent.press(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })

    await fireEvent.changeText(newPasswordInput, 'long-enough-password')
    await fireEvent.changeText(confirmPasswordInput, 'long-enough-password')

    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })
  })
})

describe('AddPassword Component Snapshot', () => {
  it('should render the AddPassword Component successfully', async () => {
    const { toJSON } = await render(<AddPassword />)

    expect(toJSON()).toMatchSnapshot()
  })
})
