import { render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { MMKV } from 'react-native-mmkv'

import TokenExpire from '@/app/token-expire'
import { setIsAuthenticated } from '@/store/auth'

const { mockedSetQueryData, mockedRemoveQueries } = require('@tanstack/react-query')

const storage = new MMKV()

const mockedStorageDelete = storage.delete as jest.MockedFunction<typeof storage.delete>

jest.mock('@/store/auth')

const mockedSetIsAuthenticated = setIsAuthenticated as jest.MockedFunction<
  typeof setIsAuthenticated
>

describe('TokenExpire Screen', () => {
  it('should clear user session and render image on mount', async () => {
    const { getByTestId } = render(<TokenExpire />)

    expect(getByTestId('token-expire-icon')).toBeTruthy()

    await waitFor(() => {
      expect(mockedStorageDelete).toHaveBeenCalledWith('api_token')

      expect(mockedSetIsAuthenticated).toHaveBeenCalledWith(false)

      expect(mockedSetQueryData).toHaveBeenCalledWith(['user'], null)

      expect(mockedRemoveQueries).toHaveBeenCalled()
    })
  })
})

describe('TokenExpire Screen Snapshot', () => {
  it('should render the TokenExpire Screen successfully', () => {
    const { toJSON } = render(<TokenExpire />)

    expect(toJSON()).toMatchSnapshot()
  })
})
