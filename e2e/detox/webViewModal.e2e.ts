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

describe('WebViewModal Flow', () => {
  it('should display the webview modal with the correct title and close when the button is pressed', async () => {
    await tapElement('view-all-button-Popular Airlines')

    await tapElement('airline-card-5')

    await waitForElement('airline-detail-screen')

    await scrollToElement('airline-detail-scroll-view', 'web', 'down')

    await tapElement('web')

    const title = 'www.aeroflot.ru'

    await visibleElement('web-view-modal-screen')

    await visibleTextInContainer('web-view-modal-screen', title)

    await tapElement('close-button')

    await waitForElement('airline-detail-screen')
  })
})
