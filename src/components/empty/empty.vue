<template>
  <div :style="{'height':height}" class="empty">
    <div class="container" :style="{'margin-bottom':marginBottom, marginTop: paddingTop?'0':'-20vh'}">
      <img v-if="image" :src="image" :style="{width:imgWidth + 'px',height:imgWidth + 'px', 'padding-top': paddingTop +'px'}" class="no-cont-icon">
      <div v-if="tip" class="tip-text">{{tip}}</div>
      <div v-if="tipSub" class="tip-sub-text">{{tipSub}}</div>
      <div v-if="buttonText" class="go-btn" :style="buttonStyle" @click="btnGo">{{buttonText}}</div>
      <slot></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'EMPTY',
    props: {
      // 标题
      tip: {
        type: String,
        default: ''
      },
      tipSub: {
        type: String,
        default: ''
      },
      buttonText: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: '/pages/home'
      },
      imgWidth: {
        type: Number,
        default: null
      },
      image: {
        type: String,
        default: require('./pic-empty@2x.png')
      },
      paddingTop: {
        type: Number,
        default: 0
      },
      buttonStyle: {
        type: String,
        default: ''
      },
      marginBottom: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: '100%'
      }
    },
    methods: {
      btnGo() {
        wx.navigateTo({ url: this.url }) || wx.switchTab({ url: this.url })
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .empty
    width: 100%
    height: 100%
    font-family: $font-family-sc-bold
    text-align: center
    display: flex
    flex-direction: column
    align-items: center
    box-sizing: border-box
    justify-content: center

    .container
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center

    .no-cont-icon
      width: 100px
      height: @width
      margin-bottom: 20px

    .title
      font-family: $font-family-medium
      color: $color-text-sub
      font-size: $font-size-20
      letter-spacing: 0.8px

    .tip-text
      text-align: center
      margin-top: 7px
      color: $color-text-secondary
      font-size: $font-size-14

    .tip-sub-text
      text-align: center
      margin-top: 10px
      color: $color-text-tip
      font-size: $font-size-12
      letter-spacing: 0.6px

    .go-btn
      display: inline-block
      border-1px($color-text-tip)
      border-radius: 2px
      font-family: PingFangSC-Regular;
      font-size: $font-size-14
      color: $color-text-main
      background-color: $color-white
      letter-spacing: 0.6px
      text-align: center
      padding: 0px 20px
      height: 30px
      line-height: 30px
      margin-top: 25px
</style>
