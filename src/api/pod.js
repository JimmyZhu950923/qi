import request from '@/utils/request'

export function getPods(data) {
  return request({
    url: 'http://localhost:8080/v1/pods/list',
    method: 'get',
    params: data
  })
}

export function update(name, nameSpace) {
  return request({
    url: 'http://localhost:8080/v1/pods/',
    method: 'put',
    params: { name: name, nameSpace: nameSpace }
  })
}
