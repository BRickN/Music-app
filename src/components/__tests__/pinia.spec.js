import { setActivePinia, createPinia } from 'pinia'
import useUserStore from '@/stores/user'

vi.mock('@/includes/firebase', () => ({
    auth: {
        signInWithEmailAndPassword: () => {
            Promise.resolve()
        }
    }
}))

const authenticateUser = async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).toBe(false)
    await store.authenticate({})
    expect(store.userLoggedIn).toBe(true)
}

describe('stores', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('authenticate user', authenticateUser)
})

