import request from '@/utils/request'

export function createD(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/',
    method: 'post',
    params: data
  })
}

export function list(data) {
  return request({
    url: 'http://localhost:8080/v1/wb/',
    method: 'get',
    params: data
  })
}
