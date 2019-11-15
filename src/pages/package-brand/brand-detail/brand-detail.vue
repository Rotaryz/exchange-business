<template>
  <div class="brand-detail">
    <navigation-bar
      ref="navigationBar"
      :title="brand.name"
    ></navigation-bar>
    <img mode="aspectFill" class="brand-img" v-if="brand.banner_image_url" :src="brand.banner_image_url">
    <div class="brand-shop">
      <div class="brand-top">
        <div class="brand-header-box">
          <img v-if="brand.logo_image_url" :src="brand.logo_image_url" class="brand-header" mode="aspectFill">
        </div>
        <div class="brand-msg">
          <div class="brand-name">{{brand.name}}</div>
          <div class="brand-sub-name">{{brand.sub_name}}</div>
        </div>
      </div>
      <div class="brand-information" :class="{'no-more': !showMore}">{{brand.describe}}</div>
      <!--文字超过两行-->
      <!--类名  show-more-active-->
      <div class="show-more" @click="showMore = !showMore">
        <div class="show-box">
          <div class="show-name">更多品牌信息</div>
          <img src="./icon-arrow_open@2x.png" class="show-img" :class="{active: showMore}">
        </div>
      </div>
    </div>
    <div class="goods">
      <ul v-if="list.length" class="goods-ul">
        <li v-for="item in list" :key="item.id" class="goods-item" @click="navHandle(item)">
          <div class="goods-item-wrap">
            <div class="img-wrap">
              {{item.id}}
              <image :src="item.goods_cover_image" mode="aspectFill" class="goods-img">
                <div v-if="!(item.saleable && item.status)" class="goods-none">
                  <img src="./pic-out_stock@2x.png" class="goods-none-img">
                </div>
              </image>
            </div>
            <div class="info-wrap">
              <div class="title">{{item.name}}</div>
              <div class="price-wrap">
                <div class="price-level-wrap">
                  <div v-if="(item.shop_level_id) < 2" class="price-item">
                    <div class="price-icon bz-icon">{{$discountStandard}}折</div>
                    <div class="price-num">¥{{item.standard_price}}</div>
                  </div>
                  <div class="price-item">
                    <div class="price-icon qn-icon">{{$discountVersatile}}折</div>
                    <div class="price-num">¥{{item.versatile_price }}</div>
                  </div>
                  <div v-if="item.shop_level_id >= 2" class="price-item">
                    <div class="price-icon hh-icon">{{$discountPartner}}折</div>
                    <div class="price-num">¥{{item.partner_price}}</div>
                  </div>
                </div>
                <div class="common-price">¥{{item.price}}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <loading-more v-if="isShowLoading"></loading-more>
    <is-end v-if="isShowEnd"></is-end>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import LoadingMore from '@components/loading-more/loading-more'
  import IsEnd from '@components/is-end/is-end'

  const PAGE_NAME = 'BRAND_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      LoadingMore,
      IsEnd
    },
    data() {
      return {
        id: '',
        list: [],
        totalPage: 1,
        page: 1,
        brand: {},
        showMore: false,
        isShowLoading: false,
        isShowEnd: false
      }
    },
    onLoad(option) {
      // 30个字每行
      this.id = option.id || ''
      this._getGoodsList(true)
      this._getDetail()
    },
    onReachBottom() {
      if (this.page >= this.totalPage) {
        this.isShowEnd = !!this.list.length
        return
      }
      this.isShowLoading = true
      this.page++
      this._getGoodsList()
    },
    methods: {
      // 获取商品列表
      _getGoodsList(loading = false) {
        const data = { brand_id: this.id, page: this.page }
        API.Goods.getGoodsList({ data, loading }).then(res => {
          if (this.page === 1) this.list = []
          this.list = [...this.list, ...res.data]
          this.totalPage = res.meta.last_page
          this.isShowEnd = this.list.length < 10 && this.list.length
          this.isShowLoading = false
        })
      },
      _getDetail() {
        const data = {
          id: this.id
        }
        API.Brand.getBrandDetail({ data }).then((res) => {
          this.brand = res.data
        })
      },
      navHandle(item) {
        wx.navigateTo({ url: this.$routes.main.GOODS_DETAIL + '?id=' + item.id })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/goodslist.styl"

  .brand-detail
    min-height: 100vh
    box-sizing: border-box
    padding-bottom: 15px
    background: $color-background

  .brand-img
    background: $image-color
    width: 100vw
    display: block
    height: 37.33vw

  .brand-shop
    margin-top: -5px
    border-radius: 3px 3px 0 0
    background: $color-white
    padding: 0 15px 15px
    box-sizing: border-box

  .brand-top
    display: flex
    .brand-header-box
      margin-top: -10px
      border-1px(#EFEEF5, 2px)
      border-radius: 2px
      box-shadow: 0 5px 13px 0 rgba(0, 0, 0, 0.10)
      width: 60px
      height: 60px
      display: flex
      align-items: center
      justify-content: center

      .brand-header
        display: block
        height: 100%
        width: @height
        border-radius: 2px
    .brand-msg
      margin-left: 10px
      flex: 1
      width: 0
      .brand-name
        line-height: 1.2
        no-wrap()
        font-family: $font-family-medium
        color: $color-text-sub
        font-size: $font-size-16
        margin-top: 6.9px
      .brand-sub-name
        no-wrap()
        font-size: $font-size-12
        color: $color-text-secondary
        font-family: $font-family-regular
        line-height: 1.2
        margin-top: 3px

  .brand-information
    margin-top: 15px
    font-family: $font-family-regular
    color: $color-sub
    line-height: 20px
    font-size: $font-size-14
    box-sizing border-box
    transition: all 0.2s
    &.no-more
      no-wrap-plus()

  .show-more
    margin-top: 10px
    display: flex
    align-items: center
    justify-content: center
    .show-box
      display: flex
      align-items: center
      position: relative
      padding: 0 9px
      box-sizing: border-box
      &:after, &:before
        content: ''
        width: 32.53vw
        height: 1px
        background: #EFEEF5
        col-center()
        transform: scaleY(0.5)
        left: -32.53vw
      &:before
        left: 101px
      .show-name
        color: rgba(129, 141, 153, .8)
        font-family: $font-family-regular
        font-size: $font-size-12
        line-height: 1
      .show-img
        margin-left: 3px
        height: 8.5px
        width: 8.5px
        transition: transform 0.6s
        transform: rotate(0deg)
        &.active
          transform: rotate(180deg)

  .show-more-active
    .show-box
      .show-img
        transform: rotate(180deg)
</style>
