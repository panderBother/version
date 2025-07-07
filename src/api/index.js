import request from '@/utils/request'

// 地图相关的可视化数据
export const getMap = () => {
  return request.get('/map')
}
// 获取商家列表
export const getSeller = () => {
  return request.get('/seller')
}

export const getTrend = () => {
  return request.get('/trend')
}
// 获取库存数据
export const getStock = () => {
  return request.get('/stock')
}
// 获取热搜数据
export const getHot = () => {
  return request.get('/hot')
}
// 获取排行榜数据
export const getRank = () => {
  return request.get('/rank')
}