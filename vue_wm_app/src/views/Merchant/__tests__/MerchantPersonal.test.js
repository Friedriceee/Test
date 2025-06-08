import { mount } from '@vue/test-utils';
import MerchantPersonal from '../MerchantPersonal.vue'; // 修正为 MerchantPersonal.vue
import ElementPlus from 'element-plus';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';

// 创建一个简单的 Vuex store
const store = createStore({
  state: {
    merchant: {
      MerchantId: 4,
      Password: '123456',
      MerchantName: '测试商家',
      MerchantAddress: '测试地址',
      Contact: '12345678901',
      CouponType: 0,
      DishType: '川菜',
      Wallet: 100,
      WalletPassword: '123456'
    }
  }
});

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe('MerchantPersonal.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MerchantPersonal, {
      global: {
        plugins: [ElementPlus, router, store],
        stubs: {
          'el-descriptions': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-radio-group': true,
          'el-radio': true,
          'el-time-picker': true
        }
      }
    });
  });

  it('页面能正常渲染', () => {
    expect(wrapper.exists()).toBe(true);
  });

 

  it('测试打开钱包按钮的点击', async () => {
    await wrapper.find('.wallet-button').trigger('click'); // 点击钱包按钮
    expect(wrapper.vm.isWallet).toBe(true); // 确保钱包界面被打开
  });
});
