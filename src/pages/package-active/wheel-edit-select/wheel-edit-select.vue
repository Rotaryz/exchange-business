<template>
  <div class="wheel-edit-select">
    <navigation-bar title="选择奖品"></navigation-bar>
    <dl class="header">
      <dt class="line-wrapper" :style="{transform :'translate3d('+ tabIndex* 100+'%,0,0)'}">
        <div class="line"></div>
      </dt>
      <dd v-for="(item, index) in tabList" :key="index" class="item-wrapper" :class="{active: tabIndex === index}" @click="handleChangeTab(item,index)">{{item.text}}</dd>
    </dl>
    <div class="holder"></div>
    <ul class="scroll-wrapper" :style="{transform :'translate3d('+ -tabIndex* 100/3+'%,0,0)'}" :class="{'max-height': tabIndex}">
      <li v-for="(item, index) in tabList" :key="index" class="single-wrapper">
        <section v-if="index === 0" class="serve-list">
          <div v-for="(card, cIdx) in serveList" :key="cIdx" class="serve-card" :style="{height: cardHeight + 'px'}" @click="handleSelect(card, cIdx)">
            <img :src="card.image_url" alt="" class="left" mode="aspectFill">
            <div class="middle">
              <p class="title">{{card.name}}</p>
              <p class="stock">库存{{card.totalStock}}</p>
              <p class="price-wrapper"><span class="unit">¥</span><span>{{card.price}}</span></p>
            </div>
            <div class="right" :class="{active: card.selected}">
              <div class="circle"></div>
              <img src="./icon-pick@1x.png" alt="" class="circle select">
            </div>
          </div>
          <empty v-if="showEmpty" height="70vh"></empty>
        </section>
        <section v-if="index === 1" class="input-wrapper">
          <p class="left">兑换券</p>
          <div class="right">
            <input type="number" maxlength="17" placeholder="请输入兑换券数量" placeholder-class="placeholder" class="input" v-model="certificateModel">
          </div>
        </section>
        <section v-if="index === 2" class="input-wrapper">
          <p class="left">播豆</p>
          <div class="right">
            <input type="number" maxlength="17" placeholder="请输入播豆数量" placeholder-class="placeholder" class="input" v-model="beanModel">
          </div>
        </section>
      </li>
    </ul>
    <edit-button :opacity="check" @click="handleSubmit"></edit-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as WheelEditHelpers from '../wheel-edit/modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import EditButton from '@components/edit-button/edit-button'
  import {globalComputed} from '@state/helpers'
  import {createGift, resolveServeData} from '../wheel-edit/wheel-handle'
  import Empty from '@components/empty/empty'

  // import wx from 'wx'
  console.log(Empty)

  const PAGE_NAME = 'WHEEL_EDIT_SELECT'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      EditButton,
      Empty
    },
    data() {
      return {
        tabList: [
          {
            text: '服务',
            type: 1
          },
          {
            text: '兑换券',
            type: 3
          },
          {
            text: '播豆',
            type: 2
          }
        ],
        tabIndex: 0,
        certificate: '',
        bean: '',
        serveList: [],
        selectedItem: null,
        selectObj: {},
        page: 1,
        hasMore: true,
        isFirstLoad: true,
        wipeList: [],
        showEmpty: false
      }
    },
    computed: {
      ...WheelEditHelpers.computed,
      ...globalComputed,
      cardHeight() {
        return (this.$systemInfo.screenWidth - 20) * 0.28169014084507044
      },
      check() {
        return !!this.selectedItem
      },
      certificateModel: {
        get() {
          return this.certificate
        },
        set(val) {
          this.certificate = val
          this.selectedItem = createGift({type: 3, number: this.certificate})
        }
      },
      beanModel: {
        get() {
          return this.bean
        },
        set(val) {
          this.bean = val
          this.selectedItem = createGift({type: 2, number: this.bean})
        }
      }
    },
    onLoad(options) {
      this._initConfig(options)
      this.getWipeList()
      this._getList()
    },
    onReachBottom() {
      this.page++
      this._getList()
    },
    methods: {
      ...WheelEditHelpers.methods,
      _initConfig(options = {}) {
        if (!(+options.changeIndex)) return
        let obj = this.selectList[options.changeIndex] || {}
        let index = this.tabList.findIndex(val => +val.type === +obj.type)
        this.handleChangeTab({}, index)
        switch (obj.type) {
          case 2:
            this.bean = obj.number
            break
          case 3:
            this.certificate = obj.number
            break
          default:
            break
        }
        this.selectObj = obj
      },
      getWipeList() {
        let arr = []
        this.selectList.forEach((item) => {
          if (+item.type === 1) {
            arr.push(item.object_id)
          }
        })
        this.wipeList = arr
      },
      _getList() {
        if (!this.hasMore) return
        API.Wheel.getServeList(this.page, this.wipeList, this.isFirstLoad).then(res => {
          const arr = resolveServeData(res.data)
          if (this.page === 1) {
            this.serveList = arr
            this.showEmpty = !arr.length
          } else {
            this.serveList = this.serveList.concat(arr)
          }
          this.hasMore = res.meta.current_page < res.meta.last_page
        })
        this.isFirstLoad = false
      },
      handleSubmit() {
        this['SET_SELECT_ITEM']({...this.selectedItem})
        wx.navigateBack()
      },
      handleChangeTab(item, index) {
        if (this.tabIndex === index) return
        this.tabIndex = index
        this.resetSelect()
      },
      handleSelect(card, cIdx) {
        this.serveList = this.serveList.map(item => {
          if (item.object_id === card.object_id) {
            item.selected = !card.selected
            this.selectedItem = createGift({type: 1, number: 1}, item)
          } else {
            item.selected = false
          }
          return item
        })
      },
      resetSelect() {
        this.selectedItem = null
        this.serveList = this.serveList.filter((item, index) => {
          item.selected = false
          return index <= 20
        })
        this.certificate = ''
        this.bean = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $tab-height=45px
  @import "~@design"

  .placeholder
    font-family: $font-family-regular
    font-size: 14px
    color: #BCC4CC

  .wheel-edit-select
    min-height :100vh
    overflow-x :hidden

    .holder
      height :$tab-height
    .header
      height: $tab-height
      font-family: $font-family-regular
      font-size: 16px
      color: #606972
      text-align: center
      layout(row,block,nowrap)
      background :#fff
      position: fixed
      left: 0
      right: 0
      z-index :999
      .item-wrapper
        flex: 1
        layout(row,block,nowrap)
        justify-content :center
        align-items : center
        height :$tab-height
        line-height :@height
        &.active
          font-family: $font-family-medium
          color: #1D2023;
      .line-wrapper
        width : (100/3)%
        height: 3px
        position: absolute
        bottom: 0
        transform :translate3d(0,0,0)
        transition :transform 0.3s
        .line
          margin :0 auto
          height :100%
          width :30px
          background: #D83F35
          border-radius: 100px

  .scroll-wrapper
    width :300vw
    overflow-x :hidden
    layout(row,block,nowrap)
    transform :translate3d(0,0,0)
    transition :transform 0.3s
    &.max-height
      height : 400px
      overflow :hidden
    .single-wrapper
      flex: 1


  .serve-list
    padding :10px 10px (65+10)px
    .serve-card
      height :100px
      background: #FFFFFF
      border-radius: 2px
      margin-bottom :10px
      layout(row,block,nowrap)
      align-items: center
      overflow :hidden
      .left
        margin : 0 10px
        width :px2vw(70)
        height :@width
        border-radius: 2px
        background :#ccc
      .middle
        flex: 1
        overflow :hidden
        font-family: $font-family-regular
        font-size: 14px
        line-height: 1
        width :100px
        .title
          font-size: 16px
          color: #3F454B;
          letter-spacing: 0.8px
          no-wrap()
        .stock
          padding-top :12.5px
          color: #818D99;
          letter-spacing: 0.6px
        .price-wrapper
          padding-top :6px
          font-family: $font-family-medium
          font-size: 18px
          color: #D83F35;
          letter-spacing: 0.77px
          line-height: 18px
          .unit
            position :relative
            bottom :1px
            font-size: 12px
            margin-right :2px
      .right
        padding-left:5px
        width :50px
        height :100px
        layout(row)
        justify-content :center
        align-items: center
        position :relative
        &.active
          & > .circle
            opacity : 0
          & > .circle.select
            opacity : 1
        .circle
          all-center()
          box-sizing :border-box
          border: 1px solid #BCC4CC
          border-radius :50%
          width: 20px
          height: @width
          opacity : 1
          transition :opacity 0.2s
          &.select
            border: none
            opacity : 0
            transition :opacity 0.2s
  .input-wrapper
    margin :20px 10px
    background: #FFFFFF
    border-radius: 2px
    height: 80px
    layout(row,block,nowrap)
    align-items :center
    font-family: $font-family-regular
    font-size: 14px
    color: #606972
    line-height: 1
    padding :0 15px
    .left
      flex: 1
    .right
      height :14px
      line-height: @height
      .input
        position :relative
        top: -4px
        width: 200px
        height :20px
        font-family: $font-family-medium
        font-size: @height
        color: #1D2023
        line-height: @height
        text-align :right
        text-indent :-2px
</style>
