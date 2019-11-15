<template>
  <div class="order-list">
    <navigation-bar title="订单列表"></navigation-bar>
    <div class="scroll-box" :style="{top: statusBarHeight + 'px'}">
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
        <!--<div :style="{left: move + 'px'}" class="line-box">-->
        <div :style="{left: (20 * tabIndex) + '%'}" class="line-box">
          <div class="line"></div>
        </div>
      </scroll-view>
    </div>

    <div class="big-box">
      <div class="classify-big-box"
           :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  width +'vw'}"
      >
        <div
          v-for="(tabItem, tabInx) in orderList" :key="tabInx"
          :style="{height: tabIndex * 1 === tabInx ? -1 : scrollHeight + 'px'}"
          class="goods-list-box"
        >
          <div class="order" v-if="isShowSheet">
            <!--状态为全部、待付款时的展示样式（显示子单）-->
            <div v-for="(item, index) in tabItem.arr" :key="index" class="order-item">
              <div class="order-header">
                <img src="./icon-order@2x.png" class="order-icon">
                <p class="order-sn">{{item.order_sn}}</p>
              </div>
              <div class="goods-box">
                <div class="goods-item" v-if="item.sub_order" v-for="(good, goodIdx) in item.sub_order" :key="goodIdx" @click="jumpDetail(good)">
                  <div class="goods-header">
                    <div class="goods-id">ID
                      <div class="goods-tip">{{good.sub_order_sn}}</div>
                    </div>
                    <div class="order-status">{{good.status_str}}</div>
                  </div>
                  <div class="goods">
                    <img v-if="good.detail" :src="good.detail.goods_cover_image" mode="aspectFill" class="goods-img">
                    <div class="goods-msg">
                      <div class="goods-name">{{good.detail.goods_name}}</div>
                      <div class="sku">
                        <div class="sku-item">数量:{{good.detail.goods_num}}</div>
                        <div v-for="(sku, skuIdx) in good.detail.goods_spec.specs_attrs" :key="skuIdx" class="sku-item">{{sku.attr_key}}:{{sku.attr_value}}</div>
                      </div>
                      <div class="goods-tariff">
                        小计：
                        <div class="goods-price"><span class="goods-unit">¥</span>{{good.pay_amount}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--<div class="show-more" v-if="item.sub_order && item.sub_order.length > 1" @click.stop="showMore(item.sub_order.length, index)">-->
              <!--<p class="show-text">{{item.height === 145 ? '展开订单' : '收起订单'}}</p>-->
              <!--<img src="./icon-downpre@2x.png" class="show-icon" :class="{'show-icon-active' : item.height > 145}">-->
              <!--</div>-->
              <div class="goods-total">
                共<p class="goods-num">{{item.goods_num_total}}</p>件商品
                <p class="goods-money-text">合计: </p>
                <p class="goods-unit">¥</p>
                <p class="goods-money">{{item.pay_amount_total}}</p>
              </div>
              <div class="orderPay" v-if="item.sub_order && item.sub_order[0].status === 0" @click="getCode">
                <!--<div class="order-btn" @click="orderRepay(item.id, index)">立即付款</div>-->
                <button class="order-btn" open-type="getUserInfo" @getuserinfo="getCodeHandle($event,item.id, index)">立即付款</button>
              </div>
            </div>
            <empty v-if="tabItem.isEmpty" :image="empty" :paddingTop="100" tip="你的订单是空的"></empty>
            <!--状态为已完成、待发货、待收货时的展示样式（不显示子单）-->
          </div>
          <div class="order" v-else>
            <div v-for="(item, index) in tabItem.arr" :key="index" class="order-item" @click="jumpDetail(item)">
              <div class="goods-item">
                <div class="goods-header goods-header-sub">
                  <div class="goods-id">ID
                    <div class="goods-tip">{{item.sub_order_sn}}</div>
                  </div>
                  <div class="order-status">{{item.status_str}}</div>
                </div>

                <div class="goods" v-if="item.detail">
                  <img :src="item.detail.goods_cover_image" mode="aspectFill" class="goods-img">
                  <div class="goods-msg">
                    <div class="goods-name">{{item.detail.goods_name}}</div>
                    <div class="sku">
                      <div class="sku-item">数量:{{item.detail.goods_num}}</div>
                      <div v-for="(sku, skuIdx) in item.detail.goods_spec.specs_attrs" :key="skuIdx" class="sku-item">{{sku.attr_key}}:{{sku.attr_value}}</div>
                    </div>
                    <div class="goods-tariff">
                      小计：
                      <div class="goods-price"><span class="goods-unit">¥</span>{{item.goods_amount}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="goods-total">
                共<p class="goods-num" v-if="item.detail">{{item.detail.goods_num}}</p>件商品
                <p class="goods-money-text">合计: </p>
                <p class="goods-unit">¥</p>
                <p class="goods-money">{{item.pay_amount}}</p>
              </div>
            </div>
            <empty v-if="tabItem.isEmpty" :image="empty" :paddingTop="100" tip="你的订单是空的"></empty>
          </div>
          <loading-more v-if="tabItem.isLoading"></loading-more>
          <isEnd v-if="tabItem.isEnd"></isEnd>
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
  import LoadingMore from '@components/loading-more/loading-more'
  import IsEnd from '@components/is-end/is-end'

  const PAGE_NAME = 'ORDER_LIST'
  const NAV_LIST = [
    { name: '全部', status: '' },
    { name: '待付款', status: '0' },
    { name: '待发货', status: '10' },
    { name: '待收货', status: '20' },
    { name: '已完成', status: '100' }
  ]
  const ARR = { arr: [], classifyMore: false, isEmpty: false, lastPage: 2, page: 1, height: 145, isEnd: false, isLoading: false }
  const EMPTY = require('./pic-order@2x.png')
  const SHOW_INDEX = [0, 1]
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty,
      LoadingMore,
      IsEnd
    },
    data() {
      return {
        empty: EMPTY,
        navList: NAV_LIST,
        viewToItem: 'item0',
        boxTransition: 'all .3s',
        move: 0,
        tabIndex: 0,
        statusBarHeight: 64,
        orderList: [],
        width: NAV_LIST.length * 100,
        status: '',
        page: 1,
        winHeight: 667,
        code: '',
        encrypted_data: '',
        iv: ''
      }
    },
    computed: {
      isShowSheet() {
        let show = SHOW_INDEX.findIndex((item) => item === this.tabIndex)
        return show !== -1
      },
      methodsName() {
        let name = this.tabIndex === 0 || this.tabIndex === 1 ? 'order' : 'subOrder'
        return name
      },
      scrollHeight() {
        let height = this.winHeight - this.statusBarHeight - 45
        return height
      }
    },
    // 翻页
    onPullDownRefresh() {
      if (this.orderList.length) {
        this.orderList[this.tabIndex].page = 1
      }
      this.getOrderList(true)
      wx.stopPullDownRefresh()
    },
    onReachBottom() {
      if (this.orderList[this.tabIndex].page >= this.orderList[this.tabIndex].lastPage) {
        this.orderList[this.tabIndex].isEnd = !!this.orderList[this.tabIndex].arr.length
        return
      }
      this.orderList[this.tabIndex].page++
      this.orderList[this.tabIndex].isLoading = true
      this.getOrderList()
    },
    async onLoad(option) {
      this.status = option.status || ''
      let index = this.navList.findIndex((item) => item.status === this.status)
      this.orderList = this.navList.map(() => {
        return ARR
      })
      this._changeTab(index)
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight ? res.statusBarHeight + 44 : 64
      this.winHeight = res.screenHeight
      this.getOrderList(true)
    },
    onShow() {
      this.orderList[this.tabIndex].page = 1
      this.getOrderList(true)
      this._changeTab(this.tabIndex)
    },
    methods: {
      async getCode() {
        let codeMsg = await this.$wechat.login()
        this.code = codeMsg.code
      },
      // 重新支付，重新授权绑定
      async getCodeHandle(e, id, index) {
        let userInfo = this.$storage('userInfo')
        if (e.mp.detail.errMsg !== 'getUserInfo:ok') return
        this.iv = e.target.iv
        this.encrypted_data = e.target.encryptedData
        const authData = {
          code: this.code,
          iv: this.iv,
          encrypted_data: this.encrypted_data,
          shop_id: userInfo.shop_id
        }
        let res = await API.Login.auth({
          data: authData,
          toast: false,
          doctor: async () => {
            let codeMsg = await this.$wechat.login()
            this.code = codeMsg.code
          }
        })
        let customerId = res.data.id
        this.orderRepay(id, index, customerId)
      },
      // 重新支付
      orderRepay(id, index, customerId) {
        API.Order.orderRepay({ data: { order_id: id, customer_id: customerId } })
          .then((res) => {
            let payRes = res.data.pay_config
            const { timestamp, nonceStr, signType, paySign } = payRes
            wx.requestPayment({
              timeStamp: timestamp,
              nonceStr,
              package: payRes.package,
              signType,
              paySign,
              success: async () => {
                let codeMsg = await this.$wechat.login()
                this.code = codeMsg.code
                // this.orderList[this.tabIndex].arr.splice(index, 1)
              }
            })
          })
          .catch(async () => {
            let codeMsg = await this.$wechat.login()
            this.code = codeMsg.code
          })
      },
      jumpDetail(item) {
        wx.navigateTo({ url: `${this.$routes.personalCenter.ORDER_DETAIL}?id=${item.id}` })
      },
      // 展开订单
      showMore(num, index) {
        let height = this.orderList[this.tabIndex].arr[index].height === 145 ? num * 145 : 145
        this.orderList[this.tabIndex].arr[index].height = height
      },
      // 切换tab
      _changeTab(index, id, e) {
        if (this.tabIndex === index) return
        // this.move = 86 * index
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
      // 跳转导航
      _setViewToItem(index = 0) {
        this.tabIndex = index
        // let number = index < 3 ? 0 : index - 2
        // this.viewToItem = `item${number}`
      },
      // 获取订单列表
      getOrderList(loading = false) {
        let data = { status: this.navList[this.tabIndex].status, page: this.orderList[this.tabIndex].page }
        API.Order[this.methodsName]({ data, loading })
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
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .order-list
    overflow-x: hidden
    box-sizing: border-box
    margin-top: 45px

  .scroll-box
    top: 64px
    position: fixed
    box-shadow: 0 0.5px 0 0 #E6E7E9
    background: $color-white
    height: 45px
    z-index: 999

  .scroll-view2
    position: relative
    padding: 0 5px
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
      white-space: nowrap
      font-size: $font-size-16
      text-align: center
      display: inline-block
      position: relative
      height: 100%
      line-height: 45px
      transform-origin: 50%
      transition: all 0.2s
      width: 20%
      .text
        font-family: $font-family-regular
        color: $color-text-assist
        line-height: 45px
    .item-active

      font-size: $font-size-16
      color: $color-text-main
      position: relative
      transition: font-size 0.2s
      transform-origin: 50%
      .text
        font-family: $font-family-medium
        color: $color-text-main
        line-height: 45px

  .line-box
    position: absolute
    width: 20%
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
    background: $color-white
    box-sizing: border-box
    margin-bottom: 10px
    .order-header
      align-items: center
      display: flex
      padding: 13px 10px
      .order-sn
        font-size: $font-size-14
        line-height: 1
        color: $color-text-main
      .order-icon
        margin-right: 6px
        width: 15px
        height: @width
    .goods-item
      margin: 0 10px
      background: #FAFAFC
      margin-bottom: 5px
      &:last-child
        margin-bottom: 0
      .goods-header
        display: flex
        justify-content: space-between
        align-items: center
        padding: 13px 10px 0
        box-sizing: border-box
        .goods-id
          display: flex
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
          .goods-tip
            margin-left: 6px
        .order-status
          color: $color-main
          font-size: $font-size-14
      .goods-header-sub
        padding-bottom: 13px
        background: $color-white
      .goods
        padding: 10px
        box-sizing: border-box
        display: flex
        .goods-img
          border-radius: 3px
          background: $image-color
          width: 90px
          min-width: @width
          min-height: @width
          height: @width
        .goods-msg
          margin-left: 10px
          flex: 1
          box-sizing: border-box
          width: 0
          flex-wrap: wrap
          .goods-name
            no-wrap()
            margin-top: 4px
            font-family: $font-family-medium
            color: $color-text-sub
            font-size: $font-size-14
            line-height: 1
          .sku
            display: flex
            flex-wrap: wrap
            margin-top: 8.7px
            font-size: $font-size-13
            font-family: $font-family-regular
            line-height: 1.2
            color: $color-text-secondary
            .sku-item
              margin-right: 10px
              white-space: nowrap
              color: #818D99
        .goods-tariff
          display: flex
          align-items: flex-end
          line-height: 1
          margin-top: 25.7px
          font-size: $font-size-13
          color: $color-text-main
          font-family: $font-family-regular
          .goods-price
            transform: translateY(2px)
            font-size: $font-size-16
            color: $color-money
            line-height: 1
            .goods-unit
              line-height: 1
              font-size: $font-size-12
    .show-more
      height: 35px
      display: flex
      align-items: center
      justify-content: center
      background: #FAFAFC
      color: $color-text-main
      font-size: $font-size-13
      .show-icon
        transform-origin: 50%
        transition: all 0.2s
        width: 8.5px
        height: 4.5px
        margin-left: 4.5px
      .show-icon-active
        transform: rotate(180deg)
    .goods-total
      padding: 14px 10px
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      align-items: flex-end
      display: flex
      line-height: 1
      justify-content: flex-end
      .goods-num
        letter-spacing: 0.6px
        line-height: 1
        font-family: $font-family-medium
      .goods-money-text
        margin-left: 4px
        line-height: 1
      .goods-unit
        color: $color-main
        font-size: $font-size-12
        font-family: $font-family-medium
        margin-left: 2px
        line-height: 1
      .goods-money
        color: $color-main
        line-height: 1
        font-size: $font-size-18
        font-family: $font-family-medium

  .goods-box
    overflow: hidden
    transition: all 0.3s

  .orderPay
    height: 49.5px
    display: flex
    align-items: center
    justify-content: flex-end
    border-top-1px($color-line)
    padding: 0 10px
    .order-btn
      color: $color-white
      font-size: $font-size-14
      font-family: $font-family-regular
      line-height: 28px
      border-radius: 2px
      width: 83px
      text-align: center
      background: $color-main
</style>
