<template>
  <div class="goods-classify">
    <navigation-bar title="分类"></navigation-bar>
    <div class="page-container">
      <scroll-view :style="{top:statusBarHeight + 44 + 'px'}" :scroll-into-view="toView" scroll-x="true" scroll-with-animation="true" class="menu-box">
        <div class="scroll-menu">
          <div v-for="(item,i) in menuList" :key="item.id" :id="'item'+item.id" class="menu-item" :class="{active:params.category_id===item.id}" @click="changeView(item,i)">
            <img :src="item.image_url" class="categroy-icon" mode="aspectFill">
            <div class="name">{{item.name}}</div>
          </div>
          <div :style="{transform:'translateX('+transformX+')'}" class="slider-line-wrap">
            <div class="line-wrap"></div>
          </div>
        </div>
      </scroll-view>
      <ul v-if="list.length" class="goods-ul">
        <li v-for="item in list" :key="item.id" class="goods-item" @click="goToDetail(item)">
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
        </li>
      </ul>
      <div class="empty-page" v-else>
        <empty tip="你的页面是空的"></empty>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { cartComputed, cartMethods } from '@state/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'
  import GetOptions from '@mixins/get-options'

  const PAGE_NAME = 'GOODS_CLASSIFY'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    mixins: [GetOptions],
    onPullDownRefresh() {
      // console.log(111)
    },
    onReachBottom() {
      // console.log('onReachBottom')
      if (this.params.page + 1 > this.totalPage || this.loading) return
      this.params.page++
      this._getGoodsList()
    },
    onLoad(options) {
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.params.category_id = options.id || 0
      this._getCategoryList()
      this._getGoodsList()
    },
    data() {
      return {
        toView: 'item',
        toViewValue: '',
        statusBarHeight: 20,
        loading: false,
        params: {
          category_id: 0,
          keyword: '',
          limit: 10,
          page: 1
        },
        totalPage: 0,
        menuList: [],
        list: [],
        transformX: ''
      }
    },
    computed: {
      ...cartComputed
    },
    methods: {
      ...cartMethods,
      // 顶部 商品分类选择切换
      changeView(item, i) {
        this.toViewValue = item.id
        let newIndex = i < 3 ? 0 : i > this.menuList.length - 3 ? this.menuList.length - 1 : i - 2
        this.toView = 'item' + this.menuList[newIndex].id
        this.transformX = i * 84 + 'px'
        this.params.category_id = item.id
        this.params.page = 1
        this._getGoodsList({ loading: false })
      },
      // 获去商品分类列表
      _getCategoryList() {
        API.Goods.getCategoryList({ data: { pid: 0 }, loading: false }).then(res => {
          this.menuList = res.data
          if (this.params.category_id) {
            let i = this.menuList.findIndex(item => item.id === Number(this.params.category_id))
            if (i >= 0) {
              let newIndex = i < 3 ? 0 : i > this.menuList.length - 3 ? this.menuList.length - 1 : i - 2
              this.toView = 'item' + this.menuList[newIndex].id
              this.transformX = i * 84 + 'px'
            }
          }
        })
      },
      // 获取商品列表
      _getGoodsList(other) {
        this.loading = true
        API.Goods.getGoodsList({ data: this.params, loading: false, ...other }).then(res => {
          if (this.params.page === 1) this.list = []
          this.list = [...this.list, ...res.data]
          this.totalPage = res.meta.last_page
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // addCart(item) {
      //   this._addToCart({})
      // },
      // 去详情
      goToDetail(item) {
        wx.navigateTo({ url: this.$routes.main.GOODS_DETAIL + '?id=' + item.id })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/goodsList.styl"

  .goods-classify
    height: 100vh
    display: flex
    flex-direction: column

    .page-container
      flex: 1
      display: flex
      flex-direction: column
      position:relative

    .menu-box
      background-color: $color-white
      border-bottom-1px($color-line, solid, -0.5px)
      position: fixed
      top: 64px
      width: 100vw
      z-index: 10

      &::-webkit-scrollbar
        width: 0
        height: 0
        color: transparent

      .scroll-menu
        display: flex
        align-items: center
        flex-wrap: no-wrap
        position: relative

        &::-webkit-scrollbar
          width: 0
          height: 0
          color: transparent

        .menu-item
          font-size: $font-size-16
          padding: 2px 8px
          box-sizing: border-box
          flex-shrink: 0
          text-align: center
          white-space: nowrap
          overflow-x: hidden
          text-overflow: ellipsis
          width: 84px

          .name
            font-size: $font-size-12
            line-height: $font-size-12
            padding: 4px 0px 8px

          .categroy-icon
            display: inline-block
            width: 45px
            height: 45px
            border-radius: 50%
            background-color: $color-background

          &.active .name
            font-family: $font-family-medium

        .slider-line-wrap
          position: absolute
          bottom: 0
          padding: 0 27px
          transition: all 0.3s
          z-index: 50px

          .line-wrap
            height: 3px
            width: 30px
            border-radius: 2px
            background-color: $color-money

  .empty-page
    background-color: $color-white
    flex: 1
    padding: 50px 0 0px 5px

  .goods-ul
    padding-top: 85px
</style>
