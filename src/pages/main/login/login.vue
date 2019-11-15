<template>
  <div class="login">
    <navigation-bar
      :showArrow="false"
      :translucent="true"
      arrowColor="white"
    ></navigation-bar>
    <img src="./pic-banner.png" alt="" mode="aspectFill" :style="{height: topHeight + 'px'}" class="banner-img">
    <div class="top-wrapper" :style="{height: topHeight + 'px'}">
      <p class="title" :style="{paddingTop:statusBarHeight + 'px'}">{{tabList[tabIndex].title}}</p>
      <img src="./icon-zanbo@2x.png" alt="" class="logo">
    </div>
    <p class="tab-wrapper">
      <i class="tab-scroll-chunk" :style="'transform:translate3d('+tabIndex*66+'px,0,0)'"></i>
      <span class="tab-item"
            v-for="(tab, idx) in tabList"
            :key="idx"
            @click="changeTabHandle(tab, idx)"
            :class="{active: tabIndex === idx}"
      >{{tab.name}}</span>
    </p>
    <ul class="form-wrapper">
      <li class="form-item-wrapper"
          v-for="(tab, idx) in tabList"
          :key="idx"
          :style="{transform: 'translate3d('+tabIndex*-100+'vw,0,0)'}"
      >
        <login-input ref="input" :config="tab.config" :mini_code="mini_code" @submit="submitHandle" @codeFailed="getMiniCode"></login-input>
      </li>
    </ul>
<!--    <p v-if="tabIndex" class="copyright" @click="checked=!checked"><span v-if="!checked" class="circle"></span><img v-if="checked" class="circle" :class="{active: checked}" src="./icon-pick@2x.png" alt="">阅读并同意<span class="rule" @click.stop="navRuleHandle">《赞播集采服务条款》</span></p>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  // import app from '@src/app.json'
  import wx from 'wx'
  import LoginInput from './login-input/login-input'
  import { globalComputed } from '@state/helpers'

  const PAGE_NAME = 'LOGIN'
  // const TAB_BAR = app.tabBar.list
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      LoginInput
    },
    data() {
      return {
        tabList: [{
          name: '登录',
          title: '赞播集采',
          config: {
            btnText: '登录',
            api: 'login'
          }
        }, {
          name: '注册',
          title: '赞播集采',
          config: {
            btnText: '注册',
            register: true,
            api: 'register'
          }
        }],
        tabIndex: 0,
        topHeight: 0,
        mini_code: null,
        checked: false
      }
    },
    computed: {
      ...globalComputed
    },
    onLoad() {
      this.tabIndex = this.$storage('tabIndexLogin') || 0
      this.topHeight = this.statusBarHeight + this.$vw * 180
      this.getMiniCode()
    },
    onHide() {
      this.$storage('tabIndexLogin', this.tabIndex)
    },
    methods: {
      clearChildrenData() {
        Object.assign(this.$data, this.$options.data())
        if (this.$refs.input) {
          this.$refs.input.forEach(val => val.clearData())
        }
      },
      async getMiniCode() {
        try {
          let res = await this.$wechat.login()
          this.mini_code = res.code
        } catch (e) {
          console.error(e)
        }
      },
      changeTabHandle(tab, idx) {
        this.tabIndex = idx
        this.getMiniCode()
      },
      navRuleHandle() {
        wx.navigateTo({url: this.$routes.other.TERMS_SERVICE})
      },
      submitHandle() {
        this.goNextPage()
      },
      goNextPage() {
        wx.switchTab({url: this.$routes.main.HOME})
        this.clearChildrenData()
        this.$storage('tabIndexLogin', 0)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .circle
    position :relative
    top:2px
    margin-right :5px
    display :inline-block
    width: 14px
    height: @width
    box-sizing :border-box
    border-radius : 50%
    border: 1px solid $color-text-assist
    &.active
      border: 1px solid transparent

  .login
    height: 100vh
    background: $color-white
    position :relative
    overflow :hidden
    &::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .banner-img
      width :100vw
      position absolute
      top:0
      left :0
    /*头部*/
    .top-wrapper
      position :relative
      text-align: center
      .title
        font-family: $font-family-medium
        font-size: 18px
        color: #FFFFFF
        height: 44px
        line-height :44px
      .logo
        padding-top :px2vw(73)
        width: px2vw(108)
        height: @width
    /*tab栏*/
    .tab-wrapper
      margin :px2vw(58) auto 0
      font-family: $font-family-regular
      font-size: 15px
      color: #27273E
      height :31px
      width 142px
      background: #EFEEF5
      border-radius: @height
      text-align :center
      position: relative
      display :flex
      .tab-item
        flex: 1
        height :31px
        position: relative
        transition :color 0.3s
        line-height :@height
        &.active
          color: #FFFFFF
      .tab-scroll-chunk
        position: absolute
        top:0
        left: 0
        display :block
        width :76px
        height: 31px
        border-radius :@height
        background :#D83F35
        transform: translate3d(0,0,0)
        transition :transform 0.3s
  /*表单结构*/
  .form-wrapper
    width :200vw
    layout(row,block,nowrap)
    overflow :hidden
    .form-item-wrapper
      width :50%
      transform: translate3d(0,0,0)
      transition :transform 0.3s

  /*版权信息*/
  .copyright
    position fixed
    left :0
    right :0
    bottom :0
    padding-bottom:px2vw(31)
    font-family: $font-family-regular
    font-size: 11px
    color: #818D99
    line-height: 1
    text-align :center
    .rule
      color: #818D99
      text-decoration :underline


</style>
