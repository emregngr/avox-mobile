const mockedAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        emailVerified: true,
      },
    }),
  ),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: {
        uid: 'test-uid',
        email: 'test@example.com',
      },
    }),
  ),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(callback => {
    callback(null)
    return jest.fn()
  }),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
  updatePassword: jest.fn(() => Promise.resolve()),
  linkWithCredential: jest.fn(() => Promise.resolve()),
  reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
  signInWithCredential: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  AppleAuthProvider: {
    credential: jest.fn(),
  },
}

const mockedFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ exists: true, id: 'mocked-doc-id', data: () => ({}) })),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve({ id: 'new-doc-id' })),
    where: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ docs: [] })),
    })),
    orderBy: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ docs: [] })),
    })),
  })),
  doc: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ exists: true, id: 'mocked-doc-id', data: () => ({}) })),
    set: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  })),
  batch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  FieldValue: {
    serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
    delete: jest.fn(() => 'DELETE_FIELD'),
  },
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  getDoc: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
}

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

export const mockedAnalyticsInstance = {
  app: { name: 'avox' },
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
  resetAnalyticsData: jest.fn(),
  setCurrentScreen: jest.fn(),
}

const mockApp = {
  auth: jest.fn(() => mockedAuth),
  firestore: jest.fn(() => mockedFirestore),
  remoteConfig: jest.fn(() => mockedRemoteConfig),
  messaging: jest.fn(() => mockedMessagingInstance),
  analytics: jest.fn(() => mockedAnalyticsInstance),
}

module.exports = {
  getApp: jest.fn(() => mockApp),
  getApps: jest.fn(() => [mockApp]),
  initializeApp: jest.fn(() => mockApp),
  auth: jest.fn(() => mockedAuth),
  firestore: jest.fn(() => mockedFirestore),
  remoteConfig: jest.fn(() => mockedRemoteConfig),
  messaging: jest.fn(() => mockedMessagingInstance),
  analytics: jest.fn(() => mockedAnalyticsInstance),
  getAnalytics: jest.fn(() => mockedAnalyticsInstance),
  mockApp,
}
