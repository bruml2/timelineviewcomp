import { mount } from '@vue/test-utils'
import { USPresidentsMixin } from '../../src/mixins/USPresidentsMixin.js'

describe('USPresidentsMixin.getRelevantPres(startYear, stopYear)', () => {
  const Component = {
    render() {},
    mixins: [USPresidentsMixin]
  }
  const wrapper = mount(Component, {
    propsData: {
      tl: {startYear: 1900, stopYear: 2000, tickInterval: 10}
    }
  })

  test('on boundaries', () => {
    const objArr = wrapper.vm.getRelevantPres(1910, 1960)
    expect (objArr.length).toBe(8)
  })

  test('properties of president object', () => {
    const objArr = wrapper.vm.getRelevantPres(1910, 1952)
    expect (objArr.pop()).toEqual({from: 1945, to: 1953, name: "Harry S. Truman", party: "Democratic", portrait: "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States#/media/File:TRUMAN_58-766-06_CROPPED.jpg"})
  })
})
