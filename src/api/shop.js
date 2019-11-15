import request from '@utils/http'

export default {
  /**
   * 购买充值
   * @param data
   * @param loading
   * @returns {*}
   */
  recharge(args) {
    const url = `/shop/shop/integral-bean-log/provide`
    return request.post({url, ...args})
  },
  /**
   * 兑换订单
   * @param data
   * @param loading
   * @returns {*}
   */
  exchangeOrder(args) {
    const url = `/shop/integral-order/order/index`
    return request.get({url, ...args})
  },
  /**
   * 兑换订单
   * @param data
   * @param loading
   * @returns {*}
   */
  verifyOrder(args) {
    const url = `/shop/integral-order/order/verify`
    return request.get({url, ...args})
  },
  /**
   * 会员管理-用户统计
   * @param data
   * @param loading
   * @returns {*}
   */
  shopProfile(args) {
    const url = `/shop/shop/shop-manager/shop-profile`
    return request.get({url, ...args})
  },
  /**
   * 会员管理-商家消费记录
   * @param data
   * @param loading
   * @returns {*}
   */
  consumeRecord(args) {
    const url = `/shop/shop/integral-bean-log/index`
    return request.get({url, ...args})
  },
  /**
   * 会员管理-会员列表
   * @param data
   * @param loading
   * @returns {*}
   */
  memberRecord(args) {
    const url = `/shop/customer/authorize-shop/index`
    return request.get({url, ...args})
  },
  /**
   * 店铺信息
   * @param data
   * @param loading
   * @returns {*}
   */
  getShopInfo(args) {
    const url = `/shop/shop/shop-manager/show`
    return request.get({url, ...args})
  },
  /**
   * 店铺设置
   * @param data
   * @param loading
   * @returns {*}
   */
  updateShopInfo(args) {
    const url = `/shop/shop/shop-manager/update`
    return request.post({url, ...args})
  }
}
