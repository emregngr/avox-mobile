import { appleAuth } from '@invertase/react-native-apple-authentication'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { getLocale } from '@/locales/i18next'
import {
  authStateChanged,
  handleLogout,
  sendPasswordResetLink,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '@/services/authService'
import { updateUser } from '@/services/userService'
import { Logger } from '@/utils/common/logger'

const {
  GoogleAuthProvider,
  AppleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} = require('@react-native-firebase/auth')

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

jest.mock('@/locales/i18next')

const mockedGetLocale = getLocale as jest.MockedFunction<typeof getLocale>

jest.mock('@/services/userService')

const mockedGoogleSignin = GoogleSignin.signIn as jest.MockedFunction<typeof GoogleSignin.signIn>
const mockedGoogleSigninGetTokens = GoogleSignin.getTokens as jest.MockedFunction<
  typeof GoogleSignin.getTokens
>
const mockedGoogleSigninHasPlayServices = GoogleSignin.hasPlayServices as jest.MockedFunction<
  typeof GoogleSignin.hasPlayServices
>
const mockedGoogleSigninGetCurrentUser = GoogleSignin.getCurrentUser as jest.MockedFunction<
  typeof GoogleSignin.getCurrentUser
>
const mockedGoogleSigninSignOut = GoogleSignin.signOut as jest.MockedFunction<
  typeof GoogleSignin.signOut
>

const mockedAppleAuthPerformRequest = appleAuth.performRequest as jest.MockedFunction<
  typeof appleAuth.performRequest
>

beforeEach(() => {
  mockedGetLocale.mockImplementation((key: string) => {
    const translations: Record<string, string> = {
      somethingWentWrong: 'Something went wrong.',
      userNotLoggedIn: 'User not logged in.',
      invalidEmail: 'Invalid email.',
    }
    return translations[key] || key
  })
})

describe('Auth Service', () => {
  describe('authStateChanged', () => {
    it('should call onAuthStateChanged with the provided callback', () => {
      const mockedCallback = jest.fn()
      authStateChanged(mockedCallback)
      expect(onAuthStateChanged).toHaveBeenCalledWith(expect.anything(), mockedCallback)
    })
  })

  describe('signUpWithEmail', () => {
    it('should create a user and call updateUser on success', async () => {
      const mockedCredentials = {
        email: 'test@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }
      const mockedUserCredential = { user: { uid: '123' } }
      createUserWithEmailAndPassword.mockResolvedValue(mockedUserCredential)

      const result = await signUpWithEmail(mockedCredentials)

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockedCredentials.email,
        mockedCredentials.password,
      )
      expect(updateUser).toHaveBeenCalledWith({
        email: mockedCredentials.email,
        firstName: mockedCredentials.firstName,
        lastName: mockedCredentials.lastName,
      })
      expect(result).toBe(mockedUserCredential)
    })

    it('should throw and log an error on failure', async () => {
      const mockedCredentials = {
        email: 'test@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }
      const mockedError = new Error('Firebase error')
      createUserWithEmailAndPassword.mockRejectedValue(mockedError)

      await expect(signUpWithEmail(mockedCredentials)).rejects.toThrow('Something went wrong.')
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to sign up with email',
        'error',
        mockedError,
      )
    })
  })

  describe('signInWithEmail', () => {
    it('should sign in a user successfully', async () => {
      const mockedCredentials = { email: 'test@test.com', password: 'password123' }
      const mockUserCredential = { user: { uid: '123' } }
      signInWithEmailAndPassword.mockResolvedValue(mockUserCredential)

      const result = await signInWithEmail(mockedCredentials)

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockedCredentials.email,
        mockedCredentials.password,
      )
      expect(result).toBe(mockUserCredential)
    })

    it('should throw and log an error on failure', async () => {
      const mockedCredentials = { email: 'test@test.com', password: 'password123' }
      const mockedError = new Error('Invalid mockedCredentials')
      signInWithEmailAndPassword.mockRejectedValue(mockedError)

      await expect(signInWithEmail(mockedCredentials)).rejects.toThrow('Something went wrong.')
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to sign in with email',
        'error',
        mockedError,
      )
    })
  })

  describe('signInWithGoogle', () => {
    it('should sign in with Google and update user profile', async () => {
      mockedGoogleSigninHasPlayServices.mockResolvedValue(true)
      mockedGoogleSignin.mockResolvedValue({} as any)
      mockedGoogleSigninGetTokens.mockResolvedValue({ idToken: 'google-id-token' } as any)
      GoogleAuthProvider.credential.mockReturnValue('google-credential')
      const mockUserCredential = { user: { email: 'john.doe@google.com', displayName: 'John Doe' } }
      signInWithCredential.mockResolvedValue(mockUserCredential)

      const result = await signInWithGoogle()

      expect(GoogleSignin.getTokens).toHaveBeenCalled()
      expect(signInWithCredential).toHaveBeenCalledWith(expect.anything(), 'google-credential')
      expect(updateUser).toHaveBeenCalledWith({
        email: 'john.doe@google.com',
        firstName: 'John',
        lastName: 'Doe',
      })
      expect(result).toBe(mockUserCredential)
    })

    it('should handle Google sign-in for users with only a first name', async () => {
      mockedGoogleSigninHasPlayServices.mockResolvedValue(true)
      mockedGoogleSignin.mockResolvedValue({} as any)
      mockedGoogleSigninGetTokens.mockResolvedValue({ idToken: 'google-id-token' } as any)
      GoogleAuthProvider.credential.mockReturnValue('google-credential')
      const mockUserCredential = { user: { email: 'john@google.com', displayName: 'John' } }
      signInWithCredential.mockResolvedValue(mockUserCredential)

      await signInWithGoogle()

      expect(updateUser).not.toHaveBeenCalled()
    })

    it('should throw an error if idToken is missing', async () => {
      mockedGoogleSigninHasPlayServices.mockResolvedValue(true)
      mockedGoogleSignin.mockResolvedValue({} as any)
      mockedGoogleSigninGetTokens.mockResolvedValue({ idToken: null } as any)

      await expect(signInWithGoogle()).rejects.toThrow('Something went wrong.')
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
    })
  })

  describe('signInWithApple', () => {
    it('should sign in with Apple and update user profile', async () => {
      const appleResponse: any = {
        email: 'jane.doe@apple.com',
        fullName: { givenName: 'Jane', familyName: 'Doe' },
        identityToken: 'apple-identity-token',
        nonce: 'apple-nonce',
      }
      mockedAppleAuthPerformRequest.mockResolvedValue(appleResponse)
      AppleAuthProvider.credential.mockReturnValue('apple-credential')
      const mockUserCredential = { user: { email: 'jane.doe@apple.com' } }
      signInWithCredential.mockResolvedValue(mockUserCredential)

      const result = await signInWithApple()

      expect(appleAuth.performRequest).toHaveBeenCalled()
      expect(signInWithCredential).toHaveBeenCalledWith(expect.anything(), 'apple-credential')
      expect(updateUser).toHaveBeenCalledWith({
        email: 'jane.doe@apple.com',
        firstName: 'Jane',
        lastName: 'Doe',
      })
      expect(result).toBe(mockUserCredential)
    })

    it('should use email from userCredential if Apple response email is null', async () => {
      const appleResponse: any = {
        email: null,
        fullName: { givenName: 'Jane', familyName: 'Doe' },
        identityToken: 'apple-identity-token',
        nonce: 'apple-nonce',
      }
      mockedAppleAuthPerformRequest.mockResolvedValue(appleResponse)
      AppleAuthProvider.credential.mockReturnValue('apple-credential')
      const mockUserCredential = { user: { email: 'jane.doe.fallback@apple.com' } }
      signInWithCredential.mockResolvedValue(mockUserCredential)

      await signInWithApple()

      expect(updateUser).toHaveBeenCalledWith({
        email: 'jane.doe.fallback@apple.com',
        firstName: 'Jane',
        lastName: 'Doe',
      })
    })

    it('should not call updateUser if fullName is missing from Apple response', async () => {
      const appleResponse: any = {
        email: 'jane.doe@apple.com',
        fullName: null,
        identityToken: 'apple-identity-token',
        nonce: 'apple-nonce',
      }
      mockedAppleAuthPerformRequest.mockResolvedValue(appleResponse)
      AppleAuthProvider.credential.mockReturnValue('apple-credential')
      const mockUserCredential = { user: { email: 'jane.doe@apple.com' } }
      signInWithCredential.mockResolvedValue(mockUserCredential)

      await signInWithApple()

      expect(updateUser).not.toHaveBeenCalled()
    })
  })

  describe('handleLogout', () => {
    it('should sign out from Google and Firebase', async () => {
      mockedGoogleSigninGetCurrentUser.mockReturnValue({
        user: { email: 'test@google.com' },
      } as any)

      await handleLogout()

      expect(mockedGoogleSigninSignOut).toHaveBeenCalled()
      expect(signOut).toHaveBeenCalled()
    })

    it('should only sign out from Firebase if user is not a Google user', async () => {
      mockedGoogleSigninGetCurrentUser.mockReturnValue(null)

      await handleLogout()

      expect(mockedGoogleSigninSignOut).not.toHaveBeenCalled()
      expect(signOut).toHaveBeenCalled()
    })
  })

  describe('sendPasswordResetLink', () => {
    it('should send a password reset email for a valid email', async () => {
      const email = 'user@example.com'
      await sendPasswordResetLink(email)
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), email)
    })

    it('should throw an error for an invalid email', async () => {
      await expect(sendPasswordResetLink('invalid-email')).rejects.toThrow('Invalid email.')
      expect(getLocale).toHaveBeenCalledWith('invalidEmail')
      expect(sendPasswordResetEmail).not.toHaveBeenCalled()
    })

    it('should throw and log an error on failure', async () => {
      const mockedError = new Error('Server error')
      sendPasswordResetEmail.mockRejectedValue(mockedError)

      await expect(sendPasswordResetLink('user@example.com')).rejects.toThrow(
        'Something went wrong.',
      )
      expect(getLocale).toHaveBeenCalledWith('somethingWentWrong')
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to send password reset link',
        'error',
        mockedError,
      )
    })
  })
})
