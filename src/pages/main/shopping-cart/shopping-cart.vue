<template>
  <div class="shopping-cart" @click.self="pageClick">
    <navigation-bar title="购物车" :showArrow="false"></navigation-bar>
    <scroll-view v-if="list.length" scroll-y="true" :style="{height:scrollHeight+'px'}" class="goods-list">
      <li v-for="(item,i) in list" :key="i" class="goods-item">
        <div class="goods-wrap" :style="{transform:'translateX('+item.x+'px)'}">
          <div class="goods-right" @touchstart="handleTouchStart($event)"
               @touchmove.stop="handleTouchmove($event,i)"
               @touchend.stop="handleTouchend($event,i)">
            <div v-if="item.saleable && item.status" class="check-box" @click="setCheckType(item,i)">
              <zb-checkbox :type="item.select ? 'checked':item.saleable<item.num ? 'disable':''"></zb-checkbox>
            </div>
            <div v-else class="failure">
              失效
            </div>
            <div class="goods-img-wrap">
              <img class="good-img" mode="aspectFill" :src="item.goods_cover_image" @click="goToDetail(item,i)">
              <div v-if="item.saleable && item.status && item.saleable<item.num" class="beyond-saleable-tip">库存仅剩{{item.saleable}}件</div>
            </div>
            <div class="info" :class={disable:!item.saleable||!item.status} @click="goToDetail(item,i)">
              <div class="top-wrap">
                <div class="name">{{item.name}}</div>
                <div class="spec">
                  <span v-for="(sp,idx) in item.goods_spec.specs_attrs" :key="idx" class="spec-item">{{sp.attr_key}}:{{sp.attr_value}}</span>
                </div>
              </div>
              <div v-if="item.saleable && item.status" class="price-wrap">
                <div class="price-level-wrap">
                  <div v-if="(item.shop_level_id || 0)<2" class="price-item">
                    <div class="price-icon bz-icon">{{$discountStandard}}折</div>
                    <div class="price-num">¥{{item.goods_spec.standard_price}}</div>
                  </div>
                  <div class="price-item">
                    <div class="price-icon qn-icon">{{$discountVersatile}}折</div>
                    <div class="price-num">¥{{item.goods_spec.versatile_price }}</div>
                  </div>
                  <div v-if="item.shop_level_id>=2" class="price-item">
                    <div class="price-icon hh-icon">{{$discountPartner}}折</div>
                    <div class="price-num">¥{{item.goods_spec.partner_price}}</div>
                  </div>
                </div>
                <zb-count-operate :value="item.num" @change="goodsNumChange($event,item)"></zb-count-operate>
              </div>
              <div v-else class="failure-text">
                该商品已下架/已售完
              </div>
            </div>
          </div>
          <div class="button-primary" @click.stop="_deleteGoods(item)">
            <div class="button-primary">删除</div>
          </div>
        </div>
        <div class="fee">
          <div class="fee-item express-fee">
            <div class="label">配送</div>
            <div class="express-value">{{item.logistics_name}}</div>
            <div class="express-money"><span class="money-icon">¥</span>{{item.freight}}</div>
          </div>
          <div class="fee-item">

            <div class="label">总价</div>
            <div class="pay-money"><span class="money-icon">¥</span>{{item.pay_total}}</div>
          </div>
        </div>
      </li>
    </scroll-view>
    <div v-if="list.length" class="footer-wrap">
      <div v-if="list.length" class="footer">
        <div class="check-all">
          <zb-checkbox :type="isAllSelect ? 'checked':''" @click="selectAll"></zb-checkbox>
          <span class="label">全选</span></div>
        <div class="total">合计：<span class="total-all-price">¥{{totalMoney}}</span></div>
        <div class="button-primary submit-btn" @click="submitBtn">提交</div>
      </div>
    </div>
    <div v-else class="empty-box">
      <empty :image="require('./pic-shopcar@2x.png')"
             tip="您还没有添加任何商品哦～"
             buttonText="去看看"
      ></empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ZbCheckbox from '@components/checkbox/checkbox'
  import Empty from '../../../components/empty/empty'
  import ZbCountOperate from '../../../components/count-operate/count-operate'
  import { cartMethods, globalComputed } from '@state/helpers'

  const PAGE_NAME = 'SHOPPING_CART'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ZbCheckbox,
      Empty,
      ZbCountOperate
    },
    // todo 暂时未做 页面滚动到底部 加载更多
    // onReachBottom() {
    //   if (this.isLoading || this.params.page === this.totalPage) {
    //     return false
    //   }
    //   this.params.page++
    //   this._getList()
    // },
    onShow() {
      this._getList()
    },
    onUnload() {
      this.selectIds = {}
    },
    data() {
      return {
        list: [],
        scrollHeight: 0,
        showDeleteIndex: null,
        startY: 0,
        endY: 0,
        startX: 0,
        currentX: 0,
        selectIds: {}
        // isLoading: false,
        // totalPage: 10,
        // params: {
        //   page: 1,
        //   limit: 0
        // },
      }
    },
    onLoad() {
      // let res = wx.getSystemInfoSync()
      this.scrollHeight = this.$systemInfo.windowHeight - this.statusBarHeight - 44 - 60
    },
    computed: {
      ...globalComputed,
      isAllSelect() {
        let arr = this.list.filter(item => item.saleable && item.status)
        if (!arr.length) return false
        let res = arr.find(item1 => {
          return !item1.select
        })
        return !res
      },
      totalMoney() {
        // console.log(this.selectList)
        let res = this.list.filter(item => item.select)
        if (!res.length) return 0
        return res.map(item => Number(item.pay_total)).reduce((one, two) => one + two).toFixed(2)
      }
    },
    methods: {
      ...cartMethods,
      // 请购物车列表设置在data里
      setData(res) {
        this.list = res.data.list.map(item => {
          item.select = this.selectIds[item.id] ? 'select' : ''
          return item
        })
        this.SET_CART_COUNT(res.data.goods_count)
      },
      // 获取购物车列表
      _getList(other = {}) {
        API.Cart.getList({ data: { limit: 0, page: 1 }, ...other }).then(res => {
          this.setData(res)
          console.log('this.list.find(item => item.select)', this.list.find(item => item.select))
          if (this.list.length && !this.list[0].select) {
            this.$set(this.list[0], 'select', true)
            this.$set(this.selectIds, this.list[0].id, true)
          }
        })
      },
      // 全选按钮点击
      selectAll() {
        let arr = this.list.filter(item => item.saleable && item.status)
        if (!arr.length) {
          wx.showToast({ title: '还没有可以选择的宝贝~', icon: 'none' })
          return false
        }
        // console.log(this.isAllSelect)
        if (this.isAllSelect) {
          this.list.forEach((item, idx) => {
            this.$set(this.list[idx], 'select', '')
            this.$set(this.selectIds, item.id, false)
          })
        } else {
          this.list.forEach((item, idx) => {
            if (item.saleable && item.status) {
              this.$set(this.list[idx], 'select', 'checked')
              this.$set(this.selectIds, item.id, true)
            }
          })
        }
      },
      // 去详情页
      goToDetail(item, i) {
        wx.navigateTo({ url: this.$routes.main.GOODS_DETAIL + '?id=' + item.goods_id })
      },
      // 商品数量修改
      goodsNumChange(e, item) {
        API.Cart.setGoodsNum({ data: { spec_id: item.spec_id, num: e }, loading: false }).then(res => {
          this.setData(res)
        })
      },
      //  ----- 删除部分----
      // 点击页面初始化所有删除按钮
      pageClick(e) {
        if (this.showDeleteIndex !== null) {
          this.$set(this.list[this.showDeleteIndex], 'x', 0)
        }
      },
      // 商品元素 触摸开始的一刻
      handleTouchStart(e, i) {
        this.pageClick()
        // console.log('handleTouchStart', e)
        this.startX = e.clientX
        this.startY = e.clientY
        this.currentX = e.clientX
        this.endY = e.clientY
      },
      // 商品元素 触摸后移动
      handleTouchmove(e, i) {
        // console.log('handleTouchmove', e)
        this.currentX = e.clientX
        this.endY = e.clientY
        let distance = this.currentX - this.startX
        // console.log(this.currentX, this.startX, 'distance', distance)
        if (this.endY - this.startY > 10) return
        if (distance < 0 && this.list[i].x > -60) {
          this.$set(this.list[i], 'x', (distance > -60 ? distance : -60))
        } else if (distance > 0 && this.list[i].x < 0) {
          this.$set(this.list[i], 'x', (distance < 60 ? -1 * distance : 0))
        }
      },
      // 商品元素 触摸后触摸结束
      handleTouchend(e, i) {
        if (!this.currentX) return false
        if ((this.list[i].x === 0 || this.list[i].x === -60) && this.endY - this.startY > 10) return
        // console.log('handleTouchend', this.currentX, this.startX, this.currentX < this.startX)
        let distance = this.currentX - this.startX
        // console.log(distance)
        if (distance < -20) {
          this.$set(this.list[i], 'x', -60)
        } else {
          this.$set(this.list[i], 'x', 0)
        }
        this.showDeleteIndex = distance < 0 ? i : null
      },
      // 商品单个选择
      setCheckType(item, i) {
        // if (item.saleable < item.num) return
        if (item.select) {
          this.$set(this.list[i], 'select', '')
          this.$set(this.selectIds, item.id, 0)
        } else {
          this.$set(this.list[i], 'select', 'checked')
          this.$set(this.selectIds, item.id, 1)
        }
      },
      // 删除商品
      _deleteGoods(item) {
        // console.log(item)
        API.Cart.deleteGoods({ data: { ids: [item.id] }, loading: false }).then(res => {
          this.setData(res)
          if (this.selectIds[item.id]) this.$delete(this.selectIds, item.id)
          this.showDeleteIndex = null
        })
      },
      // 提交订单
      submitBtn() {
        let res = this.list.filter(item => item.select)
        if (res.length <= 0) {
          wx.showToast({ title: '请选择需要提交的商品', icon: 'none' })
          return false
        }
        let list = res.map(item => {
          return {
            name: item.name,
            id: item.id,
            image: item.goods_cover_image,
            specification: item.goods_spec.specs_attrs.map(item => {
              return {
                name: item.attr_key,
                value: item.attr_value
              }
            }),
            price: item.sale_price,
            count: item.num,
            logistics: {
              price: item.freight,
              id: item.logistics_id,
              name: item.logistics_name
            },
            spec_id: item.spec_id,
            totalPrice: item.sub_total
          }
        })
        this.SET_ORDER({
          list: list,
          type: 'shopping_cart'
        })
        wx.navigateTo({ url: this.$routes.main.SUBMIT_ORDER })
        // console.log(res)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/price"
  .shopping-cart
    width: 100%
    height: 100vh
    display: flex
    flex-direction: column

    .empty-box
      flex: 1
      overflow-y: auto

      &::-webkit-scrollbar
        width: 0
        height: 0
        color: transparent

    .goods-list
      flex: 1
      overflow-y: auto
      overflow-x: hidden

      .goods-item
        margin-top: 10px
        background-color: $color-white

        .goods-wrap
          display: flex
          transition: all 0.3s

          .goods-right
            box-sizing: border-box
            width: 100vw
            flex-shrink: 0
            display: flex
            align-items: center
            padding: 10px 10px 10px 0
            height: 110px

            .check-box
              display: flex
              align-items: center
              height: 100%
              flex-shrink: 0
              padding: 0px 10px

            .failure
              width: 28px
              height: 15px
              line-height: 15px
              text-align: center
              border-radius: 7px
              background-color: #BCC4CC
              margin: 0 2px 0 5px
              font-size: $font-size-10
              color: #fff

            .goods-img-wrap
              position: relative
              height: 100%
              margin-right: 8px

              .good-img
                flex-shrink: 0
                height: 100%
                width: 90px
                border-radius: 2px

              .beyond-saleable-tip
                position: absolute
                bottom: 0
                left: 0
                right: 0
                width: 100%
                height: 20px
                line-height: 20px
                text-align: center
                background-color: #EA4A49
                opacity: 0.9
                color: $color-white
                font-size: $font-size-12
                border-radius: 0 0 2px 2px
                white-space: nowrap

            .info
              height: 100%
              flex: 1
              width: 0
              display: flex
              flex-direction: column
              justify-content: space-between

              .top-wrap

                .name
                  color: $color-text-main
                  font-size: $font-size-14
                  font-family: $font-family-medium
                  letter-spacing: 0.6px
                  white-space: nowrap
                  overflow: hidden
                  text-overflow: ellipsis
                  margin-top: 4px
                  flex-shrink: 0

                .spec
                  color: $color-text-secondary
                  font-size: $font-size-13
                  letter-spacing: 0.6px
                  margin-top: 10px
                  margin-bottom: 2px
                  height: 13px
                  white-space: nowrap
                  overflow: hidden
                  text-overflow: ellipsis

                  .spec-item
                    margin-right: 10px

                .price-item
                  margin-bottom: 5px

                  .price-item:last-child
                    margin-bottom: 0

                  .price-num
                    color: $color-text-main
                    font-family: $font-family-regular

              .failure-text
                font-size: $font-size-13
                color: $color-text-tip
                letter-spacing: 0.6px
                height: 13px

              &.disable
                .name
                .spec
                  color: $color-text-tip

          .button-primary
            width: 60px
            display: flex
            align-items: center
            justify-content: center

        .fee
          background-color: $color-white
          padding: 0px 10px

          .fee-item
            display: flex
            align-items: center
            justify-content: space-between
            font-size: $font-size-14
            font-family: $font-family-medium
            height: 40px

            .label
              color: $color-text-assist
              font-family: $font-family-regular
              margin-right: 10px

            .money-icon
              font-size: $font-size-12
              margin-right: 2px

            .pay-money
              font-family: $font-family-medium
              color: $color-money
              font-size: $font-size-18

            &.express-fee
              border-top-1px()
              border-bottom-1px()

              .express-value
                flex: 1
                color: $color-text-main
                font-size: $font-size-14
                letter-spacing: 0.6px

              .express-money
                color: $color-text-main
                font-size: $font-size-18

  .footer-wrap
    height: 50px
    margin-top: 10px
    border-bottom-1px($color-line, solid, 1px)

  .footer
    display: flex
    width: 100vw
    justify-content: space-between
    align-items: center
    height: 50px
    background-color: $color-white
    box-sizing: border-box

    .check-all
      flex: 1
      display: flex
      align-items: center
      padding-left: 10px

      .label
        color: $color-text-main
        font-size: $font-size-14
        margin-left: 5px

    .total
      font-size: $font-size-14
      margin-right: 10px

      .total-all-price
        color: $color-money
        font-size: $font-size-18
        font-family: $font-family-bold
        margin-left: 2px

    .submit-btn
      height: 48px
      line-height: 48px
      width: 105px

</style>
