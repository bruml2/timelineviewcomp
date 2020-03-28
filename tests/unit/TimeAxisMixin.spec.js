import { mount } from '@vue/test-utils'
import { TimeAxisMixin } from '../../src/mixins/TimeAxisMixin.js'

describe('TimeAxisMixin.getTickValues()', () => {
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
  test('on odd start', () => {
    const tl = {startYear: 1902, stopYear: 2000, tickInterval: 10}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1902, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000])
  })
  test('on odd stop', () => {
    const tl = {startYear: 1900, stopYear: 1997, tickInterval: 10}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 1997])
  })
  test('on odd start and stop', () => {
    const tl = {startYear: 1902, stopYear: 2006, tickInterval: 10}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1902, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2006])
  })
  test('on short extent', () => {
    const tl = {startYear: 1902, stopYear: 1916, tickInterval: 5}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1902, 1905, 1910, 1915, 1916])
  })
  test('on improbable extent', () => {
    const tl = {startYear: 1902, stopYear: 1906, tickInterval: 5}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1902, 1905, 1906])
  })
  test('observed bug', () => {
    const tl = {startYear: 1900, stopYear: 1975, tickInterval: 25}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1900, 1925, 1950, 1975])
  })
  test('bug: ticks are 1900 1905 ...', () => {
    const tl = {startYear: 1900, stopYear: 1975, tickInterval: 15}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1900, 1915, 1930, 1945, 1960, 1975])
  })
  test('bug: ticks are 1900 1905 ...', () => {
    const tl = {startYear: 1898, stopYear: 1975, tickInterval: 15}
    const ret = wrapper.vm.getTickValues(tl)
    expect(ret).toEqual([1898, 1915, 1930, 1945, 1960, 1975])
  })
})

describe('TimeAxisMixin.getTimeScaleFn()', () => {
  const Component = {
    render() {},
    mixins: [TimeAxisMixin]
  }
  const wrapper = mount(Component)
  const tl = {startYear: 1900, stopYear: 1975,
    svgSideMargin: 30, svgWidth: 900}

  test('observed bug A', () => {
    const scaleFn = wrapper.vm.getTimeScaleFn(tl)
    expect(scaleFn(1900)).toBe(30)
  })
  test('observed bug B', () => {
    const scaleFn = wrapper.vm.getTimeScaleFn(tl)
    expect(scaleFn(1975)).toBe(870)
  })
  test('observed bug C', () => {
    const scaleFn = wrapper.vm.getTimeScaleFn(tl)
    expect(scaleFn(1980)).toBeGreaterThan(870)
  })
})
