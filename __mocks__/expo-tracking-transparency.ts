export const getTrackingPermissionsAsync = jest.fn().mockResolvedValue({
  status: 'granted',
})

export const requestTrackingPermissionsAsync = jest.fn().mockResolvedValue({
  status: 'granted',
})

export const PermissionStatus = {
  UNDETERMINED: 'undetermined',
  GRANTED: 'granted',
  DENIED: 'denied',
}
