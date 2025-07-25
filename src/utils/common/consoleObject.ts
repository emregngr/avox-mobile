export const consoleObject = (object: unknown) => {
  if (object == null) {
    console.log('Object is null or undefined')
    return
  }

  if (typeof object !== 'object') {
    console.log('Input is not an object')
    return
  }

  const entries = Object.entries(object)

  if (entries.length === 0) {
    console.log('Object is empty')
    return
  }

  entries.forEach(([key, value]) => {
    console.log(`${key}: ${value}`)
  })
}
