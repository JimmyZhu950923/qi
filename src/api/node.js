import request from '@/utils/request'

export function getNodes() {
  return request({
    url: 'http://127.0.0.1:8080/v1/node/',
    method: 'get'
  })
}

export function getNodeByName(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/node/' + params,
    method: 'get'

  })
}
