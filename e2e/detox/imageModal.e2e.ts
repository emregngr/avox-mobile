import {
  scrollToElement,
  tapElement,
  visibleElement,
  visibleTextInContainer,
  waitForElement,
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

describe('ImageModal Flow', () => {
  it('should display the image modal with the correct title and close when the button is pressed', async () => {
    await tapElement('view-all-button-Popular Airlines')

    await tapElement('airline-card-5')

    await waitForElement('airline-detail-screen')

    await tapElement('fleet-tab')

    await scrollToElement('airline-detail-scroll-view', 'airplane-row-card-Airbus A320-200', 'down')

    await tapElement('airplane-row-card-Airbus A320-200')

    const title = 'Airbus A320-200'

    await visibleElement('image-modal-screen')

    await visibleTextInContainer('image-modal-screen', title)

    await tapElement('close-button')

    await waitForElement('airline-detail-screen')
  })
})
