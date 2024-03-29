<template>
  <div id="navigationBar">
    <div class="head-item" :class="showTitle ? '' : 'showNavigation'">
      <div class="head-bc" :style="headStyleData"></div>
      <div v-if="isShowSearch" class="search-box" @click="search">
        <img v-if="isBlackSearch" src="./icon-search@2x.png" class="search">
        <img v-else src="./icon-search_white@2x.png" class="search">
      </div>
      <div class="status-bar" :style="{height: statusBarHeight + 'px'}"></div>
      <div class="head-content" :style="{color: titleColorData}">
        {{currentTitle}}
        <div class="head-arrow" v-if="showArrow" @click="goBackUrl">
          <img v-if="arrowType === 'black'" src="./icon-title_back@2x.png" class="head-arrow-img">
          <img v-if="arrowType === 'white'" src="./icon-top_left@2x.png" class="head-arrow-img white">
        </div>
      </div>
    </div>
    <div v-if="!translucent || isPHB" :style="{height: statusBarHeight + 44 + 'px'}"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  /* eslint-disable no-undef */
  import wx from 'wx'

  // import app from '@src/app.json'

  function pageRouter() {
    return '/pages/home'
  }

  let DEFAULT_PAGE = pageRouter()

  const DTC = '#1D2023'
  export default {
    name: 'HEAD_ITEM',
    props: {
      // 标题
      title: {
        type: String,
        default: ''
      },
      // 头部背景颜色
      headStyle: {
        type: String,
        default: 'background: #ffffff'
      },
      // 是否显示返回箭头
      showArrow: {
        type: Boolean,
        default: true
      },
      arrowColor: {
        type: String,
        default: 'black' // white
      },
      // 标题文字颜色
      titleColor: {
        type: String,
        default: DTC
      },
      // 是否在点击返回时自定义方法
      custom: {
        type: Boolean,
        default: false
      },
      // 是否为沉浸式
      translucent: {
        type: Boolean,
        default: false
      },
      // 自定义沉浸式滚动fn
      hasTranslucentFn: {
        type: Boolean,
        default: false
      },
      arrowUrl: {
        type: String,
        default: '/zd-image/1.2/icon-title_back@2x.png'
      },
      hasTranslucentHeight: {
        type: Number,
        default: 100
      },
      exceedHeightFn: {
        type: Boolean,
        default: true
      },
      exceedHeight: {
        type: Number,
        default: 100
      },
      titleMaxLen: {
        type: Number,
        default: 10
      },
      isShowSearch: {
        type: Boolean, // 是否展示搜索框
        default: false
      },
      // 标题是否占位
      isPHB: {
        type: Boolean,
        default: false
      },
      isOpacity: {
        type: Boolean,
        default: false
      }
    },
    onPageScroll(e) {
      this._diyHeadNavigation(e)
      this._exceedHeadShow(e)
    },
    data() {
      return {
        statusBarHeight: 20,
        translucentTitle: this.title,
        headStyleData: this.headStyle,
        titleColorData: this.titleColor,
        showTitle: true,
        isBlackSearch: false,
        arrowType: this.arrowColor
      }
    },
    watch: {
      title(news) {
        this.translucentTitle = news
      }
    },
    created() {
      let res = mpvue.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
    },
    onLoad() {
      const color = this.arrowType === 'black' ? DTC : '#ffffff'
      this._initHeadStyle()
      // this.setNavBar(color)
      this.titleColorData = color
    },
    methods: {
      setNavBar(frontColor = '#000000') {
        if (frontColor === DTC) {
          frontColor = '#000000'
        }
        // 搜索
        this.isBlackSearch = frontColor === '#000000'
      },
      search() {
        this.$emit('search')
      },
      setNavigationBarTitle(title) {
        this.translucentTitle = title
      },
      setNavigationBarBackground(styles) {
        this.headStyleData = styles
      },
      getStatusBarHeight() {
        return this.statusBarHeight
      },
      _diyHeadNavigation(e) {
        // 是否为沉浸式
        if (!this.translucent) return
        // 是否自定义沉浸式方法
        if (this.hasTranslucentFn) {
          this.$emit('headNavigation', e)
          return
        }
        // 沉浸式滚动时的效果
        if (e.scrollTop >= this.hasTranslucentHeight) {
          this.headStyleData = 'background: #ffffff'
          this.titleColorData = DTC
          this.translucentTitle = this.title
          this.$emit('showTitle')
          this.arrowType = 'black'
        } else {
          this.headStyleData = 'display: none'
          this.titleColorData = '#ffffff'
          this.translucentTitle = this.isOpacity ? this.title : ''
          this.$emit('inTop')
          this.arrowType = 'white'
        }
        // this.setNavBar(this.titleColorData)
      },
      _initHeadStyle() {
        if (this.translucent && !this.isOpacity) {
          this.headStyleData = 'display: none'
          this.titleColorData = 'transparent'
          this.translucentTitle = ''
        } else if (this.isOpacity) {
          this.headStyleData = 'display: none'
          this.translucentTitle = this.title
        }
      },
      goBackUrl() {
        // 如果有自定义方法，会向父级页面传递一个customFn的方法，如果没有直接返回
        if (this.custom) {
          this.$emit('customFn')
          return
        }
        let pages = getCurrentPages()
        if (+pages.length === 1) {
          console.log(DEFAULT_PAGE)
          wx.switchTab({ url: DEFAULT_PAGE })
        } else {
          wx.navigateBack({ delta: 1 })
        }
      },
      _exceedHeadShow(e) {
        if (this.exceedHeightFn) return
        // 沉浸式滚动时的效果
        if (e.scrollTop >= this.exceedHeight) {
          this.showTitle = false
        } else {
          this.showTitle = true
        }
      },
      setTranslucentTitle(title) {
        if (this.translucentTitle === title) return
        this.translucentTitle = title
      }
    },
    computed: {
      currentTitle() {
        if (this.translucentTitle.length > this.titleMaxLen) {
          return this.translucentTitle.slice(0, this.titleMaxLen) + '···'
        } else {
          return this.translucentTitle
        }
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  .head-item
    position: fixed
    width: 100vw
    left: 0
    top: 0
    z-index: 100

    .head-bc
      position: absolute
      left: 0
      top: 0
      right: 0
      bottom: 0
      transition: all 0.3s

    .head-arrow
      position: absolute
      left: 0
      bottom: 0
      height: 100%
      width: 40px
      display: flex
      align-items: center

      /*&:after*/
        /*content: ''*/
        /*position: absolute*/
        /*width: 100%*/
        /*height: 100%*/
        /*padding: 12px 20px*/

      .head-arrow-img
        display: block
        margin-left: 13.5px
        width: 18px
        height: @width
        &.white
          margin-left: 7px
          width: 32px
          height: @width

    .head-content
      position: relative
      text-align: center
      line-height: 44px
      height: 44px
      font-size: 18px
      font-family: PingFangSC-Medium
      color: #000000

  .showNavigation
    opacity: 0

  .search-box
    height: 100%
    position: absolute
    top: 0
    left: 0
    width: 47px
    z-index: 10

    .search
      width: 20px
      height: 20px
      position: absolute
      left: 50%
      transform: translateX(-50%)
      bottom: 10px
      z-index: 10
</style>
