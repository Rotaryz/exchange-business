<template>
  <div class="mine">
    <navigation-bar ref="navigationBar"
                    title="我的"
                    :showArrow="false"
                    :translucent="true"
                    :isOpacity="true"
                    arrowColor="white"
    ></navigation-bar>
    <header class="my-header">
      <img src="./bg-my@2x.png" class="my-bg">
      <div class="user-info">
        <div class="user-left">
          <img :src="userInfo.avatar" class="portrait">
          <div class="user-msg">
            <div class="user-name">{{userInfo.name}}</div>
            <img :src="jurisdiction[userInfo.shop_level_id]" alt="" class="label-img">
            <form report-submit="true" @submit="$getFormId">
              <button formType="submit" class="submit-inline" @click="openVip">
                <img v-if="userInfo.shop_level_id * 1 !== 3" src="./pic-vipmembers@2x.png" class="label-img label-img-up">
              </button>
            </form>
          </div>
        </div>
        <div class="user-right">
          <form report-submit="true" @submit="$getFormId">
            <button formType="submit" class="user-right" @click="improving">
              <i v-if="!userInfo.is_completed" class="user-tip"></i>
              <img src="./icon-sz@2x.png" alt="" class="settings">
            </button>
          </form>
        </div>
      </div>
    </header>

    <div class="mine-content">
      <!--采购订单-->
      <div class="my-order">
        <div class="order-header">
          <div class="order-title">采购订单</div>
          <div class="all-order" @click="navigateOrder">
            <p class="all-title">全部订单</p>
            <img mode="widthFix" src="/static/images/icon-pressed_my@2x.png" class="way">
          </div>
        </div>
        <div class="order-box">
          <div v-for="(item, index) in order" :key="index" class="order-item" @click="navigateOrder(item)">
            <img :src="item.image" class="order-img">
            <div class="order-title">{{item.name}}</div>
          </div>
        </div>
      </div>
      <!--我的资产-->
      <div class="my-assets">
        <div class="assets-header" @click="GoToProperty">
          <div class="assets-title">我的资产</div>
          <div class="assets-tip">可提现总补贴 {{moneyInfo.total_remaining}} 元<img mode="widthFix" src="/static/images/icon-pressed_my@2x.png" alt="" class="way">
          </div>
        </div>
        <div class="assets">
          <div class="assets-item">
            <div class="assets-money">{{moneyInfo.business_total_remaining}}</div>
            <div class="assets-text">业务补贴(元)</div>
          </div>
          <div class="line"></div>
          <div class="assets-item assets-item-end">
            <div class="assets-money">{{moneyInfo.goods_total_remaining}}</div>
            <div class="assets-text">商品补贴(元)</div>
          </div>
        </div>
      </div>
      <!--企业会员管理-->
      <div class="vip-manager">
        <div class="vip-title">企业管理</div>
        <div class="vip-content">
          <div class="vip-item vip-item-left" @click="jumpVip">
            <img src="./icon-qyvip@2x.png" class="vip-icon">
            <div class="vip-msg">
              <div class="vip-name">企业会员</div>
              <div class="vip-tip">已有<span class="vip-num">{{userInfo.sub_shop_count || 0}}</span>个会员</div>
            </div>
          </div>
          <div class="vip-item" @click="showShareNum">
            <img src="./icon-mycode@2x.png" class="vip-icon">
            <div class="vip-msg">
              <div class="vip-name">我的分享码</div>
              <div v-if="(userInfo.is_completed === 0 && userInfo.shop_level_id === 0) || userInfo.agent_share_code === '会员邀请码'" class="vip-tip">会员邀请码</div>
              <div v-else class="vip-share-code">{{userInfo.agent_share_code}}</div>
            </div>
          </div>
        </div>
      </div>
      <!--兑换商城管理-->
      <div class="exchange-mall">

        <div class="exchange-title">
          <div class="title-text">商城管理</div>
          <div class="shop-view" @click="showShopImg">
            <div class="shop-name">商城预览</div>
            <img src="./icon-preview@2x.png" alt="" class="shop-icon">
          </div>
        </div>
        <div class="exchange-list">
          <div v-for="(item, index) in exchange" :key="index" class="exchange-item" @click="jumpPage(item, true)">
            <div class="exchange-item-small">
              <img :src="item.image" class="exchange-icon">
              <p class="exchange-name">{{item.name}}</p>
            </div>

          </div>
        </div>
      </div>
      <!--营销活动-->
      <div class="exchange-mall">
        <div class="exchange-title">营销活动</div>
        <div class="exchange-list">
          <div v-for="(item, index) in market" :key="index" class="exchange-item" @click="jumpPage(item, true)">
            <div class="exchange-item-small">
              <img :src="item.image" class="exchange-icon">
              <p class="exchange-name">{{item.name}}</p>
            </div>

          </div>
        </div>
      </div>
      <!--ai -->
      <notification-regimental ref="notification" :customerCount="customerCount"></notification-regimental>
    </div>
    <!--开头vip的弹窗-->
    <vip-popup :confirmText="showType === 0 ? '立即升级' : '立即完善'" popUpType="confirm" :tip="showType === 0 ? '升级为代理商，享受更多权益！' : '请先完善资料！'" :showPopup.sync="showPopup" @confirm="goOpenVip"></vip-popup>
    <!--分享码的弹窗  shareNum为分享码的参数-->
    <copy-popup popUpType="copy" :shareNum="userInfo.agent_share_code" text="我的分享码" :isSituationClose="true" :showPopup.sync="showCopy"></copy-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import AppPromise from '@utils/app-promise'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import routes from '@utils/routes'
  import API from '@api'
  import Popup from './popup/popup'
  import { baseURL } from '@utils/config'
  import { PROJECT } from '@utils/constant'
  import NotificationRegimental from './notification-regimental/notification-regimental'
  import Notification from './notification'
  import { isEmptyObject } from '@utils/common'

  const PAGE_NAME = 'MINE'
  const ORDER = [
    { name: '待付款', image: require('./icon-payment@2x.png'), status: 0 },
    { name: '待发货', image: require('./icon-shipments@2x.png'), status: 10 },
    { name: '待收货', image: require('./icon-receiving@2x.png'), status: 20 },
    { name: '已完成', image: require('./icon-complete@2x.png'), status: 100 }
  ]
  const EXCHANGE = [
    { name: '订单核销', image: require('./icon-ddhx@2x.png'), path: routes.shopManage.VERIFY, isJump: true, message: '' },
    { name: '服务', image: require('./icon-service_manage@2x.png'), path: routes.active.SERVICE, isJump: true, message: '' },
    { name: '兑换商品', image: require('./icon-exchange_goods@2x.png'), path: routes.shopManage.GOODS_MANAGE, isJump: true, message: '' },
    { name: '会员管理', image: require('./icon-hygl@2x.png'), path: routes.shopManage.MEMBER_MANAGE, isJump: true, message: '' },
    { name: '订单管理', image: require('./icon-dhdd@2x.png'), path: routes.personalCenter.SERVICE_ORDER, isJump: true, message: '' },
    { name: '商城收入', image: require('./icon-tmall_moeny@2x.png'), path: routes.personalCenter.SHOP_INCOME, isJump: true, message: '' },
    { name: '兑换记录', image: require('./icon-exchange_records@2x.png'), path: routes.shopManage.EXCHANGE_ORDER, isJump: true, message: '' },
    // { name: '小程序码', image: require('./icon-rwm@2x.png'), path: '', isJump: false, message: '' }, // 小程序码直接预览图片
    // { name: '商城预览', image: require('./icon-scyl@2x.png'), path: '', isJump: false, message: '' },
    { name: '基础信息', image: require('./icon-jcxx@2x.png'), path: routes.shopManage.SETTING, isJump: true, message: '' }
  ]
  const MARKET = [
    { name: '赠送', image: require('./icon-give@2x.png'), path: routes.shopManage.RECHARGE, isJump: true, message: '' },
    { name: '拼团', image: require('./icon-assemble@2x.png'), path: `${routes.active.ACTIVITY}?type=1`, isJump: true, message: '' },
    { name: '砍价', image: require('./icon-bargain@2x.png'), path: `${routes.active.ACTIVITY}?type=4`, isJump: true, message: '' },
    { name: '大转盘', image: require('./icon-big_turntable@2x.png'), path: routes.active.WHEEL_EDIT, isJump: true, message: '' },
    { name: '裂变分销', image: require('./icon-fission@2x.png'), path: routes.active.SHARE_LIST, isJump: true, message: '' }
  ]
  const JURISDICTION = { 0: require('./pic-vippt@2x.png'), 1: require('./pic-vipbz@2x.png'), 2: require('./pic-vipqn@2x.png'), 3: require('./pic-viphh@2x.png') }
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      'vip-popup': Popup,
      'copy-popup': Popup,
      NotificationRegimental
    },
    data() {
      return {
        exchange: EXCHANGE,
        jurisdiction: JURISDICTION,
        market: MARKET,
        order: ORDER,
        count: 0,
        userInfo: {},
        showPopup: false,
        showCopy: false,
        moneyInfo: {},
        showTip: '升级为代理商，享受更多权益！',
        showType: 0,
        customerCount: 0
      }
    },
    onLoad() {
    },
    onShow() {
      this._getCustomerCount()
      this.getUserInfo()
      this.getUserMoneyInfo()
      Notification.getInstance().connect() // 连接
      this._onSocketMsg()
    },
    onUnload() {
      Notification.getInstance().destroy()
      this.$refs.navigationBar && this.$refs.navigationBar._initHeadStyle()
    },
    methods: {
      // 获取用户访问次数
      _getCustomerCount(loading = false, callback) {
        API.Ai.getCustomerCount({ data: {}, loading, toast: false }).then((res) => {
          this.customerCount = res.data.customer_count
          let msg = res.data.msg || {}
          msg = isEmptyObject(msg) ? {} : Object.assign({}, msg, msg.param)
          !isEmptyObject(msg) && this.$refs.notification && this.$refs.notification._action(msg)
        })
      },
      // 监听socketMSG
      _onSocketMsg() {
        Notification.getInstance().on((msg) => {
          console.warn('收到socket信息...', msg)
          try {
            let data = JSON.parse(msg.data)
            let obj = Object.assign({}, data, data.param)
            this.$refs.notification && this.$refs.notification._action(obj)
          } catch (e) {
            console.error(e, '接受数据失败！')
          }
        })
      },
      // 查看分享码
      showShareNum() {
        if (this.userInfo.is_completed === 0) {
          this.showType = 1
          this.showPopup = true
          return
        }
        if (this.userInfo.shop_level_id === 0) {
          this.showType = 0
          this.showPopup = true
          return
        }
        this.showCopy = true
      },
      // 跳转开通会员的页面
      goOpenVip() {
        if (this.showType === 1) {
          wx.navigateTo({ url: `${this.$routes.personalCenter.IMPROVING_DATA}` })
          return
        }
        let pageUrl = process.env === 'production' ? '/level-upgrade' : '/#/level-upgrade'
        wx.navigateTo({ url: `${this.$routes.main.OUT_HTML}?pageRoute=${pageUrl}&project=${PROJECT.EXCHANGE_PLATFORM}&levelId=${this.userInfo.shop_level_id}` })
      },
      // 开通会员的弹窗
      openVip() {
        if (this.userInfo.is_completed === 0) {
          this.showType = 1
          this.showPopup = true
          return
        }
        let pageUrl = process.env === 'production' ? '/level-upgrade' : '/#/level-upgrade'
        wx.navigateTo({ url: `${this.$routes.main.OUT_HTML}?pageRoute=${pageUrl}&project=${PROJECT.EXCHANGE_PLATFORM}&levelId=${this.userInfo.shop_level_id}` })
      },
      getUserInfo() {
        API.Mine.getUserInfo({
          data: {},
          loading: false
        })
          .then((res) => {
            this.userInfo = res.data.shop_info
            this.$storage('userInfo', res.data.shop_info)
          })
          .catch(() => {
            this.userInfo = this.$storage('userInfo')
          })
      },
      getUserMoneyInfo() {
        API.Manager.getUserMoney({
          data: {},
          loading: false
        })
          .then((res) => {
            this.moneyInfo = res.data
          })
      },
      improving() {
        wx.navigateTo({ url: this.$routes.personalCenter.PERSONAL_SETTINGS })
      },
      GoToProperty() {
        wx.navigateTo({ url: this.$routes.personalCenter.PROPERTY })
      },
      jumpVip() {
        if (this.userInfo.is_completed === 0) {
          this.showType = 1
          this.showPopup = true
          return
        }
        if (this.userInfo.shop_level_id === 0) {
          this.showType = 0
          this.showPopup = true
          return
        }
        wx.navigateTo({ url: this.$routes.personalCenter.ENTERPRISE_USER_MANAGEMENT })
      },
      jumpPage(item, type) {
        if (this.userInfo.is_completed === 0) {
          this.showType = 1
          this.showPopup = true
          return
        }
        if (this.userInfo.shop_level_id === 0 && type) {
          this.showType = 0
          this.showPopup = true
          return
        }
        item.message && this.$wechat.showToast(item.message)
        if (!item.isJump) {
          switch (item.name) {
            case '小程序码':
              let pathEncode = encodeURIComponent(`pages/home?s=${this.userInfo.shop_id}`)
              // 预览该店铺的兑换商城的小程序码
              wx.previewImage({
                current: `${baseURL.api}/common/file/qrcode/miniprogram-load?path=${pathEncode}&program=customer&width=500`, // 当前显示图片的http链接
                urls: [`${baseURL.api}/common/file/qrcode/miniprogram-load?path=${pathEncode}&program=customer&width=500`] // 需要预览的图片http链接列表
              })
              break
            case '商城预览':
              // 预览该店铺的兑换商城的小程序码
              wx.navigateToMiniProgram({
                appId: 'wxbebabb5eb8a0b7b3',
                path: `pages/home?shopId=${this.userInfo.shop_id}`,
                envVersion: process.env === 'production' ? 'release' : 'trial' // 小程序参数跳转 release-正式站 trial-体验版 develop-开发版
              })
              break
            default:
              break
          }
          return
        }
        if (!item.path) return
        wx.navigateTo({ url: item.path })
      },
      showShopImg() {
        if (process.env === 'production') {
          let pathEncode = encodeURIComponent(`pages/home?s=${this.userInfo.shop_id}`)
          // console.log(`${baseURL.api}/common/file/qrcode/miniprogram-load?path=${pathEncode}&program=customer&width=500`)
          wx.previewImage({
            current: `${baseURL.api}/common/file/qrcode/miniprogram-load?path=${pathEncode}&program=customer&width=500`, // 当前显示图片的http链接
            urls: [`${baseURL.api}/common/file/qrcode/miniprogram-load?path=${pathEncode}&program=customer&width=500`] // 需要预览的图片http链接列表
          })
        } else {
          // console.log(process.env)
          wx.navigateToMiniProgram({
            appId: 'wxbebabb5eb8a0b7b3',
            path: `pages/home?shopId=${this.userInfo.shop_id}`,
            envVersion: process.env === 'production' ? 'release' : 'trial' // 小程序参数跳转 release-正式站 trial-体验版 develop-开发版
          })
        }
      },
      navigateOrder(item) {
        let query = item.name ? `?status=${item.status}` : ''
        wx.navigateTo({ url: `${this.$routes.personalCenter.ORDER_LIST}${query}` })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .mine
    padding-bottom: 15px

  .my-header
    height: 33.8vh
    position: relative
    width: 100vw
    padding: 0 3.6vw 11.73vh
    box-sizing: border-box
    display: flex
    align-items: flex-end
    .my-bg
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
    .user-info
      display: flex
      position: relative
      box-sizing: border-box
      z-index: 1
      width: 100%
      .user-left
        display: flex
        box-sizing: border-box
        align-items: center
        flex: 1
        .portrait
          background: $image-color
          border-radius: 50%
          border: 1.5px solid $color-white
          width: 15.4667vw
          height: @width
        .user-msg
          margin-left: 3.8667vw
          .user-name
            font-family: $font-family-medium
            font-size: 4.8vw
            margin-bottom: 7px
            color: $color-white
            width: 48vw
            no-wrap()
            word-break: break-all
          .label-img
            height: 18px
            width: 62.5px
          .label-img-up
            margin-left: 10px
      .user-right
        display: flex
        align-items: center
        justify-content: flex-end
        width: 40px
        position: relative
        .settings
          display: block
          width: 20px
          height: @width
          margin-right: 8px
        .user-tip
          position absolute
          width: 6px
          height: @width
          border-radius: 100%
          right: 5px
          top: -3px
          background: #EA4A49

  .way
    display: block
    margin-left: 6px
    width: 10px
    height: 10px

  .mine-content
    padding: 0 12px
    box-sizing: border-box
    margin-top: -7.28vh
    position: relative
    z-index: 2
    .my-assets
      padding: 0 4vw
      box-sizing: border-box
      border-radius: 3px
      background: $color-white
      margin-top: 10px
      .assets-header
        padding: 4vw 0
        display: flex
        justify-content: space-between
        align-items: center
        .assets-title
          line-height: 1
          font-size: $font-size-16
          color: $color-text-main
          font-family: $font-family-medium
        .assets-tip
          display: flex
          font-size: $font-size-13
          color: $color-text-secondary
          align-items: center
          font-family: $font-family-regular
          .way
            margin-left: 6px
            height: 10px
            width: 10px
      .assets
        padding: 4vw 0 28px
        box-sizing: border-box
        display: flex
        .assets-item
          flex: 1
          padding-right: 10px
          .assets-money
            font-size: $font-size-22
            font-family: $font-family-din-bold
            color: $color-text-main
            text-align: center
            line-height: 1
          .assets-text
            margin-top: 10px
            font-size: $font-size-12
            font-family: $font-family-regular
            color: $color-text-secondary
            text-align: center
            line-height: 1
        .assets-item-end
          text-align: right
          padding-right: 0
          padding-left: 10px
        .line
          transform: scaleX(0.5)
          background: $color-line
          height: 35px
          width: 1px
    .my-order
      border-radius: 3px
      background: $color-white
      .order-header
        display: flex
        align-items: center
        padding: 4vw 4vw 25.5px
        justify-content: space-between
        .order-title
          color: $color-text-main
          font-family: $font-family-medium
          line-height: 1
          font-size: $font-size-16
        .all-order
          display: flex
          align-items: center
          .all-title
            font-size: $font-size-13
            font-family: $font-family-regular
            color: $color-text-secondary
      .order-box
        display: flex
        padding: 0 4vw
        box-sizing: border-box
        justify-content: space-between
        .order-item
          flex-direction: column
          align-items: center
          display: flex
          padding: 6px 4vw 22.5px
          .order-img
            margin-bottom: 10px
            width: 26px
            height: @width
          .order-title
            color: $color-text-sub
            font-size: $font-size-12

    .my-navigate
      margin: 10px 0
      background: $color-white
      padding: 0 21.5px
      box-sizing: border-box
      border-radius: 3px
      display: flex
      .navigate-item
        display: flex
        flex-direction: column
        align-items: center
        margin-right: 46px
        box-sizing: border-box
        padding: 17px 0 26.5px
        .nav-img
          width: 7.467vw
          height: @width
        .nav-name
          margin-top: 7.5px
          color: $color-text-main
          line-height: 1
          font-family: $font-family-regular
          font-size: $font-size-12
    .vip-manager
      padding: 4vw 39px 10.667vw 15px
      box-sizing: border-box
      margin-top: 10px
      border-radius: 3px
      background: $color-white
      .vip-title
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-medium
      .vip-content
        padding-top: 30px
        display: flex
        justify-content: space-between
        .vip-item-left
          margin-left: 14.5px
        .vip-item
          display: flex
          .vip-icon
            margin-right: 10px
            width: 32px
            height: @width
          .vip-msg
            display: flex
            flex-direction: column
            justify-content: space-between
            .vip-name
              white-space: nowrap
              line-height: 1
              font-size: $font-size-14
              color: $color-text-main
              font-family: $font-family-medium
            .vip-share-code
              font-size: $font-size-16
              margin-top: 4px
              font-family: $font-family-medium
              line-height: 1
              color: #EA4A49
            .vip-tip
              white-space: nowrap
              display: flex
              align-items: flex-end
              font-family: $font-family-regular
              color: $color-text-secondary
              font-size: $font-size-12
              .vip-num
                margin: 0 2px
                font-family: $font-family-medium
                color: #EA4A49
                transform: translateY(2px)
                font-size: $font-size-16

    .exchange-mall
      padding: 0 0 14px
      box-sizing: border-box
      background: $color-white
      border-radius: 3px
      margin-top: 10px
      .exchange-title
        padding: 4vw 15px 0
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-medium
        display: flex
        justify-content: space-between
        align-items: center
        .title-text
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-16
        .shop-view
          display: flex
          font-size: $font-size-13
          font-family: $font-family-regular
          height: 30px
          align-items: center
          .shop-name
            color: #818D99
          .shop-icon
            display: block
            margin-left: 5px
            width: 15px
            height: 10px
      .exchange-list
        padding: 0 1.5px
        box-sizing: border-box
        display: flex
        flex-wrap: wrap
        margin-top: 4vw
        .exchange-item
          display: flex
          padding: 14px 0
          width: 25%
          align-items: center
          justify-content: center
          .exchange-item-small
            display: flex
            flex-direction: column
            align-items: center
            min-width: 48px
          .exchange-icon
            width: 26px
            height: @width
          .exchange-name
            margin-top: 8px
            color: $color-text-main
            font-family: $font-family-regular
            font-size: $font-size-12

  .submit-inline
    display: inline-block
</style>
