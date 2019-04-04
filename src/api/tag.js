import request from '@/utils/request'

export function findLabels(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/label',
    method: 'get',
    params: { projectId: data }
  })
}
export function all(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/',
    method: 'get',
    params: data
  })
}
export function remove(data, name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/',
    method: 'delete',
    params: { repoName: data, name: name }
  })
}
export function minus(labelId, tagName, data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/label',
    method: 'delete',
    params: { repoName: data, labelId: labelId, tagName: tagName }
  })
}
export function add(labelId, tagName, data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/label',
    method: 'post',
    params: { repoName: data, labelId: labelId, tagName: tagName }
  })
}
