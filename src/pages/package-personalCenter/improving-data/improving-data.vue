<template>
  <div class="improving-data">
    <navigation-bar title="完善账号信息"></navigation-bar>
    <div class="improving-set">
      <div class="improving-item">
        <div class="improving-text">手机号码</div>
        <input v-model="information.mobile" disabled type="number" placeholder-style="color: #818D99; font-size:14px;" maxlength="11" class="improving-input">
      </div>
      <div class="improving-item">
        <div class="improving-text">姓名</div>
        <input v-model="information.truename" type="text" placeholder-style="color: #818D99; font-size:14px;" maxlength="10" placeholder="请输入姓名" class="improving-input">
      </div>
      <div class="improving-item">
        <div class="improving-text">店铺名称</div>
        <input v-model="information.name" type="text" placeholder-style="color: #818D99; font-size:14px;" maxlength="20" placeholder="请输入店铺名称" class="improving-input">
      </div>
      <picker class="border-box" mode="selector" @change="industry" :range="industryArr" range-key="name">
        <div class="improving-item">
          <div class="improving-text">所属行业</div>
          <div :class="{'improving-place': !information.industry}" class="improving-input">
            {{information.industry || '请选择行业'}}
          </div>
          <img src="/static/images/icon-pressed_my@2x.png" style="width: 10px;height: 10px;" alt="" class="way">
        </div>
      </picker>
      <picker class="border-box" mode="region" @change="region" :value="address">
        <div class="improving-item">
          <div class="improving-text">所属地区</div>
          <div :class="{'improving-place': !addressAll}" class="improving-input">
            {{addressAll || '请选择地区'}}
          </div>
          <img src="/static/images/icon-pressed_my@2x.png" style="width: 10px;height: 10px;" alt="" class="way">
        </div>
      </picker>
      <div class="improving-item upload-item">
        <div class="improving-text">营业执照</div>
        <div class="upload-con">
          <div v-if="uploadImg" class="upload-box">
            <img src="/static/images/icon-deltc@2x.png" alt="" class="icon-delete" @click="deleteUploadImg">
            <img :src="uploadImg" alt="" class="upload-img">
          </div>
          <div v-else  class="upload-box">
            <img src="/static/images/icon-add@2x.png" alt="" class="upload-img icon-add" @click="chooseFilesBtn">
          </div>
          <div class="placeholder-text">添加1张图片（大小5M以下）</div>
        </div>
      </div>
    </div>
    <form action="">
      <button class="submit" :class="{'determine' : isSubmit}" @click="submit">确定</button>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import storage from '@utils/storage'
  import chooseFiles from '@utils/we-cos/upload'

  const PAGE_NAME = 'IMPROVING_DATA'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        userInfo: {},
        information: {
          mobile: '',
          // code: '',
          name: '', // 店铺名称
          truename: '', // 姓名
          province: '',
          city: '',
          district: '',
          industry: '',
          industry_id: '',
          certificate_image_id: ''
        },
        uploadImg: '',
        address: ['广东省', '广州市', '荔湾区'],
        addressAll: '',
        tapCode: true,
        isSubmission: true,
        wxCode: '',
        industryArr: []
      }
    },
    computed: {
      isSubmit() {
        for (let value in this.information) {
          if (!this.information[value]) {
            return false
          }
        }
        return true
      }
    },
    watch: {
      address: {
        handler(news) {
          this.information.province = news[0]
          this.information.city = news[1]
          this.information.district = news[2]
          this.addressAll = news.join(' ')
        },
        deep: true
      }
    },
    onLoad() {
      this.userInfo = storage('userInfo') || {}
      this.information.mobile = this.userInfo.mobile
      this.getIndustry()
    },
    methods: {
      // 获取行业
      getIndustry() {
        API.Mine.industry({ data: { limit: 0 }, loading: false, toast: false })
          .then(res => {
            this.industryArr = res.data
          })
      },
      // 获取微信登录信息
      _getCode() {
        this.$wechat.login()
          .then(res => {
            this.wxCode = res.code
          })
      },
      // 获取微信手机号码
      getPhoneNumber(e) {
        let data = {
          code: this.wxCode,
          iv: e.mp.detail.iv,
          encrypted_data: e.mp.detail.encryptedData
        }
        API.Mine.getWechatMobile({ data, loading: false, toast: false })
          .then(res => {
            this.information.mobile = res.data.mobile
          })
          .catch(() => {
            this.$wechat.showToast('获取手机号码失败，请重试')
          })
      },
      // 获取用户信息
      getUserInfo() {
        API.Mine.getUserInfo({
          data: {},
          loading: false,
          doctor: () => {
          }
        })
          .then((res) => {
            let userInfo = res.data.shop_info
            this.$storage('userInfo', userInfo)
            wx.navigateBack()
          })
      },
      // 提交修改
      submit() {
        if (!this.isSubmission) return // 防止多次提交
        if (!this.isSubmit) return // 判断是否可提交
        const data = Object.assign(this.information, { is_completed: 1 })
        API.Mine.updateShop({ data })
          .then(res => {
            this.$wechat.showToast('保存成功！')
            wx.navigateBack()
          })
          .catch(() => {
            this.isSubmission = true
          })
      },
      // 选择地区
      region(e) {
        this.address = e.target.value
      },
      // 选择行业
      industry(e) {
        let index = e.target.value * 1
        this.information.industry = this.industryArr[index].name
        this.information.industry_id = this.industryArr[index].id
      },
      // 点击获取验证码
      async setCode() {
        if (this.information.mobile === '') {
          this.$wechat.showToast('请输入手机号码')
          return
        } else if (this.information.mobile.length < 11) {
          this.$wechat.showToast('请输入正确的手机号码')
          return
        }
        let data = { mobile: this.information.mobile }
        if (!this.tapCode) {
          return
        }
        this.tapCode = false
        let codeData = {}
        try {
          codeData = await API.Mine.messageBind({
            data,
            loading: true,
            toast: true,
            doctor() {
            }
          })
          this.codeText = '发送中…'
          setTimeout(() => {
            this.$wechat.showToast(codeData.message)
          }, 200)
          if (codeData.error_code !== this.$ERR_OK) {
            this.codeText = '获取验证码'
            this.tapCode = true
          } else {
            let time = 60
            this.codeText = '60s'
            let timer = setInterval(() => {
              // this.tapCode = false
              time--
              this.codeText = `${time}s`
              if (time <= 0) {
                this.codeText = '获取验证码'
                this.tapCode = true
                clearInterval(timer)
              }
            }, 1000)
          }
        } catch (e) {
          this.tapCode = true
        } finally {
          this.$wechat.hideLoading()
        }
      },
      deleteUploadImg() {
        this.uploadImg = ''
        this.information.certificate_image_id = ''
      },
      chooseFilesBtn() {
        chooseFiles().then(res => {
          console.log('uploadImg')
          console.log(res)
          this.uploadImg = res[0].url
          this.information.certificate_image_id = res[0].id
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .improving-data
    height: 100vh

  .improving-set
    padding: 0 10px
    box-sizing: border-box
    background: $color-white
    margin-top: 10px

  .border-box
    border-bottom-1px(#F0F0F0)

  .improving-item
    display: flex
    align-items: center
    height: 49.5px
    border-bottom-1px(#F0F0F0)
    &:last-child
      border-none()
    .improving-text
      margin-right: 30px
      color: $color-text-assist
      width: 56px
      white-space: nowrap
      text-align: left
      font-family: $font-family-regular
      font-size: 14px
    .improving-input
      color: $color-text-main
      font-size: 14px
      flex: 1
      height: 40px
      line-height: 40px
      no-wrap()
    .improving-place
      color: $color-text-secondary
    &.upload-item
      box-sizing: border-box
      padding-top: 19.5px
      height: 135px
      align-items: flex-start
    .upload-con
      .upload-box
        position: relative
        width: 64px
        height: @width
        margin-bottom: 10px
        .upload-img
          width: 100%
          height: 100%
          &.icon-add
            width: 64px
        .icon-delete
          position: absolute
          top: -9px
          right: -9px
          width: 18px
          height: @width
      .placeholder-text
        line-height: 1
        font-family: $font-family-regular
        font-size: 12px
        color: #bcc4cc
    .user-wx
      color: #5B93E1
      white-space: nowrap
      font-family: $font-family-regular
      font-size: 14px
      margin-left: 10px
    .way
      width: 5.5px
      height: 10px
      col-center()
      right: 0

    .user-code
      padding: 7px 0
      width: 96px
      text-align: center
      border-1px(#D2D2D2, 15px)
      color: $color-text-main
      font-size: 14px
    .user-code-user
      color: $color-text-secondary

  .submit
    margin: 20px 10px 0
    height: 45px
    line-height: 45px
    opacity: 0.5
    background: $color-main
    color: rgba(255, 255, 255, .5)
    display: block
    font-size: $font-size-16
    font-family: $font-family-regular
    border-radius: 2px
    letter-spacing: 0.8px

  .determine
    color: $color-white
    opacity: 1

  .improving-footer
    position: fixed
    bottom: 20px
    left: 0
    width: 100vw
    font-size: $font-size-12
    color: #BCC4CC
    font-family: $font-family-regular
    text-align: center
    display: flex
    align-items: center
    line-height: 1
    justify-content: center
    .link
      color: #5B93E1
</style>
