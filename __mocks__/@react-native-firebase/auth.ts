const mockedAuth = {
  currentUser: {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'http://example.com/photo.jpg',
    delete: jest.fn().mockResolvedValue(undefined),
  },
  getIdToken: jest.fn(),
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
  EmailAuthProvider: {
    credential: jest.fn(),
  },
}

module.exports = {
  getAuth: jest.fn(() => mockedAuth),
  getIdToken: mockedAuth.getIdToken,
  signInWithEmailAndPassword: mockedAuth.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockedAuth.createUserWithEmailAndPassword,
  signOut: mockedAuth.signOut,
  onAuthStateChanged: mockedAuth.onAuthStateChanged,
  sendPasswordResetEmail: mockedAuth.sendPasswordResetEmail,
  updateProfile: mockedAuth.updateProfile,
  updatePassword: mockedAuth.updatePassword,
  linkWithCredential: mockedAuth.linkWithCredential,
  reauthenticateWithCredential: mockedAuth.reauthenticateWithCredential,
  signInWithCredential: mockedAuth.signInWithCredential,
  GoogleAuthProvider: mockedAuth.GoogleAuthProvider,
  AppleAuthProvider: mockedAuth.AppleAuthProvider,
  EmailAuthProvider: mockedAuth.EmailAuthProvider,
  mockedAuth,
}
