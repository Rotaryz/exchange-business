<template>
  <div class="share-edit">
    <navigation-bar title="编辑分销商品"></navigation-bar>
    <div class="share-edit-box">
      <div class="share-info">
        <div class="share-info-top">
          <image :src="goodsDetail.goods_cover_image" class="info-img" mode="aspectFill"></image>
          <div class="info-content">
            <div class="info-content-title">{{goodsDetail.name}}</div>
            <div class="info-price-box">
              <div class="price-box">售价: ¥{{goodsDetail.price}}</div>
              <div class="number-box">佣金: <span class="number-color">{{showValue}}%</span></div>
            </div>
          </div>
        </div>
        <div class="share-info-bottom">
          <div class="share-bottom-left">
            <div class="bottom-left-text">设置佣金</div>
            <div class="bottom-left-sub">(默认佣金比例为5%,可修改)</div>
          </div>
          <div class="share-bottom-right">
            <input v-model="editValue" maxlength="10" class="base-input" type="number">
            <div class="base-icon">%</div>
          </div>
        </div>
      </div>
      <div class="add-btn" @click="submitEdit">确定</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'SHARE_EDIT'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        repeatSubmit: false,
        editValue: '',
        goodsDetail: {},
        showValue: '',
        id: ''
      }
    },
    onLoad(options) {
      this.id = options.id
      this.getGoodsDetail(options.id)
    },
    methods: {
      // 获取商品详情
      getGoodsDetail(id) {
        API.Share.serviceGoodsDetail({ data: { id }, loading: false }).then(res => {
          this.editValue = res.data.commission
          this.showValue = res.data.commission
          this.goodsDetail = res.data.goods
        })
      },
      // 提交编辑
      submitEdit() {
        if (this.editValue.length === 0) {
          this.$wechat.showToast('请输入佣金比例！')
          return
        } else if (this.editValue * 1 < 0) {
          this.$wechat.showToast('佣金比率必须大于等于0')
          return
        } else if (this.editValue * 1 > 100) {
          this.$wechat.showToast('佣金比率必须小于等于100')
          return
        }
        // 防止多次点击
        if (this.repeatSubmit) return
        this.repeatSubmit = true
        API.Share.updateShareGoods({ data: { id: this.id, commission: this.editValue }, loading: true }).then(res => {
          this.$wechat.showToast('编辑佣金比例成功！')
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

  .share-edit
    width: 100%

  .share-edit-box
    padding: 10px
    box-sizing: border-box

    .share-info
      background: $color-white
      border-radius: 2px
      padding: 0 10px
      box-sizing: border-box

      .share-info-top
        layout(row)
        padding: 15px 0
        border-bottom-1px(#EFEEF5)

        .info-img
          display: block
          width: 70px
          height: @width
          border-radius: 2px
          margin-right: 10px

        .info-content
          flex: 1
          overflow: hidden

          .info-content-title
            font-family: $font-family-regular
            color: $color-text-sub
            font-size: $font-size-16
            no-wrap()
            margin-bottom: 15px

          .info-price-box
            layout(row)
            align-items: center

            .price-box
              font-family: $font-family-regular
              color: $color-text-secondary
              font-size: $font-size-14
              margin-right: 25px

            .number-box
              font-family: $font-family-regular
              color: $color-text-secondary
              font-size: $font-size-14

              .number-color
                color: $color-money

      .share-info-bottom
        height: 45px
        layout(row)
        align-items: center
        justify-content: space-between
        margin-bottom: 20px

        .share-bottom-left
          layout(row)
          align-items: center

          .bottom-left-text
            font-family: $font-family-regular
            color: $color-text-assist
            font-size: $font-size-14
            margin-right: 4px

          .bottom-left-sub
            font-family: $font-family-regular
            color: $color-text-tip
            font-size: $font-size-12

        .share-bottom-right
          flex: 1
          layout(row)
          align-items: center

          .base-input
            font-family: $font-family-medium
            color: $color-text-sub
            font-size: $font-size-16
            flex: 1
            text-align: right
            height:22px
            line-height:22px
          .base-icon
            font-family: $font-family-regular
            color: $color-text-assist
            font-size: $font-size-14
            position: relative
            margin-left: 5px
            height:22px
            line-height:22px
            padding-top:1px
            box-sizing border-box

  .add-btn
    font-family: $font-family-regular
    color: $color-white
    font-size: $font-size-16
    text-align: center
    border-radius: 2px
    background: $color-money
    height: 44px
    line-height: 44px

  .share-edit
    width: 100%
</style>
