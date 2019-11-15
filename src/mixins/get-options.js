import {isEmptyObject} from '@utils/common'

export default {
  onLoad(options) {
    if (!isEmptyObject(options)) {
      this._options = options || {}
    }
  },
  methods: {
    // 初始化页面参数
    _$$initOptions() {
      let options = {}
      if (!isEmptyObject(this._options)) {
        options = this._options
      } else if (!isEmptyObject(this.$mp.query)) {
        options = this.$mp.query
      } else if (!isEmptyObject(this.$mp.appOptions.query)) {
        options = this.$mp.appOptions.query
      }
      return options
    }
  }
}
