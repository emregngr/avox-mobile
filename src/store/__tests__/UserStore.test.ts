import { createMMKV } from 'react-native-mmkv'

import { ENUMS } from '@/enums'
import useUserStore, { deleteUser } from '@/store/user'

const storage = createMMKV()

const mockedStorageDelete = storage.remove as jest.MockedFunction<typeof storage.remove>

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

  it('should call Storage.remove and update loading state when deleteUser is called', () => {
    deleteUser()

    expect(mockedStorageDelete).toHaveBeenCalledWith(ENUMS.API_TOKEN)

    const { loading } = useUserStore.getState()
    expect(loading).toBe(false)
  })

  it('should update isOnboardingSeen status', () => {
    const { setIsOnboardingSeen } = useUserStore.getState()

    setIsOnboardingSeen(true)

    expect(useUserStore.getState().isOnboardingSeen).toBe(true)
  })
})
