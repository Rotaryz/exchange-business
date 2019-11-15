<template>
  <div class="brand">
    <navigation-bar title="品牌馆"
                    :translucent="true"
                    :showArrow="false"
                    :isPHB="true"
                    :isOpacity="true"
                    arrowColor="white"
    ></navigation-bar>
    <img mode="aspectFill" src="./pic-bg_brand.png" alt="" class="navigation-image" :style="{height: topHeight + 'px'}">
    <block v-for="(cItem, cIdx) in cms" :key="cItem.id">
      <swiper
        v-if="cItem.code === 'banner' && bannerArray.length"
        class="banner"
        :autoplay="true"
        interval="5000"
        display-multiple-items="1"
        :previous-margin="preM"
        :next-margin="nextM"
        circular
      >
        <block v-for="(item,index) in bannerArray" :key="index">
          <swiper-item class="banner-item">
            <div class="b-item-wrapper" @click="handleJump(item)">
              <img
                v-if="item.detail.image_url"
                class="item-img"
                lazy-load
                mode="aspectFill"
                :src="item.detail.image_url"
              >
            </div>
          </swiper-item>
        </block>
      </swiper>
      <block v-if="cIdx === 0">
        <section class="content-wrapper">
          <ul class="icon-group">
            <li class="icon-wrapper">
              <img src="./icon-right_ensure@2x.png" alt="" class="icon">
              <p class="text">正品溯源</p>
            </li>
            <li class="icon-wrapper">
              <img src="./icon-right_ensure@2x.png" alt="" class="icon">
              <p class="text">品质好货大折扣</p>
            </li>
            <li class="icon-wrapper">
              <img src="./icon-right_ensure@2x.png" alt="" class="icon">
              <p class="text">会员专享</p>
            </li>
          </ul>
        </section>
      </block>
      <!-- 分类 -->
      <div v-if="cItem.code === 'brand_wall' && brandMaskArray.length" class="classification-box">
        <button v-for="(item, index) in brandMaskArray" :key="index" class="classify-item" form-type="submit" @click="handleJump(item)">
          <img v-if="item.detail.logo_image_url||item.detail.image_url" :src="item.detail.logo_image_url||item.detail.image_url" lazy-load mode="aspectFill" class="classify-icon">
          <p class="classify-name">{{item.detail.title}}</p>
        </button>
      </div>
      <!-- 品牌列表 -->
      <block v-if="cItem.code === 'brand_list'">
        <section v-if="brandArray.length" class="content-wrapper">
          <block v-for="(item, index) in brandArray" :key="index">
            <div class="brand-item-wrapper" @click="handleJump(item)">
              <img :src="item.detail.image_url" lazy-load alt="" class="logo" mode="aspectFill">
            </div>
          </block>
        </section>
      </block>
      <div v-if="cItem.code === 'best_recommend' && boutiqueList.length" class="boutique-wrap">
        <div class="boutique-title">
          <div class="title-mask"></div>
          <div class="title">精品推荐</div>
        </div>
        <ul class="boutique-list">
          <li v-for="goods in boutiqueList" :key="goods.detail.id" class="boutique-item" @click="handleJump(goods)">
            <img :src="goods.detail.image_url||goods.detail.goods_cover_image" mode="aspectFill" lazy-load class="boutique-img">
            <div class="good-info">
              <div class="goods-title">{{goods.detail.name}}</div>
              <div class="goods-price">¥{{goods.detail.sale_price}}</div>
            </div>
          </li>
        </ul>
      </div>
    </block>
    <loading-more v-if="isShowLoading"></loading-more>
    <is-end v-if="isShowEnd"></is-end>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import { globalComputed } from '@state/helpers'
  import LoadingMore from '@components/loading-more/loading-more'
  import IsEnd from '@components/is-end/is-end'

  const PAGE_NAME = 'BRAND'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      LoadingMore,
      IsEnd
    },
    data() {
      this.isFirstLoad = true
      return {
        topHeight: 0,
        cms: [],
        isShowLoading: false,
        isShowEnd: true
      }
    },
    computed: {
      ...globalComputed,
      preM() {
        return this.$vw * 20 + 'px'
      },
      nextM() {
        return this.$vw * 10 + 'px'
      },
      bannerArray() {
        const list = this.cms.find(val => val.code === 'banner') || {}
        return list.children || []
      },
      brandMaskArray() {
        const list = this.cms.find(val => val.code === 'brand_wall') || {}
        return (list.children && list.children.filter(item => item.detail.status === 1 || ((item.style === 3004 || item.style === 3005) && item.detail.url))) || []
      },
      brandArray() {
        const list = this.cms.find(val => val.code === 'brand_list') || {}
        // return (list.children && list.children.filter(item => (item.style === 3009 && item.detail.brand && item.detail.brand.status === 1) || (item.style === 3002 && item.detail.status === 1))) || []
        return (list.children && list.children.filter(item => item.detail.status === 1)) || []
      },
      boutiqueList() {
        const list = this.cms.find(val => val.code === 'best_recommend') || {}
        return list.children || []
      }
    },
    onLoad() {
      const brandData = this.$storage('brandData')
      typeof brandData === 'object' && Object.assign(this, brandData)
      this.topHeight = this.statusBarHeight + this.$vw * 157
    },
    onUnload() {
      this.$storage('brandData', { cms: this.cms })
    },
    onShow() {
      this._getPageDetail()
    },
    // 下拉刷新
    onPullDownRefresh() {
      this._getPageDetail()
      setTimeout(() => {
        wx.stopPullDownRefresh()
      }, 500)
    },
    methods: {
      _getPageDetail() {
        const code = 'brand_index'
        API.Brand.pageDetail({ data: { code }, loading: this.isFirstLoad }).then((res) => {
          if (res.data.code === code) {
            this.cms = res.data.children
          }
        })
        this.isFirstLoad = false
      },
      handleJump(item) {
        let url = ''
        switch (item.style) {
          case 3001:// 活动
            url = `${this.$routes.main.GOODS_DETAIL}?id=${item.detail.object_id}`
            break
          case 3002:// 商品
            url = `${this.$routes.main.GOODS_DETAIL}?id=${item.detail.object_id}`
            break
          case 3003:// 商品分类
            url = `${this.$routes.main.GOODS_CLASSIFY}?id=${item.detail.object_id}`
            break
          case 3004:// out-html外链
            const link = item.detail.url.split('?')
            const type = /webview/i.test(link[1]) ? '&webview=true' : ''
            url = `${this.$routes.main.OUT_HTML}?url=${link[0]}` + type
            break
          case 3005:// 小程序链接
            url = `${item.detail.url}`
            break
          case 3006:// 文章
            url = `${this.$routes.brand.BRAND_CONTENT}?id=${item.detail.object_id}`
            break
          case 3009:// 品牌
          case 3010:// 品牌
            url = `${this.$routes.brand.BRAND_DETAIL}?id=${item.detail.object_id}`
            break
          default:
            break
        }
        url && wx.navigateTo({ url })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $bannerWidth = 336.5
  @import "~@design"
  @import "~@style/goodScrollList.styl"

  .brand
    min-height: 100vh
    background: $color-background
    overflow-x: hidden
    box-sizing: border-box
    padding-bottom: 10px

  .navigation-image
    position: absolute
    top: 0
    left: 0
    width: 100vw

  .banner
    border-top: 10px solid transparent
    height: px2vw(200)

    .banner-item
      width: px2vw($bannerWidth)
      height: 100%

      .b-item-wrapper
        position: relative
        width: px2vw($bannerWidth)
        height: px2vw(200)

        .item-img
          background: $image-color
          width: px2vw($bannerWidth)
          height: px2vw(200)
          border-radius: 2px

  .content-wrapper
    position: relative
    padding: 0 10px

    .icon-group
      padding: 15px 0 15px 9px
      layout(row, block, nowrap)

      .icon-wrapper
        layout(row)
        align-items: center
        margin-right: 25px

        &:last-child
          margin-right: 0

        .icon
          width: 11px
          height: 11px

        .text
          margin-left: 3px
          font-family: $font-family-regular
          font-size: 12px
          color: #818D99
          line-height: 1

  .brand-item-wrapper
    box-sizing: border-box
    margin-bottom: 12px
    background: #FFFFFF
    box-shadow: 0 5px 13px 0 rgba(0, 0, 0, 0.04)
    border-radius: 2px
    overflow: hidden
    position: relative

    .logo
      width: 100%
      height: px2vw(266)
      /*height: 125px*/
      font-size: 0
      display: block
      border-radius: 2px

  .boutique-wrap
    padding: 12px 10px 0 10px

    .boutique-title
      display: flex
      align-items: center
      margin-bottom: 15px

      .title-mask
        height: 16px
        width: 4px
        background-color $color-money
        margin-right: 6px

      .title
        font-size: $font-size-18
        font-family $font-family-medium

    .boutique-list
      .boutique-item
        margin-bottom 10px
        border-radius 4px
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.02)

        .boutique-img
          width: 100%
          height: px2vw(200)
          display block
          border-radius 4px 4px 0 0

        .good-info
          padding: 12px
          background-color $color-white
          border-radius 0 0 4px 4px

          .goods-title
            color: $color-text-sub
            font-size $font-size-14
            margin-bottom 8px

          .goods-price
            color: $color-money
            font-family $font-family-medium
            font-size $font-size-14

  .classification-box
    display: flex
    flex-wrap: wrap
    padding: 0 10px
    text-align: center

    .classify-item
      width: 20%
      display flex
      flex-direction column
      align-items center
      padding-bottom:10px
      .classify-icon
        background: $image-color
        border-radius: 50%
        display: block
        margin-bottom: 7px
        height: 45px
        width: @height
        background-color $color-white

      .classify-name
        color: $color-text-sub
        font-family: $font-family-regular
        width:100%
        no-wrap()
        font-size:12px


  /*惯性滚动*/
  .ios-scroll-smooth
    -webkit-overflow-scrolling: touch

  /*隐藏scroll*/
  .no-scroll-bar
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
