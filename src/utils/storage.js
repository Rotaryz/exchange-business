import wx from 'wx'

export default function storage(key, val) {
  if (val) {
    wx.setStorageSync(key, val)
  } else {
    return wx.getStorageSync(key)
  }
}
