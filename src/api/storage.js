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
export function createYaml(storage1, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/storage/' + namespace,
    method: 'post',
    data: storage1
  })
}
// 删
export function remove(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/storage',
    method: 'delete',
    params: data
  })
}
// 更新
export function update(name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/storage',
    method: 'put',
    params: { name: name }
  })
}
