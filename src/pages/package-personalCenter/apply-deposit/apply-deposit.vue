<template>
  <div class="apply-deposit">
    <navigation-bar title="提现申请"></navigation-bar>
    <section class="bind-card" @click="navHandle">
      <p class="name" :class="{active: cardBank}">{{cardBank || '添加银行卡'}}</p>
      <p class="middle">{{cardNumber}}</p>
      <img src="/static/images/icon-pressed_my@2x.png" alt="" class="arrow-right">
    </section>
    <section class="money-wrapper">
      <p class="title">提现金额</p>
      <div class="input-wrapper">
        <span class="unit">¥</span>
        <input type="digit" class="input-default" v-model="money" maxlength="20">
      </div>
      <p class="bottom">
        <span class="left">可提现金额</span>
        <span class="middle">¥{{balance}}</span>
        <span class="right" @click="_goToWithdraw">提现记录</span>
      </p>
    </section>
    <p class="explain">需大于{{rule}}元才可进行提现。提现预计到账时间为{{time}}个工作日。提现手续费以实际为准，根据不同银行收费标准不同。</p>
    <button class="button" :class="{active: checkApply}" @click="submitHandle">提现</button>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import wx from 'wx'

  const PAGE_NAME = 'APPLY_DEPOSIT'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        type: '',
        cardNumber: '',
        cardBank: '',
        bankCardId: '',
        balance: '',
        money: '',
        rule: 100,
        time: '2-5'
      }
    },
    computed: {
      regCardNumber() {
        return this.cardNumber
      },
      regCardBank() {
        return this.cardBank
      },
      regMoney() {
        return this.money >= this.rule
      },
      regBalance() {
        return this.money <= this.balance
      },
      checkApply() {
        return this.regCardNumber && this.regCardBank && this.regMoney && this.regBalance
      }
    },
    onLoad(options) {
      this.type = options.type * 1
    },
    onShow() {
      this._getPropertyInfo()
      this.getBankCardDetail()
    },
    methods: {
      // 获取可提现余额
      _getPropertyInfo(loading = false) {
        API.Property.getPropertyData({data: {type: this.type}, loading})
          .then((res) => {
            this.balance = res.data.remaining
          })
      },
      // 银行卡信息
      getBankCardDetail() {
        API.Property.getBackCardInfo().then((res) => {
          if (res.error_code === this.$ERR_OK && res.data.bank_id) {
            this.cardBank = res.data.bank_name
            this.bankCardId = res.data.id
            this.cardNumber = res.data.bank_card
            this.rule = (res.data.min_limit * 1) || 100
          }
        })
      },
      navHandle() {
        const url = this.$routes.personalCenter.BIND_CARD
        wx.navigateTo({url})
      },
      _goToWithdraw() {
        const url = this.$routes.personalCenter.LOG_DEPOSIT + '?type=' + this.type
        wx.navigateTo({url})
      },
      // 申请提现
      submitHandle() {
        if (!this.check()) {
          return
        }
        const params = {money: this.money, type: this.type, bank_card_id: this.bankCardId}
        API.Property.applyWithdraw({data: params})
          .then((res) => {
            if (res.error_code === this.$ERR_OK) {
              this.money = ''
              this._getPropertyInfo()
              this.$wechat.showToast('申请成功！')
            } else {
              this.$wechat.showToast(res.message)
            }
          })
      },
      check() {
        let result = true
        const checkArr = [
          {value: this.regCardNumber, msg: '请选择银行卡'},
          {value: this.regMoney, msg: `提现金额必须大于等于${this.rule}`},
          {value: this.regBalance, msg: `余额不足`}
        ]
        for (let i = 0; i < checkArr.length; i++) {
          const item = checkArr[i]
          if (!item.value) {
            result = item.value
            this.$wechat.showToast(item.msg)
            break
          }
        }
        return result
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .apply-deposit
    width: 100%

  .bind-card
    border-top : 10px solid #f5f5f9
    background :#fff
    padding : 0 15px 0 10px
    height: 55px
    layout(row,block,nowrap)
    align-items :center
    font-family: $font-family-regular
    line-height :1
    .name
      font-size: 14px;
      color: #818D99;
      &.active
        color: #1D2023
    .middle
      flex: 1
      font-size: 14px;
      color: #3F454B;
      padding-left :20px
    .arrow-right
      width: 10px
      height: 10px

  .money-wrapper
    font-family: $font-family-regular
    line-height :1
    border-top : 10px solid #f5f5f9
    background :#fff
    padding : 0 10px
    height: 151.5px
    .title
      padding-top:18px
      padding-bottom :13px
      font-size: 14px;
      color: #3F454B;
    .input-wrapper
      layout(row)
      align-items: center
      padding: 13px 0
      border-bottom-1px(#ECEDF1)
      font-size: 35px
      line-height : 1
      font-family: $font-family-medium
      .input-default
        height :35px
        line-height :@height
        padding-left: 10px
        width :80%
        min-height :35px
        font-family: DINAlternate-Bold
    .bottom
      padding-top: 18px
      font-size: 14px;
      letter-spacing: 0.6px;
      layout(row,block,nowrap)
      .left
        color: #818D99;
      .middle
        flex: 1
        margin-left :5px
        color:#000
      .right
        color: #5B93E1


  .explain
    padding :11px 10px 16px
    font-family: $font-family-regular
    font-size: 12px;
    color: #818D99;
    line-height: 18px;

  .button
    margin :0 10px
    height: 45px
    background: #D83F35;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    line-height :@height
    letter-spacing: 0.8px;
    text-align: center;
    opacity : 0.5
    transition :opacity 0.2s
    &.active
      opacity : 1
</style>
