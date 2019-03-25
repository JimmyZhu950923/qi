import request from '@/utils/request'

export function createD(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/daemonset',
    method: 'post',
    params: data
  })
}

export function Single(name, namespace) {
  return request({
    url: 'http://localhost:8080/v1/wb/daemonset/' + name,
    method: 'get',
    params: { namespace: namespace }
  })
}

export function list(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/daemonset',
    method: 'get',
    params: data
  })
}

export function updateDae(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/daemonset',
    method: 'put',
    params: data
  })
}

export function delDae(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/daemonset',
    method: 'delete',
    params: data
  })
}
