import { stringify } from 'qs';
import request from '../utils/request';

/*//分页查询用户列表
export async function queryUsers(params) {
  return request('/user/api/0/permission/user/queryUsersPageByUserDto',{
    method: 'POST',
    body: params,
  });
}*/
//分页查询用户列表
export async function queryUsers(params) {
  return request('/permission/api/0/permission/user/queryUsersPageByUserDtoForInnerPlatform',{
    method: 'POST',
    body: params,
  });
}

//删除用户
export async function daleteUser(params) {
  return request('/permission/api/0/permission/user/delete',{
    method: 'POST',
    body: params,
  });
}
//更新用户
export async function updateUser(params) {
  return request('/permission/api/0/permission/user/update',{
    method: 'POST',
    body: params,
  });
}
//获取用户根据id
export async function getUser(params) {
  return request('/permission/api/0/permission/user/update',{
    method: 'POST',
    body: params,
  });
}

//增加用户
export async function addtUser(params) {
  return request('/permission/api/0/permission/user/create',{
    method: 'POST',
    body: params,
  });
}

//查询经销商信息
export async function queryAgency(params) {
  return request('/permission/api/0/permission/organization/queryCompaniesUnderCurrentUser', {
    method: 'POST',
    body: params,
  });
}

//根据经销商查询业主
export async function queryProprietor(params) {
  return request('/permission/api/0/permission/organization/queryOfficesUnderCurrentUser', {
    method: 'POST',
    body: params,
  });
}

//查询用户角色信息
export async function queryRoles(params) {
  return request('/permission/api/0/permission/role/queryRoleRoleDTO',{
    method: 'POST',
    body: params,
  });
}

//角色管理

//查询用户角色列表
export async function queryRolesLsit(params) {
  return request('/permission/api/0/permission/role/queryRoleByPage',{
    method: 'POST',
    body: params,
  });
}
//删除用户角色列表
export async function deleteRole(params) {
  return request('/permission/api/0/permission/role/deleteRoleById',{
    method: 'POST',
    body: params,
  });
}
//新增用户角色列表
export async function addRole(params) {
  return request('/permission/api/0/permission/role/createRole',{
    method: 'POST',
    body: params,
  });
}


//更新用户角色
export async function updateRole(params) {
  return request('/permission/api/0/permission/role/updateRole',{
    method: 'POST',
    body: params,
  });
}
/*
//获取所有服务项
export function queryResources(){  
 return request('/permission/api/0/admin/queryUserAllResourcesForInnerPlatform', {
  method: 'POST',
});
}*/
//获取所有服务项
export function queryResources(params){  
 return request('/permission/api/0/permission/resource/queryAllResource', {
  method: 'POST',
  body: params,
});
}

