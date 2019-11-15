import request from '@utils/http'

export default {
  /**
   * 我的资产总览
   * @param data
   * @param loading
   * @returns {*}
   */
  getUserMoney(args) {
    const url = `/shop/settlement/account/overview`
    return request.get({ url, ...args })
  },
  /**
   * 我的资产总览
   * @param data
   * @param loading
   * @returns {*}
   */
  getLevelIndex(args) {
    const url = `/shop/shop/shop-level/index`
    return request.get({ url, ...args })
  },
  /**
   * 我的资产总览
   * @param data
   * @param loading
   * @returns {*}
   */
  shopLevelList(args) {
    const url = `/shop/shop/shop-manager/index`
    return request.get({ url, ...args })
  },
  /**
   * 全职等级升级[PM_1.3]
   * @param data
   * @param loading
   * @returns {*}
   */
  levelShop(args) {
    const url = `/shop/shop/shop-manager/set-level`
    return request.post({ url, ...args })
  }
}
