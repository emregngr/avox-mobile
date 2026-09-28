import { render } from '@testing-library/react-native'
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router'

import AuthLayout from '@/app/(auth)/_layout'
import useAuthStore from '@/store/auth'

jest.mock('@/store/auth')

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

const mockedUseGlobalSearchParams = useGlobalSearchParams as jest.MockedFunction<
  typeof useGlobalSearchParams
>

const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>

beforeEach(() => {
  mockedUseAuthStore.mockReturnValue({ isAuthenticated: false })

  mockedUseGlobalSearchParams.mockReturnValue({})

  mockedUseFocusEffect.mockImplementation(callback => callback())
})

describe('AuthLayout', () => {
  it('should not redirect if the user is not authenticated', async () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: false })

    mockedUseGlobalSearchParams.mockReturnValue({})

    await render(<AuthLayout />)

    expect(router.replace).not.toHaveBeenCalled()
  })

  it('should redirect to "/home" if user is authenticated and no tab param is provided', async () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({})

    await render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should redirect to the specified valid tab if user is authenticated', async () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({ tab: 'profile' })

    await render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/profile')
  })

  it('should redirect to "/home" if user is authenticated with an invalid tab param', async () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({ tab: 'invalid-tab' })

    await render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should redirect to "/home" if user is authenticated and tab param is not a string', async () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({ tab: ['profile', 'home'] })

    await render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })
})

describe('AuthLayout Snapshot', () => {
  it('should render the AuthLayout successfully', async () => {
    const { toJSON } = await render(<AuthLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})
