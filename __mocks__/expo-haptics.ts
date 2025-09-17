export const impactAsync = jest.fn().mockResolvedValue(undefined)
export const notificationAsync = jest.fn().mockResolvedValue(undefined)
export const selectionAsync = jest.fn().mockResolvedValue(undefined)

export const ImpactFeedbackStyle = {
  Light: 'Light',
  Medium: 'Medium',
  Heavy: 'Heavy',
}

export const NotificationFeedbackType = {
  Success: 'Success',
  Warning: 'Warning',
  Error: 'Error',
}
