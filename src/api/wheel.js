import request from '@utils/http'

export default {
  // 查看活动
  getDetail(args) {
    const url = `/shop/marketing/rotary-disk/show`
    return request.get({url, ...args})
  },
  // 编辑活动
  update(args) {
    const url = `/shop/marketing/rotary-disk/update`
    return request.put({url, ...args})
  },
  // 编辑活动
  getServeList(page = 1, arr = [], loading, toast) {
    const data = {page, status: 1, is_available: 1, except_ids: arr}
    const url = `/shop/service-goods/goods/index`
    return request.get({url, data, loading, toast})
  }
}
