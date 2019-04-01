import request from '@/utils/request'

export function getLabels(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/label/',
    method: 'get',
    params
  })
}
export function getLabelById(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/label/' + params.id,
    method: 'get',
    params
  })
}
export function insertLabel(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/label/',
    method: 'post',
    data: data
  })
}
export function updateLabel(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/label/' + data.id,
    method: 'put',
    data: data
  })
}
export function deleteLabel(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/label/' + params,
    method: 'delete'
  })
}

