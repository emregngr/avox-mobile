const mockedRemoteConfig = {
  setDefaults: jest.fn(() => Promise.resolve()),
  fetch: jest.fn(() => Promise.resolve()),
  activate: jest.fn(() => Promise.resolve(true)),
  fetchAndActivate: jest.fn(() => Promise.resolve(true)),
  getValue: jest.fn(key => ({
    asBoolean: () => (key === 'feature_enabled' ? true : false),
    asString: () => (key === 'app_version' ? '1.0.0' : ''),
    asNumber: () => (key === 'max_items' ? 10 : 0),
  })),
  getAll: jest.fn(() => ({
    feature_enabled: { asBoolean: () => true },
    app_version: { asString: () => '1.0.0' },
    max_items: { asNumber: () => 10 },
  })),
  setConfigSettings: jest.fn(),
  getStringValue: jest.fn(),
  setFirebaseConfig: jest.fn(),
}

module.exports = {
  getRemoteConfig: jest.fn(() => mockedRemoteConfig),
  setDefaults: mockedRemoteConfig.setDefaults,
  setConfigSettings: mockedRemoteConfig.setConfigSettings,
  fetchAndActivate: mockedRemoteConfig.fetchAndActivate,
  getAll: mockedRemoteConfig.getAll,
  getValue: mockedRemoteConfig.getValue,
  getStringValue: mockedRemoteConfig.getStringValue,
  setFirebaseConfig: mockedRemoteConfig.setFirebaseConfig,
}
