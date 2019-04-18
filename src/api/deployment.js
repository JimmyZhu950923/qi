import request from '@/utils/request'

export function createD(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/',
    method: 'post',
    params: data
  })
}

export function Single(name, namespace) {
  return request({
    url: 'http://localhost:8080/v1/wb/' + name,
    method: 'get',
    params: { namespace: namespace }
  })
}

export function list(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/',
    method: 'get',
    params: data
  })
}

export function updateDep(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/',
    method: 'put',
    params: data
  })
}

export function delDep(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/',
    method: 'delete',
    params: data
  })
}

export function createDYaml(namespace, deployment) {
  return request({
    url: 'http://localhost:8080/v1/wb/' + namespace,
    method: 'post',
    data: deployment
  })
}
