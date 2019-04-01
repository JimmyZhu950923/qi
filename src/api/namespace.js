import request from '@/utils/request'

export function getAllNamespace() {
  return request({
    url: 'http://127.0.0.1:8080/v1/namespace/',
    method: 'get'
  })
}

export function getNamespace(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/namespace/' + params,
    method: 'get'
  })
}

export function addNamespace(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/namespace?name=' + params.name,
    method: 'post'
  })
}
export function deleteNamespace(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/namespace/' + params,
    method: 'delete'
  })
}
