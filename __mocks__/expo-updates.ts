module.exports = {
  checkForUpdateAsync: jest.fn(() =>
    Promise.resolve({
      isAvailable: false,
      manifest: null,
    }),
  ),
  fetchUpdateAsync: jest.fn(() =>
    Promise.resolve({
      isNew: false,
      manifest: null,
    }),
  ),
  reloadAsync: jest.fn(() => Promise.resolve()),
  isEnabled: true,
  isEmbeddedLaunch: false,
  updateId: null,
  manifest: null,
  releaseChannel: 'default',
  runtimeVersion: '1.0.0',
}
