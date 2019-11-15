import request from '@utils/http'

export default {
  // 增加地址
  addAddress(args) {
    const url = `/shop/shop/receiver-address/create`
    return request.post({ url, ...args })
  },
  // 删除地址
  deleteAddress(args) {
    const url = `/shop/shop/receiver-address/destroy`
    return request.get({ url, ...args })
  },
  // 地址列表
  getAddressList(args) {
    const url = `/shop/shop/receiver-address/index`
    return request.get({ url, ...args })
  },
  // 编辑地址
  editAddress(args) {
    const url = `/shop/shop/receiver-address/update`
    return request.post({ url, ...args })
  },
  // 设置默认地址
  setDefaultAddress(args) {
    const url = `/shop/shop/receiver-address/set-default`
    return request.post({ url, ...args })
  },
  // 获取地址详情
  getAddressDetail(args) {
    const url = `/shop/shop/receiver-address/show`
    return request.get({ url, ...args })
  },
  // 获取默认地址
  getDefaultAddress(args) {
    const url = `/shop/shop/receiver-address/default-address`
    return request.get({ url, ...args })
  }
}
