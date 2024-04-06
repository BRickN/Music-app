import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

const renderComponent = (song) => {
    return shallowMount(SongItem, {
        props: {
            song
        },
        global: {
            components: {
                'router-link': RouterLinkStub
            }
        }
    });
}

const renderSongDisplayName = () => {
    const song = {
        display_name: 'test',
    }
    const wrapper = renderComponent(song)
    const compositionAuthor = wrapper.find('.text-gray-500');
    expect(compositionAuthor.text()).toBe(song.display_name)
}

const renderSongIdInId = () => {
    const song = {
        docId: 'abc',
    }
    const wrapper = renderComponent(song)
    expect(wrapper.attributes().id).toBe(`song-id-${song.docId}`)
}

const renderSongIdInClass = () => {
    const song = {
        docId: 'abc',
    }
    const wrapper = renderComponent(song)
    expect(wrapper.classes()).toContain(`song-id-${song.docId}`)
}

describe('SongItem.vue', () => {
    test('render song.display_name', renderSongDisplayName)
    test('renders song.docId in id attribute', renderSongIdInId)
    test('renders song.docId in class attribute', renderSongIdInClass)
})
