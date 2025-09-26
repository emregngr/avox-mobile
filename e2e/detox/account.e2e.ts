import { tapElement, tapText, typeText, visibleText, waitForElement, waitForText } from './setup'

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
      locale: 'en_US',
    },
  })

  await tapElement('onboarding-skip-button')
})

describe('Account Flow', () => {
  describe('UpdateProfile Flow', () => {
    it('should display the update profile screen', async () => {
      await tapText('Favorites')

      await tapElement('login-button')

      await waitForElement('login-screen')

      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('login-submit-button')

      await waitForElement('favorites-screen')

      await tapText('Profile')

      await tapElement('update-profile-button')

      await waitForElement('update-profile-screen')

      await typeText('firstName', '1')
      await typeText('lastName', '1')

      await tapElement('update-submit-button')

      await waitForText('Successful')

      await visibleText('Profile updated successfully')

      await waitForElement('profile-screen')
    })
  })

  describe('Password Flow', () => {
    it('should change password successfully', async () => {
      await tapText('Favorites')

      await tapElement('login-button')

      await waitForElement('login-screen')

      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('login-submit-button')

      await waitForElement('favorites-screen')

      await tapText('Profile')

      await tapText('Profile')

      await tapElement('password-button')

      await waitForElement('password-screen')

      await typeText('currentPassword', '123456')
      await typeText('newPassword', '654321')
      await typeText('confirmPassword', '654321')

      await tapElement('change-password-submit-button')

      await waitForText('Successful')

      await visibleText('Password changed successfully')

      await waitForElement('profile-screen')
    })
  })

  describe('ChooseTheme Flow', () => {
    it('should display the choose theme screen', async () => {
      await tapText('Profile')

      await tapElement('choose-theme-button')

      await waitForElement('choose-theme-screen')

      await tapElement('theme-item-light')

      await waitForElement('profile-screen')
    })
  })

  describe('ChooseLanguage Flow', () => {
    it('should display the choose language screen', async () => {
      await tapText('Profile')

      await tapElement('choose-language-button')

      await waitForElement('choose-language-screen')

      await tapElement('language-item-tr')

      await waitForElement('profile-screen')
    })
  })
})
