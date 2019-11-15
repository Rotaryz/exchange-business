<template>
  <div class="new-address">
    <navigation-bar :title="(id ? '编辑':'新建')+'地址'"></navigation-bar>
    <div class="input-content">
      <div class="form-item">
        <div class="label-text">收货人</div>
        <input v-model="edit.name" maxlength="10" class="base-input" placeholder="收件人" placeholder-class="placeholder" type="text">
      </div>
      <div class="form-item">
        <div class="label-text">手机号码</div>
        <input v-model="edit.mobile" maxlength="11" class="base-input" placeholder="收件人手机号" placeholder-class="placeholder" type="text">
      </div>
      <div class="form-item">
        <div class="label-text">选择地区</div>
        <picker mode="region" class="pick-wrap" @change="changeArea" :value="area">
          <div class="picker">
            <div v-if="!edit.province && !edit.city && !edit.district " class="base-input address-item placeholder">请选择所在地区</div>
            <div v-else class="address-item-text">{{edit.province}}，{{edit.city}}，{{edit.district }}</div>
            <img src="/static/images/icon-pressed_my@2x.png" class="arrow-right" style="width: 10px;height: 10px;">
          </div>
        </picker>
      </div>
      <div class="form-item detail-address-item">
        <div class="label-text">详细地址</div>
        <textarea v-model="edit.address" class="base-input textarea" :class="{'regimental-text-ios': isIos}" placeholder="街道、楼牌号等" placeholder-class="placeholder" type="text"></textarea>
      </div>
    </div>
    <div class="form-item default-set">
      <div class="label-text">设为默认地址</div>
      <div class="switch-button" :class="{active:edit.is_default}" @click="switchChange"></div>
    </div>
    <div class="btn-wrap">
      <!--      <button v-if="isDisable" class="button-primary button-disable">{{id ? '保存':'新建'}}地址</button>-->
      <!--      <button v-else class="button-primary" @click="_addAddrss">{{id ? '保存':'新建'}}地址</button>-->
      <button v-if="isDisable" class="button-primary button-disable">保存</button>
      <button v-else class="button-primary" @click="_addAddrss">保存</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import GetOptions from '@mixins/get-options'

  const PAGE_NAME = 'NEW_ADDRESS'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    mixins: [GetOptions],
    data() {
      return {
        area: ['广东省', '广州市', '荔湾区'],
        id: 0,
        isIos: false,
        edit: {
          is_default: 0,
          name: '',
          mobile: '',
          province: '',
          city: '',
          district: '',
          address: ''
        }
      }
    },
    computed: {
      isDisable() {
        return !this.edit.name || !this.edit.mobile || !this.edit.province || !this.edit.city || !this.edit.district || !this.edit.address
      }
    },
    onLoad(options) {
      wx.getSystemInfo({
        success: (res) => {
          this.isIos = res.system.includes('iOS')
        }
      })
      let { id } = options
      this.id = id || 0
      if (id) {
        this._getAddressDetail(id)
      } else {
        let userInfo = this.$storage('userInfo')
        this.edit.name = userInfo.truename
        this.edit.mobile = userInfo.mobile
        this.edit.province = userInfo.province
        this.edit.city = userInfo.city
        this.edit.district = userInfo.district
      }
    },
    methods: {
      // 是否默认
      switchChange() {
        this.edit.is_default = this.edit.is_default ? 0 : 1
      },
      _getAddressDetail(id) {
        API.Address.getAddressDetail({ data: { id } }).then((res) => {
          this.edit = res.data
        })
      },
      changeArea(val) {
        this.area = val.mp.detail.value
        this.edit.province = this.area[0]
        this.edit.city = this.area[1]
        this.edit.district = this.area[2]
      },
      _addAddrss() {
        let requestName = this.id ? 'editAddress' : 'addAddress'
        let data = this.id ? { ...this.edit, id: this.id } : this.edit
        API.Address[requestName]({ data }).then(() => {
          wx.showToast({ title: '保存地址成功', icon: ',/icon-success_save@2.png' })
          wx.navigateBack({ delta: 1 })
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .new-address
    width: 100%

  .input-content
    padding-left: 10px
    background-color: $color-white

  .form-item
    min-height: 50px
    display: flex
    align-items: center
    border-bottom-1px(#EBEAF3)

    .label-text
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub
      white-space: nowrap
      flex-shrink: 0
      width: 88px

    .pick-wrap
      flex: 1
      height: 50px
      line-height: 50px
      width: 0
      .picker
        display: flex
        align-items: center
        width: 100%
        line-height: 50px
        height: 50px
        .address-item-text
          width: 100%
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
          font-size: $font-size-14

        .address-item
          width: 0
          display: flex
          flex: 1
          align-items: center
          justify-content: space-between
          height: 50px
          line-height: 50px
          font-size: $font-size-14
        .arrow-right
          width: 10px
          height: 10px
          margin-right 10px

    .base-input
      flex: 1
      padding-right: 10px
      font-size: $font-size-14
      letter-spacing: 0.6px
      height: 40px
      line-height: 40px

  .detail-address-item
    padding: 18px 0
    align-items: flex-start
    border-none()

    .textarea
      height: 44px
      line-height: 1.4

      &.regimental-text-ios
        margin-top: -10px
        margin-left: -4px

  .default-set
    padding-left: 10px
    background-color: $color-white
    margin-top: 7px
    padding-right: 10px
    justify-content: space-between
    border-none()

    .switch-button
      width: 50px
      height: 27px
      background-size: 100% 100%
      object-fit: cover
      background-image: url("./icon-close@2x.png")

      &.active
        background-image: url("./icon-open@2x.png")

  .btn-wrap
    padding: 20px 10px

    .button-primary
      height: 45px
      line-height: @height
      border-radius: 2px

</style>
