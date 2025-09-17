module.exports = {
  preventAutoHideAsync: jest.fn(() => Promise.resolve(true)),
  hideAsync: jest.fn(() => Promise.resolve(true)),
  isHiddenAsync: jest.fn(() => Promise.resolve(false)),
  setOptions: jest.fn(),
}
