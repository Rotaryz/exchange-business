<template>
  <div class="bank-card">
    <navigation-bar title="绑定银行卡"></navigation-bar>
    <div class="white">
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">持卡人</div>
        <input type="text" placeholder="持卡人姓名" class="ro-bank-content" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #ccc" v-model="cardName" />
      </div>
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">银行卡号</div>
        <input type="number" placeholder="输入银行卡号" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #ccc" maxlength="23" @input="getCardNum" v-model="cardNum" class="ro-bank-content" placeholder-class="ro-bank-content-place" />
      </div>
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">开户行</div>
        <picker mode="selector" @change="_selectBack" :value="bankIdx" :range="bankList" range-key="name">
          <div class="ro-bank-content" :class="bankId ? '' : 'ro-bank-content-place'">{{bank}}</div>
        </picker>
        <img class="ro-bank-card-icon" v-if="imageUrl" :src="imageUrl + '/ws-image/icon-pressed@2x.png'">
      </div>
    </div>
    <div :class="[cardName&&cardNum&&bankId?'active':'']" class="button"  @click="_showBankToast">保存</div>

    <article class="confirm-msg" v-if="isShowToast" :animation="maskAnimation" @click="_hideBankToast">
      <button class="content" :animation="modalAnimation">
        <p class="title">请核对您的信息</p>
        <div class="item-wrapper">
          <p class="it-left">持卡人</p>
          <p class="it-right">{{cardName}}</p>
        </div>
        <div class="item-wrapper">
          <p class="it-left">银行卡号</p>
          <p class="it-right">{{cardNum}}</p>
        </div>
        <div class="item-wrapper">
          <p class="it-left">开户行</p>
          <p class="it-right">{{bank}}</p>
        </div>
        <div class="btn-group">
          <div class="btn confirm" @click.stop="saveBackCard">确定</div>
        </div>
      </button>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import AnimationModal from '@mixins/animation-modal'
  import API from '@api'

  const PAGE_NAME = 'BANK_CARD'

  export default {
    name: PAGE_NAME,
    mixins: [AnimationModal],
    data() {
      return {
        cardNum: '',
        cardName: '',
        bank: '选择开户银行',
        bankId: '',
        cardId: '',
        bankList: [],
        id: null,
        bankIdx: 0,
        submitLock: false,
        isShowToast: false,
        isUpdate: false
      }
    },
    components: {
      NavigationBar
    },
    onLoad(options) {
      this.getBankCardDetail()
      this.getBankList()
    },
    methods: {
      // 开户行列表
      getBankList() {
        API.Property.getBankList().then((res) => {
          this.bankList = res.data
        })
      },
      // 银行卡信息
      getBankCardDetail() {
        API.Property.getBackCardInfo().then((res) => {
          if (res.error_code === this.$ERR_OK && res.data.user_name) {
            this.cardName = res.data.user_name
            this.bank = res.data.bank_name
            this.bankId = res.data.bank_id
            this.cardId = res.data.id
            this.cardNum = res.data.bank_card
            this.isUpdate = true
          }
        })
      },
      getCardNum (e) {
        this.cardNum = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      },
      // 选择银行
      _selectBack (e) {
        let index = e.target.value * 1
        this.bank = this.bankList[index].name
        this.bankId = this.bankList[index].bank_id
      },
      // 显示确认弹窗
      _showBankToast() {
        if (this.submitLock) {
          return
        }
        if (!this.cardName) {
          this.$wechat.showToast('持卡人不能为空')
          return
        }
        if (!this.cardNum) {
          this.$wechat.showToast('银行卡号不能为空')
          return
        }
        if (this.bank === '选择开户银行') {
          this.$wechat.showToast('开户行不能为空')
          return
        }
        this.isShowToast = true
      },
      _hideBankToast() {
        this.isShowToast = false
      },
      // 保存银行卡
      saveBackCard() {
        if (this.submitLock) {
          return
        }
        this.submitLock = true
        let params = {
          user_name: this.cardName,
          bank_id: this.bankId,
          bank_name: this.bank,
          bank_card: this.cardNum
        }
        let apiFun = 'addBackCard'
        if (this.isUpdate) {
          apiFun = 'updateBackCard'
          params.id = this.cardId
        }
        API.Property[apiFun]({data: params})
          .then((res) => {
            this._hideBankToast()
            this.$wechat.showToast('绑定成功！')
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

  // 弹窗
  .confirm-msg
    background-color: rgba(17, 17, 17, 0.7)
    fill-box(fixed)
    z-index: 500
    layout()
    align-items: center
    .mask
      fill-box()
      background-color: $color-20202E
      opacity: 0.8
    .content
      position: relative
      width: 290px
      min-height: 244px
      background-color: $color-white
      border: 1px solid rgba(32, 32, 46, 0.10)
      border-radius: 6px
      layout()
      left:0
      top:0
      bottom:0
      right:0
      margin:auto
      opacity :1
      line-height :1
    .title
      font-family: PingFangSC-Medium
      font-size: 16px
      color: #111111
      margin :25px auto 30px
    .item-wrapper
      font-family: PingFangSC-Regular
      font-size: 14px
      display :flex
      margin-bottom :20px
      text-align :left
      .it-left
        width :74px
        color: #616161
        padding-left :25px
      .it-right
        coor: $color-text-main
    .btn-group
      margin :15px auto 0
      width :136px
      height:36px
      background: #D83F35
      border: 1px solid #D83F35
      border-radius: @height
      .confirm
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color:#fff
        text-align :center
        line-height :36px

  .bank-card
    width: 100%
    background: $color-background
    min-height: 100vh
  .white
    background: $color-white
    margin-top: 10px
  .ro-bank-card-item
    margin: 0 15px
    box-sizing: border-box
    height: 55px
    display: flex
    align-items: center
    font-size: $font-size-14
    white-space: nowrap
    position: relative
    &:after
      content: ""
      transform: scaleY(.5) translateZ(0)
      transform-origin bottom
      border-bottom: 1px solid $color-line
      position: absolute
      bottom: 0
      left :0
      right: -15px
    &:last-child
      border-none()
    .ro-bank-card-name
      min-width: 56px
      color: $color-828AA2
      font-family $font-family-regular
    .ro-bank-content
      height: 44.5px
      line-height: 44.5px
      width: 73.6vw
      color: $color-374B63
      font-family: $font-family-regular !important
    input.ro-bank-content
      width: 55vw
      font-size: $font-size-14
      font-family: $font-family-regular !important
    .ro-bank-content
      margin-left: 30px
    .ro-bank-content-place
      font-size: $font-size-14
      font-family: $font-family-regular !important
      color: #ccc
    .ro-bank-card-icon
      position: absolute
      col-center()
      right: 0
      height: 12px
      width: 6px

  .button
    margin :20px 10px 0
    height: 45px
    background #D83F35
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0.8px;
    text-align: center;
    line-height :@height
    border-radius :2px
    opacity :0.5
    &.active
      opacity : 1

</style>
