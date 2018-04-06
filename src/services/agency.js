import request from '../utils/request';

export async function getAllAgencyList(param) { // 分页查询数据
  return request('/permission/api/0/permission/organization/queryOrganizationsByDtoPage', {
    method: 'POST',
    body: param,
  });
}
