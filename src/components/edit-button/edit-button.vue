<template>
  <div>
    <div class="footer-fill" :style="{height: statusBarHeight > 20 ? '20px': 0}"></div>
    <cover-view class="edit-button border-top-1px" :style="{paddingBottom: statusBarHeight > 20 ? '20px' : 0}">
      <cover-view class="button" :style="{opacity: opacity === true && 1 || 0.5}" @click="handleClick">{{btnText}}</cover-view>
    </cover-view>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'EDIT_BUTTON'

  export default {
    name: COMPONENT_NAME,
    props: {
      btnText: {
        type: String,
        default: '保存'
      },
      opacity: {
        type: [Number, Boolean],
        default: false
      }
    },
    data() {
      return {
      }
    },
    methods: {
      handleClick() {
        if (this.isClick) {
          return
        }
        this.isClick = true
        this.$emit('click')
        setTimeout(() => {
          this.isClick = false
        }, 500)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-button
    position: fixed
    bottom: 0
    left: 0
    right: 0
    height: 65px
    background :#fff
    layout(row)
    align-items :center
    justify-content: center
    padding :0 10px
    z-index :50
    .button
      width :100%
      height: 45px
      background: #D83F35
      border-radius: 2px
      font-family: $font-family-regular
      font-size: 16px
      color: #FFFFFF
      letter-spacing: 0.8px
      text-align: center
      line-height :@height
      opacity : 0.5
      transition :opacity 0.2s

</style>
