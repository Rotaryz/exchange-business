<template>
  <div class="enterprise-user-management">
    <div class="top-wrap">
      <img src="./bg-my@2x.png" mode="widthFix" class="top-bg">
      <div class="container-wrap">
        <navigation-bar :isOpacity="true" arrowColor="white" titleColor="#fff" title="企业用户管理"></navigation-bar>
        <div class="top-info-wrap">
          <div class="info-item">
            <div class="num">{{userInfo.sub_shop_count || 0}}</div>
            <div class="name">企业会员总数</div>
          </div>
          <div class="v-line"></div>
          <div class="info-item">
            <div class="num">{{userInfo.available_account_num || 0}}</div>
            <div class="name">可开通账号数量</div>
          </div>
        </div>
      </div>
    </div>
    <div class="vip-type-list">
      <div v-for="(item,idx) in typeList" :key="idx" :style="{width:itemWidth+'px'}" class="vip-type-item" :class="{active:idx===activeIndex}" @click.stop="changeType(item, idx)">
        {{item.name}}({{item.num>99 ? '99+' : item.num}})
      </div>
      <div class="active-line" :style="{transform: 'translateX('+activeIndex*itemWidth+'px)',width:itemWidth+'px'}">
        <div class="line-color"></div>
      </div>
    </div>
    <div class="list-wrap">
      <div v-for="(item,idx) in list" :key="item.id" class="list-item">
        <div class="shop-name">{{item.name}}</div>
        <div class="person" @click.stop="goToDetail(item)">
          <div class="name">{{item.truename}}</div>
          <div class="phone">{{item.mobile}}</div>
          <div class="flex-1"></div>
          <img v-if="item.shop_level_id * 1=== 1" class="vip-icon" src="./pic-vipbz@2x.png">
          <img v-else-if="item.shop_level_id * 1=== 0" class="vip-icon" src="./pic-vippt@2x.png">
          <img v-else-if="item.shop_level_id * 1=== 2" class="vip-icon" src="./pic-vipqn@2x.png">
          <img src="/static/images/icon-pressed_my@2x.png" class="arrow-right" style="width: 10px;height: 10px;">
        </div>
        <div class="price">
          <div class="price-item">
            <span class="name">累计采购</span>
            <span class="num">{{item.purchase_money || 0}}元</span>
          </div>
          <div class="price-item">
            <span class="name">产生商品补贴</span>
            <span class="num">{{item.goods_commission_sum || 0}}元</span>
          </div>
        </div>
        <div v-if="item.shop_level_id * 1=== 0 && userInfo.available_account_num * 1 !== 0" class="open-versatile-btn" @click="showOpenVersatile(item)">
          开通全能版
        </div>
      </div>
      <empty v-if="list.length === 0" :paddingTop="80" tip="你的页面是空的"></empty>
    </div>
    <div class="default-modal-wrap" :class="{'hide-modal':!dialogVisible}">
      <div class="content-wrap" :class="{'hide-wrap':!dialogVisible}">
        <div class="content-head center">开通提示</div>
        <div class="content-body">
          <div class="info-text">当前可开通账号数：<span class="open-info-value">{{userInfo.available_account_num || 0}}</span></div>
          <div class="info-text">当前开通客户名称：<span class="open-info-value">{{currentItem.name}}</span></div>
        </div>
        <div class="content-footer">
          <div class="footer-button default-button" @click.stop="dialogVisible=false">取消</div>
          <div class="footer-button default-yellow" @click.stop="sureOpen">开通</div>
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

  const PAGE_NAME = 'ENTERPRISE_USER_MANAGEMENT'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    onLoad() {
      let res = wx.getSystemInfoSync()
      console.log(res)
      this.itemWidth = res.screenWidth / 3
    },
    onShow() {
      this.getUserInfo()
      this.page = 1
      this.getLevelTab()
    },
    // 翻页
    onReachBottom() {
      console.log(this.page)
      if (this.page >= this.lastPage) return false
      this.page++
      this.getShopList()
    },
    data() {
      return {
        itemWidth: 135,
        activeIndex: 0,
        typeList: [{
          name: '普通会员',
          key: 'common'
        }, {
          name: '标准版',
          key: 'standard'
        }, {
          name: '全能版',
          key: 'versatile'
        }],
        list: [],
        userInfo: {},
        currentItem: {},
        dialogVisible: false,
        currentUserInfo: {
          surplus: 2
        },
        tabItem: {},
        page: 1,
        lastPage: 1
      }
    },
    methods: {
      changeType(item, idx) {
        this.activeIndex = idx
        this.tabItem = item
        this.page = 1
        this.getLevelTab()
      },
      goToDetail(item) {
        wx.navigateTo({ url: this.$routes.personalCenter.ENTERPRISE_USER_DETAIL + '?id=' + item.shop_id })
      },
      showOpenVersatile(item) {
        console.log(item)
        this.currentItem = item
        this.dialogVisible = true
      },
      // 确定开通
      sureOpen() {
        API.Manager.levelShop({
          data: {
            shop_id: this.currentItem.shop_id,
            loading: false
          }
        }).then((res) => {
          this.$wechat.showToast('开通成功')
          this.getUserInfo()
          this.page = 1
          this.getLevelTab()
          this.dialogVisible = false
        })
      },
      getUserInfo() {
        API.Mine.getUserInfo({
          data: {},
          loading: false
        })
          .then((res) => {
            this.userInfo = res.data.shop_info
          })
      },
      getLevelTab() {
        API.Manager.getLevelIndex({
          data: {is_show_count: 1},
          loading: false,
          doctor: () => {
          }
        })
          .then((res) => {
            res.data.splice(res.data.length - 1, 1)
            this.typeList = res.data
            if (!this.tabItem.level_no) {
              this.tabItem = res.data[0]
            }
            this.getShopList()
          })
      },
      // 获取商品列表
      getShopList() {
        if (!this.tabItem.level_no && this.tabItem.level_no * 1 !== 0) return false
        API.Manager.shopLevelList({
          data: {
            shop_level_id: this.tabItem.level_no,
            page: this.page,
            loading: false,
            doctor: () => {
            }
          }
        }).then((res) => {
          this.lastPage = res.meta.last_page
          this.list = this.page * 1 === 1 ? res.data : this.list.concat(res.data)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/modal.styl"

  .enterprise-user-management
    width: 100%

    .top-wrap
      position relative

      .top-bg
        width: 100%

      .container-wrap
        position absolute
        top: 0
        right: 0
        left: 0
        bottom: 0
        display flex
        flex-direction column

        .top-info-wrap
          flex: 1
          display flex
          align-items center
          justify-content space-around

          .info-item
            flex: 1
            text-align center

            .num
              font-family $font-family-din-bold
              font-size: 25px
              margin-bottom: 13px
              color: $color-white

            .name
              font-size $font-size-13
              color: $color-white

          .v-line
            height: 36px
            border-left-1px(rgba(238, 239, 245, 0.1))

    .vip-type-list
      background-color $color-white
      display flex
      justify-content space-around
      align-items center
      border-bottom-1px()

      .vip-type-item
        height: 50px
        line-height 50px
        text-align center
        font-size: $font-size-16
        color: #606972

        &.active
          font-family $font-family-medium
          color #1D2023

      .active-line
        position absolute
        bottom: 0
        left: 0
        transform translateX(0)
        transition all 0.3s

        .line-color
          width: 30px
          height: 3px
          border-radius 1.5px
          margin: 0 auto
          background-color #D83F35

    .list-wrap
      background-color: #f5f5f9
      padding: 10px

      .list-item
        background-color $color-white
        padding: 0 10px
        border-radius 3px
        margin-bottom 10px
        overflow: hidden

        .shop-name
          height: 45px
          line-height 45px
          font-family $font-family-medium
          font-size $font-size-15
          border-bottom-1px()

        .person
          display flex
          justify-content space-between
          align-items center
          height: 60px
          border-bottom-1px()

          .name
          .phone
            font-size $font-size-14
            margin-right 25px
            color: $color-text-main

          .flex-1
            flex: 1

          .vip-icon
            width: 62px
            height: 18px
            margin-right 6px

          .arrow-right
            width: 5px
            height: 9px

        .price
          display flex
          align-items center
          height: 50px

          .price-item
            width: 50%

            .name
              color: #818D99
              font-size $font-size-14
              margin-right: 5px

            .num
              color: #3F454B
              font-size $font-size-14
              font-family $font-family-medium

        .open-versatile-btn
          background-image: linear-gradient(114deg, #F5E5C1 1%, #F2D699 98%)
          margin: 10px 0
          height: 38px
          line-height 38px
          font-family: $font-family-medium
          font-size: $font-size-14
          color: #704F1B
          border-radius: 2px
          text-align center

    .info-text
      font-size $font-size-15
      margin-bottom 10px

      .open-info-value
        font-size $font-size-15
        font-family $font-family-medium
        color: #000E11
</style>
