import { getCrashlytics, log, recordError } from '@react-native-firebase/crashlytics'

export type LogCategory = 'info' | 'error' | 'warning' | 'debug'

export type LogData = Record<string, unknown> | Error | null

const crashlytics = getCrashlytics()

export const Logger = {
  breadcrumb: (message: string, category: LogCategory, data: LogData = null): void => {
    const row = {
      category,
      data: data ?? {},
      message,
    }

    if (!__DEV__) {
      if (data instanceof Error) {
        recordError(crashlytics, data)
      } else {
        log(crashlytics, JSON.stringify(row))
      }
    }

    console.log(message, category, data)
  },

  log: (message: string, data: LogData = null): void => {
    const row = {
      category: 'info' as LogCategory,
      data: data ?? {},
      message,
    }

    if (!__DEV__) {
      if (data instanceof Error) {
        recordError(crashlytics, data)
      } else {
        log(crashlytics, JSON.stringify(row))
      }
    }

    console.log(message, data)
  },
}
