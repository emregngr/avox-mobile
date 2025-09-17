export const getNetworkStateAsync = jest.fn()

export const addNetworkStateListener = jest.fn(() => ({
  remove: jest.fn(),
}))
