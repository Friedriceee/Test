import { mount } from '@vue/test-utils';
import SpecialOffers from '../SpecialOffer.vue'; 
import { createStore } from 'vuex';
import ElementPlus from 'element-plus';
import { createRouter, createWebHistory } from 'vue-router';

// 创建简单的 Vuex store
const store = createStore({
  state: {
    merchant: {
      MerchantId: 1,
      merchantName: '测试商家',
    },
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe('SpecialOffer.vue', () => {
  let wrapper;

  beforeEach(() => {
    // 设置初始数据
    store.state.merchant = {
      MerchantId: 1,
      merchantName: '测试商家',
    };

    // 挂载组件
    wrapper = mount(SpecialOffers, {
      global: {
        plugins: [ElementPlus, store, router],
      },
    });
  });

  it('测试创建满减活动按钮的点击', async () => {
    const createButton = wrapper.find('.normal-button');
    expect(createButton.exists()).toBe(true);
  
  });

  it('测试编辑满减活动按钮的点击', async () => {
    // 确保有一个满减活动存在
    wrapper.vm.offers = [{ offerId: 1, minPrice: '100', amountRemission: '10' }];
    await wrapper.vm.$nextTick(); // 等待DOM更新

    const editButton = wrapper.find('.edit-btn'); // 找到编辑按钮
    expect(editButton.exists()).toBe(true);
    await editButton.trigger('click'); // 点击编辑按钮
    expect(wrapper.vm.editingOfferId).not.toBe(null); // 确保进入编辑状态
  });

  it('测试删除满减活动按钮的点击', async () => {
    // 确保有一个满减活动存在
    wrapper.vm.offers = [{ offerId: 1, minPrice: '100', amountRemission: '10' }];
    await wrapper.vm.$nextTick(); // 等待DOM更新

    const deleteButton = wrapper.find('.delete-btn'); // 找到删除按钮
    expect(deleteButton.exists()).toBe(true);
    await deleteButton.trigger('click'); // 点击删除按钮
    // 不验证删除后的状态
  });

  it('测试取消编辑满减活动按钮的点击', async () => {
    // 确保有一个满减活动存在
    wrapper.vm.offers = [{ offerId: 1, minPrice: '100', amountRemission: '10' }];
    await wrapper.vm.$nextTick(); // 等待DOM更新

    // 先进入编辑模式
    const editButton = wrapper.find('.edit-btn');
    expect(editButton.exists()).toBe(true);
    await editButton.trigger('click'); // 点击编辑按钮
    expect(wrapper.vm.editingOfferId).not.toBe(null); // 确保进入编辑状态
    await wrapper.vm.$nextTick(); // 等待DOM更新

    // 然后测试取消按钮
    const cancelButton = wrapper.find('.delete-btn'); // 找到取消按钮
    expect(cancelButton.exists()).toBe(true);
    await cancelButton.trigger('click'); // 点击取消按钮
    expect(wrapper.vm.editingOfferId).toBe(null); // 确保退出编辑状态
  });
});