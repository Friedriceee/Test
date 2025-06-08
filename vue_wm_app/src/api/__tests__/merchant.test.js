/// <reference types="vitest" />
import axios from 'axios'
import * as merchantApi from '../merchant'

vi.mock('axios')
vi.mock('../../utils/request.js', () => ({
  __esModule: true,
  default: {}
}))

axios.create = vi.fn(() => axios) // 让 axios.create() 返回 axios 本身

// mock axios.interceptors
axios.interceptors = {
  request: { use: vi.fn() },
  response: { use: vi.fn() }
}

describe('merchant.js API 测试', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // 1. 注册
  test('merchantRegisterService 注册成功', async () => {
    const mockRes = { data: { msg: 'ok', data: 1 } }
    axios.post.mockResolvedValue(mockRes)
    const data = { MerchantName: '商家', Password: '123456' }
    const result = await merchantApi.merchantRegisterService(data)
    expect(result).toEqual(mockRes.data)
    expect(axios.post).toHaveBeenCalled()
  })
  test('merchantRegisterService 注册失败', async () => {
    axios.post.mockRejectedValue(new Error('error'))
    await expect(merchantApi.merchantRegisterService({})).rejects.toThrow('error')
  })

  // 2. 登录
  test('merchantLoginService 登录成功', async () => {
    const mockRes = { data: { msg: 'ok', data: { MerchantId: 1 } } }
    axios.post.mockResolvedValue(mockRes)
    const result = await merchantApi.merchantLoginService({ MerchantId: 1, Password: '123' })
    expect(result).toEqual(mockRes.data)
    expect(axios.post).toHaveBeenCalled()
  })
  test('merchantLoginService 登录失败', async () => {
    axios.post.mockRejectedValue(new Error('error'))
    await expect(merchantApi.merchantLoginService({})).rejects.toThrow('error')
  })

  // 3. 修改商家信息
  test('updateMerchant 修改成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.put.mockResolvedValue(mockRes)
    const result = await merchantApi.updateMerchant({ MerchantId: 1 })
    expect(result).toEqual(mockRes.data)
    expect(axios.put).toHaveBeenCalled()
  })
  test('updateMerchant 修改失败', async () => {
    axios.put.mockRejectedValue(new Error('error'))
    await expect(merchantApi.updateMerchant({})).rejects.toThrow('error')
  })

  // 4. 查询商家信息
  test('merchantInfo 查询成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.merchantInfo(1)
    expect(result).toEqual(mockRes.data)
    expect(axios.get).toHaveBeenCalled()
  })
  test('merchantInfo 查询失败', async () => {
    axios.get.mockRejectedValue(new Error('error'))
    await expect(merchantApi.merchantInfo(1)).rejects.toThrow('error')
  })

  // 5. 钱包充值
  test('walletRecharge 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.put.mockResolvedValue(mockRes)
    const result = await merchantApi.walletRecharge(1, 100)
    expect(result).toEqual(mockRes.data)
    expect(axios.put).toHaveBeenCalled()
  })
  test('walletRecharge 失败', async () => {
    axios.put.mockRejectedValue(new Error('error'))
    await expect(merchantApi.walletRecharge(1, 100)).rejects.toThrow('error')
  })

  // 6. 钱包提现
  test('walletWithdraw 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.put.mockResolvedValue(mockRes)
    const result = await merchantApi.walletWithdraw(1, 50)
    expect(result).toEqual(mockRes.data)
    expect(axios.put).toHaveBeenCalled()
  })
  test('walletWithdraw 失败', async () => {
    axios.put.mockRejectedValue(new Error('error'))
    await expect(merchantApi.walletWithdraw(1, 50)).rejects.toThrow('error')
  })

  // 7. 查询菜品
  test('searchDishes 查询成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.searchDishes(1)
    expect(result).toEqual(mockRes.data)
    expect(axios.get).toHaveBeenCalled()
  })
  test('searchDishes 查询失败', async () => {
    axios.get.mockRejectedValue(new Error('error'))
    await expect(merchantApi.searchDishes(1)).rejects.toThrow('error')
  })

  // 8. 获取所有站点信息
  test('getAllStationInfos 成功', async () => {
    // 这里需要 mock 两次 axios.get
    axios.get
      .mockResolvedValueOnce({ data: { data: [{ stationId: 1, stationAddress: '地址' }] } }) // GetStations
      .mockResolvedValueOnce({ data: { geocodes: [{ location: '120.1,30.1' }] } }) // amap
    const result = await merchantApi.getAllStationInfos()
    expect(Array.isArray(result)).toBe(true)
    expect(axios.get).toHaveBeenCalled()
  })

 

  // 10. 编辑商家站点
  test('EditMerchantStation 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.put.mockResolvedValue(mockRes)
    const result = await merchantApi.EditMerchantStation({ MerchantId: 1, StationId: 1 })
    expect(result).toEqual(mockRes.data)
    expect(axios.put).toHaveBeenCalled()
  })

  // 11. 创建满减活动
  test('CreateSpecialOffer 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.post.mockResolvedValue(mockRes)
    const result = await merchantApi.CreateSpecialOffer({ MerchantId: 1, MinPrice: 100, AmountRemission: 10 })
    expect(result).toEqual(mockRes.data)
    expect(axios.post).toHaveBeenCalled()
  })

  // 12. 编辑满减活动
  test('EditSpecialOffer 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.put.mockResolvedValue(mockRes)
    const result = await merchantApi.EditSpecialOffer({ OfferId: 1, MinPrice: 100, AmountRemission: 10 })
    expect(result).toEqual(mockRes.data)
    expect(axios.put).toHaveBeenCalled()
  })

  // 13. 删除满减活动
  test('DeleteSpecialOffer 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.delete.mockResolvedValue(mockRes)
    const result = await merchantApi.DeleteSpecialOffer(1)
    expect(result).toEqual(mockRes.data)
    expect(axios.delete).toHaveBeenCalled()
  })

  // 14. 获取满减活动
  test('GetSpecialOffer 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.GetSpecialOffer(1)
    expect(result).toEqual(mockRes.data)
    expect(axios.get).toHaveBeenCalled()
  })

  // 15. 获取订单
  test('getOrdersToHandle 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.getOrdersToHandle(1)
    expect(result).toEqual(mockRes.data)
    expect(axios.get).toHaveBeenCalled()
  })

  // 16. 删除已支付订单
  test('deletePaidOrder 成功', async () => {
    const mockRes = { data: { msg: 'ok' } }
    axios.delete.mockResolvedValue(mockRes)
    const result = await merchantApi.deletePaidOrder(1)
    expect(result).toEqual(mockRes.data)
    expect(axios.delete).toHaveBeenCalled()
  })

  // 17. 订单送达
  // test('deliverOrder 成功', async () => {
  //   const mockRes = { data: { msg: 'ok' } }
  //   axios.put.mockResolvedValue(mockRes)
  //   const result = await merchantApi.deliverOrder({ orderId: 1 })
  //   expect(result).toEqual(mockRes.data)
  //   expect(axios.put).toHaveBeenCalled()
  //   console.log(result)
  // })

  // 18. 获取本月订单
  test('getMerOrdersWithinThisMonth 成功', async () => {
    const mockRes = { data: { data: [1, 2, 3] } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.getMerOrdersWithinThisMonth(1)
    expect(result).toEqual([1, 2, 3])
    expect(axios.get).toHaveBeenCalled()
  })

  // 19. 获取本日订单
  test('getMerOrdersWithinThisDay 成功', async () => {
    const mockRes = { data: { data: [1, 2] } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.getMerOrdersWithinThisDay(1)
    expect(result).toEqual([1, 2])
    expect(axios.get).toHaveBeenCalled()
  })

  // 20. 获取订单盈利
  test('getMerPrice 成功', async () => {
    const mockRes = { data: { data: 100 } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.getMerPrice(1)
    expect(result).toBe(100)
    expect(axios.get).toHaveBeenCalled()
  })

  // 21. 获取商家评分
  test('getMerAvgRating 成功', async () => {
    const mockRes = { data: { data: 4.5 } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.getMerAvgRating(1)
    expect(result).toBe(4.5)
    expect(axios.get).toHaveBeenCalled()
  })

  // 22. 获取已完成订单
  test('getFinishedMerOrders 成功', async () => {
    const mockRes = { data: { data: [1, 2, 3] } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.getFinishedMerOrders(1)
    expect(result).toEqual([1, 2, 3])
    expect(axios.get).toHaveBeenCalled()
  })

  // 23. 获取订单评分
  test('getMerRating 成功', async () => {
    const mockRes = { data: { data: 5 } }
    axios.get.mockResolvedValue(mockRes)
    const result = await merchantApi.getMerRating(1)
    expect(result).toBe(5)
    expect(axios.get).toHaveBeenCalled()
  })

  // 24. 获取订单盈利失败
  test('getMerPrice 失败', async () => {
    axios.get.mockRejectedValue(new Error('error'))
    await expect(merchantApi.getMerPrice(1)).rejects.toThrow('error')
  })
})