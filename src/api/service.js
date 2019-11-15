import request from '@utils/http'

export default {
  /**
   * 服务商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getServiceList(args) {
    const url = `/shop/service-goods/goods/index`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 服务商品数量统计
   * @param data
   * @param loading
   * @returns {*}
   */
  getServiceCount(args) {
    const url = `/shop/service-goods/goods/statistic`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 服务商品详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getServiceDetail(args) {
    const url = `/shop/service-goods/goods/show`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 服务商品上下架
   * @param data
   * @param loading
   * @returns {*}
   */
  serviceUpDown(args) {
    const url = `/shop/service-goods/goods/set-status`
    return request.put({ url, loading: false, ...args })
  },
  /**
   * 服务商品删除
   * @param data
   * @param loading
   * @returns {*}
   */
  serviceDel(args) {
    const url = `/shop/service-goods/goods/destroy`
    return request.delete({ url, loading: false, ...args })
  },
  /**
   * 编辑服务
   * @param data
   * @param loading
   * @returns {*}
   */
  serviceEdit(args) {
    const url = `/shop/service-goods/goods/update`
    return request.put({ url, loading: false, ...args })
  },
  /**
   * 新建服务
   * @param data
   * @param loading
   * @returns {*}
   */
  newService(args) {
    const url = `/shop/service-goods/goods/create`
    return request.post({ url, loading: false, ...args })
  },
  /**
   * 订单列表[v1.5.2]
   * @param data
   * @param loading
   * @returns {*}
   */
  serviceList(args) {
    const url = `/shop/service-order/order/index`
    return request.get({ url, loading: false, ...args })
  },
  /**
   * 订单详情[v1.5.2]
   * @param data
   * @param loading
   * @returns {*}
   */
  serviceDetail(args) {
    const url = `/shop/service-order/order/show`
    return request.get({ url, loading: false, ...args })
  }
}
