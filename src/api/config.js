import request from '@/utils/request'

// 查
export function getConfigs(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/config',
    method: 'get',
    params: data
  })
}
export function getSingle(namespace, name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/config/' + namespace,
    method: 'get',
    params: { name: name }
  })
}
// 删
export function remove(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/config',
    method: 'delete',
    params: data
  })
}
// 更新
export function update(name, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/config',
    method: 'put',
    params: { name: name, namespace: namespace }
  })
}
// 增
export function createYaml(config1, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/config/' + namespace,
    method: 'post',
    data: config1
  })
}
