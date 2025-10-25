export const mockedMMKV = {
  getString: jest.fn(),
  set: jest.fn(),
  getNumber: jest.fn(),
  getBoolean: jest.fn(),
  contains: jest.fn(),
  remove: jest.fn(),
  getAllKeys: jest.fn(),
  clearAll: jest.fn(),
}

export const createMMKV = jest.fn(() => mockedMMKV)
