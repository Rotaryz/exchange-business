import appJson from '../app.json'
// 不需要自动重置data数据的页
const unResetPage = [
  'login'
]

export default {
  data() {
    return {
      imageUrl: this.$imageUrl,
      $routes: this.$routes
    }
  },
  onLoad() {
    this._saveCurrentPage()
  },
  onUnload() {
    this.timer && clearInterval(this.timer)
    this.timer && clearTimeout(this.timer)
    this._resetData()
    this._clearWatcher()
  },
  methods: {
    _clearWatcher() {
      if (!this.$mp) return
      // 清除mpvue的wathcers
      this._watchers = []
      this._watcher && this._watcher.teardown()
    },
    _resetData() {
      // 重置页面组件的data数据
      if (!this.$mp) return
      // 重置页面的data数据
      let flag = unResetPage.some(value => {
        let reg = new RegExp(value)
        return reg.test(this.$options.__file)
      })
      if (!flag && this.$options.data) {
        Object.assign(this.$data, this.$options.data())
      }
    },
    $checkIsTabPage(path) {
      return appJson.tabBar.list.some(val => path.includes(val.pagePath))
    },
    $getUrl(path = '', query = '') {
      let url = path || (this.$root.$mp.page && this.$root.$mp.page.route)
      let status = this.$checkIsTabPage(url)
      query = query || this.$root.$mp.query
      if (!status) {
        let string = ''
        for (let value in query) {
          string += `&${value}=${query[value]}`
        }
        url = string ? `${url}?${string.slice(1)}` : url
      }
      return url
    },
    _saveCurrentPage() {
      // 重置页面组件的data数据
      if (!this.$mp) return
      let url = this.$getUrl()
      // 记录页面栈
      if (!url || url.includes('pages/lost') || url.includes('pages/error') || url.includes('pages/login')) {
        return
      }
      wx.setStorageSync('errorUrl', url)
    }
  }
}
