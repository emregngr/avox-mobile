import { cn } from '@/utils/common/cn'

describe('cn utility function', () => {
  describe('Basic Functionality', () => {
    it('should return an empty string when called with no arguments', () => {
      expect(cn()).toBe('')
    })

    it('should combine multiple string arguments', () => {
      expect(cn('hello', 'world')).toBe('hello world')
    })

    it('should ignore all falsy values', () => {
      expect(cn('hello', null, 'world', undefined, false, 0, '')).toBe('hello world')
    })

    it('should flatten nested arrays', () => {
      expect(cn('a', ['b', ['c', 'd']])).toBe('a b c d')
    })
  })

  describe('Conditional Classes (clsx features)', () => {
    it('should handle object arguments for conditional classes', () => {
      expect(cn({ a: true, b: false, c: true })).toBe('a c')
    })

    it('should handle mixed arguments (strings, objects, arrays)', () => {
      const isActive = true
      const hasError = false
      expect(cn('base', { active: isActive, error: hasError }, ['p-4', 'm-2'])).toBe(
        'base active p-4 m-2',
      )
    })
  })

  describe('Tailwind CSS Merging (tailwind-merge features)', () => {
    it('should resolve simple conflicts, with the last class winning', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4')
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
      expect(cn('text-sm', 'text-lg')).toBe('text-lg')
    })

    it('should resolve conflicts from within the same string', () => {
      expect(cn('p-2 p-4')).toBe('p-4')
    })

    it('should correctly merge classes with different properties', () => {
      expect(cn('p-4', 'px-6')).toBe('p-4 px-6')
    })

    it('should correctly merge classes where one is a superset of another', () => {
      expect(cn('px-4', 'p-6')).toBe('p-6')
      expect(cn('p-6', 'px-4')).toBe('p-6 px-4')
    })

    it('should handle directional property conflicts correctly', () => {
      expect(cn('py-6', 'pt-4')).toBe('py-6 pt-4')
    })

    it('should resolve conflicts with responsive modifiers', () => {
      expect(cn('p-2', 'md:p-4')).toBe('p-2 md:p-4')
      expect(cn('md:p-2', 'md:p-4')).toBe('md:p-4')
    })

    it('should resolve conflicts with state modifiers like hover', () => {
      expect(cn('bg-blue-500', 'hover:bg-red-500')).toBe('bg-blue-500 hover:bg-red-500')
      expect(cn('hover:bg-blue-500', 'hover:bg-red-500')).toBe('hover:bg-red-500')
    })

    it('should handle color and opacity conflicts', () => {
      expect(cn('text-blue-500', 'text-blue-500/80')).toBe('text-blue-500/80')
      expect(cn('text-black/50', 'text-black/80')).toBe('text-black/80')
    })

    it('should handle arbitrary value conflicts', () => {
      expect(cn('w-10', 'w-[100px]')).toBe('w-[100px]')
      expect(cn('top-[20px]', 'top-5')).toBe('top-5')
    })
  })

  describe('Edge Cases & Complex Scenarios', () => {
    it('should resolve conflicts that are generated from conditional objects', () => {
      const hasPadding = true
      const hasRedBg = false
      const result = cn(
        'p-2 bg-blue-500',
        {
          'p-4': hasPadding,
          'bg-red-500': hasRedBg,
        },
        'text-white',
      )
      expect(result).toBe('bg-blue-500 p-4 text-white')
    })

    it('should correctly merge a complex list of mixed arguments', () => {
      const result = cn(
        'p-2',
        ['m-4', { 'font-bold': true, 'text-lg': false }],
        'p-4',
        'text-red-500',
        ['text-sm', 'text-blue-500'],
      )
      expect(result).toBe('m-4 font-bold p-4 text-sm text-blue-500')
    })
  })
})
