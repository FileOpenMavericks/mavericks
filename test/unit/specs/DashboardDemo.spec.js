import Vue from 'vue'
import DashboardDemo from '@/components/DashboardDemo'

describe('DashboardDemo.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(DashboardDemo)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
