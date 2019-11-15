<template>
  <div class="activity-item" :class="{'big-item' : showTime}">
    <div class="item-container">
      <div class="service-content">
        <img class="item-left" :src="item.image_url" mode="aspectFill"/>
        <div class="item-right">
          <div class="right-title">{{item.name}}</div>
          <div class="right-down">
            <div class="down-left">
              <p class="down-txt"><span class="first-txt">库存: {{item.stock}}</span></p>
              <p class="down-txt second">
                <span class="first-txt">售价: <i class="small"></i><span class="red-price">¥{{item.price || item.bottom_price}}</span></span>
                <span class="original-price">原价: {{item.goods_price}}</span>
              </p>
            </div>
            <div class="down-right">
              <div class="down-right-icon" :class="showEdit ? 'active' : ''" @click.stop="showEditCover(item)"></div>
            </div>
          </div>
        </div>
        <div class="editor-box" :class="showEdit ? '' : 'hide'">
          <div class="editor-container">
            <div class="editor-content">
              <div class="editor-item" @click.stop="itemEditor(item)">
                <div class="item-icon edit"></div>
                <div class="item-txt">编辑</div>
              </div>
              <div class="editor-item" v-if="tabIdx === 0" @click.stop="itemDown(item)">
                <div class="item-icon down"></div>
                <div class="item-txt">下架</div>
              </div>
              <div class="editor-item" v-if="tabIdx === 1" @click.stop="itemDelete(item)">
                <div class="item-icon del"></div>
                <div class="item-txt">删除</div>
              </div>
            </div>
            <div class="editor-arrow"></div>
          </div>
        </div>
      </div>
      <img v-if="item.type === 2" src="./pic-label_kj@2x.png" alt="" class="activity-type">
      <img v-if="item.type === 1" src="./pic-label_pt@2x.png" alt="" class="activity-type">
      <div class="item-header border-top-1px" v-if="showTime">
        <div class="activity-time">距开始
          <p v-if="endTime && endTime.day && endTime.day>0" class="date">{{endTime.day}}</p><p v-if="endTime && endTime.day>0">:</p>
          <p v-if="endTime && endTime.hour" class="date">{{endTime.hour}}</p>:
          <p v-if="endTime && endTime.minute" class="date">{{endTime.minute}}</p>:
          <p v-if="endTime && endTime.second" class="date">{{endTime.second}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    // props: ['tabIdx', 'item', 'showEdit'],
    props: {
      tabIdx: {
        type: String,
        default: 0
      },
      item: {
        type: Object,
        default: () => {}
      },
      showEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        endTime: {},
        current_timestamp: 0,
        timer: ''
      }
    },
    computed: {
      showTime() {
        return this.item.status > 0 && (new Date() - new Date(this.item.start_at) < 0)
      }
      // showTime() {
      //   return true
      // }
    },
    onLoad() {
      console.log('onload')
      this._timeRun()
    },
    onUnload() {
      this.endTime = {}
      this.current_timestamp = 0
      this.timer = ''
      clearInterval(this.timer)
      // this.item = {}
      this.item = {}
      setTimeout(() => {
        console.log('--------------------------------------', this.item)
      }, 1000)
    },
    methods: {
      _timeRun() {
        if (!this.showTime) return
        let nowTime = new Date() / 1000
        this.current_timestamp = nowTime
        this.current_timestamp++
        // this.item.start_at = '2019-09-26 10:07:00'
        this.endTime = this._timeCheckout(this.item.start_at, this.current_timestamp)
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.current_timestamp++
          this.endTime = this._timeCheckout(this.item.start_at, this.current_timestamp)
        }, 1000)
      },
      _timeCheckout(time, nowTime) {
        let differ = (new Date(time).getTime() / 1000) - nowTime
        let day = Math.floor(differ / (60 * 60 * 24))
        day = day >= 10 ? day : '0' + day
        let hour = Math.floor(differ / (60 * 60)) - (day * 24)
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            day,
            hour,
            minute,
            second
          }
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
          clearInterval(this.timer)
        }
        return times
      },
      showEditCover(item) {
        this.$emit('showEdit', item)
      },
      itemEditor(item) {
        this.$emit('itemEditor', item)
      },
      itemDown(item) {
        this.$emit('itemDown', item)
      },
      itemDelete(item) {
        this.$emit('itemDelete', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .activity-item
    width: 100%
    padding-top: 100px
    height: 0
    background: $color-white
    border-1px($color-line, 2px)
    position: relative
    .item-container
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 0 10px

    .item-header
      width: 100%
      height: 31%
      display: flex
      align-items: center
      justify-content: space-between
      .activity-time
        font-size: 14px
        display: flex
        align-items: center
        color: $color-text-main
        .date
          width: 18px
          height: 18px
          line-height: 18px
          text-align: center
          background: #17273A
          border-radius: 2px
          margin: 0 2px
          font-size: $font-size-10
          color: $color-white
          &:first-child
            min-width: 12px
            text-align: center
            margin-left: 4px
            width: auto
            padding: 0 3px
    .activity-type
      width: 10vw
      height: 10vw
      position: absolute
      left: -2px
      top: -1px
    .service-content
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 15px 0
      display: flex
      align-items: center
      position: relative
      .item-left
        width: 70px
        height: @width
        margin-right: 10px
        border-radius: 2px
        border-1px($color-E6E6E6)
        object-fit: cover
        overflow: hidden
        position: relative
        .left-cover
          position: absolute
          width: 100%
          height: 100%
          background: rgba(54,53,71,0.8)
          line-height: 18.666vw
          text-align: center
          color: $color-white
          font-size: $font-size-12
          font-family: $font-family-regular
          transition: all .3s
        .hide.left-cover
          opacity: 0
      .item-right
        flex: 1
        overflow: hidden
        height: 66px
        display: flex
        flex-direction: column
        justify-content: space-between
        .right-title
          font-size: $font-size-16
          color: $color-text-sub
          font-family: $font-family-regular
          letter-spacing: 0.8px
          width: 100%
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .right-down
          display: flex
          justify-content: space-between
          align-items: flex-end
          .down-left
            flex: 1
            overflow: hidden
            .down-txt
              font-family: $font-family-regular
              color: $color-text-secondary
              font-size: $font-size-14
              letter-spacing: 0.6px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              .small
                font-style: normal
                font-size: 12px
                color: $color-main
                display: inline-block
              .red-price
                color: $color-main
                font-family: $font-family-medium
              .original-price
                color: $color-text-secondary
                font-size: $font-size-12
                opacity: 0.6
                text-decoration: line-through
                margin-left: 10px
            .second
              margin-top: 8px
              color: $color-text-secondary
              font-size: $font-size-14
              display: flex
              align-items: baseline
            .first
              color: $color-text-secondary
          .down-right
            width: 10.6vw
            height: 5.3vw
            margin-left: 6vw
            position: relative
            .down-right-icon
              width: 10.6vw
              height: 5.3vw
              background: url('icon-function@2x.png')
              background-size: 100% 100%
            .down-right-icon.active
              background: url('icon-function_click@2x.png')
              background-size: 100% 100%

    .editor-box
      position: absolute
      height: 60px
      right: 14.6vw
      bottom: 5px
      width: 110px
      overflow: hidden
      transition: all 0.3s
      .editor-container
        display: flex
        align-items: flex-end
        height: 55px
        position: absolute
        right: 0
        top: 0
        transition: all 0.3s
        .editor-content
          background: rgba(0, 0, 0, 0.8)
          box-shadow: 0 1px 5px 0 rgba(54,53,71,0.50)
          border-radius: 2px
          height: 100%
          padding: 0 10px
          display: flex
          .editor-item
            width: 40px
            height: 100%
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            .item-icon
              width: 17px
              height: 17px
              margin-bottom: 9px
              &.edit
                background: url('icon-compile_kj@2x.png')
                background-size: 100% 100%

              &.del
                background: url('icon-delete@2x.png')
                background-size: 100% 100%
              &.down
                background: url('icon-offline@2x.png')
                background-size: 100% 100%
            .item-txt
              font-size: $font-size-10
              font-family: $font-family-regular
              color: $color-white
        .editor-arrow
          width: 0
          height: 0
          border-width: 5px 0 5px 5px
          border-style: solid
          border-color: transparent transparent transparent rgba(0, 0, 0, 0.8)/*透明 灰 透明 透明 */
          margin-bottom: 12px

      .hide.editor-container
        right: -100%
    .editor-box.hide
      width: 0
  .big-item
    padding-top: 42%
    .service-content
      height: 69%
</style>
