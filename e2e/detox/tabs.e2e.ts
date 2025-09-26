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

describe('Tabs Flow', () => {
  it('should display the tabs and navigate through them', async () => {
    await waitForElement('home-screen')

    await swipeScreen('home-screen-flatlist', 'up', 'slow', 0.8)

    await tapText('Discover')

    await waitForElement('discover-screen')

    await sleep(5000)

    await swipeScreen('discover-screen', 'up', 'slow', 0.8)

    await tapElement('discover-airlines-tab')

    await swipeScreen('discover-screen', 'up', 'slow', 0.8)

    await tapText('Favorites')

    await tapElement('login-button')

    await waitForElement('login-screen')

    await typeText('email', 'avox@gmail.com')
    await typeText('password', '123456')

    await tapElement('login-submit-button')

    await waitForElement('favorites-screen')

    await sleep(5000)

    await swipeScreen('favorites-screen', 'up', 'slow', 0.8)

    await tapElement('favorites-airlines-tab')

    await swipeScreen('favorites-screen', 'up', 'slow', 0.8)

    await tapText('Profile')
  })

  it('should display airport search and filter successfully', async () => {
    await waitForElement('home-screen')

    await tapText('Discover')

    await waitForElement('discover-screen')

    await typeText('search-input', 'İstanbul')

    await tapElement('search-clear-button')

    await tapElement('search-cancel-button')

    await tapElement('filter-button')

    await tapElement('filter-chip-Europe')

    await tapElement('filter-chip-> 2000')

    await tapElement('filter-apply-button')

    await tapElement('active-filters-remove-foundingYear')

    await tapElement('active-filters-clear-button')
  })

  it('should display airline search and filter successfully', async () => {
    await waitForElement('home-screen')

    await tapText('Discover')

    await waitForElement('discover-screen')

    await tapElement('discover-airlines-tab')

    await typeText('search-input', 'Turkish')

    await tapElement('search-clear-button')

    await tapElement('search-cancel-button')

    await tapElement('filter-button')

    await tapElement('filter-chip-Europe')

    await tapElement('filter-chip-> 2000')

    await tapElement('filter-apply-button')

    await tapElement('active-filters-remove-region')

    await tapElement('active-filters-clear-button')
  })
})
