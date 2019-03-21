import request from '@/utils/request'

// 查
export function getServices(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'get',
    params: data
  })
}
// 增
export function addServices(name, namespace, type, port) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'post',
    params: { name: name, namespace: namespace, type: type, port: port }
  })
}
// 删
export function remove(name, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'delete',
    params: { name: name, namespace: namespace }
  })
}
