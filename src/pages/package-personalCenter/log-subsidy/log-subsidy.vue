<template>
  <div class="log-subsidy">
    <navigation-bar :title="titleName"></navigation-bar>
    <dl v-if="logList.length" :style="{minHeight: listHeight+'px'}" class="wrapper">
      <dt class="log-header border-bottom-1px">
        <div v-for="(head, index) in headList" :key="index" :style="head.styles" class="head-item">{{head.text}}</div>
      </dt>
      <dd v-for="(item, idx) in logList" :key="idx" class="log-item-wrapper border-bottom-1px">
        <div class="default-side" :style="headList[0].styles">
          <p class="up">{{item[LOG_ITEM[type].letTop]}}</p>
          <p class="down">{{item[LOG_ITEM[type].letDown]}}</p>
        </div>
        <div v-if="type === 1" class="default-side" :style="headList[1].styles">
          <p class="up">{{item[LOG_ITEM[type].middleTop]}}</p>
          <p class="down">{{item[LOG_ITEM[type].middleDown]}}</p>
        </div>
        <div v-if="type === 2 || type === 4" class="default-side" :style="headList[1].styles">
          <p class="up">{{item[LOG_ITEM[type].middleTop]}}</p>
        </div>
        <div class="default-side p-r-10" :style="headList[2].styles">
          <p class="up-other">{{item[LOG_ITEM[type].rightTop]}}</p>
        </div>
      </dd>
    </dl>
    <empty v-else :paddingTop="emptyTop" tip="暂时无记录"></empty>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'LOG_SUBSIDY'
  const LIST_INFO = {
    1: [
      {
        text: '客户',
        styles: 'flex: 2'
      },
      {
        text: '购买等级',
        styles: 'flex: 1'
      },
      {
        text: '业务补贴(元)',
        styles: 'flex: 1.2;text-align:right'
      }
    ],
    2: [
      {
        text: '客户',
        styles: 'flex: 2'
      },
      {
        text: '订单金额(元)',
        styles: 'flex: 1'
      },
      {
        text: '商品补贴(元)',
        styles: 'flex: 1;text-align:right'
      }
    ],
    4: [
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
        styles: 'flex: 1.2;text-align:right'
      }
    ]
  }
  // 后台字段
  const LOG_ITEM = {
    1: {
      letTop: 'source_shop_name',
      letDown: 'settlement_at',
      middleTop: 'source_shop_level_name',
      middleDown: 'total',
      rightTop: 'commission_money'
    },
    2: {
      letTop: 'source_shop_name',
      letDown: 'settlement_at',
      middleTop: 'total',
      middleDown: 'total',
      rightTop: 'commission_money'
    },
    4: {
      letTop: 'source_customer_nickname',
      letDown: 'settlement_at',
      middleTop: 'order_type_text',
      middleDown: 'order_type_text',
      rightTop: 'money'
    }
  }

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        titleName: '补贴记录',
        listHeight: 0,
        emptyTop: '',
        headList: LIST_INFO[1],
        logList: [],
        LOG_ITEM,
        page: 1,
        type: 1,
        hasMore: false
      }
    },
    onReachBottom() {
      if (this.hasMore) {
        this.page++
        this._getSubsidyRecord()
      }
    },
    onLoad(options) {
      let res = wx.getSystemInfoSync()
      this.listHeight = res.screenHeight - res.statusBarHeight - 44
      this.emptyTop = (res.screenHeight - res.statusBarHeight - 44 - 100) / 3
      this.type = options.type * 1 || 1
      this.titleName = this.type === 4 ? '商城收入记录' : '补贴记录'
      this.headList = LIST_INFO[this.type]
      this._getSubsidyRecord(true)
    },
    methods: {
      // 补贴记录
      _getSubsidyRecord(loading = false) {
        API.Property.getSubsidyRecord({data: {type: this.type, page: this.page, limit: 20}, loading})
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
  .log-subsidy
    min-height 100vh

    .wrapper
      box-sizing: border-box
      border-top :10px solid #F5F5F9;
      padding : 0 0 0 10px
      background :#fff
  .head-item
    font-size: 13px
    color: $color-text-secondary
    &:last-child
      padding-right: 10px
  .p-r-10
    padding-right :10px
  .log-item-wrapper
    height: 60px
    layout(row)
    align-items: center
    .default-side
      padding-top: 0
</style>
