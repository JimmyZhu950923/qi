import request from '@/utils/request'

export function getServices(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'get',
    params: data
  })
}
export function addServices(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'post',
    params: { name: data }
  })
}
export function remove(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'delete',
    params: { name: data }
  })
}
