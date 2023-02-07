import request from 'src/service/request'

export function AdminListarEmpresas () {
  return request({
    url: '/admin/tenants/',
    method: 'get'
  })
}
export function CriarTenant (data) {
  return request({
    url: '/admin/tenants/',
    method: 'post',
    data
  })
}
