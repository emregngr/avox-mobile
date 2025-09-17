import { MMKV } from 'react-native-mmkv'

import { ENUMS } from '@/enums'
import useUserStore, { deleteUser, setIsOnboardingSeen } from '@/store/user'

const storage = new MMKV()

const mockedStorageDelete = storage.delete as jest.MockedFunction<typeof storage.delete>

const mockedStorageSet = storage.set as jest.MockedFunction<typeof storage.set>

beforeEach(() => {
  useUserStore.setState({
    isOnboardingSeen: false,
    loading: false,
  })
})

describe('useUserStore', () => {
  it('should initialize with default state', () => {
    const { isOnboardingSeen, loading } = useUserStore.getState()
    expect(isOnboardingSeen).toBe(false)
    expect(loading).toBe(false)
  })

  it('should call Storage.delete and update loading state when deleteUser is called', () => {
    deleteUser()

    expect(mockedStorageDelete).toHaveBeenCalledWith(ENUMS.API_TOKEN)

    const { loading } = useUserStore.getState()
    expect(loading).toBe(false)
  })

  it('should call Storage.set when setIsOnboardingSeen is called', () => {
    setIsOnboardingSeen(true)
    expect(mockedStorageSet).toHaveBeenCalledWith(ENUMS.IS_ONBOARDING_SEEN, 'true')

    setIsOnboardingSeen(false)
    expect(mockedStorageSet).toHaveBeenCalledWith(ENUMS.IS_ONBOARDING_SEEN, 'false')
  })
})
