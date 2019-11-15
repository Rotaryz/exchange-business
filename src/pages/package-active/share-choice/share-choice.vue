<template>
  <div class="share-choice">
    <navigation-bar title="选择商品"></navigation-bar>
    <div class="share-choice-box" v-if="goodsList.length && totalPage >= 1">
      <div class="choice-item-box" v-for="item in goodsList" :key="item.id">
        <image :src="item.goods_cover_image" class="choice-img"></image>
        <div class="choice-content">
          <div class="content-title">{{item.name}}</div>
          <div class="content-price-box">
            <div class="price-box">售价: ¥{{item.price}}</div>
            <div class="price-box">销量: {{item.sale_count}}</div>
          </div>
        </div>
        <div class="choice-right" @click="clickGoods(item)">
          <img v-if="item.select" src="./icon-pick@2x.png" class="choice-icon" alt="">
          <div v-else class="null-icon"></div>
        </div>
      </div>
    </div>
    <div class="empty-page" v-else>
      <empty :image="require('./pic-shopcar@2x.png')" tip="暂无商品"></empty>
    </div>
    <div class="add-btn-fixed">
      <div class="share-add-btn">
        <div class="add-btn" @click="submitGoods">确定</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Empty from '@components/empty/empty'

  const PAGE_NAME = 'SHARE_CHOICE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      Empty
    },
    data() {
      return {
        repeatSubmit: false,
        params: {
          is_available: true,
          except_promotion_type: 3,
          limit: 10,
          page: 1
        },
        loading: false,
        totalPage: 0,
        goodsList: []
      }
    },
    onLoad() {
      this.getServiceGoods()
    },
    // 下拉加载
    onReachBottom() {
      if (this.params.page + 1 > this.totalPage || this.loading) return
      this.params.page++
      this.getServiceGoods()
    },
    methods: {
      // 获取服务商品列表
      getServiceGoods() {
        this.loading = true
        API.Share.serviceGoods({ data: this.params, loading: false }).then(res => {
          res.data.forEach((item) => {
            item.select = false
          })
          if (this.params.page === 1) this.goodsList = []
          this.goodsList = [...this.goodsList, ...res.data]
          this.totalPage = res.meta.last_page
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 点击选中
      clickGoods(item) {
        item.select = !item.select
      },
      // 确认选择商品
      submitGoods() {
        let arr = []
        this.goodsList.forEach((item) => {
          if (item.select) {
            arr.push({
              goods_id: item.id
            })
          }
        })
        if (arr.length === 0) {
          this.$wechat.showToast('请选择服务商品！')
          return
        }
        // 防止多次点击
        if (this.repeatSubmit) return
        this.repeatSubmit = true
        API.Share.createServiceGoods({data: {goods: arr}, loading: true}).then(res => {
          this.$wechat.showToast('添加商品成功！')
          setTimeout(() => {
            wx.navigateBack()
            this.repeatSubmit = false
          }, 1500)
        }).catch(() => {
          this.repeatSubmit = false
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .share-choice
    width: 100%
    height: 100vh
    display: flex
    flex-direction: column
  .share-choice-box
    padding: 10px 10px 64px
    box-sizing: border-box
    .choice-item-box
      background: $color-white
      border-radius: 2px
      padding: 15px 15px 15px 10px
      layout(row)
      align-items: center
      .choice-img
        width: 70px
        height: @width
        display: block
        margin-right: 10px
      .choice-content
        layout(row)
        justify-content: space-between
        flex: 1
        overflow: hidden
        min-height: 70px
        .content-title
          font-family: $font-family-regular
          color: $color-text-sub
          font-size: $font-size-16
          no-wrap()
        .content-price-box
          layout(row)
          width: 100%
          align-items: center
          .price-box
            flex: 1
            font-family: $font-family-regular
            color: $color-text-secondary
            font-size: $font-size-14
      .choice-right
        extend-click()
        width: 20px
        height: @width
        .choice-icon
          display: block
          width: 20px
          height: @width
          background: $color-white
        .null-icon
          background: $color-white
          border: 2px solid #BCC4CC
          box-sizing: border-box
          border-radius: 50%
          display: block
          width: 20px
          height: @width
  .add-btn-fixed
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    .share-add-btn
      border-top-1px(#e6e6e6)
      width: 100%
      padding: 10px
      height: 64px
      box-sizing: border-box
      background: $color-white
      .add-btn
        font-family: $font-family-regular
        color: $color-white
        font-size: $font-size-16
        text-align: center
        border-radius: 2px
        background: $color-money
        height: 44px
        line-height: 44px
  .empty-page
    background-color: $color-white
    flex: 1
    padding: 10px 10px 64px
</style>
