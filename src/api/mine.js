import request from '@utils/http'

export default {
  /**
   * 微信授权手机号码
   * @param data
   * @param loading
   * @returns {*}
   */
  getWechatMobile(args) {
    const url = `/shop/shop/customer/get-mobile`
    return request.post({ url, ...args })
  },
  /**
   * 微信授权手机号码
   * @param data
   * @param loading
   * @returns {*}
   */
  messageBind(args) {
    const url = `/common/manager/mobile-code/send`
    return request.post({ url, ...args })
  },
  /**
   * 微信授权手机号码
   * @param data
   * @param loading
   * @returns {*}
   */
  industry(args) {
    const url = `/shop/industry/industry/index`
    return request.get({ url, ...args })
  },
  /**
   * 微信授权手机号码
   * @param data
   * @param loading
   * @returns {*}
   */
  updateShop(args) {
    const url = `/shop/shop/shop-manager/update`
    return request.post({ url, ...args })
  },
  /**
   * 个人信息（商家信息）
   * @param data
   * @param loading
   * @returns {*}
   */
  getUserInfo(args) {
    const url = `/shop/shop/shop-manager/show`
    return request.get({ url, ...args })
  },
  /**
   * 个人信息（商家信息）
   * @param data
   * @param loading
   * @returns {*}
   */
  editInfo(args) {
    const url = `/shop/shop/shop-manager/update`
    return request.post({ url, ...args })
  },
  /**
   * 生成小程序二维码（商家信息）
   * @param data
   * @param loading
   * @returns {*}
   */
  createQrcode(args) {
    const url = `/common/file/qrcode/miniprogram-load`
    return request.get({ url, ...args })
  }
}
