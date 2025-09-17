export const GoogleSignin = {
  hasPlayServices: jest.fn(),
  configure: jest.fn(),
  signIn: jest.fn(),
  addScopes: jest.fn(),
  signInSilently: jest.fn(),
  signOut: jest.fn(),
  revokeAccess: jest.fn(),
  hasPreviousSignIn: jest.fn(),
  getCurrentUser: jest.fn(),
  clearCachedAccessToken: jest.fn(),
  getTokens: jest.fn(),
}
