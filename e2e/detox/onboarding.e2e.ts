import { by, element } from 'detox'
import { tapElement, visibleElement, waitForElement } from './setup'

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
})

describe('Onboarding Flow', () => {
  it('should display the first onboarding slide on app launch', async () => {
    await visibleElement('onboarding-screen')

    await visibleElement('continue-button')

    await visibleElement('onboarding-skip-button')
  })

  it('should navigate through slides by swiping', async () => {
    const flatList = element(by.id('onboarding-flatlist'))

    await flatList.swipe('left', 'slow')
    await flatList.swipe('left', 'slow')
    await flatList.swipe('left', 'slow')

    await flatList.swipe('right', 'slow')
  })

  it('should navigate through slides using the "Continue" button and finish', async () => {
    await tapElement('continue-button')

    await tapElement('continue-button')

    await tapElement('continue-button')

    await tapElement('skip-button')

    await waitForElement('home-screen')
  })

  it('should skip the onboarding process using the top skip button', async () => {
    await tapElement('onboarding-skip-button')

    await waitForElement('home-screen')
  })
})
