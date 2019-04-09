import request from '@/utils/request'

export function getAllClu() {
  return request({
    url: 'http://127.0.0.1:8080/v1/cluster',
    method: 'get'
  })
}

export function getClu(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/cluster/' + params,
    method: 'get'
  })
}

export function insertCluster(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/cluster',
    method: 'post',
    params
  })
}

export function deleteClu(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/cluster/' + params,
    method: 'delete'
  })
}
