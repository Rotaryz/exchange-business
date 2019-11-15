<template>
  <div class="out-html">
    <!--<navigation-bar title="" :showArrow="true"></navigation-bar>-->
    <web-view :src="url"></web-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import storage from '@utils/storage'
  import { baseURL } from '@utils/config'
  const PAGE_NAME = 'OUT_HTML'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        url: '',
        routeType: ''
      }
    },
    onLoad(options = {}) {
      console.info(options)
      if (options.webview) {
        this.url = options.url
        return
      }
      this.setUrl(options)
    },
    methods: {
      setUrl(options = {}) {
        const token = storage('token')
        const shopId = storage('userInfo').shop_id
        const api = baseURL.api
        let params = ''
        Object.assign(options, {token, shopId, api})
        for (let key in options) {
          if (key === 'pageRoute') continue
          params += `${key}=${options[key]}&`
        }
        this.url = `${baseURL.webview}${options.pageRoute || ''}?${params}`
        console.info(this.url)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .out-html
    width: 100%
</style>
