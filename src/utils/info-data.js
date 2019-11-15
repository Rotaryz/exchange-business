import { baseURL } from '@utils/config'

export default class {
  constructor(obj) {
    let name = obj.nickname || obj.customer_name
    this.image_url = obj.image_url || `${baseURL.image}/yx-image/group/pic-head@2x.png`
    obj.customer_id = +obj.customer_id
    let nickName = obj.customer_id ? name : '游客'
    switch (+obj.event_no) {
      case 1001:
        this.content = [
          {
            text: nickName,
            active: false
          },
          {
            text: obj.customer_id ? `第${obj.count_sum}次` : '',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '了你的',
            active: false
          },
          {
            text: '小店',
            active: true
          }
        ]
        break
      case 1002:
        this.content = [
          {
            text: `${nickName}` + '通过他人分享的链接',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '服务',
            active: false
          },
          {
            text: obj.title,
            active: true
          }
        ]
        break
      case 1003:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '你的服务',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '请把握商机',
            active: false
          }
        ]
        break
      case 1004:
        this.content = [
          {
            text: `${nickName}`,
            active: false
          },
          {
            text: '提交了',
            active: true
          },
          {
            text: '服务',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '的订单，金额为' + obj.total + '元，并支付成功',
            active: false
          }
        ]
        break
      case 1005:
        this.content = [
          {
            text: `${nickName}`,
            active: false
          },
          {
            text: '转发',
            active: true
          },
          {
            text: '了你的服务',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '，你的服务正在裂变',
            active: false
          }
        ]
        break
      case 1006:
        this.content = [
          {
            text: `${nickName}` + '通过他人分享的链接',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '了你的拼团活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          }
        ]
        break
      case 1007:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '你的拼团活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '，可能对该活动感兴趣',
            active: false
          }
        ]
        break
      case 1008:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '参加',
            active: true
          },
          {
            text: '拼团活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          }
        ]
        break
      case 1009:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '发起',
            active: true
          },
          {
            text: '拼团活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          }
        ]
        break
      case 1010:
        this.content = [
          {
            text: `${nickName}`,
            active: false
          },
          {
            text: '提交',
            active: true
          },
          {
            text: '了拼团活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '的订单，金额为' + obj.total + ' 元，并支付成功',
            active: false
          }
        ]
        break
      case 1011:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '邀请',
            active: true
          },
          {
            text: '好友来参加拼团活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '，你的活动正在裂变',
            active: false
          }
        ]
        break
      case 1012:
        this.content = [
          {
            text: `${nickName}` + '通过他人分享的链接',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '了你的砍价活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          }
        ]
        break
      case 1013:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '你的砍价活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '，可能对该活动感兴趣',
            active: false
          }
        ]
        break
      case 1014:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '参与',
            active: true
          },
          {
            text: '你的砍价活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '，成功砍掉' + obj.total + '元',
            active: false
          }
        ]
        break
      case 1015:
        this.content = [
          {
            text: `${nickName}`,
            active: false
          },
          {
            text: '提交',
            active: true
          },
          {
            text: '了砍价活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '的订单，金额为' + obj.total + '元，并支付成功',
            active: false
          }
        ]
        break
      case 1016:
        this.content = [
          {
            text: `${nickName}` + '正在邀请好友来',
            active: false
          },
          {
            text: '参加',
            active: true
          },
          {
            text: '砍价活动',
            active: false
          },
          {
            text: obj.title,
            active: true
          },
          {
            text: '，你的活动正在裂变',
            active: false
          }
        ]
        break
      case 1017:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '查看',
            active: true
          },
          {
            text: '大转盘，可能对该活动感兴趣',
            active: false
          }
        ]
        break
      case 1018:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '参加',
            active: true
          },
          {
            text: '大转盘活动',
            active: false
          }
        ]
        break
      case 1019:
        this.content = [
          {
            text: `${nickName}`,
            active: false
          },
          {
            text: '参加',
            active: true
          },
          {
            text: '大转盘活动， 中了',
            active: false
          },
          {
            text: obj.title,
            active: true
          }
        ]
        break
      case 1020:
        this.content = [
          {
            text: `${nickName}` + '正在',
            active: false
          },
          {
            text: '转发',
            active: true
          },
          {
            text: '你的大转盘，您的活动正在裂变',
            active: false
          }
        ]
        break
    }
    return Object.assign({}, obj, this)
  }
}
