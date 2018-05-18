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
//注册
export async function userRegister(params) {
  return request('/user/signup', {
    method: 'POST',
    body: params,
  });
}

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


//修改密码
export async function rePassword(params) {
  return request('/pass_setting', {
    method: 'POST',
    body: params,
  });
}


//获取用户信息(自己)
export async function userInfo(params) {
  return request('/userInfo', {
    method: 'GET',
  });
}

//获取用户信息（别人）
export async function getUserById(params) {
  return request('/userInfo', {
    method: 'GET',
    param:params.id,
  });
}
//修改用户信息
export async function setting(params) {
  return request('/setting', {
    method: 'POST',
    body: params,
  });
}

//获取消息
export async function queryNotices(params) {
  return request('/message', {
    method: 'GET',
  });
}

//某条消息已读
export async function readNotices(params) {
  return request('/message_hasread', {
    method: 'GET',
    param:params.id,
  });
}

//清空所有消息
export async function clearAllNotices(params) {
  return request('/allmessage_hasread', {
    method: 'POST',
    body: params,
  });
}
