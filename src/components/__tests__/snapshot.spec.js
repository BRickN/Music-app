import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

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

const rendersCorrectly = () => {
    const song = {
        docId: 'docId',
        modified_name: 'modName',
        display_name: 'test',
        comment_count: 5
    }
    const wrapper = renderComponent(song)

    expect(wrapper.element).toMatchSnapshot()
}

describe('Snapshots SongItem.vue', () => {
    test('render correctly', rendersCorrectly)
})
