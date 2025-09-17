export const mockedAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  head: jest.fn(),
  options: jest.fn(),
  request: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {},
    },
    timeout: 0,
    baseURL: '',
  },
}

export const mockedAxiosCreate = jest.fn(() => mockedAxiosInstance)

const mockedAxios = {
  ...mockedAxiosInstance,
  create: mockedAxiosCreate,
  all: jest.fn(),
  spread: jest.fn(),
  isAxiosError: jest.fn(),
  CancelToken: {
    source: jest.fn(() => ({
      token: {},
      cancel: jest.fn(),
    })),
  },
}

export default mockedAxios
