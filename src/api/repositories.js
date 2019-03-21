import request from '@/utils/request'

export function getRepositories(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/repositories/',
    method: 'get',
    params
  })
}

export function deleteRepositories(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/repositories/',
    method: 'delete',
    params: { path: params }
  })
}

export function pageChange(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/repositories/',
    method: 'get',
    params
  })
}

export function getProject(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/object/' + params,
    method: 'get'
  })
}
