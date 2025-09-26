import { sleep, swipeScreen, tapElement, tapText, typeText, waitForElement } from './setup'

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

describe('Airline Flow', () => {
  describe('AllPopularAirlines Flow', () => {
    it('should display the all popular airlines screen', async () => {
      await tapElement('view-all-button-Popular Airlines')

      await swipeScreen('all-popular-airlines-screen', 'up', 'slow', 0.8)
    })
  })

  describe('AirlineDetail Flow', () => {
    it('should display the airline detail screen', async () => {
      await tapElement('view-all-button-Popular Airlines')

      await tapElement('airline-card-5')

      await waitForElement('airline-detail-screen')

      await swipeScreen('airline-detail-screen', 'up', 'slow', 0.8)

      await sleep(3000)

      await tapElement('fleet-tab')

      await swipeScreen('airline-detail-screen', 'up', 'slow', 0.8)

      await sleep(3000)

      await tapElement('airlineFlight-tab')

      await swipeScreen('airline-detail-screen', 'up', 'slow', 0.8)

      await sleep(3000)

      await tapElement('safetyEnv-tab')

      await swipeScreen('airline-detail-screen', 'up', 'slow', 0.8)
    })
  })

  describe('AirlineDetail Favorite and Share Flow', () => {
    it('should display the airline detail screen', async () => {
      await tapText('Favorites')

      await tapElement('login-button')
      await waitForElement('login-screen')

      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('login-submit-button')

      await waitForElement('favorites-screen')

      await tapText('Home')

      await tapElement('view-all-button-Popular Airlines')

      await tapElement('airline-card-5')

      await waitForElement('airline-detail-screen')

      await tapElement('header-right-icon')

      await tapElement('header-share-icon')
    })
  })
})
