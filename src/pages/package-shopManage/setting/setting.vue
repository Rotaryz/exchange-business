<template>
  <div class="setting">
    <navigation-bar title="基础信息"></navigation-bar>
    <div class="list">
      <div class="list-item upload-item">
        <div class="item-label">店铺logo</div>
        <div class="upload-box">
          <img v-if="logoImg" src="/static/images/icon-deltc@2x.png" alt=""
               class="icon-delete" @click="deleteUploadImg">
          <img :src="logoImg||'/static/images/icon-add@2x.png'" alt="" class="upload-img" @click="chooseFilesBtn">
        </div>
      </div>
      <div class="list-item">
        <div class="item-label">店铺名称</div>
        <!--<input v-model="name" type="text" placeholder-style="color: #818D99; font-size:14px;" maxlength="11" placeholder="请输入店铺名称" class="item-input phone">-->
        <div class="item-val" style="color: #818D99">{{shopName}}</div>
      </div>
      <picker mode="region" @change="handleRegion" :value="region">
        <div class="list-item ">
          <p class="item-label">所属地区</p>
          <div :class="{'improving-place': !address}" class="item-val">
            {{address || '请选择地区'}}
          </div>
          <!--          <img src="/static/images/icon-pressed_my@2x.png" style="width: 10px;height: 10px;align-self: center" alt="">-->
        </div>
      </picker>
      <section class="list-item border-top-1px" style="height: auto">
        <p class="item-label">详细地址</p>
        <textarea :class="['text-area',{'ios-textarea':isIos}]"
                  type="text"
                  auto-height
                  v-model="addressDetail"
                  placeholder="请输入详细地址"
                  placeholder-style="color: #818D99; font-size:14px" maxlength="400"></textarea>
      </section>
      <div class="list-item">
        <div class="item-label">营业时间</div>
        <div class="time-con">
          <picker mode="time" :value="startTime" id="startTime" @change="_timeChange">
            <div v-if="startTime" class="time-val">{{startTime}}</div>
            <div v-else class="time-val sub-text">开始时间</div>
          </picker>
          <img src="/static/images/icon-pressed_my@2x.png" class="icon-arrow">
          <div class="center-label">至</div>
          <picker mode="time" :value="endTime" id="endTime" @change="_timeChange">
            <div v-if="endTime" class="time-val">{{endTime}}</div>
            <div v-else class="time-val sub-text">结束时间</div>
          </picker>
          <img src="/static/images/icon-pressed_my@2x.png" class="icon-arrow">
        </div>
      </div>
    </div>
    <div :class="[shopName&&address&&addressDetail&&startTime&&endTime?'active':'']" class="save-btn" @click="_saveSetting">保存</div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import chooseFiles from '@utils/we-cos/upload'

  const PAGE_NAME = 'SETTING'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        shopName: '',
        // address: '',
        startTime: '',
        endTime: '',
        submitting: false,
        logoImg: '',
        logoId: '',
        region: ['广东省', '广州市', '荔湾区'],
        addressDetail: ''
      }
    },
    onLoad() {
      this._getShopInfo()
    },
    computed: {
      isIos() {
        return this.$systemInfo.system.includes('iOS')
      },
      address() {
        return this.region.reduce((total, item) => {
          return total === item ? total : total + item
        })
      }
    },
    methods: {
      handleRegion(e) {
        this.region = e.target.value
      },
      // 获取店铺信息
      _getShopInfo() {
        API.Shop.getShopInfo()
          .then((res) => {
            const shopInfo = res.data.shop_info
            this.logoImg = shopInfo.avatar
            this.logoId = shopInfo.image_id
            this.shopName = shopInfo.name
            let shopDate = shopInfo.opening_time_text.split('-')
            this.startTime = shopDate[0]
            this.endTime = shopDate[1]
            this.region = [shopInfo.province || '', shopInfo.city || '', shopInfo.district || '']
            this.addressDetail = shopInfo.address || ''
          })
      },
      // 保存修改
      _saveSetting() {
        if (this.submitting) return
        if (!this.logoImg) {
          this.$wechat.showToast('请上传店铺logo')
          return
        }
        if (!this.startTime) {
          this.$wechat.showToast('请选择营业开始时间')
          return
        }
        if (!this.endTime) {
          this.$wechat.showToast('请选择营业结束时间')
          return
        }
        let checkStartTime = new Date(`2019-08-20 ${this.startTime}:00`).getTime()
        let checkEndTime = new Date(`2019-08-20 ${this.endTime}:00`).getTime()
        if (checkStartTime >= checkEndTime) {
          this.$wechat.showToast('开始时间必须小于结束时间')
          return
        }
        this.submitting = true
        let params = { opening_time_text: `${this.startTime}-${this.endTime}` }
        params.image_id = this.logoId || 0
        Object.assign(params, {
          province: this.region[0],
          city: this.region[1],
          district: this.region[2],
          address: this.addressDetail
        })
        API.Shop.updateShopInfo({ data: params })
          .then((res) => {
            this.$wechat.showToast('保存成功！')
            this.submitting = false
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          })
          .catch(() => {
            this.submitting = false
          })
      },
      _timeChange(e) {
        e.currentTarget && e.currentTarget.id && (this[e.currentTarget.id] = e.mp.detail.value)
      },
      chooseFilesBtn() {
        chooseFiles().then(res => {
          this.logoImg = res[0].url
          this.logoId = res[0].id
        })
      },
      deleteUploadImg() {
        this.logoImg = ''
        this.logoId = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $margin = px-change-vw(10)

  .text-area
    padding: 15px 0
    font-family: $font-family-regular
    color: $color-text-main
    font-size: 14px
    flex: 1
    line-height: 1.4
    &.ios-textarea
      margin-top: -8px
      margin-left: -6px
  .setting
    width: 100%

    .list
      margin-top: 10px
      padding-left: $margin
      background: $color-white

      .list-item
        position: relative
        height: 48px
        line-height: 48px
        padding-right: $margin
        border-bottom-1px()
        layout(row, block, nowrap)

        &:last-child
          border-none()

        &.upload-item
          height: 58px
          line-height: @height
          align-items: center

          .upload-box
            position: relative
            width: 45px
            height: @width

            .upload-img
              width: 45px
              height: @width
              border-radius: 2px

            .icon-delete
              position: absolute
              top: -5px
              right: -8px
              width: 16px
              height: @width

      .item-label
        height: inherit
        line-height: inherit
        width: px-change-vw(86)
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-assist

      .item-val
        flex: 1
        height: inherit
        line-height: inherit
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-main
        no-wrap-plus(1)

        &.improving-place
          color: $color-text-secondary

      .time-con
        layout(row)
        align-items: center

        .time-val
          height: 48px
          line-height: 48px
          min-width: px-change-vw(72)
          font-family: $font-family-regular
          font-size: 14px
          color: $color-text-main

          &.sub-text
            color: $color-text-secondary

        .center-label
          margin: 0 px-change-vw(30) 0 px-change-vw(10)
          color: $color-text-secondary
          font-family: $font-family-regular
          font-size: 14px

      .icon-arrow
        right: $margin
        margin: auto
        width: 10px
        height: 10px

    .save-btn
      margin: 20px $margin
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
