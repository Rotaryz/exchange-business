import request from '@utils/http'

export default {
  /**
   * 登录
   * @param data
   * @param loading
   * @returns {*}
   */
  tokenValidate(args) {
    const url = `/shop/shop/auth/token-validate`
    return request.get({ url, ...args })
  },
  // 商家登录【1.4】
  login(args) {
    const url = `/shop/customer/admin/login`
    return request.post({ url, ...args })
  },
  // 商家注册【1.4】
  register(args) {
    const url = `/shop/customer/admin/register`
    return request.post({ url, ...args })
  },
  sendCode(args) {
    const url = `/common/customer/mobile-code/send`
    return request.post({ url, ...args })
  },
  getToken(args) {
    const url = `/shop/shop/auth/post-login`
    return request.post({ url, ...args })
  },
  auth(args) {
    const url = `/shop/shop/auth/shop-wechat-auth`
    return request.post({ url, ...args })
  }
}
