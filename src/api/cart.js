import request from '@utils/http'

export default {
  // 获取购物车列表
  getList(args) {
    const url = `/shop/shop-cart/cart/index`
    return request.get({ url, ...args })
  },
  // 加入购物车
  addToCart(args) {
    const url = `/shop/shop-cart/cart/create`
    return request.get({ url, ...args })
  },
  // 获取购物车数量
  getCartCount(args) {
    const url = `/shop/shop-cart/cart/total`
    return request.get({ url, ...args })
  },
  // 提交订单中下单
  palceOrder(args) {
    const url = `/shop/platform-order/order/create`
    return request.post({ url, ...args })
  },
  // 删除购物车商品
  deleteGoods(args) {
    const url = `/shop/shop-cart/cart/clear`
    return request.post({ url, ...args })
  },
  // 购物车商品数量改变
  setGoodsNum(args) {
    const url = `/shop/shop-cart/cart/update`
    return request.post({ url, ...args })
  }
}
