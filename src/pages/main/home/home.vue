<template>
  <form report-submit @submit="$getFormId">
    <div class="home">
      <navigation-bar title="礼品馆"
                      :showArrow="false"
                      :translucent="true"
                      :titleMaxLen="12"
                      :isShowSearch="true"
                      :isPHB="true"
                      :isOpacity="true"
                      arrowColor="white"
                      @search="searchGoods"
      ></navigation-bar>
      <img mode="aspectFill" src="./pic-bg_gift.png" alt="" class="navigation-image" :style="{height: topHeight + 'px'}">
      <div v-for="(cms, cmsIndex) in CMS" :key="cms.id" class="cms">
        <!-- 轮播图 -->
        <div v-if="cms.code === 'banner' && bannerArray.length" class="banner-box">
          <swiper
            class="banner"
            autoplay
            interval="5000"
            display-multiple-items="1"
            previous-margin="0px"
            next-margin="0px"
            circular
            :current="bannerIndex"
            @change="handleSetBannerIndex">
            <block
              v-for="(item,index) in bannerArray"
              :key="index"
            >
              <swiper-item
                class="banner-item"
              >
                <div class="b-item-wrapper"
                     @click="handleBannerJump(item)"
                >
                  <img
                    v-if="item.detail.image_url"
                    class="item-img"
                    lazy-load
                    mode="aspectFill"
                    :src="item.detail.image_url"
                  >
                  <!-- <article class="mask-wrapper-banner">-->
                  <!-- </article>-->
                </div>
              </swiper-item>
            </block>
          </swiper>
          <div class="dot-wrapper">
            <p class="dot-item">{{bannerIndex+1}}</p>
            <p class="dot-item">/</p>
            <p class="dot-item">{{cms.children.length}}</p>
          </div>
        </div>
        <!-- 分类 -->
        <div v-if="cms.code === 'navigation' && navigationArray.length" class="classification">
          <div class="classification-box">
            <button v-if="index<5" v-for="(item, index) in navigationArray" :key="index" class="classify-item" form-type="submit" @click="handleBannerJump(item)">
              <img v-if="item.detail.image_url" :src="item.detail.image_url" lazy-load mode="aspectFill" class="classify-icon">
              <p class="classify-name">{{item.detail.title}}</p>
            </button>
          </div>
        </div>
        <!-- 今日爆款-->
        <section v-if="cms.code === 'hot_goods' && hotArray.length" class="default-module">
          <div class="top-banner mask-banner">
            <img v-if="bannerHT" :src="bannerHT" alt="" class="banner-img" mode="aspectFill">
            <!--          <p class="mask-banner"></p>-->
          </div>
          <article class="_top-wrapper">
            <p class="_top-title">今日爆款</p>
            <p class="_top-sub-title">优选国内2%精品品牌</p>
          </article>
          <article class="bottom-wrapper">
            <section class="scroll-wrapper no-scroll-bar">
              <ul class="goods-wrapper ios-scroll-smooth">
                <block v-for="(goods, gIdx) in hotArray" :key="gIdx">
                  <li class="goods goods-default" @click="navHandle(goods.detail.id)">
                    <block>
                      <image mode="aspectFill" :src="goods.detail.image_url||goods.detail.goods_cover_image" lazy-load alt="" class="goods-cover">
                        <div v-if="!(goods.detail.saleable && goods.detail.status)" class="goods-none">
                          <img src="./pic-out_stock@2x.png" class="goods-none-img">
                        </div>
                      </image>
                    </block>
                    <p class="name">{{goods.detail.name}}</p>
                    <p class="money"><span class="unit">¥</span>{{goods.detail.sale_price}}</p>
                  </li>
                </block>
              </ul>
            </section>
          </article>
        </section>
        <!-- 精选推荐-->
        <section v-if="cms.code === 'recommend' && recommendArray.length" class="default-module">
          <div class="top-banner mask-banner">
            <img v-if="bannerRE" :src="bannerRE" alt="" class="banner-img" mode="aspectFill">
            <!--          <p class="mask-banner"></p>-->
          </div>
          <article class="_top-wrapper">
            <p class="_top-title">精选推荐</p>
            <p class="_top-sub-title">严选国内2%的优品</p>
          </article>
          <article class="bottom-wrapper">
            <section class="scroll-wrapper no-scroll-bar">
              <ul class="goods-wrapper ios-scroll-smooth">
                <block v-for="(goods, gIdx) in recommendArray" :key="gIdx">
                  <li class="goods goods-default" @click="navHandle(goods.detail.id)">
                    <block>
                      <image lazy-load mode="aspectFill" :src="goods.detail.image_url||goods.detail.goods_cover_image" alt="" class="goods-cover">
                        <div v-if="!(goods.detail.saleable && goods.detail.status)" class="goods-none">
                          <img src="./pic-out_stock@2x.png" class="goods-none-img">
                        </div>
                      </image>
                    </block>
                    <p class="name">{{goods.detail.name}}</p>
                    <p class="money"><span class="unit">¥</span>{{goods.detail.sale_price}}</p>
                  </li>
                </block>
              </ul>
            </section>
          </article>
        </section>
      </div>
      <!-- 推荐商品列表-->
      <section class="recommend" v-if="goodsList.length">
        <div class="recommend-name">{{industryObj.industry_name}}</div>
        <ul class="goods-ul">
          <button form-type="submit" v-for="item in goodsList" :key="item.id" class="goods-item" @click="navHandle(item.id)">
            <div class="goods-item-wrap">
              <div class="img-wrap">
                <image lazy-load v-if="item.goods_cover_image" :src="item.goods_cover_image" mode="aspectFill" class="goods-img">
                  <div v-if="!(item.saleable && item.status)" class="goods-none">
                    <img src="./pic-out_stock@2x.png" class="goods-none-img">
                  </div>
                </image>
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
          </button>
        </ul>
      </section>
      <loading-more v-if="isShowLoading"></loading-more>
      <is-end v-if="isShowEnd" styles="padding: 20px 0 0"></is-end>
    </div>
  </form>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import { cartMethods, cartComputed, globalComputed } from '@state/helpers'
  import storage from '@utils/storage'
  import LoadingMore from '@components/loading-more/loading-more'
  import IsEnd from '@components/is-end/is-end'

  const PAGE_NAME = 'HOME'

  function formatArray(arr = [], codeName) {
    const list = arr.find(val => val.code === codeName) || {}
    return list.children || []
  }

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
        bannerIndex: 0,
        page: 1,
        goodsList: [],
        total: 1,
        isBlackSearch: false,
        bannerHT: this.$imageUrl + '/exchange/pic-hot_banner.png',
        bannerRE: this.$imageUrl + '/exchange/pic-re_banner.png',
        CMS: [],
        isShowLoading: false,
        isShowEnd: false
      }
    },
    computed: {
      ...cartComputed,
      ...globalComputed,
      // banner图
      bannerArray() {
        return formatArray(this.CMS, 'banner')
      },
      // 导航栏
      navigationArray() {
        return formatArray(this.CMS, 'navigation')
      },
      // 今日爆款
      hotArray() {
        return formatArray(this.CMS, 'hot_goods')
      },
      // 推荐
      recommendArray() {
        return formatArray(this.CMS, 'recommend')
      },
      // 行业推荐
      industryObj() {
        let obj = formatArray(this.CMS, 'industry_recommend')
        // const obj = this.CMS.find(val => val.code === 'industry_recommend') || {}
        let detail = {}
        if (obj.length !== 0) {
          detail = obj[0].detail
        }
        console.log(detail)
        return detail || {}
      }
    },
    onLoad() {
      const dataHome = storage('homeData')
      typeof dataHome === 'object' && Object.assign(this, dataHome)
      this.topHeight = this.statusBarHeight + this.$vw * 157
    },
    onShow() {
      if (!storage('token')) {
        return
      }
      this.pageDetail()
      this._getCartCount()
    },
    onUnload() {
      storage('homeData', { CMS: this.CMS })
    },
    // 翻页
    onReachBottom() {
      if (this.page >= this.total) {
        this.isShowEnd = !!this.goodsList.length
        return
      }
      this.isShowLoading = true
      this.page++
      this.getGoodsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
      this.page = 1
      this.bannerIndex = 0
      this.pageDetail()
      setTimeout(() => {
        wx.stopPullDownRefresh()
      }, 500)
    },
    methods: {
      ...cartMethods,
      // banner页面跳转
      handleBannerJump(item) {
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
          case 3007:// 文章分类
            break
          case 3008:// image图片
            break
          case 3009:// 品牌
            url = `${this.$routes.brand.BRAND_DETAIL}?id=${item.detail.object_id}`
            break
          default:
            break
        }
        if (url) {
          this.$checkIsTabPage(url) ? wx.switchTab({ url }) : wx.navigateTo({ url })
        }
      },
      navHandle(id) {
        wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${id}` })
      },
      pageDetail() {
        const code = 'gift_index'
        const data = { code }
        API.Home.pageDetail({ data, loading: this.isFirstLoad })
          .then((res) => {
            if (res.data.code === code) {
              this.CMS = res.data.children
              if (this.page !== 1) return
              this.getGoodsList()
              this.CMS.forEach((item) => {
                if (item.code === 'hot_goods' && item.detail.image_url) {
                  this.bannerHT = item.detail.image_url
                }
                if (item.code === 'recommend' && item.detail.image_url) {
                  this.bannerRE = item.detail.image_url
                }
              })
            }
          })
        this.isFirstLoad = false
      },
      getGoodsList(loading = false) {
        if (!this.industryObj.industry_id) return
        const data = {
          page: this.page,
          limit: 10,
          industry_id: this.industryObj.industry_id,
          use_type: 1
        }
        API.Home.goodsList({ data, loading })
          .then((res) => {
            this.total = res.meta.last_page
            if (this.page === 1) {
              this.goodsList = res.data
              this.isShowEnd = this.goodsList.length < 10
            } else {
              this.goodsList = this.goodsList.concat(res.data)
            }
            this.isShowLoading = false
          })
      },
      handleSetBannerIndex(e) {
        this.bannerIndex = e.target.current
      },
      // 搜索商品
      searchGoods() {
        wx.navigateTo({ url: this.$routes.main.GOODS_SEARCH })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $bannerWidth = 355
  @import "~@design"
  @import "~@style/goodScrollList.styl"
  @import './price.styl'

  .home
    min-height: 100vh
    background: $color-background
    overflow-x: hidden
    padding-bottom: 15px
    box-sizing: border-box
    .navigation-image
      position: absolute
      top: 0
      left: 0
      width: 100vw

  .mask-wrapper-banner
    fill-box(absolute)
    background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0.00) 42%, rgba(0, 0, 0, 0.60) 100%);
    border-radius: 3px 3px 0 0;
    layout(row, block, nowrap)

  .banner-box
    border-top: 10px solid transparent
    position: relative
    .banner
      height: px2vw(170)
      .banner-item
        width: px2vw($bannerWidth)
        height: 100%
        margin: 0 atuo
        .b-item-wrapper
          margin: 0 auto
          position: relative
          width: px2vw($bannerWidth)
          height: px2vw(170)
          .item-img
            background: $image-color
            width: px2vw($bannerWidth)
            height: px2vw(170)
            border-radius: 2px
    .dot-wrapper
      position: absolute
      left: px2vw(27)
      bottom: px2vw(12)
      display: flex
      width: 35px
      height: 17.5px
      background-image url("./pic-switch.png")
      background-size: 100% 100%
      layout(row, block, nowrap)
      align-items: center
      justify-content space-around
      box-sizing: border-box
      padding: 0 3px
      .dot-item
        font-family: $font-family-regular
        font-size: 10px;
        color: #F1F5EB;
        line-height: 1

  .classification
    box-sizing: border-box
    padding: 15px 10px 20px
    height:108px
    text-align: center
    display: flex
    .classification-box
      width:100%
      display: flex
      flex-wrap: wrap
      .classify-item
        display flex
        flex-direction column
        align-items center
        width:20%
        .classify-icon
          background: $image-color
          border-radius: 50%
          display: block
          margin-bottom: 10px
          height: 50px
          width: @height
        .classify-name
          color: $color-text-main
          font-family: $font-family-regular
          width:100%
          no-wrap()
          font-size:12px
  .recommend
    padding: 0 px2vw(10)
    box-sizing: border-box
    .recommend-name
      margin: 8px 0 15px
      padding: 0 16px
      font-family: $font-family-regular
      color: #fff
      font-size: 16px
      background-image: linear-gradient(144deg, #F46D0D 0%, #D83F35 33%);
      height: 27px
      border-radius: @height
      text-align: center
      line-height @height
      display inline-block
    .goods-ul
      display flex
      flex-wrap wrap
      padding: 0
      .goods-item
        width: (174 / 355 * 100) %
        padding-right: 0
        margin-right: px2vw(7)
        padding-bottom: px2vw(7)
        box-sizing border-box
        &:nth-child(2n)
          margin-right: 0
        .goods-item-wrap
          background-color $color-white
          border-radius 2px
          position relative
          .img-wrap
            width: 100%
            padding-top: 100%
            position relative
            border-radius: 2px 2px 0px 0px
            .goods-img
              position absolute
              top: 0
              right: 0
              left: 0
              bottom: 0
              width: 100%
              height: 100%
              border-radius: 2px 2px 0px 0px
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
          .info-wrap
            padding: 7px 10px 12px
            .title
              font-family $font-family-regular
              font-size $font-size-14
              color: $color-text-main
              line-height 20px
              height: 40px
              text-align: left
              no-wrap-plus()
              margin-bottom: 7px
            & >>> .price-icon
              padding-left: 12px

  .default-module
    margin-bottom: 15px
    position: relative
    .bottom-wrapper
      height 171px
      margin-left: px2vw(10)
      box-shadow: 0 5px 13px 0 rgba(0, 0, 0, 0.04);
      border-radius: 2px
      overflow: hidden
    ._top-wrapper
      height 125.5px
      position relative
      line-height: 1
      padding-left px2vw(15)
      ._top-title
        padding-top: 43px
        font-family: $font-family-medium
        color: #FFFFFF
        font-size: 22px;
      ._top-sub-title
        padding-top: 10px
        opacity: 0.9;
        font-family: $font-family-regular
        color: #FFFFFF
        font-size: 13px;
    .top-banner
      width: 100vw
      height: 155px
      position: absolute
      .banner-img
        position: absolute
        width: 100%
        height: 100%
      .mask-banner
        fill-box(absolute)
        background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.50) 100%);
        border-radius: 3px 3px 0 0


</style>
