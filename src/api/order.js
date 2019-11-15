import request from '@utils/http'

export default {
  /**
   * 订单列表（子订单）
   * @param data
   * @param loading
   * @returns {*}
   */
  subOrder(args) {
    const url = `/shop/platform-order/sub-order/index`
    return request.get({ url, ...args })
  },
  /**
   * 订单列表（主订单）
   * @param data
   * @param loading
   * @returns {*}
   */
  order(args) {
    const url = `/shop/platform-order/order/index`
    return request.get({ url, ...args })
  },
  /**
   * 订单详情（子订单）
   * @param data
   * @param loading
   * @returns {*}
   */
  orderDetail(args) {
    const url = `/shop/platform-order/sub-order/show`
    return request.get({ url, ...args })
  },
  /**
   * 重新支付
   * @param data
   * @param loading
   * @returns {*}
   */
  orderRepay(args) {
    const url = `/shop/platform-order/order/repay`
    return request.get({ url, ...args })
  },
  /**
   * 查询订单物流详情
   * @param data
   * @param loading
   * @returns {*}
   */
  logistics(args) {
    const url = `/shop/platform-order/sub-order/logistics`
    return request.get({ url, ...args })
  },
  /**
   * 确认收货
   * @param data
   * @param loading
   * @returns {*}
   */
  confirmReceipt(args) {
    const url = `/shop/platform-order/sub-order/confirm-receipt`
    return request.get({ url, ...args })
  }
}
