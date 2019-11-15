<template>
  <div class="recharge">
    <navigation-bar title="购买充值"></navigation-bar>
    <div class="list">
      <div class="list-item">
        <div class="item-label">会员账号</div>
        <input v-model="rechargeData.mobile" type="number" placeholder-style="color: #818D99; font-size:14px;"
               maxlength="11" placeholder="请输入手机号码" class="item-input phone">
      </div>
      <div class="list-item">
        <div class="item-label">购买金额</div>
        <div v-if="amount" class="price-unit">￥</div>
        <input v-model="amount" type="number" placeholder-style="color: #818D99; font-size:14px;" maxlength="11"
               placeholder="请输入金额" class="item-input price">
      </div>
      <div class="list-item">
        <div class="item-label">赠送兑换券</div>
        <input v-model="rechargeData.integral_num" type="number" placeholder-style="color: #818D99; font-size:14px;"
               maxlength="11" class="item-input price">
      </div>
      <div class="list-item">
        <div class="item-label">赠送播豆</div>
        <input v-model="rechargeData.bean_num" type="number" placeholder-style="color: #818D99; font-size:14px;"
               maxlength="11" class="item-input price">
      </div>
    </div>
    <div class="tips">当前积分充值比例：顾客消费100元赠送100兑换券，同时赠送100播豆。</div>
    <div :class="[rechargeData.mobile&&rechargeData.amount?'active':'']" class="recharge-btn" @click="_recharge">确认赠送
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'RECHARGE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        amount: '',
        rechargeData: {
          mobile: '',
          amount: '',
          integral_num: '',
          bean_num: ''
        },
        submitting: false
      }
    },
    watch: {
      amount(val) {
        this.rechargeData = {
          mobile: this.rechargeData.mobile,
          amount: val,
          integral_num: val,
          bean_num: val
        }
      }
    },
    methods: {
      _recharge() {
        if (this.submitting) return
        if (!this.rechargeData.mobile) {
          this.$wechat.showToast('请输入手机号码')
          return
        }
        if (!this.rechargeData.amount) {
          this.$wechat.showToast('请输入金额')
          return
        }
        if (!this.rechargeData.integral_num) {
          this.$wechat.showToast('请输入需赠送的兑换券')
          return
        }
        if (!this.rechargeData.bean_num) {
          this.$wechat.showToast('请输入需赠送的播豆')
          return
        }
        this.submitting = true
        API.Shop.recharge({data: this.rechargeData})
          .then((res) => {
            this.amount = ''
            this.$wechat.showToast('充值成功！')
            this.submitting = false
          })
          .catch(() => {
            this.submitting = false
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $margin = px-change-vw(10)
  .recharge
    width: 100%
    .list
      margin-top: 10px
      padding-left: $margin
      background: $color-white
      .list-item
        height: 48px
        line-height: 48px
        padding-right: $margin
        border-bottom-1px()
        layout(row)
      .item-label
        height: inherit
        line-height: inherit
        width: px-change-vw(86)
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-assist
      .price-unit
        height: inherit
        line-height: inherit
        width: 10px
        font-family: $font-family-medium
        font-size: 16px
        color: $color-text-main
        transition: opacity 0.25s
      .item-input
        flex: 1
        height: inherit
        padding: 0 5px
        font-family: $font-family-medium
        font-size: 14px
        color: $color-text-main
        &.phone
          font-family: $font-family-regular
        &.price
          font-size: 16px
          font-family: $font-family-medium
      .recharge-info
        padding: 8px 0
        .info-item
          height: 34px
          line-height: 34px
          padding-right: $margin
          layout(row)
      .item-val
        flex: 1
        text-align: right
        line-height: inherit
        font-size: 14px
        font-family: $font-family-medium
    .tips
      margin: 11px px-change-vw(10) 15px
      line-height: 18px
      font-family: $font-family-regular
      font-size: 12px
      color: $color-text-secondary
    .recharge-btn
      margin: 0 $margin
      width: px-change-vw(355)
      height: 45px
      line-height: 45px
      text-align: center
      font-size: 16px
      color: $color-white
      background: $color-main
      border-radius: 2px
      opacity: 0.5
      &.active
        opacity: 1
</style>
