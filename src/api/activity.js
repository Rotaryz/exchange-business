import request from '@utils/http'

export default {
  /**
   * 活动列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getActivityList(args) {
    const url = `/shop/promotion/promotion/index`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 活动数量统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getActivityCount(args) {
    const url = `/shop/promotion/promotion/statistic`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 拼团活动详情
   * @param data
   * @param loading
   * @returns {*}
   */
  collageDetail(args) {
    const url = `/shop/promotion/groupon/show`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 砍价活动详情
   * @param data
   * @param loading
   * @returns {*}
   */
  // bargainDetail(args) { 旧砍价
  //   const url = `/shop/promotion/bargain/show`
  //   return request.get({ url, loading: false, ...args })
  // },
  bargainDetail(args) {
    const url = `/shop/promotion/team-bargain/show`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 活动上下架
   * @param data
   * @param loading
   * @returns {*}
   */
  activityUpDown(args) {
    const url = `/shop/promotion/promotion/set-status`
    return request.post({ url, loading: false, ...args })
  },
  /**
   * 活动删除
   * @param data
   * @param loading
   * @returns {*}
   */
  activityDel(args) {
    const url = `/shop/promotion/promotion/destroy`
    return request.delete({ url, loading: false, ...args })
  },
  /**
   * 编辑拼团活动
   * @param data
   * @param loading
   * @returns {*}
   */
  collageEdit(args) {
    const url = `/shop/promotion/groupon/update`
    return request.put({ url, loading: false, ...args })
  },
  /**
   * 新建拼团活动
   * @param data
   * @param loading
   * @returns {*}
   */
  newCollage(args) {
    const url = `/shop/promotion/groupon/create`
    return request.post({ url, loading: false, ...args })
  },
  /**
   * 编辑砍价活动
   * @param data
   * @param loading
   * @returns {*}
   */
  bargainEdit(args) {
    const url = `/shop/promotion/team-bargain/update`
    return request.put({ url, loading: false, ...args })
  },
  /**
   * 新建砍价活动
   * @param data
   * @param loading
   * @returns {*}
   */
  // newBargain(args) { 旧
  //   const url = `/shop/promotion/bargain/create`
  //   return request.post({ url, loading: false, ...args })
  // }
  newBargain(args) {
    const url = `/shop/promotion/team-bargain/create`
    return request.post({ url, loading: false, ...args })
  }
}
