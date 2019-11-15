import request from '@utils/http'

export default {
  // 分享赚钱商品列表[v1.5.2]
  shareActiveList(args) {
    const url = `/shop/promotion/share/index`
    return request.get({url, ...args})
  },
  // 商品列表[v1.5.2]
  serviceGoods(args) {
    const url = `/shop/service-goods/goods/index`
    return request.get({url, ...args})
  },
  // 添加分享赚钱商品[v1.5.2]
  createServiceGoods(args) {
    const url = `/shop/promotion/share/create`
    return request.post({url, ...args})
  },
  // 添加分享赚钱商品[v1.5.2]
  serviceGoodsDetail(args) {
    const url = `/shop/promotion/share/show`
    return request.get({url, ...args})
  },
  // 编辑分享赚钱商品[v1.5.2]
  updateShareGoods(args) {
    const url = `/shop/promotion/share/update`
    return request.post({url, ...args})
  },
  // 删除分享赚钱商品[v1.5.2]
  destroyShareGoods(args) {
    const url = `/shop/promotion/share/destroy`
    return request.delete({url, ...args})
  }
}
