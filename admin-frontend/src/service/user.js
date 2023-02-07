import request from 'src/service/request'

export function AdminListarUsuarios (params) {
  return request({
    url: '/admin/users/',
    method: 'get',
    params
  })
}

export function CriarTenant (data) {
  return request({
    url: '/admin/tenants/',
    method: 'post',
    data
  })
}

export function CriarUsuario (params) {
  return request({
    url: '/admin/users/',
    method: 'post',
    params
  })
}

export function AdminUpdateUsuarios (userId, data) {
  return request({
    url: `/admin/users/${userId}`,
    method: 'put',
    data
  })
}

export function DadosUsuario (userId) {
  return request({
    url: `/users/${userId}`,
    method: 'get'
  })
}

export function UpdateConfiguracoesUsuarios (userId, data) {
  return request({
    url: `/users/${userId}/configs`,
    method: 'put',
    data
  })
}
