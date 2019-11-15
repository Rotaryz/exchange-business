import Vue from 'vue'
import Page from './goods-search'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '赞播优鲜'
  }
}
