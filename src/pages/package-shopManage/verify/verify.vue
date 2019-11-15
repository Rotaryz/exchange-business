<template>
  <div class="verify">
    <navigation-bar arrowColor="white" headStyle="background: #27273e" titleColor="#ffffff" title="验证核销"></navigation-bar>
    <div :style="{height: conHeight+'px'}" class="content">
      <div class="input-con">
        <div class="input-box">
          <input v-model="code" type="text" placeholder-style="color: #BCC4CC; font-size:16px;font-family: PingFangSC-Regular;" maxlength="11" placeholder="请输入订单兑换码" class="verify-input">
          <img v-if="code" src="./icon-delss@2x.png" class="icon-clear" @click="code=''">
        </div>
        <img src="./icon-scan@2x.png" class="icon-scan" @click="_scanQRCode">
      </div>
      <div class="verify-btn">
        <span :class="[code?'active':'']" class="btn-text" @click="_verifyOrder">确认兑换</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'VERIFY'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        code: '',
        conHeight: 64
      }
    },
    onLoad(option) {
      let res = wx.getSystemInfoSync()
      const statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.conHeight = res.screenHeight - statusBarHeight
    },
    methods: {
      _verifyOrder() {
        if (!this.code) return
        API.Shop.verifyOrder({ data: { code: this.code } })
          .then((res) => {
            this.code = ''
            this.$wechat.showToast('核销成功！')
          })
          .catch(() => {
            this.$wechat.showToast('核销失败！')
          })
      },
      _scanQRCode() {
        const self = this
        wx.scanCode({
          success(res) {
            const codeRes = JSON.parse(res.result)
            if (codeRes && codeRes.code) {
              self.code = codeRes.code
              self._verifyOrder()
            } else {
              this.$wechat.showToast('获取核销码失败！')
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .verify
    width: 100%

  .content
    position: fixed
    bottom: 0
    left: 0
    right: 0
    z-index: 999
    width: 100vw
    height: px-change-vh(603)
    background: rgba(39, 39, 62, 0.7)
    layout()
    align-items: center
    justify-content: center

    .input-con
      width: 100%
      margin-top: px-change-vh(-140)
      layout(row)
      align-items: center
      justify-content: center

      .input-box
        position: relative
        box-sizing: border-box
        width: px-change-vw(250)
        height: 40px
        padding: 5px 15px
        background: $color-white
        border-radius: 2px

        .verify-input
          height: 30px
          font-size: 30px
          font-family: DINAlternate-Bold
          letter-spacing: 1px

        .icon-clear
          position: absolute
          top: 12px
          right: 10px
          width: 16px
          height: @width
          z-index: 9

      .icon-scan
        width: 25px
        height: @width
        margin-left: 10px

    .verify-btn
      margin-top: px-change-vw(35)
      width: px-change-vw(130)
      height: 40px
      line-height: 40px
      font-size: 16px
      font-family: $font-family-regular
      text-align: center
      color: $color-white
      border-radius: 20px
      background: #27273e

      .btn-text
        trasition: opacity 0.25s
        opacity: 0.3

        &.active
          opacity: 1
</style>
