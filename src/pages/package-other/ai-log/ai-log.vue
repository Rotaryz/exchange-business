<template>
  <div class="ai-log">
    <navigation-bar title="智能雷达"></navigation-bar>
    <div class="msg-list">
      <view class="msg-item" v-for="(item, index) in aiMsg" :key="index">
        <view class="item-time" v-if="item.is_showtime">{{item.time}}</view>
        <view class="msg-item-content">
          <img v-if="item.image_url" :src="item.image_url" class="msg-left">
          <img v-else :src="imageUrl+'/yx-image/order/icon-colonel_head@2x.png'" class="msg-left">
          <view class="msg-right">
            <view class="msg-container">
              <view class="msg-p">
                <text v-for="(msg, msgIdx) in item.content" :class="{'green': msg.active}" :key="msgIdx">{{msg.text}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <empty v-if="isEmpty" :image="empty" :paddingTop="100" tip="暂无访客"></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'
  import InfoData from '@utils/info-data' // 初始化访客数据
  import { actionTimeFormat } from '@utils/common'

  const PAGE_NAME = 'AI_LOG'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        noMore: false,
        aiMsg: [],
        page: 1,
        lastPage: 1,
        isEmpty: false,
        isMore: true
      }
    },
    onLoad() {
      // for (let i = 1; i <= 20; i++) {
      //   let item = {
      //     event_no: `10${i < 10 ? '0' + i : i}` * 1,
      //     title: 'jkhafjha',
      //     is_showtime: true,
      //     time: '2019/03/06 18:00',
      //     image_url: '',
      //     count_sum: 5
      //   }
      //   this.aiMsg.push(item)
      // }
      // this.aiMsg = this.aiMsg.map((item) => {
      //   let obj = new InfoData(item)
      //   return obj
      // })
      this.actionLog()
    },
    onPullDownRefresh() {
      this.page = 1
      this.actionLog()
      wx.stopPullDownRefresh()
    },
    onReachBottom() {
      if (!this.isMore) return
      this.page++
      this.actionLog()
    },
    methods: {
      actionLog() {
        let userInfo = wx.getStorageSync('userInfo')
        let id = userInfo.shop_id
        let data = { shop_id: id, page: this.page, from: 0 }
        API.Ai.actionLog({ data, loading: true, toast: false })
          .then((res) => {
            this.isMore = res.data.list.length
            // this.lastPage = res.data.page
            let arr = res.data.list.map((item) => {
              item.time = actionTimeFormat(item.created_at).time
              let obj = new InfoData(item)
              return obj
            })
            if (this.page === 1) this.aiMsg = arr
            else this.aiMsg = this.aiMsg.concat(arr)
            this.isEmpty = !this.aiMsg.length
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .action-record
    width: 100%
    min-height: 100vh
    background: $color-background
    box-sizing: border-box
    overflow-x: hidden

  .msg-list
    padding: 10px 15px 15px
    .msg-item
      margin-bottom: 12px
      .item-time
        font-family: PingFangSC-Medium
        font-size: $font-size-16
        color: #111
        padding: 10px 0 15px
      .msg-item-content
        width: 100%
        height: 70px
        background: #FFF
        border-radius: 3px
        display: flex
        justify-content: space-between
        align-items: center
      .msg-left
        margin: 0 10px 0 15px
        width: 40px
        height: 40px
        border-radius: 50%
        display: block
        background: #FFF
        border: 0.5px solid rgba(32, 32, 46, 0.1)
      .msg-right
        flex: 1
        overflow: hidden
        margin-right: 13.5px
        height: 100%
        display: flex
        justify-content: space-between
        align-items: center
        .msg-container
          flex: 1
          overflow: hidden
          height: 100%
          display: flex
          align-items: center
          .msg-p
            line-height: 20px
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #17273A
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
            .green
              color: #F46D0D
        .msg-rt
          width: 7.5px
          height: 11.5px
          margin-left: 33px

    .msg-item:last-child
      margin-bottom: 0

  .noting
    text-align: center
    margin-top: 106px
    .nothing-img
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub
</style>
