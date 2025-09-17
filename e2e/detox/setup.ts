import { by, element, waitFor } from 'detox'

export const waitForElement = async (elementId: string, timeout = 20000) => {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout)
}

export const visibleElement = async (elementId: string) => {
  await expect(element(by.id(elementId))).toBeVisible()
}

export const notVisibleElement = async (elementId: string) => {
  await expect(element(by.id(elementId))).not.toBeVisible()
}

export const tapElement = async (elementId: string) => {
  await waitForElement(elementId)
  await element(by.id(elementId)).tap()
}

export const waitForText = async (text: string, timeout = 20000) => {
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .withTimeout(timeout)
}

export const visibleText = async (text: string) => {
  await expect(element(by.text(text))).toBeVisible()
}

export const notVisibleText = async (elementId: string) => {
  await expect(element(by.text(elementId))).not.toBeVisible()
}

export const tapText = async (text: string) => {
  await waitForText(text)
  await element(by.text(text)).tap()
}

export const typeText = async (elementId: string, text: string) => {
  await waitForElement(elementId)
  await element(by.id(elementId)).typeText(text)
}

export const scrollToElement = async (
  scrollableElementId: string,
  targetElementId: string,
  direction: 'up' | 'down' | 'left' | 'right' = 'down',
  scrollAmountPerSwipe = 150,
) => {
  await waitFor(element(by.id(targetElementId)))
    .toBeVisible()
    .whileElement(by.id(scrollableElementId))
    .scroll(scrollAmountPerSwipe, direction)
}

export const swipeScreen = async (
  elementId: string,
  direction: 'up' | 'down' | 'left' | 'right',
  speed: 'slow' | 'fast' = 'slow',
  normalizedOffset = 0.5,
) => {
  await waitForElement(elementId)
  await element(by.id(elementId)).swipe(direction, speed, normalizedOffset)
}

export const visibleTextInContainer = async (containerId: string, text: string) => {
  const elementInContainer = element(by.text(text).withAncestor(by.id(containerId)))
  await expect(elementInContainer).toBeVisible()
}

export const textNotInContainer = async (containerId: string, text: string) => {
  const elementInContainer = element(by.text(text).withAncestor(by.id(containerId)))
  await expect(elementInContainer).not.toBeVisible()
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
