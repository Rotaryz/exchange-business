<template>
  <div class="service-edit">
    <navigation-bar :title="pageTitle"></navigation-bar>
    <div class="surface-image">
      <image v-if="serviceDetail.goods_banner_images[0]" class="image" :src="serviceDetail.goods_banner_images[0].image_url" mode="aspectFill"></image>
      <img v-else class="image" src="./pic-service.png">
      <div class="image-btn" @click="changeBanner"><span class="image-icon"></span>更换封面</div>
    </div>
    <!--<div class="editor-item border-bottom-1px" @click="showTitleModal('name')">
      <div class="item-left">标题</div>
      <div class="item-right input-right" >
        <div class="right-txt" v-if="serviceDetail.name">{{serviceDetail.name}}</div>
        <span class="right-txt-placeholder" v-if="!serviceDetail.name">请输入服务的标题</span>
      </div>
    </div>-->

    <label>
      <div class="editor-item">
        <div class="item-left">标题</div>
        <div class="item-right">
          <input type="text" class="input-box no-right" placeholder-style="color: #BCC4CC" maxlength="40" v-model="serviceDetail.name" placeholder="请输入服务的标题">
        </div>
      </div>
    </label>
    <!--<div class="editor-item" @click="showTitleModal('subtitle')">
      <div class="item-left need-no">副标题</div>
      <div class="item-right input-right" >
        <div class="right-txt" v-if="serviceDetail.subtitle">{{serviceDetail.subtitle}}</div>
        <span class="right-txt-placeholder" v-if="!serviceDetail.subtitle">非必填</span>
      </div>
    </div>-->
    <h1 class="grey-space"></h1>
    <label>
      <div class="editor-item border-bottom-1px">
        <div class="item-left">门市价</div>
        <div class="item-right">
          <input type="digit" class="input-box" placeholder-style="color: #BCC4CC" v-model="serviceDetail.original_price" placeholder="请输入门市价">
          元
        </div>
      </div>
    </label>
    <label>
      <div class="editor-item border-bottom-1px">
        <div class="item-left">售价</div>
        <div class="item-right">
          <input type="digit" class="input-box" placeholder-style="color: #BCC4CC" v-model="serviceDetail.price" placeholder="请输入售价">
          元
        </div>
      </div>
    </label>
    <label>
      <div class="editor-item border-bottom-1px">
        <div class="item-left">库存</div>
        <div class="item-right">
          <input type="number" class="input-box" placeholder-style="color: #BCC4CC" v-model="serviceDetail.saleable" placeholder="请输入库存">
          个
        </div>
      </div>
    </label>
    <h1 style="height: 10px; background: #F6F6F6"></h1>
    <div class="service-img-item">
      <div class="item-title">图片详情 <span class="item-subtitle">建议大小10M以内，最多5张</span></div>
      <div class="img-container">
        <div class="container-item">
          <div class="img-box" v-for="(item, index) in [1, 2, 3, 4, 5]" :key="index">
            <div class="img-bc un-up" :class="{'img-hide': index < serviceDetail.goods_detail_images.length}"></div>
            <div class="img-bc up" v-if="serviceDetail.goods_detail_images.length === index"></div>
            <div class="img-bc image-file" @click="addDetailImage()" v-if="serviceDetail.goods_detail_images.length === index"></div>
          </div>
        </div>
        <div class="container-item">
          <div class="img-box" v-for="(item, index) in serviceDetail.goods_detail_images" :key="index">
            <image class="img-show" v-if="item.image_url" :src="item.image_url" mode="aspectFill"></image>
            <img src="./icon-del@2x.png" class="del-icon" v-if="item.image_url" @click.stop="delDetailImage(index)">
          </div>
        </div>
      </div>
    </div>
    <h1 class="grey-space"></h1>
    <select-picker
      ref="startPicker"
      :slotHeight="50"
      :sources="startDateSources"
      :value="startValue"
      :disabled="Boolean(id)"
      @changePicker="changePicker"
      @toggle="pickerToggle($event, 'start')"
    >
      <template slot="content">
        <div class="editor-item border-bottom-1px">
          <div class="item-left">开始时间</div>
          <div class="item-right">
            <input type="text" class="input-box" placeholder-style="color: #BCC4CC" :class="{'no-click': (type === 'edit')}" disabled v-model="serviceDetail.use_start_at" readonly placeholder="请选择时间">
            <span class="right-tag" :class="{'open': pickerOpen === 'start'}"></span>
          </div>
        </div>
      </template>
    </select-picker>
    <select-picker
      ref="endPicker"
      :slotHeight="50"
      :sources="endDateSources"
      :value="endValue"
      @changePicker="changePicker"
      @toggle="pickerToggle($event, 'end')"
    >
      <template slot="content">
        <div class="editor-item">
          <div class="item-left">结束时间</div>
          <div class="item-right">
            <input type="text" class="input-box" placeholder-style="color: #BCC4CC" v-model="serviceDetail.use_end_at" disabled readonly placeholder="请选择时间">
            <span class="right-tag" :class="{'open': pickerOpen === 'end'}"></span>
          </div>
        </div>
      </template>
    </select-picker>
    <h1 class="grey-space"></h1>
    <label>
        <div class="editor-item border-bottom-1px">
          <div class="item-left">预约信息</div>
          <div class="item-right">
            <input type="text" maxlength="140" class="input-box" placeholder-style="color: #BCC4CC" v-model="serviceDetail.config.message" placeholder="请输入(例：需提前两天预约)">
          </div>
        </div>
      </label>
    <label>
      <div class="editor-item">
        <div class="item-left">温馨提示</div>
        <div class="item-right">
          <base-switch
            :status="serviceDetail.note.is_show"
            @changeSwitch="changeSwitch"
          ></base-switch>
        </div>
      </div>
    </label>
    <div class="textarea-item" :class="{'textarea-show': showText}">
        <div class="textarea-box">
          <textarea class="textarea-content" :class="{'textarea-content-show': showText}" placeholder-style="color: #BCC4CC" @touchmove.stop maxlength="20" placeholder="请输入" v-model="serviceDetail.note.message"></textarea>
          <!--<div class="count-box">{{serviceDetail.note.remarks.length}}/20</div>-->
        </div>
      </div>

    <div class="footer-fill" :style="{height: statusBarHeight > 20 ? '100px':'80px'}"></div>
    <cover-view class="footer-box" :style="{height: statusBarHeight > 20 ? '84px' : '64px'}">
      <button class="footer-btn" @click="submitAll">保存并发布</button>
    </cover-view>

    <!--编辑title弹窗-->
    <edit-title ref="titleBox" @submitMsg="submitTile"></edit-title>

    <detail-modal ref="detailModal" @serviceSuccess="serviceSuccess"></detail-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import DetailModal from '@components/service-detail-modal/service-detail-modal'
  import EditTitle from './title-box/title-box'
  import BaseSwitch from '@components/_base-switch/_base-switch'
  import SelectPicker from '@components/select-picker/select-picker'
  import chooseFiles from '@utils/we-cos/upload'

  const PAGE_NAME = 'SERVICE_EDIT'

  const MONEYREG = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  const COUNTREG = /^[1-9]\d*$/

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      DetailModal,
      EditTitle,
      BaseSwitch,
      SelectPicker
    },
    data() {
      return {
        type: 'new',
        id: '',
        pageTitle: '新建服务',
        serviceDetail: {
          goods_banner_images: [], // banner图
          name: '', // 商品标题
          sub_name: '', // 商品副标题
          original_price: '', // 门市价
          price: '', // 平台价
          saleable: '', // 总库存
          goods_detail_images: [], // 商品详情图片
          use_start_at: '', // 售卖开始
          use_end_at: '', // 售卖结束
          config: {
            message: '' // 预约信息
          },
          note: {
            is_show: false,
            message: '' // 温馨提示
          },
          id: ''
        },
        pickerOpen: '',
        startDateSources: [],
        endDateSources: [],
        date: [],
        dateType: '',
        showText: false,
        startValue: [],
        endValue: []
      }
    },
    computed: {
      bannerReg() {
        return this.serviceDetail.goods_banner_images.length
      },
      titleReg() {
        return this.serviceDetail.name
      },
      originPriceReg() {
        return this.serviceDetail.original_price && MONEYREG.test(+this.serviceDetail.original_price)
      },
      priceReg() {
        return this.serviceDetail.price && MONEYREG.test(+this.serviceDetail.price)
      },
      platformPriceRangeReg() {
        return +this.serviceDetail.price <= +this.serviceDetail.original_price
      },
      saleableReg() {
        return this.serviceDetail.saleable && COUNTREG.test(this.serviceDetail.saleable)
      },
      detailImgReg() {
        return this.serviceDetail.goods_detail_images.length
      },
      use1TimeReg() {
        return this.serviceDetail.use_start_at
      },
      use2TimeReg() {
        return this.serviceDetail.use_end_at
      },
      messageReg() {
        if (this.serviceDetail.note.is_show) {
          return this.serviceDetail.note.message
        }
        return true
      }
    },
    onShow() {
      this.initDate()
    },
    onLoad(options) {
      this.type = options.type || 'new'
      this.id = options.id || ''
      this.serviceDetail.id = options.id || ''
      if (this.id) {
        this.pageTitle = '编辑服务'
        this._getServiceDetail()
      }
    },
    methods: {
      initDate() {
        let years = []
        let date = new Date()
        let year = date.getFullYear()
        let months = new Array(12).fill(1).map((item, index) => index + 1)
        let days = new Array(new Date(year, date.getMonth() + 1, 0).getDate()).fill(1).map((item, index) => index + 1)
        years = [year, year + 1, year + 2]
        date.getFullYear()
        let arr = []
        arr[0] = 0
        arr[1] = months.findIndex(item => {
          return item === date.getMonth() + 1
        })
        arr[2] = days.findIndex(item => {
          return item === date.getDate()
        })
        !this.serviceDetail.use_start_at && (this.startValue = JSON.parse(JSON.stringify(arr)))
        !this.serviceDetail.use_end_at && (this.endValue = JSON.parse(JSON.stringify(arr)))
        this.startDateSources = [
          {
            list: years,
            text: '年'
          }, {
            list: months,
            text: '月'
          }, {
            list: days,
            text: '日'
          }
        ]
        this.endDateSources = [
          {
            list: years,
            text: '年'
          }, {
            list: months,
            text: '月'
          }, {
            list: days,
            text: '日'
          }
        ]
      },
      _getServiceDetail() {
        let data = {
          id: this.id
        }
        API.Service.getServiceDetail({data})
          .then(res => {
            this.serviceDetail = res.data
            this.showText = res.data.note.is_show
          })
      },
      changeBanner() {
        chooseFiles()
          .then(res => {
            this.serviceDetail.goods_banner_images = res.map(item => {
              return {
                id: 0,
                image_id: item.id,
                image_url: item.url
              }
            })
          })
      },
      showTitleModal(type) {
        let obj
        switch (type) {
          case 'name':
            obj = {
              type,
              text: this.serviceDetail[type],
              title: 'null',
              placeholder: '请输入标题'
            }
            break
          case 'sub_name':
            obj = {
              type,
              text: this.serviceDetail[type],
              title: 'null',
              placeholder: '请输入副标题'
            }
            break
        }
        this.$refs.titleBox.showTitleBox(obj)
      },
      addDetailImage() {
        let imageLength = this.serviceDetail.goods_detail_images.length
        chooseFiles(0, 5 - imageLength)
          .then(res => {
            let arr = res.map((item, index) => {
              return {
                id: 0,
                image_id: item.id,
                image_url: item.url
              }
            })
            let newArr = arr.slice(0, 5 - imageLength)
            this.serviceDetail.goods_detail_images = [...this.serviceDetail.goods_detail_images, ...newArr]
          })
      },
      submitTile(txt, type) {
        this.serviceDetail[type] = txt
      },
      delDetailImage(index) {
        let arr = JSON.parse(JSON.stringify(this.serviceDetail.goods_detail_images))
        arr.splice(index, 1)
        this.$set(this.serviceDetail, 'goods_detail_images', arr)
      },
      pickerToggle(e, type) {
        this.pickerOpen = e ? type : ''
        let source = this[type + 'DateSources']
        let value = this[type + 'Value']
        let date = value.map((item, index) => {
          return source[index].list[item]
        })
        this.$set(this.serviceDetail, 'use_' + type + '_at', date.join('-').replace(/\b\d\b/g, '0$&'))
        e && !this.serviceDetail['use_' + type + '_at'] && (this.serviceDetail['use_' + type + '_at'] = [])
        if (type === 'start') {
          this.$refs.endPicker.closePicker()
        } else {
          this.$refs.startPicker.closePicker()
        }
      },
      changePicker(date, value) {
        this[this.pickerOpen + 'Value'] = value
        let arr = JSON.parse(JSON.stringify(date))
        this.$set(this.serviceDetail, 'use_' + this.pickerOpen + '_at', arr.join('-').replace(/\b\d\b/g, '0$&'))
        let nowDay = new Date(`${date[0]}`, `${date[1]}`, 0).getDate()
        let days = new Array(nowDay).fill(1).map((item, index) => index + 1)
        this.$set(this[this.pickerOpen + 'DateSources'][2], 'list', days)
      },
      changeSwitch(status) {
        this.showText = status
        // this.serviceDetail.note.is_show = status
        this.$set(this.serviceDetail.note, 'is_show', status)
      },
      newService() {
        API.Service.newService({
          data: this.serviceDetail
        })
          .then((res) => {
            setTimeout(() => {
              this.isSubmit = false
              this.$wechat.showToast('保存成功')
              wx.navigateBack({delta: 1})
            }, 1500)
          })
          .catch(res => {
            this.isSubmit = false
          })
      },
      editService() {
        API.Service.serviceEdit({
          data: this.serviceDetail
        })
          .then(res => {
            this.$wechat.showToast('保存成功')
            setTimeout(() => {
              this.isSubmit = false
              wx.navigateBack({delta: 1})
            }, 1500)
          })
          .catch(res => {
            this.isSubmit = false
          })
      },
      submitAll() {
        if (this.isSubmit) return
        this.isSubmit = true
        this.checkForm()
      },
      checkForm() {
        let arr = [
          {value: this.bannerReg, txt: '请添加一张封面图片'},
          {value: this.titleReg, txt: '请输入服务标题'},
          {value: this.originPriceReg, txt: '请输入合法的门市价格'},
          {value: this.priceReg, txt: '请输入合法的售价'},
          {value: this.platformPriceRangeReg, txt: '售价不得高于门市价'},
          {value: this.saleableReg, txt: '请输入合法的最大库存数量'},
          {value: this.detailImgReg, txt: '请添加至少一张服务详情图片'},
          {value: this.use1TimeReg, txt: '请选择小于或等于当前日期的开始日期'},
          {value: this.use2TimeReg, txt: '请选择大于或等于开始时间的结束日期'},
          {value: this.messageReg, txt: '请输入温馨提示信息'}
        ]
        let res = this._testPropety(arr)
        if (res) {
          switch (this.type) {
            case 'new':
              this.newService()
              break
            case 'edit':
              this.editService()
              break
          }
        }
      },
      _testPropety(arr) {
        for (let i = 0, j = arr.length; i < j; i++) {
          if (!arr[i].value) {
            this.$wechat.showToast(arr[i].txt)
            this.isSubmit = false
            return false
          }
          if (i === j - 1 && arr[i].value) {
            return true
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/footer-box.styl"

  .service-edit
    width: 100%
    .grey-space
      height: 12px
      background: #F2F2F7
    label
      display: block
    .surface-image
      height: 120px
      width: 100%
      position: relative
      background: linear-gradient(#464765 100%, #1f1e37 100%)
      .image
        width: 100%
        height: 100%
      .image-btn
        width: 95px
        height: 28px
        border-radius: 30px
        background: rgba(0,0,0,0.3)
        display: flex
        align-items: center
        justify-content: center
        position: absolute
        right: 20px
        top: 20px
        font-size: 14px
        color: $color-white
        font-family: $font-family-regular
        margin-left: 2px
      .image-icon
        width: 12px
        height: 11px
        background: url("change@2x.png")
        background-size: 100% 100%
        margin-right: 2px
    .editor-title
      height: 48px
      font-size: 14px
      line-height: @height
      padding: 0 15px 0 10px
      color: $color-9B9B9B
      background :$color-white
      &:before
        border-top-color: $color-E6E6E6
      &:after
        border-bottom-color: $color-E6E6E6
      .title
        display: flex
        justify-content: space-between
        align-items: center
        font-family :$font-family-medium
        background :$color-white
        font-size :16px
        color: #000
        .add-server
          width: 20px
          height: 20px
          background: $color-F9F9F9
          border-radius: 20px
          bg-image(icon-addfw)
          background-size: 100% 100%
    .no-padding
      padding-left: 0
      transition: all 0.3s
      .has-class
        transition: all 0.3s
      .show-list
        height: 160px
      .hide-list
        height: 0
        transition: all 0.3s ease-in-out
    .editor-item
      width: 100%
      height: 50px
      padding: 0 15px 0 10px
      display: flex
      aling-items: center
      background: $color-white
      box-sizing: border-box
      .item-left
        width: 80px
        height: 50px
        line-height: 50px
        color: $color-text-assist
        font-family: $font-family-regular
        font-size: $font-size-14
        letter-spacing: 0.6px
        position: relative
      .item-right
        flex: 1
        height: 50px
        line-height: 50px
        font-size: $font-size-14
        color: $color-text-assist
        overflow: hidden
        display: flex
        align-items: center
        justify-content: flex-end
        .right-txt
          font-family: $font-family-regular
          font-size: $font-size-14
          letter-spacing: 0.6px
          color: $color-text-main
          width: 100%
          height: 50px
          line-height: 50px
          text-align: right
          no-wrap()
        .right-tag
          width: 15px
          height: 16px
          background: url("icon-right_arrowhead@2x.png")
          background-size: 100% 100%
          transition: all 0.2s
          margin-right: 5px
        .open
          transform-origin: 10px 8px
          transform: rotate(90deg)
        .right-txt-placeholder
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-tip
        .input-box
          flex: 1
          height: 20px
          outline: none
          margin-right: 5px
          padding: 0
          line-height: 20px
          border: 0 none
          text-align: right
          font-size: $font-size-14
          color: $color-text-main
        .no-right
          margin-right: 0
        .no-click
          color: $color-text-secondary
        .input-box::-webkit-input-placeholder
          color: $color-text-tip
        .input-box-placeholder
          color: $color-text-tip

      .input-right.item-right
        display: flex
        align-items: center
        justify-content: flex-end
    .service-img-item
      padding-bottom: 18px
      padding-left: 10px
      background: $color-white
      .item-title
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-assist
        padding: 18px 0
        position: relative
      .img-container
        position: relative
        height: 16vw
        .container-item
          position: absolute
          left: 0
          top: 0
          display: flex
        .img-box
          width: 16vw
          height: 16vw
          margin-right: 2.6vw
          position: relative
          .img-bc
            width: 100%
            height: 100%
            position: absolute
            left: 0
            top: 0
            opacity: 1
            &.image-file
              opacity: 0
            &.un-up
              background: url('icon-addpic_un2@2x.png')
              background-size: 100% 100%
            &.up
              background: url('icon-addpic_un@2x.png')
              background-size: 100% 100%
          .img-hide
            opacity: 0
          .detail-image
            width: 100%
            height: 100%
            position: absolute
            left: 0
            top: 0
            object-fit: cover
          .image-file
            width: 100%
            height: 100%
            position: absolute
            left: 0
            top: 0
            opacity: 0

          .img-show
            width: 100%
            height: 100%
            position: absolute
            left: 0
            top: 0
            border-radius: 2px
            background: $color-white
            box-sizing: border-box
            border-1px($color-line, 2px)
            object-fit: cover
          .del-icon
            width: 16px
            height: 16px
            position: absolute
            right: -6px
            top: -6px
      .item-subtitle
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-tip
        margin-top: 10px
    .textarea-item
      background: $color-white
      height: 0
      overflow: hidden
      transition: all 0.2s
      .textarea-title
        font-size: $font-size-14
        color: $color-text-main
        font-family: $font-family-regular
        margin: 20px 0 10px
      .textarea-box
        width: 100%
        height: 90px
        box-sizing: border-box
        padding: 10px
        background: $color-white
        position: relative
        .textarea-content
          font-size: $font-size-14
          width: 100%
          height: 0
          resize: none
          border: 0 none
          padding: 0
          margin: 0
          outline: none
          font-family: $font-family-regular
          color: $color-text-main
        .count-box
          position: absolute
          right: 10px
          bottom: 10px
          font-size: $font-size-14
          color: $color-text-secondary
        .textarea-content-show
          height: 100%
    .textarea-show
      height: 90px
    .padding-bottom
      padding-bottom: 80px
</style>
