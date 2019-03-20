import request from '@/utils/request'

export function getServices(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'get',
    params: data
  })
}
export function addServices(name, namespace, port) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'post',
    params: { name: name, namespace: namespace, port: port }
  })
}
export function remove(name, namespace) {
  return request({
    url: 'http://127.0.0.1:8080/v1/service',
    method: 'delete',
    params: { name: name, namespace: namespace }
  })
}
