import request from '@/utils/request'

// 查
export function getConfigs(data) {
  return request({
    url: 'http://127.0.0.1:8080/v1/config',
    method: 'get',
    params: data
  })
}
