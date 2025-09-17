import { router } from 'expo-router'

const { mockedAxiosInstance, mockedAxiosCreate } = require('axios')

const mockedMMKV = {
  getString: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  getNumber: jest.fn(),
  getBoolean: jest.fn(),
  contains: jest.fn(),
  getAllKeys: jest.fn(),
  clearAll: jest.fn(),
}

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => mockedMMKV),
}))

jest.mock('@/config/env/environment', () => ({
  default: {
    apiUrl: 'https://api.example.com',
  },
  apiUrl: 'https://api.example.com',
}))

jest.mock('@/enums', () => ({
  ENUMS: {
    API_TOKEN: 'API_TOKEN',
  },
}))

let ApiClient: any
let requestInterceptorSuccess: any
let responseInterceptorSuccess: any
let responseInterceptorError: any

beforeEach(() => {
  mockedAxiosCreate.mockImplementation(() => mockedAxiosInstance)

  ApiClient = require('@/api/common/apiClient').default

  const requestCalls = mockedAxiosInstance.interceptors.request.use.mock.calls
  if (requestCalls.length > 0) {
    requestInterceptorSuccess = requestCalls[0][0]
  }
  const responseCalls = mockedAxiosInstance.interceptors.response.use.mock.calls
  if (responseCalls.length > 0) {
    responseInterceptorSuccess = responseCalls[0][0]
    responseInterceptorError = responseCalls[0][1]
  }
})

describe('API Client', () => {
  describe('Axios Instance Configuration', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      })
    })
  })

  describe('Request Interceptor Logic', () => {
    it('should add Authorization header when token exists', async () => {
      if (!requestInterceptorSuccess) return

      const mockedToken = 'mocked-jwt-token'
      mockedMMKV.getString.mockReturnValue(mockedToken)

      const config = {
        headers: {},
        url: '/test',
      }

      const result = await requestInterceptorSuccess(config)

      expect(mockedMMKV.getString).toHaveBeenCalledWith('API_TOKEN')
      expect(result.headers.Authorization).toBe(`Bearer ${mockedToken}`)
    })

    it('should not add Authorization header when token does not exist', async () => {
      if (!requestInterceptorSuccess) return

      mockedMMKV.getString.mockReturnValue(null)

      const config = {
        headers: {},
        url: '/test',
      }

      const result = await requestInterceptorSuccess(config)

      expect(mockedMMKV.getString).toHaveBeenCalledWith('API_TOKEN')
      expect(result.headers.Authorization).toBeUndefined()
    })

    it('should handle config without headers', async () => {
      if (!requestInterceptorSuccess) return

      const mockedToken = 'mocked-jwt-token'
      mockedMMKV.getString.mockReturnValue(mockedToken)

      const config = {
        url: '/test',
      }

      const result = await requestInterceptorSuccess(config)

      expect(result.headers).toBeUndefined()
    })
  })

  describe('Response Interceptor Logic', () => {
    describe('Success Handler', () => {
      it('should return response for successful requests', () => {
        if (!responseInterceptorSuccess) return

        const mockResponse = {
          status: 200,
          data: { success: true },
        }

        const result = responseInterceptorSuccess(mockResponse)

        expect(result).toBe(mockResponse)
      })
    })

    describe('Error Handler', () => {
      it('should handle error with response data', async () => {
        if (!responseInterceptorError) return

        const mockError = {
          response: {
            status: 400,
            data: {
              message: 'Bad Request',
              errors: { field: ['error message'] },
            },
          },
          config: {},
        }

        await expect(responseInterceptorError(mockError)).rejects.toEqual({
          errors: { field: ['error message'] },
          message: 'Bad Request',
          status: 400,
        })
      })

      it('should handle error without response data', async () => {
        if (!responseInterceptorError) return

        const mockError = {
          response: {
            status: 500,
          },
          config: {},
        }

        await expect(responseInterceptorError(mockError)).rejects.toEqual({
          errors: {},
          message: 'An error occurred',
          status: 500,
        })
      })

      it('should handle error without response', async () => {
        if (!responseInterceptorError) return

        const mockError = {
          config: {},
        }

        await expect(responseInterceptorError(mockError)).rejects.toEqual({
          errors: {},
          message: 'An error occurred',
          status: 500,
        })
      })

      it('should skip error handling when skipErrorHandling is true', async () => {
        if (!responseInterceptorError) return

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

        const mockError = {
          response: {
            status: 400,
            data: {
              message: 'Bad Request',
            },
          },
          config: {
            skipErrorHandling: true,
          },
        }

        await expect(responseInterceptorError(mockError)).rejects.toBeDefined()
        expect(consoleSpy).not.toHaveBeenCalled()

        consoleSpy.mockRestore()
      })

      it('should navigate to token-expire for 401 error', async () => {
        if (!responseInterceptorError) return

        const mockError = {
          response: {
            status: 401,
          },
          config: {},
        }

        await expect(responseInterceptorError(mockError)).rejects.toBe(mockError)
        expect(router.replace).toHaveBeenCalledWith('/token-expire')
      })

      it('should log errors when not skipped', async () => {
        if (!responseInterceptorError) return

        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

        const mockError = {
          response: {
            status: 400,
            data: {
              message: 'Bad Request',
              errors: { field: ['error'] },
            },
          },
          config: {},
        }

        await expect(responseInterceptorError(mockError)).rejects.toBeDefined()

        expect(consoleSpy).toHaveBeenCalledWith('Error Status', 400)
        expect(consoleSpy).toHaveBeenCalledWith('Error Message', 'Bad Request')
        expect(consoleSpy).toHaveBeenCalledWith('Errors', { field: ['error'] })

        consoleSpy.mockRestore()
      })
    })
  })

  describe('API Methods', () => {
    describe('GET method', () => {
      it('should make GET request and return data', async () => {
        const mockResponse = {
          data: {
            data: { id: 1, name: 'Test' },
          },
        }

        mockedAxiosInstance.get.mockResolvedValue(mockResponse)

        const result = await ApiClient.get('/users/1')

        expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/users/1', undefined)
        expect(result).toEqual({ id: 1, name: 'Test' })
      })

      it('should pass config to GET request', async () => {
        const mockResponse = {
          data: {
            data: { id: 1, name: 'Test' },
          },
        }
        const config = { skipErrorHandling: true }

        mockedAxiosInstance.get.mockResolvedValue(mockResponse)

        await ApiClient.get('/users/1', config)

        expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/users/1', config)
      })
    })

    describe('POST method', () => {
      it('should make POST request and return data', async () => {
        const mockResponse = {
          data: {
            data: { id: 1, name: 'Test User' },
          },
        }
        const postData = { name: 'Test User' }

        mockedAxiosInstance.post.mockResolvedValue(mockResponse)

        const result = await ApiClient.post('/users', postData)

        expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/users', postData, undefined)
        expect(result).toEqual({ id: 1, name: 'Test User' })
      })

      it('should pass config to POST request', async () => {
        const mockResponse = {
          data: {
            data: { id: 1, name: 'Test User' },
          },
        }
        const postData = { name: 'Test User' }
        const config = { skipErrorHandling: true }

        mockedAxiosInstance.post.mockResolvedValue(mockResponse)

        await ApiClient.post('/users', postData, config)

        expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/users', postData, config)
      })
    })

    describe('PUT method', () => {
      it('should make PUT request and return data', async () => {
        const mockResponse = {
          data: {
            data: { id: 1, name: 'Updated User' },
          },
        }
        const putData = { name: 'Updated User' }

        mockedAxiosInstance.put.mockResolvedValue(mockResponse)

        const result = await ApiClient.put('/users/1', putData)

        expect(mockedAxiosInstance.put).toHaveBeenCalledWith('/users/1', putData, undefined)
        expect(result).toEqual({ id: 1, name: 'Updated User' })
      })
    })

    describe('PATCH method', () => {
      it('should make PATCH request and return data', async () => {
        const mockResponse = {
          data: {
            data: { id: 1, name: 'Patched User' },
          },
        }
        const patchData = { name: 'Patched User' }

        mockedAxiosInstance.patch.mockResolvedValue(mockResponse)

        const result = await ApiClient.patch('/users/1', patchData)

        expect(mockedAxiosInstance.patch).toHaveBeenCalledWith('/users/1', patchData, undefined)
        expect(result).toEqual({ id: 1, name: 'Patched User' })
      })
    })

    describe('DELETE method', () => {
      it('should make DELETE request and return data', async () => {
        const mockResponse = {
          data: {
            data: { success: true },
          },
        }

        mockedAxiosInstance.delete.mockResolvedValue(mockResponse)

        const result = await ApiClient.delete('/users/1')

        expect(mockedAxiosInstance.delete).toHaveBeenCalledWith('/users/1', undefined)
        expect(result).toEqual({ success: true })
      })

      it('should pass config to DELETE request', async () => {
        const mockResponse = {
          data: {
            data: { success: true },
          },
        }
        const config = { skipErrorHandling: true }

        mockedAxiosInstance.delete.mockResolvedValue(mockResponse)

        await ApiClient.delete('/users/1', config)

        expect(mockedAxiosInstance.delete).toHaveBeenCalledWith('/users/1', config)
      })
    })
  })
})
