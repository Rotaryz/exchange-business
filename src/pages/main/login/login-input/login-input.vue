<template>
  <form action="" report-submit @submit="getFormId">
    <ul class="login-input">
      <li class="input-wrapper">
        <img src="./icon-shouji.png" alt="" class="icon">
        <input type="number"
               class="input-default"
               placeholder="请输入手机号码"
               :placeholder-style="placeholder"
               maxlength="11"
               v-model="mobile"
               confirm-type="next"
        >
        <img v-if="mobile" src="./icon-delete.png" alt="" class=icon-delete @click="deleteMobileHandle">
      </li>
      <li class="input-wrapper">
        <img src="./icon-yzm.png" alt="" class="icon">
        <input type="number"
               class="input-default"
               :placeholder-style="placeholder"
               placeholder="请输入验证码"
               maxlength="6"
               v-model="code"
               confirm-type="done"
        >
        <button class="code-wrapper"
                :class="{black: regMobile && !counting}"
                @click.stop="checkCodeHandle"
                form-type="submit"
        >{{count}}{{counting ? 's' : ''}}
        </button>
      </li>
      <li v-if="config.register" class="input-wrapper">
        <img src="./icon-yqm.png" alt="" class="icon">
        <input type="text"
               class="input-default"
               placeholder="请输入邀请码"
               :placeholder-style="placeholder"
               maxlength="4"
               v-model="invite"
               confirm-type="done"
        >
      </li>
      <button class="button"
              :class="{active: checkRule}"
              @click="submitHandle"
              form-type="submit"
      >{{config.btnText}}
      </button>
    </ul>
  </form>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import HTTP from '@utils/http'
  import { REG_PHONE } from '@utils/common'

  const COMPONENT_NAME = 'LOGIN_INPUT'
  const CODE_TEXT = '获取验证码'

  export default {
    name: COMPONENT_NAME,
    props: {
      config: {
        type: Object,
        default: () => {
        }
      },
      mini_code: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        placeholder: 'font-size: 14px;font-family: PingFangSC-Regular; color: #BCC4CC',
        mobile: '',
        code: '',
        invite: '',
        count: CODE_TEXT,
        iv: '',
        encrypted_data: '',
        counting: false,
        customer_id: '',
        formId: []
      }
    },
    computed: {
      // 表单验证
      regMobile() {
        return REG_PHONE.test(this.mobile)
      },
      regCode() {
        // && this.iv && this.encrypted_data
        return this.code
      },
      regInvite() {
        if (this.config.register) {
          return this.invite
        } else {
          return true
        }
      },
      checkRule() {
        return this.regMobile && this.regCode && this.regInvite
      }
    },
    methods: {
      clearData() {
        Object.assign(this.$data, this.$options.data())
        clearInterval(this._timer)
      },
      deleteMobileHandle() {
        this.mobile = ''
      },
      checkCodeHandle() {
        if (!this.regMobile) {
          return this.$wechat.showToast('请输入正确的手机号码')
        }
        this.getCodeHandle()
      },
      getCodeHandle(e) {
        if (this.counting) return
        this.count = 59
        this.counting = true
        this._timer = setInterval(() => {
          this.count--
          if (this.count <= 0) {
            clearInterval(this._timer)
            this.count = CODE_TEXT
            this.counting = false
          }
        }, 1000)
        const data = { mobile: this.mobile }
        API.Login.sendCode({ data }).then((res) => {
          this.$wechat.showToast(res.message)
        })
      },
      submitHandle() {
        if (!this.regMobile) {
          return this.$wechat.showToast('请输入正确的手机号码')
        }
        if (!this.regCode) {
          return this.$wechat.showToast('请输入正确的验证码')
        }
        if (!this.regInvite) {
          return this.$wechat.showToast('请输入邀请码')
        }
        if (this.action) {
          return
        }
        this.action = true
        const data = {
          mobile: this.mobile,
          code: this.code,
          agent_share_code: this.invite,
          customer_id: this.customer_id
        }
        API.Login[this.config.api]({
          data
        }).then((res) => {
          this.setHeadInfo(res.data)
          this._sendFormId()
          this.$emit('submit')
          this.action = false
        }).catch(e => {
          this.action = false
          this.$emit('codeFailed')
        })
      },
      // 设置请求头信息
      setHeadInfo(data) {
        this.$storage('token', data.access_token)
        this.$storage('userInfo', data.shop_customer_info.shop_info)
        HTTP.setHeaders({ Authorization: data.access_token })
      },
      // 发送formId
      _sendFormId() {
        if (this.formId && this.formId[0]) {
          const data = { form_ids: this.formId }
          API.Global.getFormId({ data })
          this.formId = []
        }
      },
      // 收集formId
      getFormId(e) {
        const id = e.mp.detail.formId
        if (/mock/g.test(id)) return
        this.formId.push(id)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .login-input
    margin-top: 14px
    padding: 0 37px
    /*按钮*/
    .button
      margin-top: px2vw(39)
      height: 45px
      border-radius: 2px
      text-align: center
      line-height: @height
      font-family: $font-family-regular
      font-size: 16px
      color: #FFFFFF
      background: #D83F35
      opacity 0.5
      transition: opacity 0.3s
      &.active
        opacity 1
    /*input控件*/
    .input-wrapper
      height: 55px
      width: 100%
      layout(row, block, nowrap)
      box-sizing: border-box
      padding-top: 13.5px
      align-items: center
      border-bottom-1px()
      font-family: $font-family-regular
      font-size: 14px
      line-height 1
      color: #27273E
      .icon-delete
        width: 10px
        height: 10px
        extend-click()
      .icon
        width: 18px
        height: @width
      .input-default
        margin: 0 50px 0 10px
        flex: 1
      .code-wrapper
        height: 1em
        color: $color-text-tip
        &.black
          color: #192737
</style>
