<script>
  // import AppPromise from '@utils/app-promise'
  import storage from '@utils/storage'
  import { cartMethods, globalMethods } from '@state/helpers'
  import wx from 'wx'

  export default {
    created() {
      // 调用API从本地缓存中获取数据
      /*
       * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
       * 微信：mpvue === wx, mpvuePlatform === 'wx'
       * 头条：mpvue === tt, mpvuePlatform === 'tt'
       * 百度：mpvue === swan, mpvuePlatform === 'swan'
       * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
       */
    },
    onLaunch() {
      this.initPageConfig()
      if (!storage('token')) {
        wx.reLaunch({ url: this.$routes.main.LOGIN })
        return false
      }
      // this._getCartCount()
    },
    onShow() {
      this.getPriceTemplate()
      if (!storage('token')) {
        wx.reLaunch({ url: this.$routes.main.LOGIN })
      }
      // AppPromise.getInstance(resolve => {     // eslint-disable-line
      //   console.log('app on show 延迟1s!!!')
      //   setTimeout(() => {
      //     resolve(true)
      //   }, 0)
      // })
    },
    methods: {
      ...cartMethods,
      ...globalMethods,
      initPageConfig() {
        const res = wx.getSystemInfoSync()
        const $vw = res.screenWidth / 375
        const $systemInfo = res
        const statusBarHeight = res.statusBarHeight || 20
        this['SET_NAVIGATION_CONFIG']({ statusBarHeight })
        this['SET_VW']($vw)
        this['SET_SYSTEM_INFO']($systemInfo)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  page
    background: $color-background
</style>
