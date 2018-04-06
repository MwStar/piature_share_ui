import request from '../utils/request';

export async function userLogin(params) {
  return request('/user/login', {
    method: 'POST',
    body: params,
  });
}
// export async function queryUsers(params) {
//   return request('/permission/api/0/permission/user/getMe', {
//     method: 'POST',
//     body: params,
//   });
// }
export async function queryCurrent(params) {
  return request('/permission/api/0/permission/user/getMe', {
    method: 'POST',
    body: params,
  });
}
//找回密码
export async function getBackPassword(params) {
  return request('/permission/system/0/admin/getBackPassword', {
    method: 'POST',
    body: params,
  });
}

//获取验证码
export async function getValidateCode(params) {
  return request('/permission/system/0/admin/getValidateCode', {
    method: 'POST',
    body: params,
  });
}

//获取用户信息包含公司信息
export async function userInfo(params) {
  return request('/permission/api/0/permission/user/getCurrentUserInfo', {
    method: 'POST',
    body: params,
  });
}
//修改用户信息
export async function setting(params) {
  return request('/permission/api/0/permission/user/verifyOldPasswdAndUpdateNewPasswd', {
    method: 'POST',
    body: params,
  });
}

//获取用户对应菜单
export async function queryResource(params) {
  return request('/permission/api/0/permission/userInfo/queryResourceByUserId', {
    method: 'POST',
    body: params,
  });
}