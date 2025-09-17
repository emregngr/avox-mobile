import { render } from '@testing-library/react-native'
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router'
import React from 'react'

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
  it('should not redirect if the user is not authenticated', () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: false })

    mockedUseGlobalSearchParams.mockReturnValue({})

    render(<AuthLayout />)

    expect(router.replace).not.toHaveBeenCalled()
  })

  it('should redirect to "/home" if user is authenticated and no tab param is provided', () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({})

    render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should redirect to the specified valid tab if user is authenticated', () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({ tab: 'profile' })

    render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/profile')
  })

  it('should redirect to "/home" if user is authenticated with an invalid tab param', () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({ tab: 'invalid-tab' })

    render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })

  it('should redirect to "/home" if user is authenticated and tab param is not a string', () => {
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: true })

    mockedUseGlobalSearchParams.mockReturnValue({ tab: ['profile', 'home'] })

    render(<AuthLayout />)

    expect(router.replace).toHaveBeenCalledTimes(1)
    expect(router.replace).toHaveBeenCalledWith('/home')
  })
})

describe('AuthLayout Snapshot', () => {
  it('should render the AuthLayout successfully', () => {
    const { toJSON } = render(<AuthLayout />)

    expect(toJSON()).toMatchSnapshot()
  })
})
