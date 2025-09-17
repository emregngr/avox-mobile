import {
  swipeScreen,
  tapElement,
  tapText,
  typeText,
  visibleText,
  waitForElement,
  waitForText,
} from './setup'

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

describe('Settings Flow', () => {
  describe('SettingsPrivacyPolicy Flow', () => {
    it('should display the settings privacy policy screen', async () => {
      await tapElement('profile-tab')

      await tapElement('header-right-icon')

      await tapElement('settings-privacy-policy-button')

      await waitForElement('settings-privacy-policy-screen')

      await swipeScreen('settings-privacy-policy-screen', 'up', 'slow', 0.8)
    })
  })

  describe('SettingsTermsOfUse Flow', () => {
    it('should display the settings terms of use screen', async () => {
      await tapElement('profile-tab')

      await tapElement('header-right-icon')

      await tapElement('settings-terms-of-use-button')

      await waitForElement('settings-terms-of-use-screen')

      await swipeScreen('settings-terms-of-use-screen', 'up', 'slow', 0.8)
    })
  })

  describe('Faq Flow', () => {
    it('should display the faq screen', async () => {
      await tapElement('profile-tab')

      await tapElement('header-right-icon')

      await tapElement('faq-button')

      await waitForElement('faq-screen')

      await tapElement('faq-1')

      await swipeScreen('faq-screen', 'up', 'slow', 0.8)
    })
  })

  describe('Delete Flow', () => {
    beforeEach(async () => {
      await tapElement('favorites-tab')

      await tapElement('login-button')
      await waitForElement('login-screen')

      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('login-submit-button')

      await waitForElement('profile-tab')

      await tapElement('profile-tab')

      await tapElement('header-right-icon')
    })

    it('should cancel delete', async () => {
      await tapElement('delete-account-button')

      await waitForText('Warning')

      await visibleText(
        'Are you sure you want to delete your account? This action cannot be undone',
      )

      await tapText('Cancel')

      await waitForElement('settings-screen')
    })

    it('should delete successfully with confirmation', async () => {
      await tapElement('delete-account-button')

      await waitForText('Warning')

      await visibleText(
        'Are you sure you want to delete your account? This action cannot be undone',
      )

      await tapText('Delete')

      await waitForText('Successful')

      await visibleText('Account deleted successfully')

      await waitForElement('settings-screen')
    })
  })
})
