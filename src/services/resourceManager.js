import request from '../utils/request';

export async function thirdTreeList(params) { // 查询所有资源,树级菜单方式返回
  return request('/permission/api/0/permission/resource/queryAllResource', {
    method: 'POST',
    body: params,
  });
}

export async function thirdTreeCreate(params) { // 新增资源，资源相关基本信息
  return request('/permission/api/0/permission/resource/createResource', {
    method: 'POST',
    body: params,
  });
}

export async function thirdTreeDeleteConditional(params) { // 删除资源
  //return request('/permission/api/0/permission/resource/deleteThirdPartyServiceProviderResource', {
  return request('/permission/api/0/permission/resource/deleteResourceByResourceId', {
    method: 'POST',
    body: params,
  });
}

export async function thirdTreeUpdate(params) { // 修改资源
  return request('/permission/api/0/permission/resource/updateResourceByResourceDto', {
    method: 'POST',
    body: params,
  });
}
