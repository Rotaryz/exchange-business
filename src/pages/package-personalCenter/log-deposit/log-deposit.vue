<template>
  <div class="log-deposit">
    <navigation-bar title="提现记录"></navigation-bar>
    <dl :style="{top:statusBarHeight + 44 + 'px'}" class="tab-scroll">
      <dd v-for="(tab, index) in tabList" :key="index" class="item" :class="{active: tabIndex === index}" :style="tab.styles" @click="changeTabHandle(tab, index)">{{tab.name}}</dd>
      <dt class="line-wrapper" :style="'transform:translate3d('+tabIndex*100+'%,0,0)'"><div class="line"></div></dt>
    </dl>
    <div style="height: 45px"></div>
    <dl v-if="logList.length" :style="{minHeight: listHeight+'px'}" class="wrapper">
      <dt class="log-header border-bottom-1px">
        <div v-for="(head, index) in headList" :key="index" :style="head.styles" class="head-item">{{head.text}}</div>
      </dt>
      <dd v-for="(item, idx) in logList" :key="idx" class="log-item-wrapper border-bottom-1px">
        <div class="default-side" :style="headList[0].styles">
          <p class="up">{{item[LOG_ITEM.letTop]}}</p>
          <p class="down">{{item[LOG_ITEM.letDown]}}</p>
        </div>
        <div class="default-side" :style="headList[1].styles">
          <p class="up">{{item[LOG_ITEM.middleTop]}}</p>
        </div>
        <div class="default-side p-r-10" :style="headList[2].styles">
          <p class="up-other">{{item[LOG_ITEM.rightTop]}}</p>
        </div>
      </dd>
    </dl>
    <empty v-if="!logList.length" :paddingTop="100" tip="暂时无记录"></empty>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'LOG_DEPOSIT'

  function CreateLogItem(...args) {
    this.letTop = args[0]
    this.letDown = args[1]
    this.middleTop = args[2]
    this.rightTop = args[3]
  }
  const LOG_ITEM_TEMPLATE = {
    0: new CreateLogItem('withdraw_sn', 'created_at', 'status_text', 'total'),
    1: new CreateLogItem('withdraw_sn', 'created_at', 'status_text', 'total'),
    2: new CreateLogItem('withdraw_sn', 'created_at', 'status_text', 'total'),
    3: new CreateLogItem('withdraw_sn', 'created_at', 'status_text', 'total')
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
            name: '待审核',
            status: '0',
            styles: 'flex: 1'
          },
          {
            name: '已通过',
            status: '1',
            styles: 'flex: 1'
          },
          {
            name: '已打款',
            status: '3',
            styles: 'flex: 1'
          },
          {
            name: '未通过',
            status: '2',
            styles: 'flex: 1'
          }
        ],
        tabIndex: 0,
        listHeight: 0,
        statusBarHeight: 20,
        headList: [
          {
            text: '订单号',
            styles: 'flex: 2.4'
          },
          {
            text: '状态',
            styles: 'flex: 1'
          },
          {
            text: '金额',
            styles: 'flex: 1.5'
          }
        ],
        logList: [],
        page: 1,
        status: 0,
        hasMore: false,
        type: 1
      }
    },
    onReachBottom() {
      if (this.hasMore) {
        this.page++
        this._getList()
      }
    },
    onLoad(options) {
      this.type = options.type * 1
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.listHeight = res.screenHeight - res.statusBarHeight - 44 - 45
      this._getList(true)
    },
    computed: {
      LOG_ITEM() {
        return LOG_ITEM_TEMPLATE[this.tabIndex]
      }
    },
    methods: {
      changeTabHandle(tab, index) {
        this.status = tab.status
        this.tabIndex = index
        this.page = 1
        this.logList = []
        this._getList()
      },
      _getList(loading = false) {
        API.Property.getWithdrawRecord({data: {status: this.status, page: this.page, limit: 15, type: this.type}, loading})
          .then((res) => {
            this.logList = this.logList.concat(res.data)
            this.hasMore = res.meta.current_page < res.meta.last_page
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@style/log-tab.styl"
  @import "~@design"

  .log-deposit
    min-height 100vh

  .tab-scroll
    width : 100vw
    height: 45px
    layout(row,block,nowrap)
    align-items :center
    background :#fff
    text-align :center
    font-family: $font-family-regular
    font-size: 16px;
    color: #606972;
    position :fixed
    z-index 500
    .item
      height : 100%
      line-height :45px
      color: #606972
      transition:  color 0.3s
      &.active
        font-family :$font-family-medium
        color: #1D2023;
    .line-wrapper
      position :absolute
      bottom :0
      width : (100/4)%
      height :3px
      transition :transform 0.3s
      .line
        width 30px
        height: 3px
        margin :0 auto
        background: #D83F35;
        border-radius: 100px;

  .wrapper
    box-sizing: border-box
    border-top :10px solid #F5F5F9;
    padding : 0 0 0 10px
    background: #fff

  .p-r-10
    padding-right :10px
  .head-item
    font-family: $font-family-regular
    font-size: 13px
    color: $color-text-secondary
    &:last-child
      padding-right: 10px
      text-align: right
</style>
