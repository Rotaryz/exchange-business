export const GIFT_TYPE = {
  0: '',
  1: '服务',
  2: '播豆',
  3: '兑换券'
}

// 创建礼物
export function createGift({type, name, number, stock = ''}, others = {}) {
  return {
    type,
    number,
    stock,
    name: name || formatName(type, number),
    ...others
  }
}

function formatName(type, number) {
  let name = ''
  if (type > 1) {
    name = number + GIFT_TYPE[type]
  }
  return name
}

// 解析数据
export function resolveData(data = {}) {
  if (data.map) {
    data = {}
  }
  const config = data.config || {}
  const prizes = data.prizes || []
  const giftList = prizes.map((item) => {
    return {
      type: item.type,
      object_id: item.object_id,
      name: item.name || '',
      number: item.number,
      stock: item.usable_stock,
      image_id: item.image_id,
      image_url: item.image_url
    }
  })
  return {
    lotteryCount: data.join_times || 1,
    winItem: config.percentage || 10,
    openExplain: +config.note_status,
    explain: data.note || '',
    openWheel: +data.status,
    giftList
  }
}

// 数据格式化
export function formatData(data) {
  const prizes = data.giftList.map(item => {
    return {
      'type': item.type,
      'object_id': item.object_id || 0,
      'name': item.name,
      'number': item.number,
      'usable_stock': item.stock,
      'image_id': item.image_id || 0
    }
  })
  return {
    'type': '1',
    'join_times': data.lotteryCount,
    'config': {
      'percentage': data.winItem,
      'note_status': data.openExplain ? 1 : 0
    },
    'note': data.explain,
    'status': data.openWheel ? 1 : 0,
    prizes
  }
}

export function resolveServeData(arr = []) {
  return arr.map((data) => {
    return {
      selected: false,
      object_id: data.id || 0,
      name: data.name,
      totalStock: data.saleable,
      price: data.price,
      image_url: data.goods_cover_image,
      image_id: data.goods_cover_image_id
    }
  })
}
