miniprogram-1<template>
  <div class="exchange-order">
    <navigation-bar title="兑换记录"></navigation-bar>
    <div class="scroll-box" :style="{top: statusBarHeight + 'px'}">
      <scroll-view
        class="scroll-view2"
        v-if="navList.length"
        id="scrollView"
        :scroll-into-view="viewToItem"
        scroll-with-animation="true"
      >
        <div v-for="(item, index) in navList" :class="tabIndex === index ? 'item-active'  : ''" :key="index"
             class="item scroll-item" :id="'item'+index" @click="_changeTab(index, item.status, $event)">
          <p class="text">{{item.name}}</p>
        </div>
        <div :style="{left: (100 / 3) * tabIndex + '%'}" class="line-box">
          <div class="line"></div>
        </div>
      </scroll-view>
    </div>
    <div class="nav-block" :style=""></div>
    <div class="big-box">
      <div class="classify-big-box"
           :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', 'transition': boxTransition}"
      >
        <div
          v-for="(listItem, tabInx) in navList" :key="tabInx"
          :style="{minHeight: scrollHeight+'px'}"
          class="goods-list-box"
        >
          <div v-if="exchangeList.length" class="order-list">
            <div v-for="(item, idx) in exchangeList" :key="idx" class="order-item">
              <div class="order-header">
                <div class="order-id">
                  <img src="./icon-order@2x.png" class="order-icon">
                  {{item.order_sn}}
                </div>
                <div class="order-status">{{item.status_str}}</div>
              </div>
              <div class="order-msg">
                <img v-if="item.details&&item.details[0].goods_cover_image" :src="item.details[0].goods_cover_image" class="goods-img">
                <div class="goods-msg">
                  <div v-if="item.details" class="goods-title">{{item.details[0].goods_name}}</div>
                  <div class="goods-buyer">客户：{{item.customer.nickname}}</div>
                  <div class="goods-price">
                    <div class="goods-tag">兑换券</div>
                    <div class="goods-money">{{item.pay_integral_amount}}</div>
                  </div>
                </div>
              </div>
              <div v-if="item.status === 10" class="order-button" @click="_exchangeOrder(item)">
                <div class="order-btn">确认兑换</div>
              </div>
            </div>
          </div>
          <empty v-if="!getting&&isEmpty" tip="暂时无兑换订单"></empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'EXCHANGE_ORDER'

  const NAV_LIST = [
    { name: '全部', status: '' },
    { name: '待兑换', status: '10' },
    { name: '已完成', status: '100' }
  ]
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        statusBarHeight: 64,
        scrollHeight: 0,
        navList: NAV_LIST,
        tabIndex: 0,
        viewToItem: 'item0',
        boxTransition: 'all 0.25s',
        exchangeList: [],
        hasMore: false,
        isEmpty: false,
        getting: false,
        status: '',
        page: 1
      }
    },
    onPullDownRefresh() {
      this.page = 1
      this._getExchangeList()
    },
    onReachBottom() {
      if (this.hasMore) {
        this.page++
        this._getExchangeList()
      }
    },
    onLoad(option) {
      this.status = option.status || ''
      let index = this.navList.findIndex((item) => item.status === this.status)
      this._changeTab(index)
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.scrollHeight = res.screenHeight - this.statusBarHeight - 45
      this._getExchangeList(true)
    },
    methods: {
      _changeTab(index, status, e) {
        if (this.tabIndex === index) return
        // 如果是切换旁边的tab就加上动画，不是旁边的tab就不要动画
        this.boxTransition = this.tabIndex === index - 1 || this.tabIndex === index + 1 ? 'all 0.25s' : ''
        this._setViewToItem(index)
        // 初始化部分参数
        this.status = status
        this.page = 1
        this.exchangeList = []
        this._getExchangeList()
      },
      // 滚动
      _setViewToItem(index = 0) {
        this.tabIndex = index
        let number = index < 3 ? 0 : index - 2
        this.viewToItem = `item${number}`
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      },
      // 获取兑换订单
      _getExchangeList(loading = false) {
        this.getting = true
        API.Shop.exchangeOrder({data: {status: this.status, page: this.page}, loading})
          .then((res) => {
            this.exchangeList = this.exchangeList.concat(res.data)
            this.hasMore = res.meta.current_page < res.meta.last_page
            this.isEmpty = this.page === 1 && !res.data.length
            this.getting = false
          })
          .catch(() => {
            this.getting = false
          })
      },
      // 兑换
      _exchangeOrder(item) {
        if (!item.verify && !item.verify[0].code) return
        API.Shop.verifyOrder({data: {code: item.verify[0].code}})
          .then((res) => {
            item.status_str = '已完成'
            item.status = 100
            this.$wechat.showToast('兑换成功！')
          })
          .catch(() => {
            this.$wechat.showToast('兑换失败！')
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .exchange-order
    width: 100%
    height: 100vh
    box-sizing: border-box
    padding-top: 45px
  .scroll-box
    top: 64px
    position: fixed
    box-shadow: 0 0.5px 0 0 #E6E7E9
    background: $color-white
    height: 45px
    z-index: 999
  .scroll-view2
    position: relative
    padding-left: 9px
    z-index: 99
    display: block
    white-space: nowrap
    box-sizing: border-box
    transition: transform 0.3s
    transform: translate3d(0, 0, 0)
    height: 100%
    width: 100vw
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      box-sizing: border-box
      position: relative
      display: inline-block
      width: (100/3)%
      height: 100%
      line-height: 45px
      padding: 0 18px
      white-space: nowrap
      font-size: $font-size-16
      text-align: center
      transform-origin: 50%
      transition: all 0.2s
      .text
        font-size: $font-size-16
        font-family: $font-family-regular
        color: $color-text-assist
        line-height: 45px
    .item-active
      position: relative
      transition: font-size 0.2s
      transform-origin: 50%
      .text
        font-family: $font-family-medium
        color: $color-text-main
        line-height: 45px
    .line-box
      position: absolute
      width: (100/3)%
      height: 3px
      top: 42px
      left: 0
      display: flex
      justify-content: center
      transition: all 0.2s
      .line
        background: $color-main
        width: 30px
        border-radius: 3px
        height: 3px

  .big-box
    width: 100vw
    overflow: hidden
    .classify-big-box
      width: 300vw
      display: flex
      transform: translateX(0)
    .goods-list-box
      display: block
      width: 100vw

  .order-item
    padding: 0 15px 10px
    box-sizing: border-box
    margin-top: 10px
    background: $color-white
    .order-header
      height: 40px
      line-height: 40px
      display: flex
      justify-content: space-between
      .order-id
        layout(row)
        align-items: center
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
        .order-icon
          width: 15px
          height: @width
          margin-right: 6px
      .order-status
        line-height: 40px
        color: $color-main
        font-family: $font-family-regular
        font-size: $font-size-14
    .order-msg
      display: flex
      padding: 10px
      background: #fafafc
      border-radius: 2px
      .goods-img
        border-radius: 2px
        width: 90px
        height: @width
        margin-right: 10px
      .goods-msg
        flex: 1
        width: 0
        .goods-title
          no-wrap()
          color: $color-text-sub
          font-family: $font-family-medium
          font-size: $font-size-14
        .goods-buyer
          width: 100%
          display: flex
          flex-wrap: wrap
          margin-top: 11px
          font-size: $font-size-13
          font-family: $font-family-regular
          color: $color-text-secondary
          line-height: 1
        .goods-price
          margin-top: 26px
          display: flex
          align-items: center
          line-height: 1
          font-family: $font-family-regular
          .goods-tag
            box-sizing: border-box
            height: 16px
            font-size: $font-size-11
            padding: 2.5px 3px
            line-height: 1
            background: rgba(234,74,73,0.10)
            border-1px($color-money, 1px)
            border-radius: 1px
            margin-right: 4px
            color: $color-money
          .goods-money
            font-family: $font-family-medium
            font-size: $font-size-20
            color: $color-money

    .order-button
      padding-top: 10px
      .order-btn
        width: 100%
        height: 38px
        line-height: 38px
        text-align: center
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #ffffff
        background: $color-main
        border-radius: 2px
</style>
