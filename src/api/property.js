import request from '@utils/http'

export default {
  // 我的资产
  getPropertyData(args) {
    const url = `/shop/settlement/account/detail`
    return request.get({ url, ...args })
  },
  // 补贴记录
  getSubsidyRecord(args) {
    const url = `/shop/settlement/settlement/index`
    return request.get({ url, ...args })
  },
  // 提现记录
  getWithdrawRecord(args) {
    const url = `/shop/settlement/withdraw/index`
    return request.get({ url, ...args })
  },
  // 银行卡信息
  getBackCardInfo(args) {
    const url = `/shop/shop/bank-card/show`
    return request.get({ url, ...args })
  },
  // 添加银行卡
  addBackCard(args) {
    const url = `/shop/shop/bank-card/create`
    return request.post({ url, ...args })
  },
  // 修改银行卡
  updateBackCard(args) {
    const url = `/shop/shop/bank-card/update`
    return request.put({ url, ...args })
  },
  // 开户行列表
  getBankList(args) {
    const url = `/shop/shop/bank/index`
    return request.get({ url, ...args })
  },
  // 申请提现
  applyWithdraw(args) {
    const url = `/shop/settlement/withdraw/apply-withdrawal`
    return request.post({ url, ...args })
  }
}
