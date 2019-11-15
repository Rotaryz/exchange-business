<template>
  <div class="shop-income">
    <navigation-bar title="商城收入"></navigation-bar>
    <article class="card-wrapper">
      <div class="title">可提现商城收入(元)</div>
      <div class="money">{{info.remaining}}</div>
      <div class="line"></div>
      <section class="bottom-wrapper">
        <div class="aside">
          <p class="up">累计商城收入(元)</p>
          <p class="down">{{info.total_remaining}}</p>
        </div>
        <p class="col-line"></p>
        <div class="aside p-30">
          <p class="up">已提现商城收入(元)</p>
          <p class="down">{{info.withdrawal_remaining}}</p>
        </div>
      </section>
      <div class="button" @click="navToApplyDepositHandle">去提现</div>
    </article>
    <h1 class="log-title">
      <p class="left">收入记录<span class="title-tips">（最新10条）</span></p>
      <p v-if="incomeList.length" class="right" @click="navToLogHandle">更多</p>
      <img v-if="incomeList.length" src="/static/images/icon-pressed_my@2x.png" alt="" class="right-arrow"
           @click="navToLogHandle">
    </h1>
    <dl v-if="incomeList.length" class="panel-wrapper">
      <dt class="log-header border-bottom-1px">
        <div v-for="(head, index) in headList" :key="index" :style="head.styles" class="head-item">
          {{head.text}}
        </div>
      </dt>
      <dd v-for="(item, idx) in incomeList" :key="idx" class="log-item-wrapper border-bottom-1px">
        <div class="log-item" :style="headList[0].styles">
          <p class="log-text">{{item.source_customer_nickname}}</p>
          <p class="time">{{item.settlement_at}}</p>
        </div>
        <div class="log-item" :style="headList[1].styles">
          <p class="log-text">{{item.order_type_text}}</p>
        </div>
        <div class="log-item" :style="headList[2].styles">
          <p class="price">{{item.money}}</p>
        </div>
      </dd>
    </dl>
    <div v-else-if="!getting&&!incomeList.length" :style="{minHeight: '300px'}">
      <empty :paddingTop="100" tip="暂时无记录"></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'SHOP_INCOME'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        incomeList: [],
        getting: true,
        listHeight: 0,
        info: {},
        headList: [
          {
            text: '客户',
            styles: 'flex: 2'
          },
          {
            text: '类型',
            styles: 'flex: 0.8'
          },
          {
            text: '金额(元)',
            styles: 'flex: 1.2;text-align: right;'
          }
        ]
      }
    },
    onShow() {
      this._getPropertyInfo()
      this._getIncomeList()
    },
    methods: {
      // 统计
      _getPropertyInfo() {
        API.Property.getPropertyData({data: {type: 4}})
          .then((res) => {
            this.info = res.data
          })
      },
      // 收入记录
      _getIncomeList() {
        API.Property.getSubsidyRecord({data: {type: 4, page: 1, limit: 10}, loading: false})
          .then((res) => {
            this.incomeList = res.data
            this.getting = false
          })
      },
      navToApplyDepositHandle() {
        const url = this.$routes.personalCenter.APPLY_DEPOSIT
        wx.navigateTo({url: `${url}?type=4`})
      },
      navToLogHandle() {
        const url = this.$routes.personalCenter.LOG_SUBSIDY
        wx.navigateTo({url: `${url}?type=4`})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .shop-income
    width: 100%
    min-height :100%
  .card-wrapper
    margin 10px 10px 0 10px
    height: 180px
    background-image: url("pic-wdzc.png")
    background-size:100% 100%
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
      .title-tips
        font-size: 13px
        color: $color-text-secondary
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
    .log-header
      height: 40px
      line-height: 40px
      layout(row)
      align-items: center
    .log-item-wrapper
      height: 60px
      layout(row)
      align-items: center
    .log-item
      layout()
    .log-text
      font-size: 14px
      color: $color-text-sub
      font-family: $font-family-regular
    .time
      margin-top: 8px
      font-size: 12px
      color: $color-text-secondary
    .price
      text-align: right
      font-size: 15px
      color: $color-text-main
      font-family: $font-family-medium
      margin-right :6px
    .right-arrow
      width: 10px
      height: 10px

</style>
