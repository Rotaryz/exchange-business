// import Vue from 'vue'
// import Page from './brand-detail'
//
// const page = new Vue(Page)
// page.$mount()

import pageFactory from 'mpvue-page-factory'
import App from './brand-detail'

Page(pageFactory(App))
