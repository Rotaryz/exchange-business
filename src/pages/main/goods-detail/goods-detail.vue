<template>
  <div class="goods-detail">
    <navigation-bar ref="navigationBar" :title="title"></navigation-bar>
    <div class="banner-wrap">
      <swiper class="banner" @change="bannerChange">
        <block v-for="(item,i) in detail.goods_banner_images" :key="i">
          <swiper-item class="banner-item">
            <img :src="item.image_url + '?imageView2/3/w/100/h/100/q/30'" class="item-img item-img-one" mode="aspectFill">
            <img :src="item.image_url" class="item-img item-img-two" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <div class="banner-number-box"><span class="current-index">{{bannerIndex}}</span>/<span>{{ detail.goods_banner_images.length}}</span></div>
    </div>
    <div class="base-info-wrap">
      <div class="title">{{detail.name}}</div>
      <div class="price-wrap">
        <div class="price-level-wrap">
          <div v-if="(detail.shop_level_id || 0)<2" class="price-item big">
            <div class="price-icon bz-icon">{{$discountStandard}}折</div>
            <div class="price-num">¥{{detail.standard_price}}</div>
          </div>
          <div class="price-item big">
            <div class="price-icon qn-icon">{{$discountVersatile}}折</div>
            <div class="price-num">¥{{detail.versatile_price }}</div>
          </div>
          <div v-if="detail.shop_level_id>=2" class="price-item big">
            <div class="price-icon hh-icon">{{$discountPartner}}折</div>
            <div class="price-num">¥{{detail.partner_price}}</div>
          </div>
        </div>
        <div>
          <div class="second-price">库存 {{totalSaleable}}</div>
          <div class="second-price price">零售价：¥{{detail.price}}</div>
        </div>
      </div>
    </div>
    <div class="operate-list">
      <div class="operate-item border-bottom" @click="showModal">
        <div class="label">规格</div>
        <div class="item-value"> {{showAttrText}}</div>
        <div class="arrow-right"></div>
      </div>
      <div class="operate-item">
        <div class="label">数量</div>
        <div class="item-value"></div>
        <count-operate :value="edit.count" :onlyRead="true" @click="showModal"></count-operate>
      </div>
    </div>
    <div class="operate-list">
      <div class="operate-item border-bottom" @click="showModal">
        <div class="label">配送</div>
        <div class="item-value">{{logistics.name}}</div>
        <div class="arrow-right"></div>
      </div>
      <div class="operate-item">

        <div class="label">运费</div>
        <div v-if="logistics.priceTotal" class="item-value pay-money">
          <span class="money-icon">¥</span>{{logistics.priceTotal}}
        </div>
        <span v-else class="item-value">包邮</span>
      </div>
    </div>
    <!-- 兑换商品部给品牌详情 -->
    <section v-if="detail.use_type===2 && detail.brand.status===1" class="brand-wrap" @click="navToDetail">
      <div class="img-wrap">
        <img mode="aspectFill" :src="detail.brand.banner_image_url" class="brand-img">
      </div>
      <div class="brand-info">
        <div class="brand-name">{{detail.brand.name}}</div>
        <div class="brand-describe">{{detail.brand.describe}}</div>
      </div>
      <div class="operate-mask">
        <div class="text">进入品牌</div>
        <img src="./icon-pressed_my2@2x.png" class="arrow-right-red"></div>
    </section>
    <div>
      <div class="detail-image-mask-wrap">
        <img src="./pic-spxq@2x.png" mode="widthFix" class="detail-image-mask-img">
      </div>
      <img v-for="item in detail.goods_detail_images" :key="item.id" :src="item.image_url" mode="widthFix" class="detail-img">
    </div>
    <div>
      <div v-show="visible" class="operate-modal-wrap" @click="visible=false">
      </div>
      <div class="operate-modal" :style="{height: (visible? modalHeight :0)+'px'}">
        <div class="close-btn-wrap" @click="hideModal">
          <div class="close-btn"></div>
        </div>
        <div class="operate-cont">
          <div class="vertical-center goods-info">
            <img v-if="detail.goods_banner_images[0]" mode="aspectFill" :src="detail.goods_banner_images[0].image_url" class="goods-img">
            <div>
              <div class="price-item-wrap">¥<span class="price-num">{{detail.sale_price}}</span></div>
              <div class="store-count">库存{{detail.saleable}}件</div>
            </div>
          </div>
          <scroll-view scroll-y="true" :style="{height:modalScrollHeight+'px'}" class="scroll-wrap">
            <div v-for="(item,idx) in detail.specs_attrs" :key="idx" class="spec-module">
              <div class="name">{{item.name}}</div>
              <div class="vertical-center spec-value">
                <div v-for="(value,i) in item.values" :key="i" :class="['value-item',{active:selectSpec[idx] === item.attr_key_id+'_'+value.attr_value_id}]"
                     @click="selectModuleValue(item,idx,value,i)"
                >
                  {{value.text}}
                </div>
              </div>
            </div>
            <div class="spec-module vertical-center buyer-count">
              <div class="name">购买数量</div>
              <count-operate v-model="edit.count" :maxNumber="detail.saleable" @change="changeCount" @over="countOver"></count-operate>
            </div>
            <div class="spec-module">
              <div class="name">配送方式</div>
              <div class="vertical-center spec-value">
                <div v-for="(value,i) in logisticsList" :key="i" :class="['value-item',{active:value.id===logistics.id}]" @click="changeLogistics(value,i)">
                  {{value.name}}
                </div>
              </div>
            </div>
            <div class="spec-module logistics-fee-wrap">
              <div class="vertical-center cont-wrap">
                <div class="name">运费</div>
                <!-- 有包邮 跟 需要邮费之分 -->
                <div v-if="logistics.priceTotal" class="logistics-price">¥{{logistics.priceTotal}}</div>
                <div v-else class="logistics-price">包邮</div>
              </div>
              <div v-if="logistics.priceTotal" class="logistics-explain">{{logistics.billing_description}}</div>
            </div>
          </scroll-view>
        </div>
        <div v-show="visible" class="page-footer-wrap" :style="{height:statusBarHeight>20 ? '70px':''}">
          <div v-if="detail.saleable" class="page-footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
            <div v-if="showType === 1" class="button-primary add-shopping-cart fixed" @click.stop="addToShoppingCart()">
              加入购物车
            </div>
            <div v-else-if="showType === 2" class="button-primary add-shopping-cart fixed" @click.stop="goToSubmitOrder()">
              立即购买
            </div>
            <div v-else class="button-group fixed">
              <div class="button-primary add-shopping-cart" @click.stop="addToShoppingCart">
                加入购物车
              </div>
              <div class="button-primary right-now-buy" @click.stop="goToSubmitOrder">
                立即购买
              </div>
            </div>
          </div>
          <div v-else class="saleable-none">
            已售罄
          </div>
        </div>
      </div>
    </div>
    <div class="page-footer-wrap" :style="{height:statusBarHeight>20 ? '70px':''}">
      <div class="page-footer" :style="{'padding-bottom':statusBarHeight>20 ? '20px':''}">
        <div class="navigate-wrap">
          <div class="navigate-btn" @click="goToHome">
            <img src="./icon-home@2x.png" class="navigate-icon">
            <div class="name">首页</div>
          </div>
          <div class="navigate-btn" @click="goToShoppingCart">
            <div v-if="count" class="count">{{count<100?count:'99+'}}</div>
            <img src="./icon-mycar@2x.png" class="navigate-icon">
            <div class="name">购物车</div>
          </div>
        </div>
        <div v-if="totalSaleable" class="button-group">
          <div class="button-primary add-shopping-cart" @click="showModal(1)"> 加入购物车</div>
          <div class="button-primary right-now-buy" @click="showModal(2)">立即购买</div>
        </div>
        <div v-else class="saleable-none">
          已售罄
        </div>
      </div>
    </div>
    <popup confirmText="立即完善" popUpType="confirm" tip="请先完善资料！" :showPopup.sync="showPopup" @confirm="perfectData"></popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CountOperate from '@components/count-operate/count-operate'
  import { cartMethods, cartComputed } from '@state/helpers'
  import API from '@api'
  import Popup from './popup/popup'

  const PAGE_NAME = 'GOODS_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CountOperate,
      'popup': Popup
    },
    data() {
      return {
        showPopup: false,
        id: 0,
        // 商品banner 当前显示图片idx
        bannerIndex: 1,
        // 商品详情
        detail: {
          brand: {
            banner_image_url: '',
            name: '',
            describe: ''
          },
          specification_type: 0,
          id: 0,
          weight: 0,
          // discount_price: 0,
          standard_price: '',
          versatile_price: '',
          partner_price: '',
          price: 0,
          sale_count: 0,
          saleable: 0,
          specs_attrs: [],
          goods_banner_images: [],
          goods_detail_images: []
        },
        // 选择商品每个规格 保存的 (属性id_属性值_id) 组成array数组
        selectSpec: [],
        // 页面操做后的值
        edit: {
          count: 1,
          spec_id: 0
        },
        logistics: {
          id: 0,
          name: '',
          billing_description: '',
          priceTotal: ''
        },
        // 物流列表
        logisticsList: [],
        visible: false,
        // 总库存数
        totalSaleable: 0,
        // 弹框显示的按钮类型
        showType: 0,
        // 弹框高度
        modalHeight: 0,
        // 弹框滚动高度
        modalScrollHeight: 0
      }
    },
    onLoad(options) {
      let { id } = options
      this.id = id
      let res = wx.getSystemInfoSync()
      this.modalHeight = res.windowHeight * 0.7
      this.modalScrollHeight = this.modalHeight - 170
    },
    onShow() {
      // 请求物流列表 ,商品详情
      Promise.all([this._getLogisticsList(), this._getDetail()]).then(res => {
        // 请求运费
        this.getCurrentSpecInfo(this.selectSpec)
        this._getFreight()
      })
      // 获取购物车数
      this._getCartCount()
    },
    computed: {
      ...cartComputed,
      title() {
        return this.detail.name || '商品详情'
      },
      showAttrText() {
        return this.selectSpec.filter(item => item).map(item => {
          let arr = item.split('_')
          let keyObj = this.detail.specs_attrs.find(attr => attr.attr_key_id === +arr[0])
          let valueObj = keyObj.values.find(val => val.attr_value_id === +arr[1])
          return keyObj.name + ':' + valueObj.text
        }).join('， ')
      }
    },
    methods: {
      ...cartMethods,
      perfectData() {
        wx.navigateTo({ url: `${this.$routes.personalCenter.IMPROVING_DATA}` })
      },
      navToDetail() {
        wx.navigateTo({ url: `${this.$routes.brand.BRAND_DETAIL}?id=${this.detail.brand.id || 0}` }) // todo
      },
      // 获取物流列表
      _getLogisticsList() {
        return API.Goods.getLogisticsList({
          data: {
            limit: 0
          }
        }).then(res => {
          this.logistics = res.data[0]
          this.logisticsList = res.data
          return res
        })
      },
      // 商品详情
      _getDetail() {
        return API.Goods.getGoodsDetail({
          data: {
            id: this.id
          }
        }).then(res => {
          this.detail = res.data
          this.totalSaleable = res.data.saleable
          if (!this.detail.specification_type) {
            this.edit.spec_id = res.data.goods_specs[0].spec_id
          } else {
            // 当存在规格时候不需要
            if (this.selectSpec.find(item => item)) return res
            this.$set(this, 'selectSpec', JSON.parse(JSON.stringify(res.data.goods_specs[0].attr_array)))
            this.getCurrentSpecInfo(this.selectSpec)
          }
          return res
        })
      },
      // 获取运费
      _getFreight() {
        API.Goods.getFreight({
          data: {
            goods_id: this.detail.id,
            template_id: this.logistics.id,
            num: this.edit.count,
            weight: this.detail.weight
          },
          loading: false
        }).then(res => {
          this.$set(this.logistics, 'priceTotal', res.data.freight_amount)
        })
      },
      // --------弹框--------
      // 商品数量点击
      changeCount(val) {
        this._getFreight()
      },
      // 当商品超过库存
      countOver() {
        wx.showToast({ title: '数量超出库存范围', icon: 'none' })
      },
      // 物流改变
      changeLogistics(item, i) {
        if (this.logistics.id === item.id) return
        this.$set(this, 'logistics', { ...item, priceTotal: this.logistics.priceTotal })
        this._getFreight()
      },
      // 商品规格 选择改变
      selectModuleValue(spec, i, value, idx) {
        let arr = this.selectSpec[i].split('_')
        if ((spec.attr_key_id + '' === arr[0]) && (value.attr_value_id + '' === arr[1])) {
          this.$set(this.selectSpec, i, '')
        } else {
          this.$set(this.selectSpec, i, spec.attr_key_id + '_' + value.attr_value_id)
        }
        this.getCurrentSpecInfo(this.selectSpec)
      },
      // 选择规格是时处理函数
      getCurrentSpecInfo(arr) {
        if (arr.length && arr.filter(item => !item).length > 0) return
        let obj = this.detail.goods_specs.find(item => {
          return item.attr_array.filter(v => arr.includes(v)).length === item.attr_array.length
        })
        if (obj) {
          this.edit.spec_id = obj.spec_id
          this.detail.standard_price = obj.standard_price
          this.detail.versatile_price = obj.versatile_price
          this.detail.partner_price = obj.partner_price
          this.detail.sale_price = obj.sale_price
          this.detail.price = obj.price
          this.detail.saleable = obj.saleable
          if (this.detail.saleable < this.edit.count) {
            this.edit.count = this.detail.saleable || 1
          }
        }
      },
      // 关闭弹框
      hideModal() {
        this.visible = false
      },
      // 弹出弹框 type ： 0 两个按钮全部显示，1 显示 加入购物车 2 显示 立即购买
      showModal(type = 0) {
        let userInfo = this.$storage('userInfo')
        if (!userInfo.is_completed) {
          // 判断用户是否有完善信息
          this.showPopup = true
          return
        }
        this.showType = type
        this.visible = true
      },
      // 是否要弹商品提示
      isCan() {
        if (this.selectSpec.length > 0 && this.selectSpec.findIndex(item => !item) > -1) {
          wx.showToast({ title: '请选择商品规格', icon: 'none' })
          return false
        }
        return true
      },
      // 加入购物车按钮
      addToShoppingCart() {
        if (!this.isCan()) return false
        this._addToCart({ data: { spec_id: this.edit.spec_id, logistics_id: this.logistics.id, num: this.edit.count } }).then(res => {
          this.hideModal()
        })
      },
      // 立即购买
      goToSubmitOrder() {
        let attrArr = this.selectSpec.map(item => {
          let arr = item.split('_')
          let keyObj = this.detail.specs_attrs.find(attr => attr.attr_key_id === +arr[0])
          let valueObj = keyObj.values.find(val => val.attr_value_id === +arr[1])
          return {
            name: keyObj.name,
            value: valueObj.text
          }
        })
        if (!this.isCan()) return false
        this.SET_ORDER({
          list: [{
            name: this.detail.name,
            id: this.detail.id,
            image: this.detail.goods_banner_images[0].image_url,
            specification: attrArr,
            price: this.detail.sale_price,
            count: this.edit.count,
            logistics: {
              price: this.logistics.priceTotal,
              id: this.logistics.id
            },
            type: 'goods_detail',
            spec_id: this.edit.spec_id,
            totalPrice: this.detail.sale_price * this.edit.count
          }],
          type: 'goods_detail'
        })
        wx.navigateTo({ url: this.$routes.main.SUBMIT_ORDER })
      },
      // 顶部商品轮播图
      bannerChange(current, source) {
        this.bannerIndex = current.target.current + 1
      },
      // 去购物车
      goToShoppingCart() {
        wx.switchTab({ url: '/pages/shopping-cart' })
      },
      // 去首页
      goToHome() {
        wx.switchTab({ url: this.$routes.main.HOME })
      }
    },
    // 页面销毁时初始化头部
    onUnload() {
      this.$refs.navigationBar && this.$refs.navigationBar._initHeadStyle()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/price.styl"
  .price-item
    margin-bottom 6px
    align-items center

  .goods-detail
    height: 100vh

    .banner-wrap
      position relative

      .banner
        height: 100vw
        position: relative

        .banner-item
          .item-img
            width: 100%
            height: 100%

            &.item-img-two
              position absolute
              top: 0
              left: 0
              right: 0
              bottom: 0

      .banner-number-box
        display: inline-block
        position: absolute
        bottom: px-change-vw(10)
        right: 20px
        background: rgba(63, 69, 75, .4)
        color: #fff
        height: 20px
        line-height 20px
        border-radius: 20px
        opacity: .75
        transition: all .3s
        font-size $font-size-12
        padding: 0 10px

        .current-index
          font-size $font-size-15

    .base-info-wrap
      background-color $color-white
      padding 7px 10px 18px 10px
      margin-bottom: 7px

      .title
        font-size $font-size-16
        color: $color-text-main
        font-family $font-family-medium
        letter-spacing 0.6px
        line-height 24px
        margin-bottom: 14px

      .second-price
        text-align right
        font-size 13px
        color: $color-text-secondary

      .price
        margin-top 6px

    .operate-list
      margin-bottom: 7px
      background-color $color-white

      .operate-item
        display flex
        align-items: center
        height: 44px
        margin-left: 10px
        padding-right: 13px

        .label
          color: $color-text-secondary
          font-size $font-size-14
          margin-right: 20px

        .item-value
          color: $color-text-main
          font-size: $font-size-14
          flex: 1


        .pay-money
          color: $color-money

        .arrow-right
          width: 6px
          height: 10px
          background-image url("./icon-pressed_my@2x.png")
          background-size 100%

      .border-bottom
        border-bottom-1px()

    .brand-wrap
      display flex
      justify-content center
      background-color $color-white
      margin-bottom: 7px
      padding: 11px 5px 14px 10px

      .img-wrap
        border-1px($color-line, 2px)
        margin-right: 10px

        .brand-img
          width: 50px
          height: 50px
          flex-shrink 0
          border-radius 2px

      .brand-info
        flex: 1
        width: 0
        display flex
        flex-direction column
        justify-content space-between

        .brand-name
          font-size 16px
          line-height 16px
          color: $color-text-su
          font-family $font-family-medium
          padding: 7px 0 12px 0

        .brand-describe
          font-size 12px
          line-height 12px
          color: #A0A5AA
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          margin-bottom 3px

      .operate-mask
        flex-shrink 0
        margin-left: 30px
        display flex
        align-items center

        .text
          font-size 12px
          line-height 12px
          color: $color-money
          margin-right 5px

        .arrow-right-red
          width: 10px
          height: 10px

    .detail-image-mask-wrap
      padding: 16px
      text-align center
      background-color $color-white

      .detail-image-mask-img
        width: px-change-vw(141)

    .detail-img
      width: 100%
      display: block

    .operate-modal-wrap
      position fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      background: rgba(39, 39, 62, 0.7)

    .operate-modal
      position fixed
      left: 0
      right: 0
      bottom: 0
      border-radius 2px 0 0 2px
      background $color-white
      width: 100vw
      transition all 0.3s
      z-index: 100

      .scroll-wrap
        &::-webkit-scrollbar
          width: 0
          height: 0
          color: transparent

      .close-btn-wrap
        padding: 13px
        position absolute
        right: 0
        top: 0
        z-index: 50

        .close-btn
          width: 22px
          height: 22px
          background-size 100%
          background-image url("./icon-deltc@2x.png")

      .operate-cont

        .goods-info
          padding: 10px

          .goods-img
            width: 100px
            height: @width
            margin-right: 10px
            border-radius 2px

          .price-item-wrap
            font-size $font-size-15
            color: $color-money
            margin-bottom 10px

            .price-num
              font-size $font-size-25
              font-family $font-family-bold

          .store-count
            letter-spacing: 0.6px
            font-size $font-size-14
            color: $color-text-secondary

        .spec-module
          margin-bottom 30px

          .name
            padding: 0 10px
            color: #6E6E6E
            font-size $font-size-14
            letter-spacing: 0.6px

          .spec-value
            padding-left: 5px
            flex-wrap wrap

            .value-item
              padding: 7px 14px
              background-color $color-background
              margin: 15px 10px 0px 5px
              font-size $font-size-12
              box-sizing border-box
              border: 1px solid $color-background
              border-radius 2px

              &.active
                background-color $color-white
                border: 1px solid $color-money
                color: $color-money

        .buyer-count
          padding-top: 10px

        .buyer-count
        .logistics-fee-wrap .cont-wrap
          justify-content space-between
          padding-right: 10px

        .logistics-fee-wrap
          margin-bottom: 0px

          .logistics-price
            font-size: $font-size-14

          .logistics-explain
            font-size: $font-size-12
            color: $color-text-secondary
            line-height: 18px
            padding: 14px 10px 22px 10px

      .footer
        height: 50px

        .fixed
          position fixed
          bottom 0
          height: 50px
          line-height @height
          width: 100%

    .page-footer-wrap
      height: 50px
      background-color $color-white

    .saleable-none
      flex: 1
      height: 50px
      line-height: 50px
      text-align center
      background-color #D2D2D2
      color: $color-white

    .page-footer
      position fixed
      bottom: 0
      width: 100vw
      display flex
      height: 50px
      z-index: 10px
      background-color $color-white

      .navigate-wrap
        background-color $color-white
        display flex
        justify-content space-around
        align-items center
        width: 110px

        .navigate-btn
          text-align center
          position: relative

          .count
            position: absolute;
            color: #fff;
            background-color: #d83f35;
            font-size: 11px;
            height: 16px;
            line-height: 16px;
            border-radius: 8px;
            top: -6px;
            right: -6px;
            min-width: 16px;
            text-align: center
            padding: 0 2px
            box-sizing border-box

          .name
            font-size $font-size-10
            coplor: $color-text-assist

          .navigate-icon
            width: 21px
            height: 21px

  .add-shopping-cart
  .right-now-buy
    flex: 1
    height: 50px
    line-height: 50px
    text-align center

  .button-group
    flex: 1
    display flex

    .add-shopping-cart
      background-color #27273E
</style>
