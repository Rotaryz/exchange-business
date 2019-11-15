<template>
  <transition name="fade">
    <div class="title-shadow" v-show="showTitle" @click="hide">
      <div class="title-box" @click.stop>
        <div class="title-top">
          <div class="title" v-if="title !== 'null'">{{title}}</div>
          <div class="data-bottom">
            <!--<div class="textarea-number">{{note.length}}<span>/{{maxLength}}</span></div>-->
            <textarea class="data-area" :fixed="true" type="text" :class="{'long-text' : title === 'null'}" :focus="focus" :value="note" @change="submitTitle" :maxlength="maxLength" :placeholder="placeholder"></textarea>
          </div>
        </div>
        <div class="title-btn border-top-1px" @click="submitTitle">确定</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'title-box',
    data() {
      return {
        note: '',
        title: '标题',
        placeholder: '请输入标题',
        showTitle: false,
        type: 'title',
        maxLength: 40,
        focus: false
      }
    },
    methods: {
      showTitleBox(obj) {
        this.note = obj.text || ''
        this.title = obj.title || '标题'
        this.placeholder = obj.placeholder || '请输入标题'
        this.type = obj.type || 'title'
        this.maxLength = obj.maxLength || 40
        this.showTitle = true
        setTimeout(() => {
          this.focus = true
          // this.$refs.txt && this.$refs.txt.focus()
        }, 150)
      },
      submitTitle(e) {
        this.hide()
        let note = e.target.value || this.note
        this.$emit('submitMsg', note.trim(), this.type)
      },
      hide() {
        this.showTitle = false
        this.focus = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@design'

  .title-shadow
    position: fixed
    width: 100vw
    height: 100vh
    left: 0
    top: 0
    z-index: 555
    background: rgba(54, 53, 71, 0.80)

  .title-box
    background: $color-white
    min-height: 225px
    width: 300px
    border-radius: 1px
    all-center()
    .title-top
      box-sizing: border-box
      padding: 25px 15px 0 20px
      min-height: 180px
      border-bottom-1px(rgba(32, 32, 46, 0.1))
      .title
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-16
        margin-bottom: 18px
      .data-area
        width: 100%
        font-size: $font-size-14
        resize: none
        border: 0 none
        outline: none
    .title-btn
      height: 45px
      width: 100%
      line-height: 45px
      color: $color-text-secondary
      font-size: $font-size-14
      font-family: $font-family-medium
      text-align: center

  .data-bottom
    position: relative
    z-index: 71
    .title
      font-size: $font-size-medium
      color: $color-text-main
      font-family: $font-family-regular
    .data-area
      box-sizing: border-box
      width: 100%
      border-color: rgba(0, 0, 0, 0)
      font-size: $font-size-medium
      color: $color-text-main
      font-family: $font-family-regular
      height: 95px
      outline: none
      padding: 0 !important
      word-break: break-all
    .data-area::-webkit-input-placeholder
      color: $color-text-secondary
    .data-area::-ms-input-placeholder
      color: $color-text-secondary
    .data-area::-moz-placeholder
      color: $color-text-secondary
    .textarea-number
      position: absolute
      bottom: 8px
      right: 0
      font-family: $font-family-regular
      color: $color-text-assist
      font-size: $font-size-12
    .long-text
      height: 145px
</style>
