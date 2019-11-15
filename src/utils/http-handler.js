import HTTP from '@utils/http'
import { showLoading, hideLoading, showToast } from '@utils/wechat'
import { baseURL, ERR_OK, TIME_OUT } from '@utils/config'
// import Vue from 'Vue'
import $$routes from '@utils/routes'
import storage from '@utils/storage'

const COMMON_HEADER = {
  Authorization: storage('token') || ''
}

HTTP.init(http => {
  http.config.timeout = TIME_OUT
  http.config.headers = COMMON_HEADER
  http.config.baseURL = baseURL.api
})

HTTP.setCallback({
  // 请求前处理
  beforeRequest({ loading = true }) {
    if (loading) {
      showLoading()
    }
  },
  // 请求拦截
  willRequest(request) {
    return request
  },
  // 响应拦截
  willResponse(response) {
    return response
  },
  // 请求完成后的逻辑处理
  responseFulfilled(res, { url, loading = true, toast = true, doctor }) {
    // 可自定义处理loading
    if (typeof loading === 'function') {
      loading(res)
    } else if (loading) {
      hideLoading()
    }
    // 错误处理
    if (res.error_code !== ERR_OK) {
      // 1 code码处理
      errorCodeHandle(res.error_code, url)
      // 2 可自定义处理toast错误
      if (typeof toast === 'function') {
        toast(res)
      } else if (toast) {
        showToast(res.message)
      }
      // 3 错误处理
      console.error(url + ' <<<<<<接口异常>>>>> ' + JSON.stringify(res))
      if (typeof doctor === 'function') {
        doctor(res, url)
      } else {
        throw res
      }
    }
    return res
  }
})

// 错误码处理
function errorCodeHandle(code, url) {
  switch (code) {
    case 10000:
      HTTP.setHeaders({ Authorization: '' })
      wx.removeStorageSync('token')
      url !== '/shop/shop/auth/token-validate' && wx.redirectTo({ url: $$routes.main.LOGIN })
      break
    // 商品不存在
    case 2010101:
      wx.redirectTo({ url: $$routes.main.PAGE_MISSING + '?type=goods' })
      break
    // 商品已下架
    case 2010102:
      wx.redirectTo({ url: $$routes.main.PAGE_MISSING + '?type=goods' })
      break
    // 文章异常
    case 3300101:
      wx.redirectTo({ url: $$routes.main.PAGE_MISSING + '?type=article' })
      break
    // 品牌异常
    case 2010103:
      wx.redirectTo({ url: $$routes.main.PAGE_MISSING + '?type=brand' })
      break
    case 13005:
      break
    default:
      break
  }
}
