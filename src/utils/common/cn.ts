import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]): string => {
  if (!inputs || inputs.length === 0) {
    return ''
  }

  return twMerge(clsx(inputs))
}
