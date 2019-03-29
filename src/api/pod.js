import request from '@/utils/request'

export function getPods(data) {
  return request({
    url: 'http://localhost:8080/v1/pods/',
    method: 'get',
    params: data
  })
}

export function update(name, nameSpace) {
  return request({
    url: 'http://localhost:8080/v1/pods',
    method: 'put',
    params: { name: name, nameSpace: nameSpace }
  })
}

export function delPod(data) {
  return request({
    url: 'http://localhost:8080/v1/pods',
    method: 'delete',
    params: data
  })
}

export function getPod(params) {
  return request({
    url: 'http://127.0.0.1:8080/v1/pods/' + params.podName,
    method: 'get',
    params: { namespace: params.namespace }
  })
}
