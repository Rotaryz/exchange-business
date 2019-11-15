import request from '@utils/http'

export default {
  // ---- 商品分类列表---- pid
  getCategoryList(args) {
    const url = `/shop/platform-goods/category/index`
    return request.get({ url, ...args })
  },
  // ---- 商品列表 ---- keyword category_id limit page
  getGoodsList(args) {
    const url = `/shop/platform-goods/goods/index`
    return request.get({ url, ...args })
  },
  // 商品详情
  getGoodsDetail(args) {
    const url = `/shop/platform-goods/goods/show`
    return request.get({ url, ...args })
  },
  //  获取运费
  getFreight(args) {
    const url = `/shop/logistics/freight/show`
    return request.get({ url, ...args })
  },
  // 获取物流列表
  getLogisticsList(args) {
    const url = `/shop/logistics/template/index`
    return request.get({ url, ...args })
  },
  // 商城管理-商品管理-商品列表
  getManageGoodsList(args) {
    const url = `/shop/shop-goods/goods/index`
    return request.get({ url, ...args })
  },
  // 商城管理-商品管理-商品列表统计
  getManageGoodsStatistic(args) {
    const url = `/shop/shop-goods/goods/statistic`
    return request.get({ url, ...args })
  },
  // 商城管理-商品管理-商品上下架
  getManageSetGoodsStatus(args) {
    const url = `/shop/shop-goods/goods/batch-set-status`
    return request.get({ url, ...args })
  },
  // 商城管理-商品管理-商品详情
  getGoodsInfo(args) {
    const url = `/shop/shop-goods/goods/show`
    return request.post({ url, ...args })
  },
  // 商城管理-商品管理-设置商品采购价格
  setGoodsPrice(args) {
    const url = `/shop/shop-goods/goods/update-integral-price`
    return request.get({ url, ...args })
  }

}
