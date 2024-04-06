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

const rendersRouterLink = () => {
    const song = {
        docId: 'abc'
    }
    const component = renderComponent(song)

    expect(component.findComponent(RouterLinkStub).props().to).toEqual({ name: 'song', params: { id: song.docId } })
}


describe('Router', () => {
    test('renders router link', rendersRouterLink)
})
