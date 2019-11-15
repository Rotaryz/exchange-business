<template>
  <div class="order-detail">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-header">
      <img src="./bg-order@2x.png" mode="aspectFill" class="header-bg">
      <div class="order-status">{{orderMsg.status_str}}</div>
      <div class="order-time" v-if="orderMsg.status === 0">剩余 {{endTime}}</div>
    </div>
    <div class="address">
      <div class="add-user">
        <img src="./icon-address@2x.png" class="add-icon">
        <div class="user-name">{{orderMsg.receiver_addresses ? orderMsg.receiver_addresses.name : ''}}</div>
        <div class="user-phone">{{orderMsg.receiver_addresses ? orderMsg.receiver_addresses.mobile : ''}}</div>
      </div>
      <div class="address-msg">{{address}}</div>
    </div>
    <div class="goods-box">
      <div class="goods" v-if="orderMsg.detail">
        <img :src="orderMsg.detail.goods_cover_image" mode="aspectFill" class="goods-img">
        <div class="goods-msg">
          <div class="goods-name">{{orderMsg.detail.goods_name}}</div>
          <div class="sku">
            <div v-for="(item, index) in orderMsg.detail.goods_spec.specs_attrs" :key="index" class="sku-item">{{item.attr_key}}:{{item.attr_value}}</div>
          </div>
          <div class="goods-tariff">
            <div class="goods-price"><span class="goods-unit">¥</span>{{orderMsg.detail.goods_spec.sale_price}}</div>
            <div class="goods-num">x{{orderMsg.detail.goods_num}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-information">
      <div class="information-item">
        <div class="information-title">商品总价</div>
        <div class="information-price">¥{{orderMsg.goods_amount}}</div>
      </div>
      <div class="information-item">
        <div class="information-title">快递运费</div>
        <div class="information-price">¥{{orderMsg.freight_amount}}</div>
      </div>
      <div class="information-item">
        <div class="information-title">实付金额</div>
        <div class="information-price information-total">¥{{orderMsg.pay_amount}}</div>
      </div>
    </div>
    <div class="order-information">
      <div class="information-msg">
        <div class="information-title">订单编号</div>
        <div class="information-price">{{orderMsg.sub_order_sn}}</div>
        <div class="copy-btn" @click.stop="clipOrderId">复制</div>
      </div>
      <div class="information-msg">
        <div class="information-title">下单时间</div>
        <div class="information-price">{{orderMsg.created_at}}</div>
      </div>
      <div v-if="orderMsg.status === 10 || orderMsg.status === 20 || orderMsg.status === 100" class="information-msg">
        <div class="information-title">支付单号</div>
        <div class="information-price">{{orderMsg.transaction ? orderMsg.transaction.transaction_sn : ''}}</div>
      </div>
      <div v-if="orderMsg.status === 10 || orderMsg.status === 20 || orderMsg.status === 100" class="information-msg">
        <div class="information-title">支付时间</div>
        <div class="information-price">{{orderMsg.transaction ? orderMsg.transaction.pay_at : ''}}</div>
      </div>
    </div>
    <form class="order-btn" v-if="orderMsg.status === 20 || orderMsg.status === 100">
      <button @click="logisticsDetail" class="btn" v-if="orderMsg.status === 20 || orderMsg.status === 100">查看物流</button>
      <button class="btn" @click="confirmReceipt" v-if="orderMsg.status === 20">确认收货</button>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'ORDER_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        orderMsg: {},
        id: '',
        timeArr: [],
        endTime: '00:00:00'
      }
    },
    computed: {
      address() {
        if (!this.orderMsg.receiver_addresses) return ''
        let { province, city, district, address } = this.orderMsg.receiver_addresses
        return `${province} ${city} ${district} ${address}`
      }
    },
    onLoad(option) {
      this.id = option.id || ''
      this._getOrderDetail()
    },
    methods: {
      logisticsDetail() {
        wx.navigateTo({ url: `${this.$routes.personalCenter.LOGISTICS_INFOMATION}?id=${this.id}` })
      },
      confirmReceipt() {
        let data = { sub_order_id: this.id }
        API.Order.confirmReceipt({ data })
          .then((res) => {
            this._getOrderDetail()
          })
          .catch(() => {
          })
      },
      _getOrderDetail() {
        let data = { id: this.id }
        API.Order.orderDetail({
          data,
          doctor() {
            this.orderMsg = {}
          }
        })
          .then((res) => {
            this.orderMsg = res.data
            if (this.orderMsg.status === 0) {
              this._timePlay()
            }
          })
      },
      clipOrderId() {
        wx.setClipboardData({
          data: this.orderMsg.sub_order_sn
        })
      },
      // 团购倒计时
      _timePlay() {
        clearInterval(this.timer)
        let res = this._groupTimeCheckout(this.orderMsg.close_time)
        this.endTime = `${res.hour}:${res.minute}:${res.second}`
        this.timer = setInterval(() => {
          let res = this._groupTimeCheckout(this.orderMsg.close_time)
          this.endTime = `${res.hour}:${res.minute}:${res.second}`
          if (this.timeEnd) {
            clearInterval(this.timer)
          }
        }, 1000)
      },
      // 引入时间戳（秒）换算出时间差
      _groupTimeCheckout(time) {
        let nowSecond = parseInt(Date.now() / 1000)
        let differ = time * 1 - nowSecond
        let hour = Math.floor(differ / (60 * 60))
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            hour,
            minute,
            second
          }
        } else {
          times = {
            hour: '00',
            minute: '00',
            second: '00'
          }
          this.timeEnd = true
        }
        return times
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .order-detail
    padding-bottom: 60px
    box-sizing: border-box

  div, p
    word-break: break-all

  .order-header
    position: relative
    height: 18.667vw
    display: flex
    align-items: center
    padding: 0 20px 0 30px
    box-sizing: border-box
    justify-content: space-between
    .header-bg
      position: absolute
      width: 100%
      height: 100%
      left: 0
      top: 0
    .order-status
      font-family: $font-family-medium
      font-size: $font-size-18
      position: relative
      z-index: 1
      color: $color-white
    .order-time
      font-family: $font-family-regular
      font-size: $font-size-16
      position: relative
      z-index: 1
      color: $color-white

  .address
    background: $color-white
    padding: 15px 10.5px
    .add-user
      font-size: 4.2667vw
      color: $color-text-main
      display: flex
      flex-wrap: wrap
      box-sizing: border-box
      align-items: center
      line-height: 1
      .user-phone
        font-family: $font-family-medium
        margin-left: 20px
      .user-name
        font-family: $font-family-medium
        word-break: break-all
      .add-icon
        height: 15px
        min-height: 15px
        margin-right: 7px
        width: 15px
        min-width: 15px
    .address-msg
      padding: 0 20px
      margin-top: 9px
      line-height: 18px
      color: $color-text-assist
      font-family: $font-family-regular
      font-size: 3.7333vw

  .goods
    margin-top: 10px
    padding: 15px 10px
    box-sizing: border-box
    background: $color-white
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
      .sku
        display: flex
        flex-wrap: wrap
        margin-top: 9px
        font-size: $font-size-13
        font-family: $font-family-regular
        line-height: 1.2
        color: $color-text-secondary
        min-height: 16px
        .sku-item
          margin-right: 10px
          white-space: nowrap
          color: #818D99
    .goods-tariff
      display: flex
      align-items: flex-end
      line-height: 1
      justify-content: space-between
      margin-top: 20px
      .goods-price
        font-size: $font-size-18
        color: $color-text-main
        font-family: $font-family-regular
        .goods-unit
          font-size: $font-size-12
      .goods-num
        font-size: 12px
        color: $color-text-sub

  .order-information
    padding: 2px 10px
    box-sizing: border-box
    margin-top: 10px
    background: $color-white
    .information-item
      padding: 13px 0
      display: flex
      font-family: $font-family-regular
      justify-content: space-between
    .information-title
      font-size: $font-size-14
      color: $color-text-assist
    .information-price
      line-height: 1
      font-size: $font-size-14
      color: $color-text-main
    .information-total
      font-family: $font-family-medium
      color: $color-money

  .information-msg
    padding: 13px 0
    display: flex
    font-family: $font-family-regular
    position: relative
    .information-price
      font-size: $font-size-14
      margin-left: 20.5px

  .copy-btn
    width: 54px
    height: 20px
    border-1px(#D2D2D2, 10px)
    col-center()
    right: 0
    text-align: center
    line-height: 20px
    box-sizing: border-box
    font-family: $font-family-regular
    font-size: $font-size-12
    color: $color-text-main
    letter-spacing: 0.3px

  .order-btn
    box-shadow: 0 -1px 0 0 #EFEEF5
    position: fixed
    bottom: 0
    left: 0
    height: 50px
    padding: 0 10px
    box-sizing: border-box
    background: $color-white
    display: flex
    align-items: center
    justify-content: flex-end
    width: 100vw
    .btn
      font-size: $font-size-14
      font-family: $font-family-regular
      height: 28px
      line-height: 28px
      width: 83px
      text-align: center
      display: inline-block
      border-radius: 2px
      margin-left: 10px
      border-1px(#D2D2D2, 2px)
      color: $color-text-main
      &:last-child
        border-1px($color-main, 2px)
        color: $color-main
</style>
