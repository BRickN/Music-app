import About from '@/views/AboutView.vue'
//limits rendered component children to 1 vs mount unlimited children
import { shallowMount } from '@vue/test-utils';

const rendersInnerText = () => {
    const wrapper = shallowMount(About);
    expect(wrapper.text()).toContain('This is an about page')
}

describe('About.vue', () => {
    test('Renders inner text', rendersInnerText);
})