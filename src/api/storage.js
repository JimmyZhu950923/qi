import request from '@/utils/request'

// 查
export function getStorages(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/storage',
    method: 'get',
    params: data
  })
}
export function getSingle(namespace, name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/storage/' + name,
    method: 'get',
    params: { namespace: namespace }
  })
}
// 增
export function addStorages(name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/storage',
    method: 'post',
    params: { name: name }
  })
}
// 删
export function remove(name, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/storage',
    method: 'delete',
    params: { name: name, namespace: namespace }
  })
}
