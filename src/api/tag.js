import request from '@/utils/request'

export function findLabels(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/findLabels',
    method: 'get',
    data
  })
}
export function all(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/select',
    method: 'get',
    data
  })
}
export function remove() {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/delete',
    method: 'delete'
  })
}
export function minus(label_id, tag_name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/removeLabels?label_id=' + label_id + '&name=' + tag_name,
    method: 'delete'
  })
}
export function add(label_id, tag_name) {
  return request({
    url: 'http://127.0.0.1:8080/v1/tag/addLabels?label_id=' + label_id + '&name=' + tag_name,
    method: 'post'
  })
}
