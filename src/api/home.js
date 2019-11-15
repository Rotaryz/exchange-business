import request from '@utils/http'

export default {
  /**
   * 页面详情
   * @param data
   * @param loading
   * @returns {*}
   */
  pageDetail(args) {
    const url = `/shop/content/module/page`
    return request.get({ url, ...args })
  },
  /**
   * 推荐商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsList(args) {
    const url = `/shop/platform-goods/group/recommend`
    return request.get({ url, ...args })
  },
  /**
   * 普通商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  platformGoods(args) {
    const url = `/shop/platform-goods/goods/index`
    return request.get({ url, ...args })
  }
}
