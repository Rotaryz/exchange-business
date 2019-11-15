<template>
  <div class="goods-item" @click="jumpGoodsDetail(item)">
    <div class="goods-item-wrap">
      <div class="img-wrap">
        <img :src="item.goods_cover_image" mode="aspectFill" class="goods-img">
      </div>
      <div class="info-wrap">
        <div class="title">{{item.name}}</div>
        <div class="price-wrap">
          <div class="price-level-wrap">
            <div v-if="(item.shop_level_id || 0)<2" class="price-item">
              <div class="price-icon bz-icon">{{$discountStandard}}折</div>
              <div class="price-num">¥{{item.standard_price}}</div>
            </div>
            <div class="price-item">
              <div class="price-icon qn-icon">{{$discountVersatile}}折</div>
              <div class="price-num">¥{{item.versatile_price }}</div>
            </div>
            <div v-if="item.shop_level_id>=2" class="price-item">
              <div class="price-icon hh-icon">{{$discountPartner}}折</div>
              <div class="price-num">¥{{item.partner_price}}</div>
            </div>
          </div>
          <div class="common-price">¥{{item.price}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import API from '@api'

  const COMPONENT_NAME = 'HOME_CLASSIFY_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      item: {
        type: Object,
        default: () => {
        }
      }
    },
    methods: {
      jumpGoodsDetail(item) {
        wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${item.id}` })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/goodsList.styl"

  .home-classify-item
    padding: 0 0 0 10px
    overflow: hidden
    box-sizing: border-box
    .home-classify-small
      padding: 15px 0 0
      display: flex
      .goods-img
        width: 100px
        border-radius: 2px
        background: $image-color
        height: @width
        min-width: @width
        min-height: @width
      .goods-msg
        box-sizing: border-box
        width: 0
        padding-right: 10px
        height: 117px
        border-bottom-1px($color-line)
        margin-left: 10px
        flex: 1

  .goods-name
    line-height: 20px
    height: 40px
    margin-bottom: 23px
    font-size: $font-size-14
    color: $color-text-main
    font-family: $font-family-medium
    no-wrap()
    width: 100%
    word-break: break-all

  .goods-tariff
    display: flex
    align-items: flex-end
    line-height: 1
    .goods-price
      font-size: $font-size-20
      color: $color-text-main
      font-family: $font-family-bold
      .goods-unit
        font-size: $font-size-12
    .goods-member
      transform: translateY(-1px)
      margin-left: 1.4px
      height: 12px
      width: 33.5px

  .original-price
    text-decoration: line-through
    color: rgba(96, 105, 114, .6)
    font-size: $font-size-11
    margin-top: 4px

  .cart-icon
    extend-click(-10px)
    width: 25px
    height: 25px
    position: absolute
    right: 20px
    bottom: 20px
</style>
