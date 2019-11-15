import API from '@api'
import { globalComputed } from '@state/helpers'
import {isEmptyObject} from '@utils/common'

export default {
  onLoad(options) {
    if (!isEmptyObject(options)) {
      this._options = options || {}
    }
  },
  computed: {
    ...globalComputed
  },
  methods: {
    $storage(key, val) {
      try {
        if (val !== undefined) wx.setStorageSync(key, val)
        else return wx.getStorageSync(key)
      } catch (e) {
        console.error(e)
      }
    },
    // button收集手机formId
    async $getFormId(e) {
      const token = this.$storage('token')
      if (!token) {
        return
      }
      const formId = e.mp.detail.formId
      formId && API.Global.getFormId({ data: { form_ids: [formId] }, loading: false, toast: false })
    }
  }
}
