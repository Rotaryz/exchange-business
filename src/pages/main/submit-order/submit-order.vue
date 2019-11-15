<template>
  <div class="submit-order">
    <navigation-bar title="提交订单"></navigation-bar>
    <div class="address-box">
      <div v-if="address.name" class="address-wrap" @click="goMyAddress">
        <img src="./icon-address@2x.png" class="address-icon">
        <div class="address-info">
          <div class="person">
            <span class="name">{{address.name}}</span>
            <span class="phone">{{address.mobile}}</span>
          </div>
          <div class="address">
            {{address.province}}{{address.city}}{{address.district}}{{address.address}}
          </div>
        </div>
        <img src="/static/images/icon-pressed_my@2x.png" class="arrow-right" style="width: 10px;height: 10px;">
      </div>
      <div v-else class="address-wrap no-address-wrap" @click="goAddAddress">
        <img src="./icon-address@2x.png" class="address-icon">
        <div class="address-info">
          请添加收货地址
        </div>
        <img src="/static/images/icon-pressed_my@2x.png" class="arrow-right" style="width: 10px;height: 10px;">
      </div>
      <img src="./pic-address@2x.png" class="address-image-border">
    </div>
    <ul>
      <li v-for="(item,i) in order.list" :key="i" class="goods-item">
        <div class="item-wrap">
          <img class="good-img" :src="item.image"  mode="aspectFill">
          <div class="info">
            <div class="name">{{item.name}}</div>
            <div class="spec">
              <span v-for="(sp,idx) in item.specification" :key="idx" class="spec-item">{{sp.name}}:{{sp.value}}</span>
            </div>
            <div class="count">
              <div class="price">¥<span class="price-num">{{item.price}}</span>
              </div>
              <div class="count">x <span class="count-num">{{item.count}}</span></div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="statistics">
      <div class="statistics-item">
        <div class="label">商品总价</div>
        <div>¥{{totalPrice}}</div>
      </div>
      <div class="statistics-item express-fee">
        <div class="label">快递运费</div>
        <div>¥{{totalLogistics}}</div>
      </div>
      <div class="statistics-item">
        <div class="label">实付金额</div>
        <div class="pay-money">¥{{payPrice}}</div>
      </div>
    </div>
    <div class="footer-wrap" :style="{height:statusBarHeight>20 ? '70px':''}" @click="getCode">
      <div class="footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
        <div class="total"><div class="total-text">合计金额：</div><span class="total-all-price"><span class="money-icon">¥</span><span class="num">{{payPrice}}</span></span></div>
        <form report-submit="true" @submit="$getFormId">
          <button formType="submit" class="button-primary submit-btn" open-type="getUserInfo" @getuserinfo="getCodeHandle">确认支付</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import { cartComputed, cartMethods } from '@state/helpers'

  const PAGE_NAME = 'SUBMIT_ORDER'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        address: {
          id: 0,
          name: '',
          mobile: 0,
          address: '',
          isAuth: false,
          encrypted_data: '',
          iv: '',
          code: ''
        }
      }
    },
    async onShow() {
      this.isAuth = !this.$storage('userInfo')
      let address = this.$storage('address')
      // console.log(address)
      this._getDefaultAddress(address)
      let codeMsg = await this.$wechat.login()
      this.code = codeMsg.code
    },
    // 页面销毁时
    onUnload() {
      this.SET_ORDER({ list: [], type: '' })
    },
    computed: {
      ...cartComputed,
      // 需要支付的总数
      payPrice() {
        if (!this.order.list.length) return 0
        // console.log('Number(this.totalLogistics) + Number(this.totalPrice)', Number(this.totalLogistics) + Number(this.totalPrice))
        return (Number(this.totalLogistics) + Number(this.totalPrice)).toFixed(2)
      },
      // 总运费
      totalLogistics() {
        if (!this.order.list.length) return 0
        let arr = this.order.list.map(item => item.logistics.price)
        // console.log(arr, 'totalLogistics')
        let total = arr.reduce((total, num) => {
          return Number(total) + Number(num)
        })
        // console.log('totalLogistics', total)
        total = Number(total).toFixed(2)
        return total
      },
      // 商品总价
      totalPrice() {
        if (!this.order.list.length) return 0
        let total = this.order.list.map(item => item.totalPrice).reduce((total, num) => {
          return Number(total) + Number(num)
        })
        // console.log('totalPrice', total)
        total = Number(total).toFixed(2)
        return total
      }
    },
    methods: {
      ...cartMethods,
      // 获取默认地址
      _getDefaultAddress(address) {
        console.log(address)
        if (address && address.name) {
          this.$set(this, 'address', address)
          this.$storage('address', {})
          return false
        }
        API.Address.getDefaultAddress({ loadding: false, toast: false }).then(res => {
          this.$set(this, 'address', res.data)
        }).catch(res => {
          // console.log('catch', res)
        })
      },
      // 去新增地址
      goAddAddress() {
        wx.navigateTo({ url: this.$routes.personalCenter.NEW_ADDRESS })
      },
      // 去地址页面选择地址
      goMyAddress() {
        wx.navigateTo({ url: this.$routes.personalCenter.MY_ADDRESS + '?save=1' })
      },
      async getCode() {
        let codeMsg = await this.$wechat.login()
        this.code = codeMsg.code
      },
      async getCodeHandle(e) {
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
        // 授权成功之后
        this.payOrder(customerId)
      },
      payOrder(customerId) {
        if (!this.address.id) {
          return wx.showToast({ title: '请选择收货地址', icon: 'none' })
        }
        let data = {}
        // console.log()
        if (this.order.type === 'goods_detail') {
          data.goods = this.order.list.map(item => {
            return {
              goods_id: item.id,
              goods_spec_id: item.spec_id,
              logistics_id: item.logistics.id,
              num: item.count
            }
          })
        } else {
          data.cart = this.order.list.map(item => {
            return {
              cart_id: item.id
            }
          })
        }
        data.address_id = this.address.id
        data.customer_id = customerId // 优化版本需要的id
        API.Cart.palceOrder({ data }).then(res => {
          let payRes = res.data.pay_config
          this._payFor(payRes).then(() => {
            wx.showToast({ title: '支付成功' })
            wx.redirectTo({ url: this.$routes.main.PAY_SUCCESS })
          }).catch(() => {
            wx.redirectTo({ url: this.$routes.personalCenter.ORDER_LIST })
          })
        })
      },
      // 确认支付下单
      submitBtn() {
        if (!this.address.id) {
          return wx.showToast({ title: '请选择收货地址', icon: 'none' })
        }
        this.payOrder()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .submit-order
    .address-box
      background: $color-white
      border-radius: 3px
      margin-top: 10px
      margin-bottom: 10px
      position: relative

      .address-wrap

        box-sizing: border-box
        height: 88px
        padding: 20px 14px 25px 14px
        display: flex

        &.no-address-wrap
          align-items: center

          .arrow-right
            margin-top: 0

        .arrow-right
          width: 6px
          height: 10px
          flex-shrink: 0
          margin-top: 20px
          margin-left: 20px

        .address-info
          flex: 1
          width: 0

          .person
            color: $color-text-main
            margin-bottom: 10px
            display: flex

          .name
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            font-size: $font-size-16
            font-family: $font-family-medium
            letter-spacing: 0.6px

          .phone
            margin-left: 14px
            font-size: $font-size-16
            font-family: $font-family-medium
            letter-spacing: 0.6px

          .address
            line-height: 16px
            padding: 0 10px 5px 0
            min-height: 37px
            font-size: $font-size-13
            font-family: $font-family-regular
            color: $color-text-secondary
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis

        .address-icon
          width: 15px
          height: 15px
          flex-shrink: 0
          margin-right: 5px

      .address-image-border
        position: absolute
        bottom: 0
        left: 0
        right 0
        height: 5px
        width: 100%

    .goods-item
      background-color: $color-white
      box-sizing: border-box
      padding: 0 10px

      .item-wrap
        display: flex
        align-items: center
        padding: 15px 0px
        height: 90px
        border-bottom-1px()

      .good-img
        flex-shrink: 0
        height: 100%
        width: 90px
        margin-right: 8px

      .info
        height: 100%
        flex: 1
        width: 0
        display: flex
        flex-direction: column
        justify-content: space-between

        .name
          color: $color-text-main
          font-size: $font-size-14
          letter-spacing: 0.6px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          font-family: $font-family-medium
          margin-top: 4px

        .spec
          color: $color-text-secondary
          font-size: $font-size-13
          letter-spacing: 0.6px
          margin-bottom: 14px

          .spec-item
            margin-right: 10px

        .count
          display: flex
          justify-content: space-between

          .price
            flex-shrink: 0
            display: flex
            align-items: flex-end
            color: $color-text-main
            font-size: $font-size-12

            .price-num
              font-size $font-size-18
              margin-left: 2px

            .vip-price-icon
              width: 33px
              height: 12px

          .count
            font-size: $font-size-12
            color: $color-text-sub

            .count-num
              font-size: $font-size-14
              margin-left: 2px

    .statistics
      background-color: $color-white
      padding: 15px 10px
      margin: 10px 0px

      .statistics-item
        display: flex
        align-items: center
        justify-content: space-between
        font-size: $font-size-14
        font-family: $font-family-medium

        .label
          color: $color-text-assist
          font-family: $font-family-regular

        .pay-money
          color: $color-money

        &.express-fee
          margin: 26px 0px

    .footer-wrap
      height: 50px

    .footer
      display: flex
      justify-content: space-between
      align-items: center
      height: 50px
      background-color: $color-white
      padding-left: 10px
      position: fixed
      bottom: 0px
      width: 100vw
      box-shadow: 0 -1px 0 0 $color-border

      .total
        margin-right: 10px
        display: flex
        align-items: flex-end
        .total-text
          font-size: $font-size-14
          line-height:14px
          margin-bottom:2px
        .total-all-price
          display: flex
          align-items: flex-end
          color: $color-money
          font-family: $font-family-medium
          margin-left: 2px
          .money-icon
            font-size: $font-size-14
            margin-right: 2px
            margin-bottom:1px
          .num
            font-size: $font-size-22
            line-height: 22px

      .submit-btn
        height: 50px
        line-height: 50px
        width: 130px


</style>
