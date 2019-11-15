<template>
  <div v-if="isShow" class="brand-content" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
    <navigation-bar title="品牌内容"></navigation-bar>
    <block v-if="banner">
      <img mode="widthFix" :src="banner" alt="" class="banner">
    </block>
    <header class="header">
      <img v-if="author.head_image_url" mode="aspectFill" :src="author.head_image_url" alt="" class="left">
      <div class="middle">
        <p class="title">{{author.nickname}}</p>
        <p class="sub-title">{{author.sign}}</p>
      </div>
      <img src="./icon-high_quality@2x.png" alt="" class="right">
    </header>
    <p class="page-view">浏览{{info.browse_count}}</p>
    <div class="like-wrap">
      <div class="like-total" @click="setLikeBtn">
        <img v-if="info.is_fabulou" src="./icon-like_big1@2x.png" class="like-icon">
        <img v-else src="./icon-like_big2@2x.png" class="like-icon">
        <div class="total-count">{{info.fabulous_num }}</div>
      </div>
      <div class="good-list-wrap">
        <block v-if="likeList.length">
          <img v-for="(item,idx) in likeList" :key="idx" :src="item.avatar" class="liker-photo">
        </block>
        <block v-else>快来第一个点赞吧~</block>
      </div>
    </div>
    <h1 class="head-title">{{info.title}}</h1>
    <section class="context-wrapper">
      <block v-for="(item, index) in content" :key="index">
        <text class="default-item text"
              v-if="item.type === 'text'"
              space="nbsp"
              selectable
        >{{item.content[0].text}}</text>
        <block v-if="item.type === 'image' && item.content[0].image && item.content[0].image.url">
          <img mode="widthFix" :src="item.content[0].image.url" alt="" class="default-item picture">
        </block>
        <div class="default-item"
             v-if="item.type === 'goods' && item.content[0].goods"
        >
          <goods-item :item="item.content[0].goods"></goods-item>
        </div>
        <block v-if="item.type === 'video' && item.content[0].video && item.content[0].video.url">
          <video :src="item.content[0].video.url" :poster="item.content[0].video.cover_image_url" :id="'video'+item.content[0].video.id" class="default-item video"></video>
        </block>
      </block>
    </section>
    <footer class="footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
      <div class="left" @click="setLikeBtn">
        <img v-if="info.is_fabulou" src="./icon-like_big1@2x.png" class="like-icon">
        <img v-else src="./icon-like_big2@2x.png" class="like-icon">
        <div class="total-count">{{info.fabulous_num || 0}}</div>
      </div>
      <div v-if="goodsList.length" class="right" @click="toggleMaskHandle" >商品({{goodsList.length}})</div>
    </footer>
    <goods-mask :visible="visible" :goodsList="goodsList" @hide="toggleMaskHandle"></goods-mask>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import GoodsItem from './goods-item/goods-item'
  import GoodsMask from './goods-mask/goods-mask'

  const PAGE_NAME = 'BRAND_CONTENT'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      GoodsItem,
      GoodsMask
    },
    data() {
      return {
        info: {},
        id: 0,
        likeList: [],
        visible: false,
        isShow: false
      }
    },
    computed: {
      banner() {
        return (this.info.cover_image && this.info.cover_image.url) || ''
      },
      author() {
        return this.info.author || {}
      },
      content() {
        const obj = (this.info.assembly && this.info.assembly.find(val => val.style_type === 'content')) || {}
        return obj.content || []
      },
      goodsList() {
        const list = []
        this.content.forEach(val => {
          if (val.type === 'goods') {
            list.push(val.content[0].goods)
          }
        })
        return list
      }
    },
    onLoad(options = {}) {
      this.id = options.id || 0
      this._getDetail(this.id)
      this._report(this.id)
      this._getLikeList(this.id)
    },
    onHide() {
      this.visible = false
    },
    methods: {
      _getDetail(id, cb) {
        const data = {
          id
        }
        API.Brand.getContentDetail({data}).then((res) => {
          this.info = res.data
          this.isShow = true
        })
      },
      _getLikeList(id) {
        const data = {
          article_id: id
        }
        API.Brand.getLikeList({data}).then((res) => {
          this.likeList = res.data
        })
      },
      // 操作类型（browse=浏览，fabulou=点赞，share=分享）
      _report(id, handle = 'browse', cb) {
        const data = {
          article_id: id,
          handle
        }
        API.Brand.reportAction({data}).then((res) => {
          cb && cb()
        })
      },
      setLikeBtn() {
        this._report(this.id, 'fabulou', () => {
          this._getLikeList(this.id)
          this._getDetail(this.id)
        })
      },
      toggleMaskHandle() {
        if (!this.goodsList.length) return
        this.visible = !this.visible
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .brand-content
    min-height :100vh
    background :#fff
    overflow-x hidden
    // 首图片板块
    .banner
      display block
      width 100vw
      max-height:px2vw(500)
      font-size :0
    // 头部板块
    .header
      padding 0 15px
      layout(row,block,nowrap)
      .left
        display :block
        margin-top :15px
        width: 50px
        height: @width
        box-sizing :border-box
        background: #FFFFFF
        box-shadow: 0 5px 13px 0 rgba(63,69,75,0.06)
        border-radius: 2px
        border-1px(#EFEEF5, 2px)
      .middle
        flex: 1
        overflow :hidden
        font-family: $font-family-regular
        line-height: 1
        margin: 0 20px 0 10px
        .title
          padding-top 21px
          font-family: $font-family-medium
          color: #3F454B
          font-size: 18px
        .sub-title
          width :100%
          padding-top :10px
          opacity: 0.8
          font-size: 12px
          color: #A0A5AA
          no-wrap()
      .right
        margin-top :15px
        width: 44.5px
        height: 42px
    // 内容板块
    .page-view
      font-family: $font-family-regular
      font-size: 12px
      color: #333333
      line-height: 1
      padding :20px 0 10px
      margin-left :15px
      border-bottom-1px()

  // 点赞板块
  .like-wrap
    height: 56px
    display flex
    align-items center
    border-bottom-1px()
    .like-total
      padding: 10px 18px 10px 15px
      text-align center
      .like-icon
        width: 15px
        height: 15px
      .total-count
        font-size $font-size-10
        color: #111
        margin-top: 2px
        text-align :center
    .good-list-wrap
      flex: 1
      height: 56px
      line-height: 56px
      display flex
      flex-wrap nowrap
      overflow :hidden
      color: #808080
      font-size: $font-size-12
      align-items :center
    .liker-photo
      width: 26px
      height: 26px
      margin: 0 15px 0 0
      flex-shrink 0
      border-radius 50%
      border: 1px solid #E6E6E6

  // 底部板块
  .footer
    position: fixed
    bottom :0
    left :0
    right: 0
    height: 49px
    background: #FFFFFF
    box-shadow: 0 -4px 20px 0 rgba(29,32,35,0.06)
    layout(row,block,nowrap)
    align-items :center
    justify-content :space-between
    .right
      margin-right :15px
      width: 115px
      height: 38.5px
      background: #D83F35
      border-radius: 3px
      font-family: $font-family-regular
      font-size: 16px
      color: #FFFFFF
      letter-spacing: 0.8px
      text-align: center
      line-height: @height
    .left
      height :100%
      width :(30*2+23)px
      line-height :49px
      position relative
      display :flex
      align-items :center
      justify-content :center
      .like-icon
        width: 23px
        height: @width
      .total-count
        position absolute
        left :53px
        top: 9px
        font-family: $font-family-medium
        font-size: 11px
        color: #3F454B

  .head-title
    padding-left: 15px
    padding-right :@padding-left
    padding-top: 20px
    font-size :20px
    font-family :$color-text-main
    color: $color-text-main

  // 内容板块
  .context-wrapper
    padding : 15px 15px 57px 15px
    .default-item
      border-bottom :15px solid transparent
      &.text
        font-family: $font-family-regular
        font-size: 16px
        color: #3F454B
        letter-spacing: 0.3px
        line-height: 30px
        word-break : break-all
        display block
      &.picture
        width :100%
        display :block
        background: #FFFFFF
        box-sizing :border-box
        border-radius :2px
      &.video
        display block
        width: 100%
        border-radius 2px
</style>
