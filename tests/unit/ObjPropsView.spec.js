import { mount } from '@vue/test-utils'
import { ObjPropsView } from '../../src/components/ObjPropsView.js'

describe('ObjPropsView component', () => {
  // mount with props??
  const wrapper = mount(ObjPropsView)

  console.log(wrapper)

  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain('<span class="count">0</span>')
  })

  // it's also easy to check for the existence of elements
  it('has a button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  it('button should increment the count', () => {
    expect(wrapper.vm.count).toBe(0)
    const button = wrapper.find('button')
    button.trigger('click')
    expect(wrapper.vm.count).toBe(1)
  })
})
