<template>
  <div class="popup " :class="showPopup ? 'fade-modal-enter-active' : 'hide-popup'" @click="close">
    <div v-if="popUpType === 'confirm'" class="popup-content">
      <div class="popup-title">{{text}}</div>
      <div class="popup-tip">{{tip}}</div>
      <div class="popup-btn">
        <form report-submit="true" @submit="$getFormId" class="form-item">
          <button formType="submit" class="btn-item btn-cancel" @click="hidePopup">{{cancelText}}</button>
        </form>
        <div class="line"></div>
        <form report-submit="true" @submit="$getFormId" class="form-item">
          <button formType="submit" class="btn-item btn-confirm" :style="confirmStyle" @click="confirm">{{confirmText}}</button>
        </form>
      </div>
    </div>
    <div v-if="popUpType === 'copy'" class="popup-content">
      <div class="popup-title">{{text}}</div>
      <div class="share-num">{{shareNum}}</div>
      <div class="popup-btn">
        <div class="copy-btn" @click="copyShareNum">复制</div>
      </div>
    </div>

  </div>
</template>

<script>
  import AnimationModal from '@mixins/animation-modal'

  const PAGE_NAME = 'popup'

  export default {
    mixins: [AnimationModal],
    name: PAGE_NAME,
    props: {
      tip: {
        type: String,
        default: '升级为代理商，查看更多权益！'
      },
      text: {
        type: String,
        default: ''
      },
      // 取消按钮的文案
      cancelText: {
        type: String,
        default: '取消'
      },
      // 确定按钮的文案
      confirmText: {
        type: String,
        default: '确定'
      },
      // 是否展示弹窗，可使用.sync
      showPopup: {
        type: Boolean,
        default: false
      },
      // 确定按钮的样式配置
      confirmStyle: {
        type: String,
        default: ''
      },
      // 弹窗类型
      popUpType: {
        type: String,
        default: 'confirm' // confirm (确定取消类型); copy复制类型
      },
      shareNum: {
        type: [String, Number],
        default: ''
      },
      // 点击阴影是否可以关闭弹窗
      isSituationClose: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false
      }
    },
    onUnload() {
      this.isShow = false
    },
    methods: {
      // 点击阴影是否可以关闭弹窗
      close() {
        if (!this.isSituationClose) return
        this.$emit('update:showPopup', false)
        this.$emit('hidePopup')
      },
      // 取消
      hidePopup() {
        this.$emit('update:showPopup', false)
        this.$emit('hidePopup')
      },
      // 确定
      confirm() {
        this.$emit('update:showPopup', false)
        this.$emit('confirm')
      },
      copyShareNum() {
        wx.setClipboardData({
          data: this.shareNum,
          success: () => {
            this.$emit('update:showPopup', false)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/modal.styl"

  .popup
    padding-top: 32.5vh
    box-sizing: border-box
    background: rgba(39, 39, 62, .7)
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0

  .popup-content
    position: relative
    height: 150px
    width: 280px
    margin: 0 auto
    border-radius: 2px
    text-align: center
    background: $color-white

  .popup-title
    color: $color-text-sub
    font-size: $font-size-16
    font-family: $font-family-medium
    padding: 20px 0 0

  .popup-tip
    margin-top: 25px
    font-family: $font-family-medium
    color: $color-text-main
    font-size: $font-size-15

  .popup-btn
    width: 100%
    height: 40px
    display: flex
    border-top-1px($color-line)
    position: absolute
    bottom: 0
    left: 0
    .form-item
      flex:1
    .line
      width:1px
      background-color: $color-line
      flex-shrink 0
      transform scaleX(0.5)
    .btn-item
      font-size: $font-size-14
      font-family: $font-family-regular
      text-align: center
      line-height: 40px
      height: 40px
      display: block
    .btn-cancel
      color: $color-text-sub
    .btn-confirm
      color: $color-main

  .hide-popup
    opacity: 0
    z-index: -1
    transition: all 0.2s

  .share-num
    letter-spacing: 13.44px
    margin-top: 20px
    color: $color-text-main
    font-family: DINAlternate-Bold
    font-size: 28px

  .copy-btn
    color: $color-main
    font-size: $font-size-14
    font-family: $font-family-regular
    line-height: 40px
    text-align: center
    flex: 1
    border-top-1px($color-line)
</style>
