import request from '@utils/http'

export default {
  /**
   * 收集formId
   * @param data
   * @param loading
   * @returns {*}
   */
  getFormId(args) {
    const url = `/shop/shop/customer/collect-formid`
    return request.post({ url, ...args, loading: false, toast: false })
  },
  getPriceTemplate() {
    const data = {
      is_include_rights: 1
    }
    const url = `/shop/shop/shop-level/index`
    return request.post({ url, data, loading: false, toast: false })
  }
}
