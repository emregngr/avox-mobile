export const mockedAnalyticsInstance = {
  app: { name: 'avox' },
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
  resetAnalyticsData: jest.fn(),
  setCurrentScreen: jest.fn(),
}

module.exports = {
  getAnalytics: jest.fn(() => mockedAnalyticsInstance),
  logEvent: mockedAnalyticsInstance.logEvent,
  setUserId: mockedAnalyticsInstance.setUserId,
  setUserProperties: mockedAnalyticsInstance.setUserProperties,
  resetAnalyticsData: mockedAnalyticsInstance.resetAnalyticsData,
  setCurrentScreen: mockedAnalyticsInstance.setCurrentScreen,
}
