<template>
  <div class="goods-item" @click="navHandle(item)">
    <image v-if="item.goods_cover_image" :src="item.goods_cover_image" alt="" class="left" mode="aspectFill">
      <div v-if="!(item.saleable && item.status)" class="goods-none">
        <img src="./pic-out_stock@2x.png" class="goods-none-img">
      </div>
    </image>
    <div class="middle">
      <p class="title">{{item.name}}</p>
      <p class="sub-title">{{item.describe}}</p>
      <div class="price-wrapper">
        <p class="trade-price">¥{{item.sale_price}}</p>
        <p v-if="item.sale_price !== item.price" class="origin-price">¥{{item.price}}</p>
      </div>
    </div>
    <img src="./icon-right_goods@2x.png" alt="" class="right">
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'GOODS_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      item: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      navHandle(item) {
        wx.navigateTo({ url: this.$routes.main.GOODS_DETAIL + '?id=' + item.id })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-item
    height: 95px
    box-shadow: 0 4px 6px 0 rgba(17, 17, 17, 0.02)
    border-radius: 2px
    border-1px(#EFEFEF, 2px)
    layout(row, block, nowrap)
    align-items: center
    background: $color-background
    .left
      width: 95px
      height: 95px
      display block
      border-radius: 2px 0 0 2px
      position: relative
      .goods-none
        background: rgba(255, 255, 255, 0.6)
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        .goods-none-img
          width: 59px
          height: 59px
    .middle
      padding: 0 15px 0 12px
      flex: 1
      overflow: hidden
      font-family: $font-family-regular
      line-height: 1
      font-size: 14px
      height: 100%
      .title
        width: 100%
        no-wrap()
        padding-top: 10px
        font-family: $font-family-medium
        color: #3F454B
      .sub-title
        width: 100%
        no-wrap()
        padding-top: 7px
        color: #B3B7BB
        box-sizing: border-box
        height: 21px
      .price-wrapper
        layout(row, block, nowrap)
        align-items: flex-end
        padding-top: 22px
        .trade-price
          font-family: $font-family-medium
          font-size: 16px
          color: #D83F35
        .origin-price
          margin-left: 5px
          font-size: 12px
          color: #B7B7B7
          text-decoration: line-through
    .right
      margin: 15px
      width: 24px
      height: @width
</style>
