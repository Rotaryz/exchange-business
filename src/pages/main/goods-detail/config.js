// import Vue from 'vue'
// import Page from './goods-detail'
//
// const page = new Vue(Page)
// page.$mount()
import pageFactory from 'mpvue-page-factory'
import App from './goods-detail'

Page(pageFactory(App))
