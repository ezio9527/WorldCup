import http from 'axios'

// 上传图url
export function getBaseUrl() {
  return http.get('/file/getBaseUrl')
}
// 赛事列表
export function findMatchAll(data) {
  return http.get('/sh/findAll', { params: data })
}
// 赛程列表(未结束)
export function findDistanceAll(data) {
  return http.get('/game/findNow', { params: data })
}
// 赛程列表(已结束)
export function findDistanceEndAll(data) {
  return http.get('/game/findEnd', { params: data })
}
// 查看赛程投注记录
export function findBetRecordByDistance(data) {
  return http.get('/bet/findMyBetByGameId', { params: data })
}
// 查看全部赛程投注记录
export function findBetRecordAll(data) {
  return http.get('/bet/findAllBet', { params: data })
}
