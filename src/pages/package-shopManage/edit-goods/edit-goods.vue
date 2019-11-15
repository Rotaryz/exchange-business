<template>
  <div class="edit-goods">
    <navigation-bar title="编辑商品"></navigation-bar>
    <div v-if="hasInfo" class="top-con">
      <div class="goods-img">
        <img v-if="goodsInfo.goods_cover_image" :src="goodsInfo.goods_cover_image" mode="aspectFill" class="img">
      </div>
      <div class="goods-info">
        <div class="goods-title">{{goodsInfo.name}}</div>
        <div class="goods-stock">库存 <span class="stock-val">{{goodsInfo.saleable}}</span></div>
      </div>
    </div>
    <div v-if="hasInfo" class="bottom-con">
      <div class="title">采购信息</div>
      <div class="purchases-info">
        <div class="info-item">
          <div class="item-name">采购价格</div>
          <div class="item-val">{{goodsInfo.price}}元</div>
        </div>
        <div class="info-item">
          <div class="item-name">建议兑换券</div>
          <div class="item-val">{{goodsInfo.price}}x10={{suggestPrice}}</div>
        </div>
      </div>
      <div class="title">兑换设置</div>
      <input v-model="goodsInfo.integral_price" type="number" placeholder-style="color: #818D99; font-size:14px;" placeholder="请输入兑换券数量" class="item-input">
    </div>
    <div v-if="hasInfo" class="btn-con">
      <div class="sub-btn" @click="_editSubmit">确定</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'EDIT_GOODS'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        goodsInfo: {},
        goodsId: '',
        hasInfo: false,
        suggestPrice: 0
      }
    },
    onLoad(option) {
      this.goodsId = option.id
      this._getGoodsInfo()
    },
    methods: {
      _getGoodsInfo() {
        API.Goods.getManageGoodsList({ data: { id: this.goodsId } }).then((res) => {
          this.goodsInfo = res.data[0]
          this.hasInfo = true
          this.suggestPrice = (this.goodsInfo.price * 10).toFixed(1)
        })
      },
      // 确定修改
      _editSubmit() {
        API.Goods.setGoodsPrice({ data: { integral_price: this.goodsInfo.integral_price, id: this.goodsId } }).then((res) => {
          this.$wechat.showToast('编辑成功！')
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $margin = 10px

  .edit-goods
    width: 100%
  .top-con
    padding: 15px $margin
    margin-bottom: $margin
    background: #ffffff
    layout(row)
    .goods-img
      width: 90px
      height: @width
      margin-right: 10px
      .img
        width: 90px
        height: @width
    .goods-info
      flex: 1
      height: 90px
      layout()
      justify-content: space-between
      .goods-title
        width: 100%
        margin-bottom: 30px
        font-family: $font-family-medium
        font-size: $font-size-14
        color: $color-text-sub
        line-height: 20px
        no-wrap-plus(2)
      .goods-stock
        width: 100%
        margin-bottom: 4px
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-assist
        .stock-val
          color: #000E11
  .bottom-con
    padding: 0 $margin $margin
    background: #ffffff
    .title
      padding: 15px 0 $margin
      font-family: $font-family-medium
      font-size: $font-size-15
      color: $color-text-sub
    .purchases-info
      box-sizing: border-box
      height: 88px
      background: #FAFAFC
      margin-bottom: $margin
      padding: 20px $margin
      layout()
      justify-content: space-between
      .info-item
        height: 14px
        line-height: 1
        layout(row)
        .item-name
          flex: 0.3
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-assist
        .item-val
          flex: 0.7
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-text-main
    .item-input
      box-sizing: border-box
      width: 100%
      height: 35px
      padding: 0 $margin
      border-1px(#D2D2D2,2px)
  .btn-con
    box-sizing: border-box
    width: 100vw
    padding: 20px $margin
    .sub-btn
      box-sizing: border-box
      width: 100%
      height: 45px
      line-height: 45px
      background: $color-main
      border-radius: 2px
      text-align: center
      font-family: $font-family-regular
      font-size: $font-size-16
      color: #ffffff
</style>
