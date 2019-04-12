import request from '@/utils/request'

// 查
export function getSecrets(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/secret',
    method: 'get',
    params: data
  })
}
export function getSingle(namespace, name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/secret/' + namespace,
    method: 'get',
    params: { name: name }
  })
}
// 删
export function remove(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/secret',
    method: 'delete',
    params: data
  })
}
// 更新
export function update(name, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/secret',
    method: 'put',
    params: { name: name, namespace: namespace }
  })
}
// 增
export function createYaml(secret1, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/secret/' + namespace,
    method: 'post',
    data: secret1
  })
}
