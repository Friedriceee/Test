import { mount } from '@vue/test-utils';
import MerchantHome from '../MerchantHome.vue'; // 假设文件名为 MerchantHome.vue
import ElementPlus from 'element-plus';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus'; // 引入 ElementPlus 的 Message 组件

// 创建一个简单的 Vuex store
const store = createStore({
  state: {
    merchant: {
      MerchantId: 1,
      merchantName: '测试商家',
      contact: '123456789',
      merchantAddress: '测试地址',
    },
  },
  actions: {
    async getOrdersToHandle() {
      return {
        data: [
          {
            orderId: 1,
            price: 100,
            state: 1,
            orderTimestamp: Date.now(),
            addressId: 1,
            dishes: [{ merchantId: 1, dishId: 1, dishNum: 2 }]
          },
        ],
      };
    },
    async getDishInfo() {
      return {
        data: {
          imageUrl: 'dummy-image-url',
          dishName: '测试菜品',
        },
      };
    },
    async GetAddressByAddressId() {
      return {
        data: {
          contactName: '张三',
          phoneNumber: '987654321',
          userAddress: '测试地址',
          houseNumber: '101',
        },
      };
    },
    async deletePaidOrder() {
      return Promise.resolve(); // 模拟删除订单的请求
    }
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe('MerchantHome.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MerchantHome, {
      global: {
        plugins: [ElementPlus, store, router],
      },
    });
  });

 


  it('查看订单详情', async () => {
    await wrapper.vm.renewOrders(); // 加载订单
    await wrapper.vm.$nextTick(); // 等待更新完成

    const orderItem = wrapper.find('.order-item');
    if (orderItem.exists()) {
      await orderItem.trigger('click'); // 点击查看订单详情

      expect(wrapper.vm.isOrderInfo).toBe(true); // 确认已显示订单详情
    }
  });

 

  it('浏览不同的页面', async () => {
    await wrapper.vm.goToMenu(); // 点击进入菜单页面
    expect(wrapper.vm.isMerchantHome).toBe(false); // 确认隐藏欢迎信息和按钮

    await wrapper.vm.goToPersonal(); // 点击进入个人信息页面
    expect(wrapper.vm.isMerchantHome).toBe(false); // 确认隐藏欢迎信息和按钮

    await wrapper.vm.goBack(); // 点击返回到商家主页
    expect(wrapper.vm.isMerchantHome).toBe(true); // 确认显示欢迎信息和按钮
  });

  it('测试订单倒计时更新', async () => {
    await wrapper.vm.renewOrders(); // 加载订单
    await wrapper.vm.$nextTick(); // 等待更新完成

    if (wrapper.vm.pendingOrders.length > 0) {
      const initialCountdown = wrapper.vm.pendingOrders[0].countdown;
      jest.advanceTimersByTime(1000); // 快进1秒
      expect(wrapper.vm.pendingOrders[0].countdown).toBe(initialCountdown - 1); // 确认倒计时减少
    }
  });
});
