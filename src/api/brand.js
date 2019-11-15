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
  // 文章详情
  getContentDetail(args) {
    const url = `/shop/article/article/show`
    return request.get({ url, ...args })
  },
  // 品牌详情
  getBrandDetail(args) {
    const url = `/shop/platform-goods/brand/show`
    return request.post({ url, ...args })
  },
  // 点赞列表
  getLikeList(args) {
    const url = `/shop/article/fabulou/index`
    return request.get({ url, ...args })
  },
  // 数据上报接口（埋点接口）
  reportAction(args) {
    const url = `/shop/article/bury-point/operation`
    return request.get({ url, ...args })
  }
}
