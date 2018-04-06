import request from '../utils/request';

export async function queryAgency(params) {
  return request('/permission/api/0/permission/organization/queryAllOrganizationsUnderCurrentUser',{
    method: 'POST',
    body: params,
  });
}
export async function queryTimeZone() {
  return request('/zhgf-core/api/0/timezone/list',{
    method: 'POST'
  });
}
export async function queryAssemblyList() {
  return request('/zhgf-core/api/0/module/listAll',{
    method: 'POST'
  });
}
export async function createStep1(params) {
  return request('/zhgf-core/api/0/powerStation/createStep1',{
    method: 'POST',
    body: params,
  });
}
//修改电站信息（已完成）
export async function updateStationBaseInfo(params) {
  return request('/zhgf-core/api/0/powerStation/updateStationBaseInfo',{
    method: 'POST',
    body: params,
  });
}
export async function createStep2(params) {
  return request('/zhgf-core/api/0/powerStation/createStep2',{
    method: 'POST',
    body: params,
  });
}
export async function getDeviceRelationList(params) {
  return request('/zhgf-core/api/0/powerStation/getDeviceRelationList',{
    method: 'POST',
    body: params,
  });
}
export async function getStationById(params) {
  return request('/zhgf-core/api/0/powerStation/getById',{
    method: 'POST',
    body: params,
  });
}
// export async function getDTUList(params) {
//   return request('/zhgf-core/api/0/powerStation/getDtuList',{
//     method: 'POST',
//     body: params,
//   })
// }
// export async function getCanBindRepeaterByDtuSn(params){
//   return request('/zhgf-core/api/0/powerStation/getCanBindRepeaterByDtuSn',{
//     method: 'POST',
//     body: params,
//   });
// }
export async function bindRelation(params){
  return request('/zhgf-core/api/0/powerStation/bindRelation',{
    method: 'POST',
    body: params,
  });
}
// export async function getCanBindMiList(params){
//   return request('/zhgf-core/api/0/powerStation/getCanBindMiList',{
//     method: 'POST',
//     body: params,
//   });
// }
export async function uploadMap(params){
  return request('/zhgf-core/api/0/powerStation/uploadMap',{
    method: 'POST',
    body: params,
  });
}
export async function updateSn(params){
  return request('/zhgf-core/api/0/installRelation/updateSn',{
    method: 'POST',
    body: params,
  });
}
// export async function updateRepeaterSn(params){
//   return request('/zhgf-core/api/0/installRelation/updateRepeaterSn',{
//     method: 'POST',
//     body: params,
//   });
// }
// export async function updateMiSn(params){
//   return request('/zhgf-core/api/0/installRelation/updateMiSn',{
//     method: 'POST',
//     body: params,
//   });
// }
export async function deleteSn(params){
  return request('/zhgf-core/api/0/installRelation/deleteMi',{
    method: 'POST',
    body: params,
  });
}
// export async function deleteRepeater(params){
//   return request('/zhgf-core/api/0/installRelation/deleteRepeater',{
//     method: 'POST',
//     body: params,
//   });
// }
// export async function deleteDtu(params){
//   return request('/zhgf-core/api/0/installRelation/deleteDtu',{
//     method: 'POST',
//     body: params,
//   });
// }
export async function getUserInfoByOwnerId(params){
  return request('/permission/api/0/permission/userInfo/queryUsersInfoByOrganId',{
    method: 'POST',
    body: params,
  });
}
//根据机构获取业主
export async function queryOwnerByOrgan(params){
  return request('/permission/api/0/permission/organization/queryOwner',{
    method: 'POST',
    body: params,
  });
}
