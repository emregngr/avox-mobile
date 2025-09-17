import { tapElement, tapText, typeText, visibleText, waitForElement, waitForText } from './setup'

const newUser = {
  firstName: 'Test',
  lastName: 'User',
  email: `newuser_${Date.now()}@avox.com`,
  password: '123456',
}

beforeEach(async () => {
  await device.launchApp({
    newInstance: true,
    delete: true,
    permissions: {
      notifications: 'YES',
      camera: 'YES',
      photos: 'YES',
      medialibrary: 'YES',
      location: 'always',
      userTracking: 'YES',
    },
    languageAndLocale: {
      language: 'en',
      locale: 'en_Us',
    },
  })

  await tapElement('onboarding-skip-button')
  await tapElement('favorites-tab')
})

describe('Authentication Flow', () => {
  describe('Login Flow', () => {
    beforeEach(async () => {
      await tapElement('login-button')
      await waitForElement('login-screen')
    })

    it('should login with valid credentials', async () => {
      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('login-submit-button')

      await waitForElement('favorites-screen')
    })

    it('should show validation errors for invalid input', async () => {
      await typeText('email', 'invalid-email')
      await typeText('password', '123')

      await tapElement('login-submit-button')

      await visibleText('Invalid email address')
      await visibleText('Password must be at least 6 characters')
    })

    it('should navigate to forgot password', async () => {
      await tapElement('forgot-password-button')

      await waitForElement('forgot-password-screen')
    })
  })

  describe('Register Flow', () => {
    beforeEach(async () => {
      await tapElement('register-button')
      await waitForElement('register-screen')
    })

    it('should register new user successfully', async () => {
      await typeText('firstName', newUser.firstName)
      await typeText('lastName', newUser.lastName)
      await typeText('email', newUser.email)
      await typeText('password', newUser.password)

      await tapElement('register-screen')

      await tapElement('privacyPolicy-checkbox')
      await tapElement('termsOfUse-checkbox')

      await tapElement('register-submit-button')

      await waitForElement('favorites-screen')
    })

    it('should show validation errors for empty fields', async () => {
      await tapElement('register-submit-button')

      await visibleText('First name must be at least 2 characters')
      await visibleText('Last name must be at least 2 characters')
      await visibleText('Invalid email address')
      await visibleText('Password must be at least 6 characters')
      await visibleText('You must accept the Privacy Policy')
      await visibleText('You must accept the Terms of Use')
    })

    it('should show policy acceptance errors', async () => {
      await typeText('firstName', newUser.firstName)
      await typeText('lastName', newUser.lastName)
      await typeText('email', newUser.email)
      await typeText('password', newUser.password)

      await tapElement('register-screen')

      await tapElement('register-submit-button')

      await visibleText('You must accept the Privacy Policy')
      await visibleText('You must accept the Terms of Use')
    })
  })

  describe('Error Handling - Alert Tests', () => {
    it('should handle invalid credentials error', async () => {
      await tapElement('login-button')
      await waitForElement('login-screen')

      await typeText('email', 'wrong@user.com')
      await typeText('password', 'wrongpassword')

      await tapElement('login-submit-button')

      await waitForText('Error')

      await visibleText('Email or password incorrect')

      await tapText('Ok')

      await waitForElement('login-screen')
    })

    it('should handle email register failure', async () => {
      await tapElement('register-button')
      await waitForElement('register-screen')

      await typeText('firstName', 'Test')
      await typeText('lastName', 'User')
      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('register-screen')

      await tapElement('privacyPolicy-checkbox')
      await tapElement('termsOfUse-checkbox')

      await tapElement('register-submit-button')

      await waitForText('Error')

      await visibleText('Registration by email failed')

      await tapText('Ok')
    })
  })

  describe('Forgot Password Flow', () => {
    it('should send password reset successfully', async () => {
      await tapElement('login-button')

      await waitForElement('login-screen')

      await tapElement('forgot-password-button')

      await waitForElement('forgot-password-screen')

      await typeText('email', 'avox@gmail.com')

      await tapElement('forgot-password-submit-button')

      await waitForText('Successful')

      await visibleText('Password reset link has been sent to your email address')

      await waitForElement('login-screen')
    })
  })

  describe('Logout Flow', () => {
    beforeEach(async () => {
      await tapElement('login-button')
      await waitForElement('login-screen')

      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('login-submit-button')

      await waitForElement('profile-tab')

      await tapElement('profile-tab')
    })

    it('should cancel logout', async () => {
      await tapElement('logout-button')

      await waitForText('Warning')

      await visibleText('Are you sure you want to log out?')

      await tapText('Cancel')

      await waitForElement('profile-screen')
    })

    it('should logout successfully with confirmation', async () => {
      await tapElement('logout-button')

      await waitForText('Warning')

      await visibleText('Are you sure you want to log out?')

      await tapText('Yes')

      await waitForElement('profile-screen')
    })
  })
})
