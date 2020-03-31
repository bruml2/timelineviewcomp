import { mount } from '@vue/test-utils'
import { ObjPropsView } from '../../src/components/ObjPropsView.js'

describe('ObjPropsView component', () => {
  const Component = {
    render() {},
    mixins: [TimeAxisMixin]
  }
  const wrapper = mount(Component)

  test('on boundaries', () => {
    const tl = {startYear: 1900, stopYear: 2000, tickInterval: 10}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000])
  })
