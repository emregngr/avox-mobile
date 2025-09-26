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

describe('Airport Flow', () => {
  describe('AllPopularAirports Flow', () => {
    it('should display the all popular airports screen', async () => {
      await tapElement('view-all-button-Popular Airports')

      await swipeScreen('all-popular-airports-screen', 'up', 'slow', 0.8)
    })
  })

  describe('AirportDetail Flow', () => {
    it('should display the airport detail screen', async () => {
      await tapElement('view-all-button-Popular Airports')

      await tapElement('airport-card-24')

      await waitForElement('airport-detail-screen')

      await swipeScreen('airport-detail-screen', 'up', 'slow', 0.8)

      await sleep(3000)

      await tapElement('infrastructure-tab')

      await swipeScreen('airport-detail-screen', 'up', 'slow', 0.8)

      await sleep(3000)

      await tapElement('airportFlight-tab')

      await swipeScreen('airport-detail-screen', 'up', 'slow', 0.8)

      await sleep(3000)

      await tapElement('nearbyPlaces-tab')

      await swipeScreen('airport-detail-screen', 'up', 'slow', 0.8)
    })
  })

  describe('AirportDetail Favorite and Share Flow', () => {
    it('should display the airport detail screen', async () => {
      await tapText('Favorites')

      await tapElement('login-button')
      await waitForElement('login-screen')

      await typeText('email', 'avox@gmail.com')
      await typeText('password', '123456')

      await tapElement('login-submit-button')

      await waitForElement('favorites-screen')

      await tapText('Home')

      await tapElement('view-all-button-Popular Airports')

      await tapElement('airport-card-24')

      await waitForElement('airport-detail-screen')

      await tapElement('header-right-icon')

      await tapElement('header-share-icon')
    })
  })
})
