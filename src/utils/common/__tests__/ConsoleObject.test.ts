import { consoleObject } from '@/utils/common/consoleObject'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

describe('consoleObject', () => {
  describe('null and undefined cases', () => {
    it('should log warning for null value', () => {
      consoleObject(null)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Object is null or undefined',
        'warning',
        null,
      )
    })

    it('should log warning for undefined value', () => {
      consoleObject(undefined)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Object is null or undefined',
        'warning',
        undefined,
      )
    })
  })

  describe('non-object types', () => {
    it('should log warning for string', () => {
      const testString = 'test string'
      consoleObject(testString)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Input is not an object',
        'warning',
        testString,
      )
    })

    it('should log warning for number', () => {
      const testNumber = 42
      consoleObject(testNumber)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Input is not an object',
        'warning',
        testNumber,
      )
    })

    it('should log warning for boolean', () => {
      const testBoolean = true
      consoleObject(testBoolean)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Input is not an object',
        'warning',
        testBoolean,
      )
    })
  })

  describe('empty object', () => {
    it('should log warning for empty object', () => {
      const emptyObject = {}
      consoleObject(emptyObject)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('Object is empty', 'warning', emptyObject)
    })
  })

  describe('valid object cases', () => {
    it('should log info for single property object', () => {
      const testObject = { name: 'John' }
      consoleObject(testObject)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith('name: John', 'info', testObject)
    })

    it('should log info for each property in multi-property object', () => {
      const testObject = {
        name: 'John',
        age: 30,
        city: 'Istanbul',
      }
      consoleObject(testObject)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(3)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(1, 'name: John', 'info', testObject)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(2, 'age: 30', 'info', testObject)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(
        3,
        'city: Istanbul',
        'info',
        testObject,
      )
    })

    it('should log string representation for nested object', () => {
      const testObject = {
        user: { name: 'John', age: 30 },
        active: true,
      }
      consoleObject(testObject)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(2)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(
        1,
        'user: [object Object]',
        'info',
        testObject,
      )
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(2, 'active: true', 'info', testObject)
    })

    it('should log each element for array', () => {
      const testArray = ['apple', 'banana', 'cherry']
      consoleObject(testArray)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(3)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(1, '0: apple', 'info', testArray)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(2, '1: banana', 'info', testArray)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(3, '2: cherry', 'info', testArray)
    })
  })

  describe('special values', () => {
    it('should log null property values', () => {
      const testObject = { name: null, age: 25 }
      consoleObject(testObject)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(2)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(1, 'name: null', 'info', testObject)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(2, 'age: 25', 'info', testObject)
    })

    it('should log undefined property values', () => {
      const testObject = { name: 'John', age: undefined }
      consoleObject(testObject)

      expect(mockedLoggerBreadcrumb).toHaveBeenCalledTimes(2)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(1, 'name: John', 'info', testObject)
      expect(mockedLoggerBreadcrumb).toHaveBeenNthCalledWith(
        2,
        'age: undefined',
        'info',
        testObject,
      )
    })
  })
})
