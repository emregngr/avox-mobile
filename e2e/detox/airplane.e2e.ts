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

describe('Airplane Flow', () => {
  it('should display the airplane screen', async () => {
    await swipeScreen('home-screen-flatlist', 'up', 'slow', 0.8)

    await tapElement('view-all-button-Total Airplanes')

    await waitForElement('total-airplanes-screen')

    await swipeScreen('total-airplanes-screen', 'up', 'slow', 0.8)
  })
})
