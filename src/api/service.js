import request from '@/utils/request'

// 查
export function getServices(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'get',
    params: data
  })
}
export function getSingle(namespace, name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service/' + namespace,
    method: 'get',
    params: { name: name }
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
export function createYaml(service1, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service/' + namespace,
    method: 'post',
    data: service1
  })
}
// 删
export function remove(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'delete',
    params: data
  })
}
// 更新
export function update(name, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'put',
    params: { name: name, namespace: namespace }
  })
}
