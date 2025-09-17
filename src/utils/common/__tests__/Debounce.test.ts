import { act, renderHook } from '@testing-library/react-native'

import { debounce } from '@/utils/common/debounce'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('debounce Hook', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => debounce('initial value', 500))

    expect(result.current).toBe('initial value')
  })

  it('should update the value only after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => debounce(value, delay),
      {
        initialProps: { value: 'first', delay: 500 },
      },
    )

    expect(result.current).toBe('first')

    rerender({ value: 'second', delay: 500 })

    expect(result.current).toBe('first')

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('second')
  })

  it('should only use the latest value after rapid subsequent updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => debounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    )

    rerender({ value: 'update 1', delay: 500 })
    rerender({ value: 'update 2', delay: 500 })
    rerender({ value: 'final update', delay: 500 })

    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('final update')
  })

  it('should clear the timeout on rerender and on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const { unmount, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => debounce(value, delay),
      {
        initialProps: { value: 'hello', delay: 1000 },
      },
    )

    rerender({ value: 'world', delay: 1000 })

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2)

    clearTimeoutSpy.mockRestore()
  })
})
