import request from '@utils/http'

export default {
  /**
   * 获取行为记录
   * @param data
   * @param loading
   * @returns {*}
   */
  actionLog(args) {
    const url = `/shop/radar/radar/action-logs`
    return request.post({ url, ...args })
  }, /**
   * 获取行为记录
   * @param data
   * @param loading
   * @returns {*}
   */
  getCustomerCount(args) {
    const url = `/shop/radar/radar/customer-count`
    return request.post({ url, ...args })
  }
}
