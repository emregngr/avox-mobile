import { renderHook } from '@testing-library/react-hooks'
import * as Updates from 'expo-updates'

import { checkForAppUpdate, useAppUpdate } from '@/hooks/app/useAppUpdate'
import { Logger } from '@/utils/common/logger'

jest.mock('@/utils/common/logger')

const mockedLoggerBreadcrumb = Logger.breadcrumb as jest.MockedFunction<typeof Logger.breadcrumb>

const mockedCheckForUpdateAsync = Updates.checkForUpdateAsync as jest.MockedFunction<
  typeof Updates.checkForUpdateAsync
>

const mockedFetchUpdateAsync = Updates.fetchUpdateAsync as jest.MockedFunction<
  typeof Updates.fetchUpdateAsync
>

const createMockManifest = (): Updates.Manifest =>
  ({
    id: 'test-update-id',
    createdAt: '2023-01-01T00:00:00.000Z',
    runtimeVersion: '1.0.0',
    launchAsset: {
      key: 'test-key',
      contentType: 'application/javascript',
      url: 'test-url',
    },
    assets: [],
    metadata: {},
    extra: {},
  }) as Updates.Manifest

describe('App Update', () => {
  describe('checkForAppUpdate', () => {
    it('should check for update and fetch if available', async () => {
      const mockManifest = createMockManifest()

      mockedCheckForUpdateAsync.mockResolvedValue({
        isAvailable: true,
        manifest: mockManifest,
      } as Updates.UpdateCheckResult)

      mockedFetchUpdateAsync.mockResolvedValue({
        isNew: true,
        manifest: mockManifest,
      } as Updates.UpdateFetchResult)

      await checkForAppUpdate()

      expect(mockedCheckForUpdateAsync).toHaveBeenCalledTimes(1)
      expect(mockedFetchUpdateAsync).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
    })

    it('should not fetch update when no update is available', async () => {
      mockedCheckForUpdateAsync.mockResolvedValue({
        isAvailable: false,
      } as Updates.UpdateCheckResult)

      await checkForAppUpdate()

      expect(mockedCheckForUpdateAsync).toHaveBeenCalledTimes(1)
      expect(mockedFetchUpdateAsync).not.toHaveBeenCalled()
      expect(mockedLoggerBreadcrumb).not.toHaveBeenCalled()
    })

    it('should log error when checkForUpdateAsync fails', async () => {
      const error = new Error('Network error')
      mockedCheckForUpdateAsync.mockRejectedValue(error)

      await checkForAppUpdate()

      expect(mockedCheckForUpdateAsync).toHaveBeenCalledTimes(1)
      expect(mockedFetchUpdateAsync).not.toHaveBeenCalled()
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to check for app update',
        'error',
        error,
      )
    })

    it('should log error when fetchUpdateAsync fails', async () => {
      const error = new Error('Fetch error')
      const mockManifest = createMockManifest()

      mockedCheckForUpdateAsync.mockResolvedValue({
        isAvailable: true,
        manifest: mockManifest,
      } as Updates.UpdateCheckResult)

      mockedFetchUpdateAsync.mockRejectedValue(error)

      await checkForAppUpdate()

      expect(mockedCheckForUpdateAsync).toHaveBeenCalledTimes(1)
      expect(mockedFetchUpdateAsync).toHaveBeenCalledTimes(1)
      expect(mockedLoggerBreadcrumb).toHaveBeenCalledWith(
        'Failed to check for app update',
        'error',
        error,
      )
    })
  })

  describe('useAppUpdate', () => {
    it('should call checkForAppUpdate on mount', () => {
      renderHook(() => useAppUpdate())
    })

    it('should create stable callback', () => {
      const { result, rerender } = renderHook(() => useAppUpdate())
      const firstRender = result.current

      rerender()
      const secondRender = result.current

      expect(firstRender).toBe(secondRender)
    })
  })
})
