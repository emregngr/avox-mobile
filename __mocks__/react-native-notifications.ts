export const Notifications = {
  registerRemoteNotifications: jest.fn(),
  unregisterRemoteNotifications: jest.fn(),
  isRegisteredForRemoteNotifications: jest.fn(() => false),

  events: jest.fn(() => ({
    registerNotificationReceivedForeground: jest.fn(),
    registerNotificationReceivedBackground: jest.fn(),
    registerNotificationOpened: jest.fn(),
    registerRemoteNotificationsRegistered: jest.fn(),
    registerRemoteNotificationsRegistrationFailed: jest.fn(),
  })),

  postLocalNotification: jest.fn(),
  cancelLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),

  requestPermissions: jest.fn(() =>
    Promise.resolve({
      alert: true,
      badge: true,
      sound: true,
    }),
  ),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),

  ios: {
    setBadgeCount: jest.fn(),
    getBadgeCount: jest.fn(() => Promise.resolve(0)),
  },

  android: {
    createChannel: jest.fn(),
    deleteChannel: jest.fn(),
    getChannels: jest.fn(() => Promise.resolve([])),
  },

  removeAllDeliveredNotifications: jest.fn(),
}
