<template>
  <div class="activity-edit">
    <navigation-bar :title="pageTitle"></navigation-bar>
    <!--封面-->
    <div class="surface-image">
      <img v-if="activityDetail.image_url" class="image" :src="activityDetail.image_url" mode="aspectFill">
      <img v-else class="image" src="./pic-service.png">
      <div class="image-btn" @click="changeBanner"><span class="image-icon"></span>更换封面</div>
    </div>

    <!--<div class="editor-item" @click="showTitleModal('title')">
      <div class="item-left">活动标题</div>
      <div class="item-right input-right" >
        <div class="right-txt" v-if="activityDetail.name">{{activityDetail.name}}</div>
        <span class="right-txt-placeholder" v-if="!activityDetail.name">请输入活动标题</span>
      </div>
    </div>-->
    <label>
      <div class="editor-item">
        <div class="item-left">活动标题</div>
        <div class="item-right">
          <input type="text" class="input-box no-right" placeholder-style="color: #BCC4CC" maxlength="40" v-model="activityDetail.name" placeholder="请输入活动标题">
        </div>
      </div>
    </label>

    <div class="add-service">
      <div v-if="serviceItem.name" class="service-msg">
        <image class="service-image" :src="serviceItem.goods_cover_image" alt="" mode="aspectFill"></image>
        <div class="right-msg">
          <p class="service-title">{{serviceItem.name}}</p>
          <p class="service-stock">库存: {{serviceItem.saleable}}</p>
          <p class="service-price">
            <span class="price">售价: <i class="small"></i><span class="red-price">¥{{serviceItem.price}}</span></span>
            <span class="grey-price">原价: ¥{{serviceItem.original_price}}</span>
          </p>
        </div>
        <img v-if="type === 'new'" src="./icon-del@2x.png" class="del-icon" @click="delItem">
      </div>
      <div v-else class="add-btn" @click="goSelectService">
        <span class="add-icon"></span>
        <span class="add-text">添加服务</span>
      </div>
    </div>

    <label v-if="pageType === 1">
      <div class="editor-item border-bottom-1px">
        <div class="item-left">拼团价</div>
        <div class="item-right">
          <input type="digit" class="input-box" :class="{'disabled': type === 'edit'}" placeholder-style="color: #BCC4CC" :disabled="type === 'edit'" v-model="activityDetail.price" placeholder="请输入拼团价">
          元
        </div>
      </div>
    </label>

    <label v-else>
      <div class="editor-item border-bottom-1px">
        <div class="item-left">底价</div>
        <div class="item-right">
          <input type="digit" class="input-box" :class="{'disabled': type === 'edit'}" placeholder-style="color: #BCC4CC" :disabled="type === 'edit'" v-model="activityDetail.bottom_price" placeholder="请输入底价">
          元
        </div>
      </div>
    </label>

    <section v-if="pageType === 1" class="white-bg">
      <edit-select title="拼团人数" :dataArray="collageArr" :disabled="type === 'edit'" :selectItem="activityDetail.number" @change="changeCount"></edit-select>
    </section>

    <section v-else class="white-bg">
      <edit-select title="砍价次数" :dataArray="bargainArr" :disabled="type === 'edit'"  :selectItem="activityDetail.max_cut_num" @change="changeCount"></edit-select>
    </section>

    <label>
      <div class="editor-item">
        <div class="item-left">库存</div>
        <div class="item-right">
          <input type="number" class="input-box" placeholder-style="color: #BCC4CC" v-model="activityDetail.stock" placeholder="请输入库存数量">
          个
        </div>
      </div>
    </label>

    <div class="grey-space"></div>

    <!--选择时间-->
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
            <input type="text" class="input-box" placeholder-style="color: #BCC4CC" :class="{'disabled': (type === 'edit')}" disabled v-model="activityDetail.start_at" readonly placeholder="请选择时间">
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
            <input type="text" class="input-box" placeholder-style="color: #BCC4CC" v-model="activityDetail.end_at" disabled placeholder="请选择时间">
            <span class="right-tag" :class="{'open': pickerOpen === 'end'}"></span>
          </div>
        </div>
      </template>
    </select-picker>

    <!--保存按钮-->
    <div class="footer-fill" :style="{height: statusBarHeight > 20 ? '100px':'80px'}"></div>
    <cover-view class="footer-box" :style="{height: statusBarHeight > 20 ? '84px' : '64px'}">
      <button class="footer-btn" @click="submitAll">保存并发布</button>
    </cover-view>

    <!--编辑title弹窗-->
    <edit-title ref="titleBox" @submitMsg="submitTile"></edit-title>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './modules/helpers'
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import EditTitle from './title-box/title-box'
  import SelectPicker from '@components/select-picker/select-picker'
  import EditSelect from '@components/edit-select/edit-select'
  import chooseFiles from '@utils/we-cos/upload'

  const PAGE_NAME = 'ACTIVITY_EDIT'

  // const BARGIN_ARR = [10, 20, 30, 50, 100]
  const BARGIN_ARR = process.env !== 'production' ? [3, 5, 7, 9] : [10, 20, 30, 50, 100]
  const COLLAGE_ARR = [2, 3, 5]
  const MONEYREG = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  const COUNTREG = /^[1-9]\d*$/

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      EditTitle,
      SelectPicker,
      EditSelect
    },
    data() {
      return {
        pageTitle: '',
        pageType: 1, // bargain 砍价   collage 拼团
        activityDetail: {
          name: '',
          image_url: '',
          image_id: '',
          goods_id: '',
          price: '',
          bottom_price: '',
          number: 2,
          max_cut_num: BARGIN_ARR[0],
          stock: '',
          start_at: '',
          end_at: '',
          promotion_id: ''
        },
        serviceItem: '',
        type: '',
        id: '',
        bargainArr: BARGIN_ARR,
        collageArr: COLLAGE_ARR,
        pickerOpen: '',
        startDateSources: [],
        endDateSources: [],
        date: [],
        dateType: '',
        isSubmit: false,
        startValue: [],
        endValue: []
      }
    },
    computed: {
      word() {
        return this.pageType === 1 ? 'collage' : 'bargain'
      },
      bannerReg() {
        return this.activityDetail.image_id
      },
      titleReg() {
        return this.activityDetail.name
      },
      activityReg() {
        return this.activityDetail.goods_id
      },
      priceReg() {
        if (+this.pageType === 1) {
          return this.activityDetail.price && MONEYREG.test(+this.activityDetail.price)
        }
        return true
      },
      bottomPriceReg() {
        if (+this.pageType === 2) {
          return this.activityDetail.bottom_price && MONEYREG.test(+this.activityDetail.bottom_price)
        }
        return true
      },
      numberReg() {
        if (+this.pageType === 1) {
          return this.activityDetail.number && COUNTREG.test(this.activityDetail.number)
        }
        return true
      },
      cutReg() {
        if (+this.pageType === 2) {
          return this.activityDetail.max_cut_num && COUNTREG.test(this.activityDetail.max_cut_num)
        }
        return true
      },
      stockReg() {
        return this.activityDetail.stock && COUNTREG.test(this.activityDetail.stock)
      },
      startTimeReg() {
        return this.activityDetail.start_at
      },
      endTimeReg() {
        return this.activityDetail.end_at
      }
    },
    onShow() {
      this.initDate()
      // 获取选择的服务
      let selectItem = JSON.parse(JSON.stringify(this.$store.getters['serviceSelect/selectItem']))
      selectItem.id && (this.serviceItem = selectItem)
      selectItem.id && (this.activityDetail.goods_id = selectItem.id)
      // 清空vuex
      this.$store.dispatch('serviceSelect/setItem', {})
    },
    onLoad(options) {
      this.type = options.type || 'new'
      this.pageType = +options.pageType || 1
      this.pageTitle = this.pageType === 1 ? '新建拼团活动' : '新建砍价活动'
      this.activityDetail.count = +this.pageType === 2 ? 10 : 2
      this.id = options.id || ''
      if (this.id) {
        this.pageTitle = this.pageType === 1 ? '编辑拼团活动' : '编辑砍价活动'
        this._getActivityDetail(this.id)
      }
    },
    methods: {
      // 初始时间数据
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
        !this.activityDetail.start_at && (this.startValue = JSON.parse(JSON.stringify(arr)))
        !this.activityDetail.end_at && (this.endValue = JSON.parse(JSON.stringify(arr)))
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
      changeBanner() {
        chooseFiles()
          .then(res => {
            this.activityDetail.image_url = res[0].url
            this.activityDetail.image_id = res[0].id
          })
      },
      showTitleModal() {
        let obj = {
          type: 'name',
          text: this.activityDetail.name,
          title: 'null',
          placeholder: '请输入标题'
        }
        this.$refs.titleBox.showTitleBox(obj)
      },
      submitTile(txt, type) {
        this.activityDetail[type] = txt
      },
      delItem() {
        this.serviceItem = ''
      },
      pickerToggle(e, type) {
        this.pickerOpen = e ? type : ''
        let source = this[type + 'DateSources']
        let value = this[type + 'Value']
        let date = value.map((item, index) => {
          return source[index].list[item]
        })
        this.$set(this.activityDetail, type + '_at', date.join('-').replace(/\b\d\b/g, '0$&'))
        e && !this.activityDetail[type + '_at'] && (this.activityDetail[type + '_at'] = [])
        if (type === 'start') {
          this.$refs.endPicker.closePicker()
        } else {
          this.$refs.startPicker.closePicker()
        }
      },
      changePicker(date, value) {
        this[this.pickerOpen + 'Value'] = value
        let arr = JSON.parse(JSON.stringify(date))
        this.$set(this.activityDetail, this.pickerOpen + '_at', arr.join('-').replace(/\b\d\b/g, '0$&'))
        let nowDay = new Date(`${date[0]}`, `${date[1]}`, 0).getDate()
        let days = new Array(nowDay).fill(1).map((item, index) => index + 1)
        this.$set(this[this.pickerOpen + 'DateSources'][2], 'list', days)
      },
      goSelectService() {
        let url = `/package-active/service-select?type=${this.pageType}`
        wx.navigateTo({ url })
      },
      changeCount(count) {
        this.pageType === 1 && (this.activityDetail.number = count)
        this.pageType === 2 && (this.activityDetail.max_cut_num = count)
      },
      _getActivityDetail() {
        let data = {
          promotion_id: this.id
        }
        API.Activity[this.word + 'Detail']({data})
          .then(res => {
            this.activityDetail = JSON.parse(JSON.stringify(res.data))
            this.activityDetail.promotion_id = this.id
            delete this.activityDetail.goods
            this.serviceItem = res.data.goods
          })
      },
      newActivity() {
        let fun = this.pageType === 1 ? 'newCollage' : 'newBargain'
        API.Activity[fun]({
          data: this.activityDetail
        })
          .then((res) => {
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
      editActivity() {
        API.Activity[this.word + 'Edit']({
          data: this.activityDetail
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
          {value: this.titleReg, txt: '请输入活动标题'},
          {value: this.activityReg, txt: '请添加服务'},
          {value: this.bottomPriceReg, txt: '请输入底价'},
          {value: this.priceReg, txt: '请输入合法的拼团价'},
          {value: this.numberReg, txt: '请选择拼团人数'},
          {value: this.cutReg, txt: '请选择最多砍价次数'},
          {value: this.stockReg, txt: '请输入合法的最大库存数量'},
          {value: this.startTimeReg, txt: '请选择小于或等于当前日期的开始日期'},
          {value: this.endTimeReg, txt: '请选择大于或等于开始时间的结束日期'}
        ]
        let res = this._testPropety(arr)
        if (res) {
          switch (this.type) {
            case 'new':
              this.newActivity()
              break
            case 'edit':
              this.editActivity()
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

  .activity-edit
    width: 100%
    .grey-space
      height: 12px
      background: #F2F2F7
    .white-bg
      background: $color-white
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
        .open
          transform-origin: 10px 8px
          transform: rotate(90deg)
        .right-txt-placeholder
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-tip
        .arrow-icon
          width: 7.5px
          height: 12.5px
        .input-box
          width: 100%
          height: 20px
          outline: none
          padding: 0
          margin-right: 5px
          line-height: 20px
          border: 0 none
          text-align: right
          font-size: $font-size-14
          color: $color-text-main
        .no-right
          margin-right: 0
        .disabled
          color: $color-text-secondary
        .input-box::-webkit-input-placeholder
          color: $color-text-tip
        .input-box-placeholder
          color: $color-text-tip
        .time-right-first
          width: 90px
          .time-none
            display: flex
            align-items: center
            .time-item
              font-family: $font-family-regular
              color: $color-text-main
              font-size: $font-size-14
              margin-right: 5px
            .time-icon
              width: 7.5px
              height: 12.5px
          .time-txt
            font-family: $font-family-regular
            color: $color-text-main
            font-size: $font-size-14
            &.disabled
              color: $color-text-assist
      .input-right.item-right
        display: flex
        align-items: center
        justify-content: flex-end

    .add-service
      height: 124px
      width: 100%
      background: #f2f2f7
      position: relative
      padding: 12px 9px
      box-sizing: border-box
      .add-btn
        width: 95px
        height: 32px
        display: flex
        align-items: center
        justify-content: center
        border-radius: 1px
        border: 1px solid $color-text-assist
        all-center()
      .add-icon
        width: 12px
        height: 12px
        background: url("icon-plus_sign@2x.png")
        background-size: 100% 100%
      .add-text
        font-size: $font-size-14
        color: $color-text-assist
        font-family: $font-family-medium
        margin-left: 4px

      .service-msg
        background: $color-white
        display: flex
        align-items: center
        position: relative
        padding: 15px 10px
        .msg-bg
          width: 100%
          height: 100%
          position: absolute
          left: 0
          top: 0
          background: #f2f2f7
        .right-msg
          padding-left: 10px
          font-family: $font-family-regular
          flex: 1
          overflow: hidden
        .service-image
          width: 70px
          height: 70px
          flex: 0 0 auto
          border-radius: 2px
        .service-title
          font-size: $font-size-16
          color: $color-text-main
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        .service-stock
          font-size: $font-size-14
          color: $color-text-secondary
          margin-top: 14px
        .service-price
          margin-top: 6px
          color: $color-text-secondary
          display: flex
          align-items: baseline
        .small
          color: $color-main
          font-size: $font-size-12
          font-family: $font-family-medium
          display: inline-block
        .price
          font-size: $font-size-14
          font-family: $font-family-regular
          margin-bottom: -2px
        .red-price
          color: $color-main
          font-family: $font-family-medium
        .grey-price
          font-size: $font-size-12
          color: $color-text-secondary
          margin-left: 10px
          opacity: 0.6
          text-decoration: line-through
        .del-icon
          width: 16px
          height: 16px
          position: absolute
          right -5px
          top: -5px
          padding: 0 0 10px 10px
    .bottom
      width: 100%
</style>
