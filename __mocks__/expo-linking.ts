module.exports = {
  createURL: jest.fn(path => `exp://localhost:8081/${path || ''}`),
  parse: jest.fn(url => ({
    scheme: 'exp',
    hostname: 'localhost',
    path: '/',
    queryParams: {},
  })),
  openURL: jest.fn(() => Promise.resolve(true)),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
}
