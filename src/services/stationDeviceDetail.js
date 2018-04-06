import { stringify } from 'qs';
import request from '../utils/request';


/* ------------------DTU请求----------------------*/
export async function queryDTU(params) { // 查询DTU分页
  return request('/zhgf-core/api/0/dtuManage/findByAny', {
    method: 'POST',
    body: params,
  });
}


/* ------------------中继器请求----------------------*/
export async function queryRepeater(params) { // 查询中继器分页
  return request('/zhgf-core/api/0/repeater/findRepeater', {
    method: 'POST',
    body: params,
  });
}


/* ------------------微逆请求----------------------*/
export async function queryMicro(params) { // 查询微逆分页
  return request('/zhgf-core/api/0/microInverter/findMicroInverterByPage', {
    method: 'POST',
    body: params,
  });
}


/* ------------------公共请求----------------------*/
export async function deleteRelation(params) { // 删除设备关系
  return request('/zhgf-core/api/0/installRelation/deleteRelation', {
    method: 'POST',
    body: params,
  });
}

export async function updateRelation(params) { // 替换设备关系
  return request('/zhgf-core/api/0/installRelation/updateSn', {
    method: 'POST',
    body: params,
  });
}

export async function deviceOperation(params) { //  设备操作（非DTU的其他设备）
  return request('/zhgf-protocol/api/0/eqOperation/opera', {
    method: 'POST',
    body: params,
  });
}

export async function dtuOperation(params) { //  dtu更新固件、重启等操作
  return request('/zhgf-protocol/api/0/dtuOperation/opera', {
    method: 'POST',
    body: params,
  });
}


export async function queryHistory(params) { //  查询历史
  return request('/zhgf-core/api/0/replaceRecord/replaceReordList', {
    method: 'POST',
    body: params,
  });
}
