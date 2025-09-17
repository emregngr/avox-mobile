import { swipeScreen, tapElement, waitForElement } from './setup'

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

describe('Destination Flow', () => {
  it('should display the destination screen', async () => {
    await swipeScreen('home-screen', 'up', 'slow', 0.5)

    await tapElement('view-all-button-Popular Destinations')

    await waitForElement('all-popular-destinations-screen')

    await swipeScreen('all-popular-destinations-screen', 'up', 'slow', 0.8)
  })
})
