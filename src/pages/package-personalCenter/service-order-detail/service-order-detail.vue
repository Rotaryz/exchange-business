<template>
  <div class="service-order-detail">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-header">
      <img src="./bg-order@2x.png" mode="aspectFill" class="header-bg">
      <div class="order-status">{{orderMsg.transaction_status_str}}</div>
      <!--<div class="order-time" v-if="orderMsg.status === 0">剩余 {{endTime}}</div>-->
    </div>
    <div class="goods-box">
      <div class="goods" v-for="(item, index) in orderMsg.detail" :key="index" v-if="orderMsg.detail">
        <img :src="item.goods_cover_image" mode="aspectFill" class="goods-img">
        <div class="goods-msg">
          <div class="goods-name">{{item.goods_name}}</div>
          <div class="sku">
            <!--<div v-for="(item, index) in item.goods_spec.specs_attrs" :key="index" class="sku-item">{{item.attr_key}}:{{item.attr_value}}</div>-->
          </div>
          <div class="goods-tariff">
            <div class="goods-price"><span class="goods-unit">¥</span>{{item.goods_price}}</div>
            <div class="goods-num">x{{item.goods_num}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods-total">
      <div class="goods-total-name">总价</div>
      <div class="goods-total-money">¥{{orderMsg.pay_amount}}</div>
    </div>
    <div class="order-information">
      <div class="information-msg">
        <div class="information-title">订单编号</div>
        <div class="information-price">{{orderMsg.order_sn}}</div>
        <div class="copy-btn" @click.stop="clipOrderId">复制</div>
      </div>
      <div class="information-msg">
        <div class="information-title">订单类型</div>
        <div class="information-price">{{orderMsg.type_str}}</div>
      </div>
      <div class="information-msg">
        <div class="information-title">创建时间</div>
        <div class="information-price">{{orderMsg.created_at}}</div>
      </div>
      <div class="information-msg">
        <div class="information-title">支付时间</div>
        <div class="information-price">{{orderMsg.pay_at}}</div>
      </div>
    </div>
    <div class="order-information" v-if="orderMsg.customer">
      <div class="information-msg">
        <div class="information-title">客户名称</div>
        <div class="information-price">{{orderMsg.customer.nickname}}</div>
      </div>
      <div class="information-msg">
        <div class="information-title">手机号码</div>
        <div class="information-price">{{orderMsg.customer.mobile}}</div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'SERVICE_ORDER_DETAIL'

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
    onLoad(option) {
      this.id = option.id || ''
      this._getOrderDetail()
    },
    methods: {
      _getOrderDetail() {
        let data = { id: this.id }
        API.Service.serviceDetail({
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
          data: this.orderMsg.order_sn
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  @import "~@design"
  .service-order-detail
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

  .goods-total
    border-top-1px($color-line)
    background: $color-white
    height: 44px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    padding: 0 15px
    .goods-total-name
      font-size: $font-size-14
      color: $color-text-assist
    .goods-total-money
      font-size: $font-size-14
      color :$color-main
      font-family :$font-family-medium

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
