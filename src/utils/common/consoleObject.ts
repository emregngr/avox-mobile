import { Logger } from '@/utils/common/logger'

export const consoleObject = (object: unknown): void => {
  if (object == null) {
    Logger.breadcrumb('Object is null or undefined', 'warning', object as any)
    return
  }

  if (typeof object !== 'object') {
    Logger.breadcrumb('Input is not an object', 'warning', object as any)
    return
  }

  const entries = Object.entries(object)

  if (entries.length === 0) {
    Logger.breadcrumb('Object is empty', 'warning', object as any)
    return
  }

  entries.forEach(([key, value]) => {
    Logger.breadcrumb(`${key}: ${value}`, 'info', object as any)
  })
}
