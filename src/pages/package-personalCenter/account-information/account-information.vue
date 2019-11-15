<template>
  <div class="account-information">
    <navigation-bar title="账号信息"></navigation-bar>
    <div v-if="information.certificate_status===0||information.certificate_status===2" class="certificate-box">
      <img v-if="information.certificate_status===2" src="./pic-shwtg@2x.png" class="certificate-icon">
      <img v-else src="./pic-rzz@2x.png" class="certificate-icon">
      <div class="certificate-title">{{information.certificate_status===2?'审核未通过':'认证中'}}</div>
      <div v-if="information.certificate_status===2&&information.reasons" class="certificate-text">{{information.reasons}}</div>
    </div>
    <div class="account-box">
      <div v-if="information.certificate_status===1" class="account-item account-header">
        <p class="account-title">头像</p>
        <img :src="information.avatar" mode="aspectFill" class="header-img">
      </div>
      <div class="improving-item">
        <div class="improving-text">姓名</div>
        <p v-if="information.certificate_status===0" class="account-content">{{information.truename}}</p>
        <input v-else v-model="information.truename" type="text" placeholder-style="color: #818D99; font-size:14px;" maxlength="10" placeholder="请输入姓名" style="padding-right: 0" class="improving-input">
      </div>
      <div class="account-item">
        <p class="account-title">手机号码</p>
        <p class="account-content">{{information.mobile}}</p>
      </div>
      <div class="account-item">
        <p class="account-title">店铺名称</p>
        <input v-if="information.certificate_status===2" v-model="information.name" type="text" placeholder-style="color: #818D99; font-size:14px;" maxlength="10" placeholder="请输入店铺名称" style="padding-right: 0" class="improving-input">
        <p v-else class="account-content">{{information.name}}</p>
      </div>
      <div class="improving-item">
        <p class="improving-text">所属行业</p>
        <p v-if="information.certificate_status===0" class="account-content">{{industryText}}</p>
        <div v-else class="pick-box">
          <picker class="pick-con border-box" mode="selector" @change="industry" :range="industryArr" range-key="name">
            <div :class="{'improving-place': !industryText}" class="improving-input">
              {{industryText || '请选择行业'}}
            </div>
            <img src="/static/images/icon-pressed_my@2x.png" style="width: 10px;height: 10px;" alt="" class="way">
          </picker>
        </div>
      </div>
      <div class="improving-item">
        <p class="improving-text">所属地区</p>
        <p v-if="information.certificate_status===0" class="account-content">{{addressAll}}</p>
        <div v-else class="pick-box">
          <picker class="pick-con border-box" mode="region" :value="originRegion" @change="region">
            <div :class="{'improving-place': !addressAll}" class="improving-input">
              {{addressAll || '请选择地区'}}
            </div>
            <img src="/static/images/icon-pressed_my@2x.png" style="width: 10px;height: 10px;" alt="" class="way">
          </picker>
        </div>
      </div>
      <div class="account-item upload-item">
        <p class="account-title">营业执照</p>
        <div class="upload-con">
          <div v-if="uploadImg" class="upload-box">
            <img v-if="information.certificate_status===2" src="/static/images/icon-deltc@2x.png" alt="" class="icon-delete" @click="deleteUploadImg">
            <img :src="uploadImg" alt="" class="upload-img">
          </div>
          <div v-if="!uploadImg" class="upload-box">
            <img src="/static/images/icon-add@2x.png" alt="" class="upload-img icon-add" @click="chooseFilesBtn">
          </div>
          <div v-if="information.certificate_status===2" class="upload-tips">添加1张图片（大小5M以下）</div>
        </div>
      </div>
    </div>

    <form action="">
      <button v-if="information.certificate_status!==0" class="submit" :class="{'determine' : information.truename}" @click="submit">保存</button>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import chooseFiles from '@utils/we-cos/upload'

  const PAGE_NAME = 'ACCOUNT_INFORMATION'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        information: {
          mobile: '',
          name: '',
          truename: '',
          province: '',
          city: '',
          district: '',
          certificate_image_url: ''
        },
        addressAll: '',
        address: [],
        industryArr: [],
        isSubmission: true,
        industryText: '',
        uploadImg: ''
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
    computed: {
      originRegion() {
        return this.information.province ? [this.information.province, this.information.city, this.information.district] : ['广东省', '广州市', '荔湾区']
      }
    },
    onLoad() {
      this._getShopInfo()
      this.getIndustry()
    },
    methods: {
      // 获取店铺信息
      _getShopInfo() {
        API.Shop.getShopInfo()
          .then(res => {
            this.information = res.data.shop_info
            this.addressAll = `${this.information.province} ${this.information.city} ${this.information.district}`
            this.industryText = this.information.industry_name
            this.uploadImg = this.information.certificate_image_url
            this.$storage('userInfo', res.data.shop_info)
          })
      },
      // 获取行业
      getIndustry() {
        API.Mine.industry({ data: { limit: 0 }, loading: false, toast: false })
          .then(res => {
            this.industryArr = res.data
          })
      },
      // 选择行业
      industry(e) {
        let index = e.target.value * 1
        this.industryText = this.industryArr[index].name
        this.information.industry_id = this.industryArr[index].id
      },
      // 选择地区
      region(e) {
        this.address = e.target.value
      },
      deleteUploadImg() {
        this.uploadImg = ''
        this.information.certificate_image_url = ''
        this.information.certificate_image_id = ''
      },
      chooseFilesBtn() {
        chooseFiles().then(res => {
          this.uploadImg = res[0].url
          this.information.certificate_image_url = res[0].url
          this.information.certificate_image_id = res[0].id
        })
      },
      // 提交修改
      submit() {
        if (!this.isSubmission) return // 防止多次提交
        if (!this.information.truename) {
          this.$wechat.showToast('姓名不能为空')
          return
        }
        if (this.information.industry_id === '') {
          this.$wechat.showToast('所属行业不能为空')
          return
        }
        API.Mine.editInfo({ data: this.information })
          .then(res => {
            this.$wechat.showToast('保存成功')
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          })
          .catch(() => {
            this.isSubmission = true
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .account-information
    width: 100%

  .account-box
    padding: 0 10px
    background: $color-white
    box-sizing: border-box

  .account-item
    height: 49px
    border-bottom-1px(#F0F0F0)
    font-size: $font-size-14
    font-family: $font-family-regular
    display: flex
    align-items: center
    color: $color-text-main
    &:last-child
      border-none()
    .account-title
      width: 85px
      color: $color-text-assist
    .account-content
      max-width: 70vw
      font-family: PingFangSC-Regular
      font-size: 14px
      color: #818D99
      no-wrap()
  .improving-item
    display: flex
    align-items: center
    height: 49.5px
    border-bottom-1px(#F0F0F0)
    overflow: hidden
    .improving-text
      margin-right: 30px
      color: $color-text-assist
      width: 56px
      height: 49.5px
      line-height: 49.5px
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
      padding-right: 15px
      no-wrap-plus(1)
    .account-content
      max-width: 70vw
      font-family: PingFangSC-Regular
      font-size: 14px
      color: #818D99
      no-wrap()
    .improving-place
      color: $color-text-secondary
    .user-wx
      color: #5B93E1
      white-space: nowrap
      font-family: $font-family-regular
      font-size: 14px
      margin-left: 10px
    .way
      width: 10px
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
    margin: 20px 10px
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
  .account-header
    height: 79px
    .header-img
      background: $image-color
      border-radius: 50%
      display: block
      width: 50px
      height: 50px
  .certificate-box
    padding: 20px 0 23px
    background: #fff
    border-bottom: 10px solid $color-background
    layout()
    align-items: center
    justify-content: center
    .certificate-icon
      width: 58px
      height: @width
    .certificate-title
      font-family: $font-family-medium
      font-size: 17px
      color: $color-text-sub
    .certificate-text
      margin-top: 8px
      font-family: $font-family-regular
      font-size: 14px
      color: $color-text-secondary
  .upload-item
    padding: 20px 0
    min-height: 64px
    height: auto
    .upload-con
      .upload-box
        position: relative
        width: 64px
        height: @width
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
      .upload-tips
        margin-top: 10px
        color: $color-text-tip
        font-size: 12px
        font-family: $font-family-regular
  .pick-box
    flex: 1
    .pick-con
      width: 100%
</style>
