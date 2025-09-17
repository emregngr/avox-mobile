export const mockedMMKV = {
  getString: jest.fn(),
  set: jest.fn(),
  getNumber: jest.fn(),
  getBoolean: jest.fn(),
  contains: jest.fn(),
  delete: jest.fn(),
  getAllKeys: jest.fn(),
  clearAll: jest.fn(),
}

export const MMKV = jest.fn(() => mockedMMKV)
