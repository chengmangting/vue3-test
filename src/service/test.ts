import { GET, POST } from '@/service'
// 实例
// export function getList(data){
//     return POST({url:'xxx',data})
// }

export function getShopGroupList(data = {}) {
  return POST('data-overview/get-shop-group-list', data)
}

export function getCompanyInfo(params = {}) {
  return GET(`/login/get-company-info-by-code`, params)
}
