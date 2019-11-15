<template>
  <div class="property">
    <navigation-bar title="我的资产"></navigation-bar>
    <dl class="tab-scroll" :style="{top:statusBarHeight + 44 + 'px'}">
      <dd v-for="(tab, index) in tabList" :key="index" class="item" :class="{active: tabIndex === index}" :style="tab.styles" @click="changeTabHandle(tab, index)">{{tab.name}}</dd>
      <dt class="line-wrapper" :style="'transform:translate3d('+tabIndex*100+'%,0,0)'"><div class="line"></div></dt>
    </dl>
    <div style="height: 45px"></div>
    <swiper
      class="list-swiper"
       :style="{height: listHeight+'px'}"
      display-multiple-items="1"
      previous-margin="0px"
      next-margin="0px"
      :current="tabIndex"
      @change="handleSetBannerIndex"
      >
      <block v-for="(tab,tabIdx) in tabList" :key="tabIdx">
        <swiper-item>
          <div :style="{height: listHeight+'px'}" class="item-con">
            <article class="card-wrapper">
              <div class="title">{{cardInfo[tabIdx].upText}}</div>
              <div class="money">{{info[cardInfo[tabIdx].money]}}</div>
              <div class="line"></div>
              <section class="bottom-wrapper">
                <div class="aside">
                  <p class="up">{{cardInfo[tabIdx].bottomLeftText}}</p>
                  <p class="down">{{info[cardInfo[tabIdx].bottomLeftNumber]}}</p>
                </div>
                <p class="col-line"></p>
                <div class="aside p-30">
                  <p class="up">{{cardInfo[tabIdx].bottomRightText}}</p>
                  <p class="down">{{info[cardInfo[tabIdx].bottomRightNumber]}}</p>
                </div>
              </section>
              <div class="button" @click="navToApplyDepositHandle">去提现</div>
            </article>
            <h1 class="log-title">
              <p class="left">补贴记录</p>
              <p v-if="tab.data.length" class="right" @click="navToLogHandle">更多</p>
              <img v-if="tab.data.length" src="/static/images/icon-pressed_my@2x.png" alt="" class="right-arrow" @click="navToLogHandle">
            </h1>
            <dl v-if="tab.data.length" class="panel-wrapper">
              <dt class="log-header border-bottom-1px">
                <div v-for="(head, index) in headList[tabIdx]" :key="index" :style="head.styles" class="head-item">{{head.text}}</div>
              </dt>
              <dd v-for="(item, idx) in tab.data" :key="idx" class="log-item-wrapper border-bottom-1px">
                <div class="default-side" :style="headList[tabIdx][0].styles">
                  <p class="up">{{item[LOG_ITEM.letTop]}}</p>
                  <p class="down">{{item[LOG_ITEM.letDown]}}</p>
                </div>
                <div v-if="tabIdx === 0" class="default-side" :style="headList[tabIdx][1].styles">
                  <p class="up">{{item[LOG_ITEM.middleTop]}}</p>
                  <p class="down">{{item[LOG_ITEM.middleDown]}}</p>
                </div>
                <div v-if="tabIdx === 1" class="default-side" :style="headList[tabIdx][1].styles">
                  <p class="up" style="text-align: right">{{item[LOG_ITEM.middleDown]}}</p>
                </div>
                <div class="default-side" :style="headList[tabIdx][2].styles">
                  <p class="up-other">{{item[LOG_ITEM.rightTop]}}</p>
                </div>
              </dd>
            </dl>
            <div v-else-if="!getting&&!tab.data.length" :style="{minHeight: listHeight - 240 +'px'}">
              <empty :paddingTop="(listHeight - 260)/4" tip="暂时无记录"></empty>
            </div>
          </div>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'
  // import LogItem from '../log-subsidy/log-item'
  const PAGE_NAME = 'PROPERTY'

  const CARD_INFO = {
    0: {
      upText: '可提现业务补贴(元)',
      money: 'remaining',
      bottomLeftText: '累计业务补贴(元)',
      bottomLeftNumber: 'total_remaining',
      bottomRightText: '已提现业务补贴(元)',
      bottomRightNumber: 'withdrawal_remaining',
      params: 'ttt'
    },
    1: {
      upText: '可提现商品补贴(元)',
      money: 'remaining',
      bottomLeftText: '累计商品补贴(元)',
      bottomLeftNumber: 'total_remaining',
      bottomRightText: '已提现商品补贴(元)',
      bottomRightNumber: 'withdrawal_remaining',
      params: 'ooo'
    }
  }

  const LIST_INFO = {
    0: [
      {
        text: '客户',
        styles: 'flex: 1.9404761904761905'
      },
      {
        text: '购买等级',
        styles: 'flex: 1'
      },
      {
        text: '业务补贴(元)',
        styles: 'flex: 1.4047619047619047;text-align: right;'
      }
    ],
    1: [
      {
        text: '客户',
        styles: 'flex: 1.9404761904761905'
      },
      {
        text: '订单金额(元)',
        styles: 'flex: 1'
      },
      {
        text: '商品补贴(元)',
        styles: 'flex: 1.4047619047619047;text-align: right;'
      }
    ]
  }

  // 后台字段
  const LOG_ITEM = {
    letTop: 'source_shop_name',
    letDown: 'settlement_at',
    middleTop: 'source_shop_level_name',
    middleDown: 'total',
    rightTop: 'commission_money'
  }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        tabList: [
          {
            name: '业务补贴',
            styles: 'flex: 1',
            data: []
          },
          {
            name: '商品补贴',
            styles: 'flex: 1',
            data: []
          }
        ],
        info: {
          remaining: '—', // 对应后台的字段 todo
          total_remaining: '—',
          withdrawal_remaining: '—'
        },
        statusBarHeight: 20,
        listHeight: 0,
        tabIndex: 0,
        LOG_ITEM,
        cardInfo: CARD_INFO,
        headList: LIST_INFO,
        getting: true
      }
    },
    onLoad() {
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.listHeight = res.screenHeight - res.statusBarHeight - 100
    },
    onShow() {
      this._getPropertyInfo()
      this._getSubsidyRecord()
    },
    methods: {
      handleSetBannerIndex(e) {
        this.changeTabHandle('', e.target.current)
      },
      changeTabHandle(tab, index) {
        if (this.tabIndex === index) return
        this.tabIndex = index
        this._getPropertyInfo()
        this._getSubsidyRecord()
      },
      // 资产
      _getPropertyInfo(loading = false) {
        API.Property.getPropertyData({data: {type: (this.tabIndex + 1)}, loading})
          .then((res) => {
            this.info = res.data
          })
      },
      // 补贴记录
      _getSubsidyRecord(loading = false) {
        this.tabList[this.tabIndex].data = []
        API.Property.getSubsidyRecord({data: {type: (this.tabIndex + 1), page: 1, limit: 10}, loading})
          .then((res) => {
            this.tabList[this.tabIndex].data = res.data
            this.getting = false
          })
      },
      navToApplyDepositHandle() {
        const url = this.$routes.personalCenter.APPLY_DEPOSIT
        wx.navigateTo({url: `${url}?type=${this.tabIndex + 1}`})
      },
      navToLogHandle() {
        const url = this.$routes.personalCenter.LOG_SUBSIDY
        wx.navigateTo({url: `${url}?type=${this.tabIndex + 1}`})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@style/log-tab.styl"
  @import "~@design"

  .property
    min-height :100%

  .tab-scroll
    width : 100vw
    height: 45px
    layout(row,block,nowrap)
    align-items :center
    background :#fff
    text-align :center
    font-family: $font-family-regular
    font-size: 16px
    color: #606972
    position :fixed
    z-index 500
    .item
      height : 100%
      line-height :45px
      color: #606972
      transition:  color 0.3s
      &.active
        font-family :$font-family-medium
        color: #1D2023
    .line-wrapper
      position :absolute
      bottom :0
      width : (100/2)%
      height :3px
      transition :transform 0.3s
      .line
        width 30px
        height: 3px
        margin :0 auto
        background: #D83F35
        border-radius: 100px

  .card-wrapper
    margin 10px 10px 0 10px
    height: 180px
    background-image: url("pic-wdzc.png")
    background-size:100% 100%
    border-radius: 6px
    font-family: $font-family-regular
    padding :0 15px
    position :relative
    .title
      padding-top : 28.5px
      font-size :13px
      color: #FFFFFF
    .money
      font-family: DINAlternate-Bold
      font-size: 25px
      padding-top : 10px
      line-height : 22px
      color: #FFFFFF
    .line
      margin-top : 31px
      height : 1px
      border-top-1px(rgba(255,255,255,0.1))
    .bottom-wrapper
      flex: 1
      layout(row,block,nowrap)
      .col-line
        margin-top : 23.5px
        height : 20.5px
        width: 1px
        border-left-1px(rgba(255,255,255,0.1))
      .aside
        flex: 1
        &.p-30
         padding-left:30px
        .up
          padding-top: 15px
          font-size : 13px
          color: #FFFFFF
        .down
          color: #FFFFFF
          font-family: DINAlternate-Bold
          padding-top: 8.5px
          font-size: 18px
          line-height :16px
    .button
      position :absolute
      right :20px
      top:38.5px
      border: 1px solid #FFFFFF
      border-radius: 2px
      font-family: $font-family-regular
      font-size: 12px
      color: #FFFFFF
      text-align: center
      line-height: 24px
      width: 58px
      height: 24px

  .log-title
    font-family: $font-family-regular
    line-height: 1
    padding :21px 10px 14px
    layout(row,block,nowrap)
    align-items :center
    .left
      font-size: 15px
      color: #3F454B
      flex: 1
    .right
      font-size: 13px
      color: #818D99
      margin-right :6px
    .right-arrow
      width: 10px
      height: 10px

  .panel-wrapper
    background: #FFFFFF
    border-radius: 3px
    margin : 0 10px
    padding :0 10px
  .head-item
    font-size: 13px
    color: $color-text-secondary
  .item-con
    overflow: auto
</style>
