<template>
  <div class="pay-success">
    <navigation-bar title="支付成功"></navigation-bar>
    <div class="page-container">
      <img class="pay-success-icon" src="./pic-payok@2x.png" alt="">
      <div class="title">支付成功</div>
      <div class="tip">我们将尽快为您发货</div>
      <div class="button-group">
        <button class="button-item" @click="goToOrderList">查看订单</button>
        <button class="button-item" @click="goToHome">回到首页</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'PAY_SUCCESS'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {}
    },
    methods: {
      goToOrderList() {
        wx.navigateTo({ url: this.$routes.personalCenter.ORDER_LIST + '?status=10' })
      },
      goToHome() {
        wx.switchTab({ url: this.$routes.main.HOME })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .pay-success
    height: 100vh
    display: flex
    flex-direction: column

    .page-container
      flex: 1
      background-color: $color-white
      display: flex
      flex-direction: column
      align-items: center

    .pay-success-icon
      width: 90px
      height: 90px
      margin-top: 76px

    .title
      margin-top: 7px
      color: $color-text-sub
      font-family: $font-family-medium
      font-size: $font-size-20
      margin-bottom: 15px

    .tip
      color: $color-text-secondary
      font-size: $font-size-16
      letter-spacing: 0.6px

    .button-group
      margin-top: 60px
      display: flex

      .button-item
        height: 35px
        line-height: 35px
        width: 127px
        text-align: center
        border-1px(#D2D2D2)
        border-radius: 2px
        margin-right: 20px

        &:last-child
          margin-right: 0
</style>
