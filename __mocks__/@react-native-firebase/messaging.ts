const mockedMessagingInstance = {
  hasPermission: jest.fn(() => Promise.resolve(1)),
  requestPermission: jest.fn(() => Promise.resolve(1)),
  getToken: jest.fn(() => Promise.resolve('mocked-fcm-token-12345')),
  onMessage: jest.fn(() => jest.fn()),
  onNotificationOpenedApp: jest.fn(() => jest.fn()),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  setBackgroundMessageHandler: jest.fn(),
  subscribeToTopic: jest.fn(() => Promise.resolve()),
  unsubscribeFromTopic: jest.fn(() => Promise.resolve()),
  deleteToken: jest.fn(() => Promise.resolve()),
  onTokenRefresh: jest.fn(() => jest.fn()),
}

module.exports = {
  getMessaging: jest.fn(() => mockedMessagingInstance),
  requestPermission: mockedMessagingInstance.requestPermission,
  getToken: mockedMessagingInstance.getToken,
  onMessage: mockedMessagingInstance.onMessage,
  onNotificationOpenedApp: mockedMessagingInstance.onNotificationOpenedApp,
  setBackgroundMessageHandler: mockedMessagingInstance.setBackgroundMessageHandler,
  AuthorizationStatus: {
    AUTHORIZED: 1,
    DENIED: 0,
    NOT_DETERMINED: -1,
    PROVISIONAL: 2,
  },
}
