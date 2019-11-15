import { baseURL } from '@utils/config'

export default class Notification {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Notification()
    }
    return this.instance
  }

  constructor() {
    this.socket = null
    this.url = baseURL.websocket + '/sub'
    this.prg = `exchange-platform` // 项目
    this.isConnect = false // 判断是否连接
  }

  connect(cb) {
    if (this.isConnect) return
    let userInfo = wx.getStorageSync('userInfo')
    let id = userInfo.id
    if (!id) {
      setTimeout(() => {
        this.connect()
      }, 500)
      return
    }
    let { url, prg } = this
    let self = this
    this.socket = wx.connectSocket({
      url: `${url}?id=${id}&prg=${prg}`,
      success() {
        self.isConnect = true
        console.warn('连接socket成功...')
        self._onError()
      },
      fail() {
        self.isConnect = false
        setTimeout(() => {
          this.connect()
        }, 100)
        console.error('连接socket失败!')
      }
    })
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.socket.onClose(() => {
        this.isConnect = false
        this.connect()
        console.warn('socket断开连接！')
      })
    })
  }

  on(cb) {
    if (!this.socket) {
      setTimeout(() => {
        this.on(cb)
      }, 100)
      return
    }
    this.socket.onOpen(() => {
      this.socket.onMessage(cb)
    })
  }

  _onError() {
    if (!this.socket || !this.isConnect) {
      setTimeout(() => {
        this._onError()
      }, 100)
      return
    }
    this.socket.onError((e) => {
      console.error('socket异常，', e)
    })
  }

  destroy() {
    if (this.socket) {
      let self = this
      this.socket.close({
        success() {
          console.warn('socket关闭成功！')
        },
        fail() {
          console.warn('socket关闭失败！')
        },
        complete() {
          self.isConnect = false
        }
      })
    }
    this.instance = null
  }
}
