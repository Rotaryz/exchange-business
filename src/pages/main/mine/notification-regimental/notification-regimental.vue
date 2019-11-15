<template>
  <div class="notification-regimental" @click="test">
    <section class="title-wrapper" @click="navHandle">
      <div class="left">
        <p class="title">智能雷达</p>
      </div>
      <div class="right">
        <p class="text"><span class="number">{{customerCount}}</span>位顾客浏览了你的店铺</p>
        <img src="/static/images/icon-pressed_my@2x.png" class="arrow-right">
      </div>
    </section>
    <section class="msg-wrapper" :animation="msgHeightAnimation">
      <article class="wrapper-ul">
        <block v-for="(item, index) in dataArray" :key="index">
          <div class="wrapper" :animation="!index ? oneAnimation: twoAnimation">
            <img v-if="item.image_url" mode="aspectFill" :src="item.image_url" alt="" class="avatar">
            <p class="text"><span v-for="(child, idx) in item.content" :key="idx" :class="{'active': child.active}">{{child.text}}</span></p>
          </div>
        </block>
        <div v-if="isShowCard" class="wrapper over">
          <img v-if="currentInfo.image_url" mode="aspectFill" :src="currentInfo.image_url" alt="" class="avatar">
          <p class="text"><span v-for="(child, idx) in currentInfo.msg" :key="idx" :class="child.cname">{{child.text}}</span></p>
        </div>
      </article>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import InfoData from '@utils/info-data' // 初始化访客数据

  const COMPONENT_NAME = 'NOTIFICATION_REGIMENTAL'

  export default {
    name: COMPONENT_NAME,
    props: {
      customerCount: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dataArray: new Array(2).fill({}),
        index: 0,
        msgHeightAnimation: '',
        oneAnimation: '',
        oneIsOver: false,
        twoAnimation: '',
        twoIsOver: true,
        duration: 300,
        isShowCard: false,
        currentInfo: {}
      }
    },
    onUnload() {
      this.msgHeightAnimation = ''
      this.oneAnimation = ''
      this.oneIsOver = false
      this.twoAnimation = ''
      this.twoIsOver = true
      this.isShowCard = false
      this.currentInfo = {}
      this.index = 0
    },
    methods: {
      navHandle() {
        wx.navigateTo({ url: this.$routes.other.AI_LOG })
      },
      _action(data) {
        let eventMsg = new InfoData(data)
        this.dataArray[this.index % 2] = eventMsg
        this.index++
        this._msgHeightAnimation()
        this._cardAnimation('oneAnimation', 'oneIsOver', eventMsg)
        this._cardAnimation('twoAnimation', 'twoIsOver', eventMsg)
      },
      _cardAnimation(key, flag, eventMsg) {
        const duration = this.duration
        const animation = wx.createAnimation()
        if (this[flag]) {
          animation.translate3d(0, -55, 0).step({
            duration: 0,
            timingFunction: 'linear',
            delay: 0
          })
        } else {
          animation.translate3d(0, 0, 0).step({
            duration,
            timingFunction: 'linear',
            delay: 0
          })
        }
        setTimeout(() => {
          this[flag] = !this[flag]
          this.isShowCard = true
          flag && (this.currentInfo = eventMsg)
        }, duration)
        this[key] = animation.export()
      },
      _msgHeightAnimation() {
        if (this.msgHeightAnimation) return
        const duration = this.duration
        let msgHeightAnimation = wx.createAnimation({
          duration,
          timingFunction: 'ease-out',
          delay: 0
        })
        msgHeightAnimation.height(55).step()
        this.msgHeightAnimation = msgHeightAnimation.export()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .notification-regimental
    border-radius: 3px
    box-sizing: border-box
    background: #fff
    margin: 12px auto
    padding-bottom :15px

    .msg-wrapper
      position: relative
      height: 0
      padding: 0 10px

      .wrapper-ul
        border-radius: 3px
        height: 55px
        position: relative
        overflow: hidden

        .wrapper
          fill-box(absolute)
          layout(row, block, nowrap)
          align-items: center
          background: #F5F5F9
          border-radius: 3px
          padding: 10px
          transform: translate3d(0, -55px, 0)
          z-index: 2

          &.over
            transform: translate3d(0, 0, 0)
            z-index: 1

          .avatar
            width: 30px
            height @width
            border-radius: 100%

          .text
            padding: 0 5px
            flex: 1
            no-wrap()
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #111111

    .title-wrapper
      layout(row, block, nowrap)
      padding: 20px 15px 20px

      .left
        flex: 1
        overflow: hidden
        layout(row, block, nowrap)
        align-items: center

        .icon
          width: 22px
          height: @width

        .title
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-text-main

      .right
        layout(row, block, nowrap)
        align-items: center

        .text
          font-family: $font-family-regular
          font-size: 14px
          color: $color-text-assist

          .number
            line-height: 1
            margin-right: 2px
            font-family: $font-family-medium
            color: $color-main

        .arrow-right
          width: 10px
          height: 10px
          margin-left:6px

  .active
    color: $color-main
</style>
