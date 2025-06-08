import { mount } from '@vue/test-utils'
import MyOrder from '../MyOrder.vue'
import { createStore } from 'vuex'

const store = createStore({
  state: {
    merchant: { MerchantId: 1, MerchantName: '测试商家' }
  }
})

describe('MyOrder.vue', () => {
  it('页面能正常渲染', () => {
    const wrapper = mount(MyOrder, {
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
