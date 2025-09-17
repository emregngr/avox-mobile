export const installGlobal = jest.fn()

export const getValue = jest.fn((key: string) => {
  if (key === 'structuredClone') {
    return global.structuredClone
  }
  return undefined
})

export default {}
