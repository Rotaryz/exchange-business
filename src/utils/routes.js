// PACKAGE_PATH
const ACTIVE = '/package-active'
const OTHER = '/package-other'
const BRAND = '/package-brand'
const SHOPMANAGE = '/package-shopManage'
const PERSONALCENTER = '/package-personalCenter'
const MAIN = '/pages'
/* eslint-disable */
export default {
  active: {
    PACKAGE: ACTIVE,
    WHEEL_EDIT:`${ACTIVE}/wheel-edit`,
    WHEEL_EDIT_SELECT:`${ACTIVE}/wheel-edit-select`,
    ACTIVITY:`${ACTIVE}/activity`,
    ACTIVITY_EDIT:`${ACTIVE}/activity-edit`,
    SERVICE_SELECT:`${ACTIVE}/service-select`,
    SERVICE:`${ACTIVE}/service`,
    SERVICE_EDIT:`${ACTIVE}/service-edit`,
    SHARE_LIST:`${ACTIVE}/share-list`,
    SHARE_EDIT:`${ACTIVE}/share-edit`,
    SHARE_CHOICE:`${ACTIVE}/share-choice`,
    // package-active
  },
  other: {
    PACKAGE: OTHER,
    TERMS_SERVICE:`${OTHER}/terms-service`,
    AI_LOG:`${OTHER}/ai-log`,
    // package-other
  },
  brand: {
    PACKAGE: BRAND,
    BRAND_DETAIL:`${BRAND}/brand-detail`,
    BRAND_CONTENT:`${BRAND}/brand-content`,
    // package-brand
  },
  shopManage: {
    PACKAGE: SHOPMANAGE,
    GOODS_MANAGE:`${SHOPMANAGE}/goods-manage`,
    EDIT_GOODS:`${SHOPMANAGE}/edit-goods`,
    EXCHANGE_ORDER:`${SHOPMANAGE}/exchange-order`,
    MEMBER_MANAGE:`${SHOPMANAGE}/member-manage`,
    RECHARGE:`${SHOPMANAGE}/recharge`,
    VERIFY:`${SHOPMANAGE}/verify`,
    SETTING:`${SHOPMANAGE}/setting`,
    // package-shopManage
  },
  personalCenter: {
    PACKAGE: PERSONALCENTER,
    ORDER_LIST: `${PERSONALCENTER}/order-list`,
    NEW_ADDRESS: `${PERSONALCENTER}/new-address`,
    MY_ADDRESS: `${PERSONALCENTER}/my-address`,
    LOGISTICS_INFOMATION: `${PERSONALCENTER}/logistics-infomation`,
    ORDER_DETAIL: `${PERSONALCENTER}/order-detail`,
    IMPROVING_DATA: `${PERSONALCENTER}/improving-data`,
    APPLY_DEPOSIT:`${PERSONALCENTER}/apply-deposit`,
    BIND_CARD:`${PERSONALCENTER}/bind-card`,
    LOG_DEPOSIT:`${PERSONALCENTER}/log-deposit`,
    PROPERTY:`${PERSONALCENTER}/property`,
    LOG_SUBSIDY:`${PERSONALCENTER}/log-subsidy`,
    SUCCESSFUL_APPLICATION:`${PERSONALCENTER}/successful-application`,
    ENTERPRISE_USER_MANAGEMENT:`${PERSONALCENTER}/enterprise-user-management`,
    ENTERPRISE_USER_DETAIL:`${PERSONALCENTER}/enterprise-user-detail`,
    LEVEL_UPGRADE:`${PERSONALCENTER}/level-upgrade`,
    PERSONAL_SETTINGS:`${PERSONALCENTER}/personal-settings`,
    ACCOUNT_INFORMATION:`${PERSONALCENTER}/account-information`,
    SERVICE_ORDER:`${PERSONALCENTER}/service-order`,
    SHOP_INCOME:`${PERSONALCENTER}/shop-income`,
    SERVICE_ORDER_DETAIL:`${PERSONALCENTER}/service-order-detail`,
    // package-personalCenter
  },
  main: {
    PACKAGE: MAIN,
    HOME: `${MAIN}/home`,
    MINE: `${MAIN}/mine`,
    SHOPPING_CART: `${MAIN}/shopping-cart`,
    GOODS_CLASSIFY: `${MAIN}/goods-classify`,
    GOODS_DETAIL: `${MAIN}/goods-detail`,
    SUBMIT_ORDER: `${MAIN}/submit-order`,
    GOODS_SEARCH: `${MAIN}/goods-search`,
    ERROR: `${MAIN}/error`,
    LOGIN: `${MAIN}/login`,
    OUT_HTML: `${MAIN}/out-html`,
    PAY_SUCCESS:`${MAIN}/pay-success`,
    ERROR_PAGE:`${MAIN}/error-page`,
    PAGE_MISSING:`${MAIN}/page-missing`,
    BRAND:`${MAIN}/brand`,
    // main
  }
}
