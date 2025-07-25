export interface ParsedRange {
  max: number
  min: number
}

export const parseFilterRange = (rangeStr: string | undefined | null): ParsedRange | null => {
  if (!rangeStr) return null

  const str = String(rangeStr).toLowerCase()

  if (/^\d{4}-\d{4}$/.test(str)) {
    const parts = str.split('-')
    const min = parseInt(parts[0]!, 10)
    const max = parseInt(parts[1]!, 10)
    return !isNaN(min) && !isNaN(max) ? { max, min } : null
  }

  if (str.includes('-') && !/^\d{4}-\d{4}$/.test(str)) {
    const parts = str.split('-')
    const min = parseFloat(parts[0]!)
    const max = parseFloat(parts[1]!)
    if (!isNaN(min) && !isNaN(max)) return { max, min }
  }

  if (str.endsWith('+')) {
    const min = parseFloat(str.slice(0, -1))
    if (!isNaN(min)) return { max: Infinity, min }
  }

  return null
}
