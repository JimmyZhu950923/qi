import request from '@/utils/request'

export function getProjects(data) {
  return request({
    url: 'http://localhost:8080/v1/object',
    method: 'get',
    params: data
  })
}

export function addProject(data) {
  return request({
    url: 'http://localhost:8080/v1/object',
    method: 'post',
    data: data
  })
}

export function deleteProject(data) {
  return request({
    url: 'http://localhost:8080/v1/object',
    method: 'delete',
    params: data
  })
}

export function changeProject(data) {
  return request({
    url: 'http://localhost:8080/v1/object/' + data.pid,
    method: 'put',
    params: { public: data.public }
  })
}
