<template>
  <div class="personal-settings">
    <navigation-bar title="设置"></navigation-bar>
    <ul class="module-wrapper">
      <navigator class="default-item-wrapper"
                 style="height: 80px"
                 hover-class="none"
                 :url="informationUrl"
      >
        <div class="left">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="" class="avatar" mode="aspectFill">
          <p>{{userInfo.name}}</p>
        </div>
        <div class="right">
          <p>{{userInfo.is_completed ? '查看信息' : '完善信息'}}</p>
          <img src="./icon-pressed_my@2x.png" alt="" class="arrow-right">
        </div>
      </navigator>
      <navigator class="default-item-wrapper"
                 hover-class="none"
                 :url="$routes.personalCenter.MY_ADDRESS"
      >
        <div class="left">我的地址</div>
        <div class="right">
          <img src="./icon-pressed_my@2x.png" alt="" class="arrow-right">
        </div>
      </navigator>
    </ul>
    <ul class="module-wrapper">
      <navigator class="default-item-wrapper"
                 hover-class="none"
                 @click="welcomeHandle"
      >
        <div class="left">常见问题</div>
        <div class="right">
          <img src="./icon-pressed_my@2x.png" alt="" class="arrow-right">
        </div>
      </navigator>
      <div class="default-item-wrapper"
                 hover-class="none"
                 @click="showServicesFun"
      >
        <div class="left">联系客服</div>
        <div class="right">
          <img src="./icon-pressed_my@2x.png" alt="" class="arrow-right">
        </div>
      </div>
    </ul>
    <button class="button" @click="exitHandle">退出登录</button>
    <exit-popup></exit-popup>
    <!--exit的弹窗-->
    <exit-popup confirmText="确认" popUpType="confirm" tip="您确认要退出登录？" :showPopup.sync="showPopup" @confirm="exitAction"></exit-popup>
    <exit-popup confirmText="复制" popUpType="copy" text="请添加客服微信" shareNum="13189152290" isSituationClose :showPopup.sync="showServices" @confirm="exitAction"></exit-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import Popup from './popup/popup'
  import HTTP from '@utils/http'
  import wx from 'wx'

  const PAGE_NAME = 'PERSONAL_SETTINGS'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      'exit-popup': Popup
    },
    data() {
      return {
        userInfo: {},
        showPopup: false,
        showServices: false
      }
    },
    computed: {
      informationUrl() {
        return this.userInfo.is_completed ? this.$routes.personalCenter.ACCOUNT_INFORMATION : this.$routes.personalCenter.IMPROVING_DATA
      }
    },
    onShow() {
      this.getUserInfo()
    },
    methods: {
      getUserInfo(cb) {
        API.Mine.getUserInfo({
          data: {},
          loading: false
        })
          .then((res) => {
            this.userInfo = res.data.shop_info
            this.$storage('userInfo', this.userInfo)
            cb && cb()
          })
      },
      exitHandle() {
        this.showPopup = true
      },
      exitAction() {
        HTTP.setHeaders({Authorization: ''})
        wx.removeStorageSync('token')
        wx.redirectTo({ url: this.$routes.main.LOGIN })
      },
      showServicesFun() {
        this.showServices = true
      },
      welcomeHandle() {
        this.$wechat.showToast('即将发布')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .personal-settings
    min-height 100vh
    background :$color-background
    .button
      margin-top :20px
      height: 50px
      font-family: $font-family-medium
      font-size: 15px
      color: #313131
      text-align: center
      line-height: @height
      background :#fff
    .module-wrapper
      padding-left :10px
      margin-bottom :10px
      background :#fff
      .default-item-wrapper
        border-bottom-1px()
        font-family: $font-family-regular
        font-size: 15px
        line-height: 1
        color: #3F454B
        layout(row,block,nowrap)
        align-items center
        height: 50px
        padding-right 15px
        &:last-child
          &:after
            display :none
        .left
          flex: 1
          layout(row)
          align-items :center
          .avatar
            display block
            width: 50px
            height: 50px
            margin-right 10px
            border-radius :100%
        .right
          layout(row)
          align-items :center
          font-size: 13px
          color: #818D99
          p
            color: inherit
          .arrow-right
            margin-left :6px
            width: 10px
            height: 10.5px
</style>
