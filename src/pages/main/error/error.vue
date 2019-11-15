<template>
  <div class="error lost">
    <navigation-bar title="兑换商城" :showArrow="false"></navigation-bar>
    <div class="img-box">
      <img src="./pic-uploaddown@2x.png" class="error-img">
      <p class="text">数据加载失败，点击重新加载</p>
    </div>
    <div class="btn" @click="_refresh">立即刷新</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import app from '@src/app.json'

  const PAGE_NAME = 'ERROR'
  const TAB_BAR = app.tabBar.list
  export default {
    name: PAGE_NAME,
    data() {
      return {
        isTab: false,
        targetPage: ''
      }
    },
    onLoad() {
      this.targetPage = wx.getStorageSync('errorUrl')
      this.isTab = TAB_BAR.findIndex((item) => this.targetPage.includes(item.pagePath))
    },
    methods: {
      _refresh() {
        if (!getApp().globalData.isConnected) {
          this.$wechat.showToast('请检查您的网络')
          return
        }
        if (this.isTab === -1) {
          wx.redirectTo({ url: '/' + this.targetPage })
          return
        }
        wx.switchTab({ url: '/' + this.targetPage })
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .error
    height: 100vh
    background: $color-white
    padding-top: 19.5vh
    box-sizing: border-box

  .img-box
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    .error-img
      display: block
      height: 100px
      width: 100px
    .text
      text-align: center
      font-size: $font-size-14
      color: $color-text-assist
      font-family: $font-family-regular
      margin-top: 20px

  .btn
    border-1px(#BCC4CC, 2px)
    width: 96px
    height: 30px
    line-height: 30px
    text-align: center
    border-radius: 2px
    color: $color-text-main
    font-size: $font-size-14
    margin: 20px auto
</style>
