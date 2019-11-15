<template>
  <div class="goods-search">
    <navigation-bar title="商城"></navigation-bar>
    <section class="search-wrapper">
      <div class="input-wrapper">
        <img class="search-img" mode="aspectFit" src="./icon-search_ssy@2x.png">
        <input
          type="text"
          placeholder="请输入商品名称"
          placeholder-class="input-p"
          confirm-type="search"
          placeholder-style="color: #BCC4CC; font-size:15px"
          :focus="true"
          @focus="handleFocus"
          @blur="handleBlur"
          @confirm="handleConfirm"
          v-model="goodsNameInput"
        >
        <figure v-if="showClearGoodsNameBtn" class="close" @click="handleClearGoodsName">
          <img class="close-img" mode="aspectFit" src="./icon-delss@2x.png">
        </figure>
      </div>
      <div class="btn" @click.stop="handleSearch('')">搜索</div>
    </section>
    <section v-if="isShowHistory && historyArray.length" class="history-wrapper">
      <div class="title-wrapper">
        <p class="history">历史记录</p>
        <img
          class="delete-img"
          mode="aspectFit"
          src="./icon-del_dz@2x.png"
          @click="handleClearHistoryArr"
        >
      </div>
      <ul class="list-wrapper">
        <li v-for="(item, index) in historyArray" :key="index" class="item-wrapper" @click="handleSearch(item)">{{item}}</li>
      </ul>
    </section>
    <!--<classify-item :item="item"></classify-item>-->

    <section v-if="!isShowHistory">
      <div class="classify-wrapper goods-ul">
        <block v-for="(item, index) in classifyArray" :key="index">
          <classify-item :item="item"></classify-item>
        </block>
      </div>
      <loading-more v-if="classifyMore"></loading-more>
      <div v-if="classifyShowEmpty" class="empty-wrapper">
        <empty :image="empty" :paddingTop="1" tip="未找到你想要的商品" tipSub="换个关键词试试吧～"></empty>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ClassifyItem from './home-classify-item/home-classify-item'
  // import isActiveEmpty from '@components/is-active-empty/is-active-empty'
  import LoadingMore from '@components/loading-more/loading-more'
  import ClearWatch from '@mixins/clear-watch'
  import API from '@api'
  import Empty from '@components/empty/empty'

  const EMPTY = require('./pic-search@2x.png')

  const PAGE_NAME = 'GOODS_SEARCH'
  const MAX_HISTORY = 10
  export default {
    name: PAGE_NAME,
    mixins: [ClearWatch],
    components: {
      NavigationBar,
      ClassifyItem,
      LoadingMore,
      Empty
    },
    data() {
      return {
        empty: EMPTY,
        isShowHistory: true,
        goodsName: '',
        historyArray: [],
        classifyPage: 1,
        classifyMore: true,
        classifyArray: [],
        classifyShowEmpty: false
        // autoFocus: true
      }
    },
    computed: {
      showClearGoodsNameBtn() {
        return this.goodsName
      },
      goodsNameInput: {
        get() {
          return this.goodsName
        },
        set(val) {
          if (!val) {
            this.isShowHistory = true
          }
          this.goodsName = val
          return val
        }
      }
    },
    watch: {
      isShowHistory(val) {
        if (val) {
          this.classifyArray = []
        }
      }
    },
    onLoad() {
      let arr = wx.getStorageSync('historyArray') || []
      this.historyArray = arr
    },
    onReachBottom() {
      if (this.isLoading) return
      this.classifyPage++
      this._getClassifyList(false)
    },
    methods: {
      handleFocus(e) {
        if (!this.goodsName) {
          this.isShowHistory = true
        }
      },
      handleBlur() {
      },
      handleSearch(goodsName) {
        if (goodsName) {
          this.goodsName = goodsName
        }
        if (!this.goodsName) {
          this.$wechat.showToast('商品名称不能为空')
          return
        }
        this.isShowHistory = false
        let arr = this.historyArray
        arr.unshift(this.goodsName)
        arr = [...new Set(arr)]
        if (arr.length > MAX_HISTORY) {
          this.historyArray = arr.splice(0, MAX_HISTORY)
        } else {
          this.historyArray = arr
        }
        wx.setStorageSync('historyArray', this.historyArray)
        this.resetReqParams()
        this._getClassifyList()
      },
      handleClearGoodsName() {
        this.goodsName = ''
        // this.autoFocus = true
      },
      handleClearHistoryArr() {
        this.historyArray = []
        wx.removeStorageSync('historyArray')
      },
      handleConfirm() {
        this.handleSearch('')
      },
      // 获取商品分类列表
      async _getClassifyList(loading = true) {
        if (!this.classifyMore) return
        if (!this.goodsName) return
        try {
          const data = {
            name: this.goodsName,
            use_type: 1,
            page: this.classifyPage
          }
          this.isLoading = true
          let res = await API.Home.platformGoods({
            data,
            loading,
            toast: true,
            doctor() {
            }
          })
          if (res.meta.current_page === 1) {
            this.classifyArray = res.data
            this.classifyShowEmpty = res.meta.total === 0
          } else {
            res.data.forEach((item) => {
              this.classifyArray.push(item)
            })
          }
          this.classifyMore = res.meta.current_page < res.meta.last_page
          wx.nextTick(() => {
            this.isLoading = false
          })
        } catch (e) {
          // console.warn(e)
          this.isLoading = false
        }
      },
      resetReqParams() {
        this.classifyMore = true
        this.classifyPage = 1
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/goodsList.styl"

  .goods-search
    min-height: 100vh
    background: $color-white

  .input-p
    font-family: $font-family-regular
    font-size: 15px
    color: #BCC4CC

  .goods-search
    width: 100%
    .search-wrapper
      font-family: $font-family-regular
      padding: 0 18px 0 10px
      layout(block, block, nowrap)
      align-items: center
      z-index: 50
      .input-wrapper
        flex: 1
        height: 34px
        display: flex
        align-items: center
        background: #F5F5F9
        padding: 0 13px 0 15px
        border-radius: 2px
        position: relative
        .close
          position: absolute
          right: 0
          z-index: 100
          height: 32px
          width: @height
          display: flex
          align-items: center
          justify-content: flex-end
          .close-img
            width: 13px
            height @width
            padding-right: 13px
        .search-img
          width: 14px
          height: 14px
        input
          flex: 1
          height: 20px
          padding: 0 15px 0 8px
          font-size: 15px
          line-height: @height
      .btn
        font-size: 15px
        padding-left: 18px
    .history-wrapper
      padding: 24.5px 10px
      font-family: $font-family-regular
      font-size: 13px
      color: $color-text-main
      line-height: 1
      .title-wrapper
        display: flex
        align-items: center
        justify-content: space-between
        font-family: $font-family-medium
        font-size: 15px
        .delete-img
          width: 16px
          height: 16px
          display: block
      .list-wrapper
        layout(row, block)
        padding: 15px 0
        max-height: 210px
        box-sizing: border-box
        overflow: hidden
        .item-wrapper
          margin-bottom: 10px
          margin-right: 10px
          padding: 0 14px
          box-sizing: border-box
          height: 29px
          border-radius: 2px
          background: #F5F5F9
          color: $color-text-main
          line-height: @height
          max-width: 120px
          no-wrap()

    .classify-wrapper
      margin-top: 5px
      background: #fff
      position: relative
      border-top-1px()

    .empty-wrapper
      padding-top: 95.5px

  .history
    font-family: $font-family-medium
</style>
