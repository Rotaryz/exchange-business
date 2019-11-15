<template>
  <div class="switch-item hand" :style="switchStyles" @click="_changeSwitch">
    <span class="circular" :class="{'move': status}" :style="transformStyles"></span>
    <span class="status" :class="status ? 'status-right' : 'status-left'">{{status ? confirmText: cancelText}}</span>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'BASE_SWITCH'

  export default {
    name: COMPONENT_NAME,
    props: {
      status: {
        type: [Number, Boolean],
        default: 1
      },
      width: {
        // 组件宽度
        type: String,
        default: '40px'
      },
      height: {
        // 组件高度
        type: String,
        default: '22px'
      },
      switchColor: {
        // 组件打开背景色
        type: String,
        default: '#D83F35'
      },
      closeColor: {
        // 组件关闭背景色
        type: String,
        default: '#efeef5'
      },
      transform: {
        // 按钮位移距离
        type: String,
        default: '0px'
      },
      confirmText: {
        // 打开按钮默认文字
        type: String,
        default: ''
      },
      cancelText: {
        // 关闭按钮默认文字
        type: String,
        default: ''
      }
    },
    computed: {
      switchStyles() {
        return `background:${this.status ? this.switchColor : this.closeColor};width:${this.width};height:${this.height}`
      },
      transformStyles() {
        return `transform :translate3d(${this.transform}, 0, 0)`
      }
    },
    methods: {
      _changeSwitch() {
        let res = !this.status
        this.$emit('update:status', res)
        this.$emit('changeSwitch', res)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .switch-item
    height: 28px
    width: 69px
    border-radius: @height
    transition: background 1s
    text-align: left
    position: relative
    user-select: none
    .circular
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.10)
      display: inline-block
      height: 20px
      width: @height
      margin: 1px 2px
      border-radius: 50%
      background: $color-white
      transition: transform .3s
    .move
      transform: translateX(16px) !important
    .status
      font-size: 14px
      col-center()
      font-family: $font-family-regular
      color: #fff
    .status-right
      right: 9px
    .status-left
      color: $color-text-assist
      left: 9px
</style>
