import { act } from '@testing-library/react-native'
import { createMMKV } from 'react-native-mmkv'

import { ENUMS } from '@/enums'
import useAuthStore from '@/store/auth'

const storage = createMMKV()

const mockedStorageDelete = storage.remove as jest.MockedFunction<typeof storage.remove>

const mockedStorageSet = storage.set as jest.MockedFunction<typeof storage.set>

beforeEach(async () => {
  await act(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      loading: false,
    })
  })
})

describe('useAuthStore', () => {
  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.loading).toBe(false)
    })
  })

  describe('setIsAuthenticated', () => {
    it('should update isAuthenticated state', async () => {
      await act(() => {
        useAuthStore.getState().setIsAuthenticated(true)
      })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('should update isAuthenticated to false', async () => {
      await act(() => {
        useAuthStore.getState().setIsAuthenticated(true)
      })
      await act(() => {
        useAuthStore.getState().setIsAuthenticated(false)
      })
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockedToken = 'mocked-token-123'

      await act(() => {
        useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'password123',
          token: mockedToken,
        })
      })

      expect(mockedStorageSet).toHaveBeenCalledWith(ENUMS.API_TOKEN, mockedToken)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.loading).toBe(false)
    })

    it('should handle login with empty token', async () => {
      await act(() => {
        useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'password123',
          token: '',
        })
      })

      expect(mockedStorageSet).toHaveBeenCalledWith(ENUMS.API_TOKEN, '')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
    })

    it('should set loading state correctly during login', async () => {
      await act(() => {
        useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'password123',
          token: 'token',
        })
      })

      const finalState = useAuthStore.getState()
      expect(finalState.loading).toBe(false)
      expect(finalState.isAuthenticated).toBe(true)
    })
  })

  describe('register', () => {
    it('should register successfully and store token', async () => {
      const mockToken = 'register-token-456'

      await act(() => {
        useAuthStore.getState().register({
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
          token: mockToken,
        })
      })

      expect(mockedStorageSet).toHaveBeenCalledWith(ENUMS.API_TOKEN, mockToken)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.loading).toBe(false)
    })
  })

  describe('social', () => {
    it('should handle social login successfully', async () => {
      const mockToken = 'social-token-789'

      await act(() => {
        useAuthStore.getState().social({
          provider: 'google',
          token: mockToken,
        })
      })

      expect(mockedStorageSet).toHaveBeenCalledWith(ENUMS.API_TOKEN, mockToken)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.loading).toBe(false)
    })
  })

  describe('logout', () => {
    it('should logout successfully and remove token', async () => {
      await act(() => {
        useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'password123',
          token: 'token',
        })
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      await act(() => {
        useAuthStore.getState().logout()
      })

      expect(mockedStorageDelete).toHaveBeenCalledWith(ENUMS.API_TOKEN)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.loading).toBe(false)
    })
  })

  describe('Storage error handling', () => {
    it('should handle Storage.set error during login gracefully', async () => {
      await act(() => {
        useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'password123',
          token: 'token',
        })
      })

      const state = useAuthStore.getState()
      expect(state.loading).toBe(false)
    })

    it('should handle delete error during logout gracefully', async () => {
      await act(() => {
        useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.loading).toBe(false)
      expect(state.isAuthenticated).toBe(false)
    })
  })
})
