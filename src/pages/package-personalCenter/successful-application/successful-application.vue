<template>
  <div class="successful-application">
    <navigation-bar title="申请成功"></navigation-bar>
    <div class="content">
      <img src="./pic-payok@2x.png" alt="" class="icon">
      <p class="text">申请已提交</p>
      <p class="tip">客服人员会在24小时内联系你</p>
      <p class="money">{{successName}}({{year}}年) {{money}}元</p>
      <div class="btn" @click="goBack">回到首页</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'SUCCESSFUL_APPLICATION'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        money: '',
        successName: '',
        year: ''
      }
    },
    onLoad(options) {
      console.log(options)
      this.successName = options.name
      this.year = options.year
      this.money = options.money
    },
    methods: {
      goBack() {
        wx.switchTab({
          url: `${this.$routes.main.HOME}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .successful-application
    height: 100vh
    box-sizing: border-box
    background: $color-white

  .content
    padding-top: 10.04vh
    display: flex
    align-items: center
    flex-direction: column

  .icon
    width: 90px
    height: 90px

  .text
    margin-top: 7px
    font-size: $font-size-20
    font-family: $font-family-medium
    color: $color-text-sub

  .tip
    margin-top: 9px
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-secondary

  .money
    margin-top: 22.5px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-sub

  .btn
    margin-top: 35px
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    text-align: center
    line-height: 35px
    border-1px(#D2D2D2, 2px)
    width: 127px
</style>
