import Home from '@/views/HomeView.vue'
import SongItem from '@/components/SongItem.vue'
import { shallowMount } from '@vue/test-utils'

const createComponent = (songs) => {
    return shallowMount(Home, {
        data() {
            return {
                songs
            };
        },
        global: {
            mocks: {
                $t: (message) => message
            }
        }
    })
}

const rendersListOfSongs = () => {
    const songs = [
        {}, {}, {}
    ]
    const component = createComponent(songs)

    const items = component.findAllComponents(SongItem)
    expect(items).toHaveLength(songs.length)
}

const renderListOfSongsInOrder = () => {
    const songs = [
        {}, {}, {}
    ]
    const component = createComponent(songs)

    const items = component.findAllComponents(SongItem)
    items.forEach((wrapper, i) => {
        expect(wrapper.props().song).toStrictEqual(songs[i])
    })
}

describe('HomeView.vue', () => {
    test('renders list of songs', rendersListOfSongs)
    test('renders songs in correct order', renderListOfSongsInOrder)
})
