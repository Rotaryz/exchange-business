<template>
  <div class="zb-count-operate" @click.stop="clickEvent">
    <div :class="['icon', 'minus',{disable:value<=minNumber}]" @click="minus">-</div>
    <div v-if="onlyRead" class="input-inner">{{value}}</div>
    <input v-else :value="newValue" type="number" class="input-inner" @focus.stop="focus()" @input="input" @blur="blur" @confirm="enter">
    <div class="icon add" @click="add">+</div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'ZB_COUNT_OPERATE'

  export default {
    name: COMPONENT_NAME,
    props: {
      value: {
        default: 1,
        type: [String, Number]
      },
      minNumber: {
        default: 1,
        type: [String, Number]
      },
      maxNumber: {
        default: null,
        type: [String, Number]
      },
      onlyRead: {
        default: false,
        type: Boolean
      }
    },
    computed: {
      newValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      }
    },
    methods: {
      focus(e) {
        this.$emit('focus', e)
      },
      minus() {
        if (this.newValue - 1 < this.minNumber) {
          this.$emit('less')
          return
        }
        --this.newValue
      },
      add() {
        if (this.maxNumber && this.newValue + 1 > this.maxNumber) {
          this.$emit('over')
          return
        }
        ++this.newValue
      },
      clickEvent(e) {
        this.$emit('click', e)
      },
      blur(v) {
        if (this.minNumber > v.target.value) {
          this.newValue = this.minNumber
        }
        this.$emit('blur', v)
      },
      input(v) {
        let newValue = v.target.value
        if (!newValue) {
          this.newValue = 0
          return 0
        } else if (this.maxNumber && newValue > this.maxNumber) {
          this.$emit('over')
          this.newValue = this.maxNumber * 1
        } else if (this.minNumber <= newValue) {
          this.newValue = newValue * 1
        } else {
          console.log(newValue, 'newValue')
        }
        return this.newValue
      },
      enter(v) {
        if (this.newValue <= this.minNumber) {
          this.newValue = this.minNumber
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .zb-count-operate
    flex-shrink: 0
    display: flex
    width: 75px
    height: 20px
    align-items: center
    border: 1px solid $color-border

    .icon
      width: 20px
      line-height: 20px
      flex-shrink: 0
      text-align: center
      color: $color-text-sub
      position: relative
      &:before
        content:''
        width:25px
        height:30px
        position: absolute
        bottom: -5px
        z-index:1
      &.add
        &:before
          left:0
      &.minus
        &:before
          right:0
      &.disable
        color: $color-text-main
        opacity: 0.3

    .input-inner
      flex: 1
      font-size: $font-size-13
      line-height: 18px
      height: 18px
      text-align: center
      border-right: 1px solid $color-border
      border-left: 1px solid $color-border
</style>
