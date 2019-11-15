<template>
  <div class="service-order" @click="showSelect = false">
    <navigation-bar title="订单管理"></navigation-bar>
    <div class="scroll-box" :style="{top: statusBarHeight + 'px'}">
      <div class="scroll-big">
        <div class="select-box" @click.stop="showSelectBox">
          <div class="select-title">{{typeName}}</div>
          <img src="./icon-screen@2x.png" class="select-icon">
        </div>
        <scroll-view
          class="scroll-view2"
          v-if="navList.length"
          id="scrollView"
          :scroll-into-view="viewToItem"
          scroll-x
          scroll-with-animation="true"
        >
          <div v-for="(item, index) in navList" :class="tabIndex === index ? 'item-active'  : ''" :key="index"
               class="item scroll-item" :id="'item'+index" @click="_changeTab(index, item.status, $event)">
            <p class="text">{{item.name}}</p>
          </div>
          <div :style="{left: move + 'px'}" class="line-box">
            <div class="line"></div>
          </div>
        </scroll-view>
      </div>

      <div class="order-select" :class="{'order-select-active': showSelect}">
        <div v-for="(item, index) in typeList" :key="index" class="order-type" :class="{'order-type-active': selectStatus === item.status}" @click.stop="selectType(index, item)">{{item.name}}</div>
      </div>
    </div>
    <!--商品-->
    <div class="nav-block" :style=""></div>
    <div class="big-box">
      <div class="classify-big-box"
           :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  width +'vw'}"
      >
        <div
          v-for="(tabItem, tabInx) in orderList" :key="tabInx"
          :style="{height: tabIndex * 1 === tabInx ? -1 : scrollHeight + 'px'}"
          class="goods-list-box"
        >
          <div class="order-item" v-for="(item, index) in tabItem.arr" :key="index" @click="goDetail(item)">
            <div class="order-top">
              <div class="order-sn">订单编号:{{item.order_sn}}</div>
              <div class="order-status">{{item.transaction_status_str}}</div>
            </div>
            <div class="order-goods" v-for="(good, goodIdx) in item.detail" :key="oodIdx">
              <img :src="good.goods_cover_image" class="goods-img" mode="aspectFill">
              <div class="goods-msg">
                <div class="goods-name">{{good.goods_name}}</div>
                <div class="goods-stock"></div>
                <div class="goods-sale">
                  售价：
                  <div class="price">¥{{good.goods_price}}</div>
                </div>
              </div>
            </div>
          </div>
          <empty v-if="tabItem.isEmpty" :image="empty" :paddingTop="45.4" tip="你的订单是空的"></empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Order from './order'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'SERVICE_ORDER'
  const NAV_LIST = [
    { name: '全部', status: '' },
    { name: '交易中', status: '0' },
    { name: '交易完成', status: '100' },
    { name: '交易关闭', status: '-1' }
  ]
  const TYPE_LIST = [
    { name: '服务订单', status: '0' },
    { name: '拼团订单', status: '1' },
    { name: '砍价订单', status: '4' },
    { name: '分享订单', status: '3' }
  ]
  const EMPTY = require('./pic-order@2x.png')

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        showSelect: false,
        empty: EMPTY,
        navList: NAV_LIST,
        typeList: TYPE_LIST,
        viewToItem: 'item0',
        boxTransition: 'all .3s',
        move: 0,
        tabIndex: 0,
        statusBarHeight: 64,
        status: '',
        orderList: new Order(NAV_LIST.length),
        width: NAV_LIST.length * 100,
        page: 1,
        winHeight: 667,
        selectStatus: '0'
      }
    },
    computed: {
      scrollHeight() {
        let height = this.winHeight - this.statusBarHeight - 55
        return height
      },
      typeName() {
        let item = TYPE_LIST.find(item => item.status === this.selectStatus) || '服务订单'
        return item.name
      }
    },
    onLoad(option) {
      this.status = option && option.status ? option.status : this.status
      let index = this.navList.findIndex((item) => item.status === this.status)
      this._changeTab(index)
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.winHeight = res.screenHeight
      this.getOrderList(true)
    },
    // 翻页
    onReachBottom() {
      if (this.orderList[this.tabIndex].page >= this.orderList[this.tabIndex].lastPage) {
        return
      }
      this.orderList[this.tabIndex].page++
      this.getOrderList()
    },
    methods: {
      goDetail(item) {
        wx.navigateTo({url: `${this.$routes.personalCenter.SERVICE_ORDER_DETAIL}?id=${item.id}`})
      },
      // 获取订单列表
      getOrderList(loading = false) {
        let data = { transaction_status: this.navList[this.tabIndex].status, page: this.orderList[this.tabIndex].page, type: this.selectStatus }
        API.Service.serviceList({ data, loading })
          .then((res) => {
            this.orderList[this.tabIndex].lastPage = res.meta.last_page
            let arr = res.data.map((item) => {
              item.height = 145
              return item
            }) || []
            if (this.orderList[this.tabIndex].page === 1) {
              this.orderList[this.tabIndex].arr = arr
              this.orderList[this.tabIndex].isEmpty = !arr.length
              this.orderList[this.tabIndex].isEnd = arr.length < 10 && arr.length
            } else {
              this.orderList[this.tabIndex].arr = this.orderList[this.tabIndex].arr.concat(arr)
            }
            this.orderList = JSON.parse(JSON.stringify(this.orderList))
            this.orderList[this.tabIndex].isLoading = false
          })
          .catch(() => {
            this.orderList[this.tabIndex].arr = []
            this.orderList = JSON.parse(JSON.stringify(this.orderList))
            this.orderList[this.tabIndex].isEmpty = true
            this.orderList[this.tabIndex].isLoading = false
          })
      },
      selectType(index, item) {
        this.selectStatus = item.status
        this.orderList[this.tabIndex].page = 1
        this.getOrderList(true)
        setTimeout(() => {
          this.showSelect = false
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
        }, 200)
      },
      showSelectBox() {
        this.showSelect = !this.showSelect
      },
      // 切换tab
      _changeTab(index, id, e) {
        if (this.tabIndex === index) return
        this.move = 75 * index
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        this.boxTransition = ''
        this.orderList[this.tabIndex].arr = this.orderList[this.tabIndex].arr.slice(0, 10)
        this._setViewToItem(index)
        this.orderList[this.tabIndex].page = 1
        this.getOrderList()
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      },
      // 滚动
      _setViewToItem(index = 0) {
        this.tabIndex = index
        let number = index < 2 ? 0 : index - 1
        this.viewToItem = `item${number}`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .nav-block
    height: 40px

  .service-order
    width: 100%

  .scroll-box
    top: 64px
    position: fixed
    background: $color-white
    height: 40px
    z-index: 1
    .scroll-big
      background: $color-white
      position: relative
      z-index: 10
      display: flex
      height: 100%
    .scroll-view2
      position: relative
      z-index: 99
      display: block
      white-space: nowrap
      box-sizing: border-box
      transition: transform 0.3s
      transform: translate3d(0, 0, 0)
      height: 100%
      width: calc(100vw - 100px)
      ::-webkit-scrollbar
        width: 0
        height: 0
        color: transparent
      .item
        white-space: nowrap
        text-align: center
        display: inline-block
        position: relative
        height: 100%
        transform-origin: 50%
        transition: all 0.2s
        width: 57px
        padding: 0 9px
        .text
          line-height: 1
          padding: 10.5px 0 13.5px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-assist
      .item-active
        position: relative
        transition: font-size 0.2s
        transform-origin: 50%
        .text
          color: $color-text-main
          font-size: $font-size-14
          font-family: $font-family-medium
    .line-box
      position: absolute
      width: 75px
      height: 3px
      top: 37px
      left: 0
      display: flex
      z-index: 11
      justify-content: center
      transition: all 0.2s
      .line
        background: $color-main
        width: 28px
        border-radius: 3px
        height: 3px

    .select-box
      display: flex
      align-items: center
      justify-content: center
      width: 100px
      position: relative
      &:after
        col-center()
        right: 0
        background: #706B82
        height: 14.5px
        width: 1px
        transform: translateY(-50%) scaleX(0.5)
        content: ''
      .select-title
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-sub
        margin-right: 2px
      .select-icon
        display: block
        height: 11px
        width: 11px

    .order-select
      position: absolute
      z-index: 1
      height: 90px
      bottom: 50px
      left: 0
      display: flex
      padding: 0 15px
      box-sizing: border-box
      background: $color-white
      align-items: center
      width: 100%
      transition: all 0.3s
      box-shadow: 0 0 4px 0 rgba(183, 183, 183, 0.50)
      .order-type
        height: 32px
        line-height: 32px
        text-align: center
        border-radius: 2px
        background: #F5F5F5
        font-size: $font-size-14
        color: $color-sub
        margin-right: 20px
        width: 83.5px
        transition: all 0.2s
      .order-type-active
        background: $color-main
        color: $color-white
    .order-select-active
      bottom: -88px

  .big-box
    margin-top: 10px
    width: 100vw
    overflow: hidden
    .classify-big-box
      width: 500vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
    .goods-list-box
      display: block
      width: 100vw

  .order-item
    margin: 0 10px 10px
    background: $color-white
    border-radius: 2px
    .order-top
      display: flex
      margin: 0 10px
      justify-content: space-between
      align-items: center
      border-bottom-1px($color-line)
      height: 40px
      .order-sn
        color: $color-text-sub
        font-family: $font-family-regular
        font-size: $font-size-14
      .order-status
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-main
    .order-goods
      display: flex
      padding: 15px 0
      margin: 10px
      box-sizing: border-box
      .goods-img
        width: 70px
        height: 70px
        border-radius: 2px
        margin-right: 10px
        background: $image-color
      .goods-msg
        flex: 1
        width: 0
        .goods-name
          font-size: $font-size-16
          font-family: $font-family-regular
          color: $color-text-sub
          letter-spacing: 0.4px
          line-height: 20px
          transform: translateY(-1px)
          no-wrap()
        .goods-stock
          color: $color-text-assist
          font-size: $font-size-13
          letter-spacing: 0.28px
          line-height: 1
          font-family: $font-family-regular
          margin-top: 13.5px
          height: 13px
        .goods-sale
          color: $color-text-assist
          font-size: $font-size-13
          line-height: 1
          font-family: $font-family-regular
          margin-top: 7.5px
          align-items: flex-end
          display: flex
          .price
            transform: translateY(1px)
            line-height: 1
            color: $color-main
            font-size: $font-size-14
            font-family: $font-family-medium

</style>
