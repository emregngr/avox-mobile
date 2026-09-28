import { fireEvent, render, waitFor } from '@testing-library/react-native'

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
  const setup = async () => {
    const utils = await render(<ChangePassword />)
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

  it('should render all form fields and the submit button correctly', async () => {
    const { currentPasswordInput, newPasswordInput, confirmPasswordInput, submitButton } =
      await setup()

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
    } = await setup()
    const samePassword = 'password123'

    await fireEvent.changeText(currentPasswordInput, samePassword)
    await fireEvent.changeText(newPasswordInput, samePassword)
    await fireEvent.changeText(confirmPasswordInput, samePassword)
    await fireEvent.press(submitButton)

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
    } = await setup()

    await fireEvent.changeText(currentPasswordInput, 'oldPassword123')
    await fireEvent.changeText(newPasswordInput, 'newPassword456')
    await fireEvent.changeText(confirmPasswordInput, 'newPassword789')
    await fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getByText('passwordsDoNotMatch')).toBeTruthy()
    })
    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should show errors if passwords are too short', async () => {
    const { submitButton, getAllByText } = await setup()
    await fireEvent.press(submitButton)

    await waitFor(() => {
      expect(getAllByText('minPassword')).toHaveLength(3)
    })
    expect(mockedMutateAsync).not.toHaveBeenCalled()
  })

  it('should call mutation with correct data on successful submission', async () => {
    const { currentPasswordInput, newPasswordInput, confirmPasswordInput, submitButton } =
      await setup()
    const oldPassword = 'current-password'
    const newPassword = 'brand-new-password'

    await fireEvent.changeText(currentPasswordInput, oldPassword)
    await fireEvent.changeText(newPasswordInput, newPassword)
    await fireEvent.changeText(confirmPasswordInput, newPassword)
    await fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockedMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockedMutateAsync).toHaveBeenCalledWith({
        currentPassword: oldPassword,
        newPassword,
      })
    })
  })

  it('should disable inputs and show loading state on button when pending', async () => {
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
    } = await setup()

    expect(currentPasswordInput).toBeDisabled()
    expect(newPasswordInput).toBeDisabled()
    expect(confirmPasswordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
    expect(queryByTestId('activity-indicator')).toBeTruthy()
  })

  it('should disable the button after an invalid submission attempt and re-enable it on valid input', async () => {
    const { currentPasswordInput, newPasswordInput, confirmPasswordInput, submitButton } =
      await setup()

    expect(submitButton).toBeEnabled()

    await fireEvent.changeText(newPasswordInput, 'short')
    await fireEvent.press(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })

    await fireEvent.changeText(currentPasswordInput, 'a-valid-current-password')
    await fireEvent.changeText(newPasswordInput, 'long-enough-new-password')
    await fireEvent.changeText(confirmPasswordInput, 'long-enough-new-password')

    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })
  })
})

describe('ChangePassword Component Snapshot', () => {
  it('should render the ChangePassword Component successfully', async () => {
    const { toJSON } = await render(<ChangePassword />)

    expect(toJSON()).toMatchSnapshot()
  })
})
