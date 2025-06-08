import { mount, config } from '@vue/test-utils'
import MerchantDish from '../MerchantDish.vue'
import ElementPlus from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

// 创建一个简单的路由
const router = createRouter({
  history: createWebHistory(),
  routes: [] // 可以为空
})

config.global.config.errorHandler = (err, vm, info) => {
  // 处理错误，例如记录日志或忽略
  console.error('捕获到错误:', err);
};

describe('MerchantDish.vue 基本交互测试', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MerchantDish, {
      global: {
        plugins: [ElementPlus, router, store],
        stubs: {
          'el-input': true,
          'el-button': true,
          'el-form': true,
          'el-form-item': true,
          'el-icon': true,
        },
        provide: {
          merchant: { value: { MerchantId: 1, merchantName: '测试商家' } } // mock merchant
        }
      }
    })
  })

  it('检查新建菜单项按钮是否可见', () => {
    const createButton = wrapper.find('button.normal-button') // 找到新建菜单项按钮
    expect(createButton.exists()).toBe(true) // 确保按钮存在
  })

  it('点击新建菜单项按钮进入创建模式', async () => {
    const createButton = wrapper.find('button.normal-button');
    await createButton.trigger('click'); // 点击按钮

    expect(wrapper.html()).toContain('创建菜品'); // 检查页面是否变化，进入创建模式
  })

  it('点击取消按钮退出创建模式', async () => {
    await wrapper.find('button.normal-button').trigger('click'); // 点击新建菜单项按钮
    await wrapper.find('button.cancel-btn').trigger('click'); // 点击取消按钮

    expect(wrapper.html()).not.toContain('创建菜品'); // 确保退出创建模式
  })

  it('检查编辑菜品按钮是否可见', async () => {
    // 添加菜品以确保编辑按钮可见
    wrapper.vm.displayedDishes = [{
      dishId: 1,
      dishName: '测试菜品',
      dishPrice: 10,
      dishCategory: '测试',
      dishInventory: 100,
      imageUrl: 'http://example.com/test.png'
    }];
    await wrapper.vm.$nextTick(); // 在更新之后进行下一次检测

    const editButton = wrapper.find('button.edit-btn'); // 找到编辑按钮
    expect(editButton.exists()).toBe(true); // 确保编辑按钮存在
  })

  it('点击编辑菜品按钮进入编辑模式', async () => {
    // 添加菜品以便能够点击编辑按钮
    wrapper.vm.displayedDishes = [{
      dishId: 1,
      dishName: '测试菜品',
      dishPrice: 10,
      dishCategory: '测试',
      dishInventory: 100,
      imageUrl: 'http://example.com/test.png'
    }];
    await wrapper.vm.$nextTick(); // 确保 DOM 更新

    const editButton = wrapper.find('button.edit-btn');
    await editButton.trigger('click'); // 点击按钮

    expect(wrapper.html()).toContain('编辑菜品'); // 确保页面呈现编辑模式
  })

  it('点击取消按钮退出编辑模式', async () => {
    // 添加菜品以便测试编辑
    wrapper.vm.displayedDishes = [{
      dishId: 1,
      dishName: '测试菜品',
      dishPrice: 10,
      dishCategory: '测试',
      dishInventory: 100,
      imageUrl: 'http://example.com/test.png'
    }];
    await wrapper.vm.$nextTick(); // 确保 DOM 更新

    // 进入编辑模式
    const editButton = wrapper.find('button.edit-btn');
    await editButton.trigger('click'); // 点击编辑按钮

    const cancelButton = wrapper.find('button.cancel-btn');
    await cancelButton.trigger('click'); // 点击取消按钮

    expect(wrapper.html()).not.toContain('编辑菜品'); // 确保退出编辑模式
  })
})
