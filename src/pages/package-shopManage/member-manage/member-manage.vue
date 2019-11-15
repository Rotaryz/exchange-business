<template>
  <div class="member-manage">
    <navigation-bar title="会员管理" arrowColor="white" :translucent="true" :isOpacity="true" :titleColor="titleColor" @inTop="inTop" @showTitle="changeColor"></navigation-bar>
    <header class="header-con">
      <img src="./bg-my@2x.png" class="header-bg">
      <div class="data-con">
        <div v-for="(item, idx) in headerData" :key="idx" class="data-item">
          <div class="data-val">{{item.val}}</div>
          <div class="data-title">{{item.title}}</div>
        </div>
      </div>
    </header>
    <div v-if="recordData.length" :style="{minHeight: minHeight + 'px'}" class="record-list">
      <div class="list-header">
        <div v-for="(item, idx) in listHeader" :key="idx" class="item-box">{{item.title}}</div>
      </div>
      <div class="list-con">
        <div v-for="(item, idx) in recordData" :key="idx" class="list-item">
          <div v-for="(head, headIdx) in listHeader" :key="headIdx" :class="head.class" class="item-box">
            <div v-if="head.class === 'account'" class="account-box">
              <div class="nickname">{{item[head.key[0]]}}</div>
              <div class="account">{{item[head.key[1]]}}</div>
            </div>
            <span v-else>{{item[head.key]}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else :style="{minHeight: minHeight + 10 + 'px', background: '#fff'}">
      <empty v-if="!recordData.length" :paddingTop="100" tip="暂时无记录"></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'MEMBER_MANAGE'
  const HEADER_DATA = [
    {title: '会员数量', val: '—', key: 'shop_customer_counts'},
    {title: '今日新增', val: '—', key: 'shop_customer_today_counts'},
    {title: '今日赠送(兑换券)', val: '—', key: 'shop_integral_today_total'}
  ]
  const LIST_HEADER = [
    {title: '会员账户', key: ['nickname', 'mobile'], class: 'account'}, {title: '注册时间', key: 'date'}, {title: '累计赠送(兑换券)', key: 'integral_total', class: 'price'}
  ]

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        minHeight: 0,
        titleColor: '#fff',
        headerData: HEADER_DATA,
        listHeader: LIST_HEADER,
        recordData: [],
        page: 1,
        hasMore: false
      }
    },
    onReachBottom() {
      if (this.hasMore && this.recordData.length < 50) {
        this.page++
        this._getConsumeRecord()
      }
    },
    onLoad() {
      let res = wx.getSystemInfoSync()
      // 0.488是header的高度比例
      this.minHeight = res.screenHeight - 10 - (0.488 * res.screenWidth)
      this._getShopProfile()
      this._getConsumeRecord()
    },
    methods: {
      changeColor() {
        this.titleColor = '#1D2023'
      },
      inTop() {
        this.titleColor = '#fff'
      },
      // 顶部统计数据
      _getShopProfile() {
        API.Shop.shopProfile()
          .then((res) => {
            this.headerData.map((item) => {
              item.val = res.data[item.key]
            })
          })
      },
      // 消费记录
      _getConsumeRecord() {
        API.Shop.memberRecord({data: {page: this.page, limit: 15}})
          .then((res) => {
            res.data.map((item) => {
              item.date = item.created_at.split(' ')[0]
            })
            this.recordData = this.recordData.concat(res.data)
            this.hasMore = res.meta.current_page < res.meta.last_page
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .member-manage
    width: 100%
  .header-con
    height: px-change-vw(183)
    position: relative
    width: 100vw
    box-sizing: border-box
    display: flex
    align-items: flex-end
    .header-bg
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: -1
    .data-con
      width: 100%
      height: px-change-vw(118)
      layout(row)
      align-items: center
      .data-item
        flex: 1
        text-align: center
        .data-val
          margin-bottom: px-change-vw(13)
          color: $color-white
          font-family: $font-family-din-bold
          font-size: 25px
        .data-title
          color: $color-white
          font-size: 13px
          font-family: $font-family-regular
        &:nth-child(2)
          position: relative
          &:before,&:after
            content: ""
            position: absolute
            top: 15%
            left: 0
            width: 1px
            height: 70%
            transform: scaleX(.5) translateZ(0)
            background: $color-line
            opacity: 0.3
          &:after
            left: auto
            right: 0
        &:nth-child(3)
          flex: 1.2
  .record-list
    box-sizing: border-box
    width: 100%
    padding-left: 10px
    background: $color-white
    border-top: 10px solid $color-background
    .list-header
      height: 40px
      line-height: 40px
      font-family: $font-family-regular
      font-size: 13px
      color: $color-text-secondary
      layout(row)
    .list-item
      width: 100%
      height: 60px
      line-height: 60px
      font-family: $font-family-regular
      font-size: 14px
      color: $color-text-sub
      layout(row)
    .item-box
      flex: 1
      line-height: inherit
      color: inherit
      no-wrap-plus(1)
      border-bottom-1px()
      &.price
        color: $color-text-main
        font-family: $font-family-medium
      &:nth-child(1)
        flex: 1.5
        padding-right: 10px
      &:nth-child(3)
        flex: 1.2
        padding-right: 10px
        text-align: right
      .account-box
        box-sizing: border-box
        width: 100%
        height: 60px
        padding: 12px 0
        layout()
        justify-content: space-between
        .nickname
          width: 100%
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
        .account
          width: 100%
          color: $color-text-secondary
</style>
