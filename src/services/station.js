import request from '../utils/request';

export async function queryList(params) {
  return request('/zhgf-core/api/0/powerStation/findPowerStationWithAlarm', {
    method: 'POST',
    body: params,
  });
}
export async function deleteStationById(params) {
  return request('/zhgf-core/api/0/powerStation/deleteById', {
    method: 'POST',
    body: params,
  });
}
//获取地址
export async function getStationAddress() {
  return request('/zhgf-core/api/0/address/getSataionAddress',{
    method: 'POST',
  });
}
//修改电站信息
export async function updateStationInfo(params) {
  return request('/zhgf-core/api/0/powerStation/updateVisibleByIds',{
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
//转移业主
export async function moverOwner(params){
  return request('/zhgf-core/api/0/powerStation/moveOwner',{
    method: 'POST',
    body: params,
  });
}
//保存列表选项
export async function saveTableColumns(params){
  return request('/zhgf-core/api/0/userCol/save',{
    method: 'POST',
    body: params,
  });
}
//获取列表信息
export async function queryTableColumns(params){
  return request('/zhgf-core/api/0/userCol/query',{
    method: 'POST',
    body: params,
  });
}
//获取销售统计信息
export async function generalStatistics(){
  return request('/zhgf-core/api/0/reportStationApi/generalStatistics',{
    method: 'POST'
  });
}
//获取运维统计信息
export async function generalStatisticsOPS(){
  return request('/zhgf-core/api/0/reportStationApi/generalStatisticsToInstall',{
    method: 'POST'
  });
}
//获取地图信息
export async function getStationMapList(){
  return request('/zhgf-core/api/0/powerStation/stationMapList',{
    method: 'POST'
  });
}

//电站基本信息
export async function stationInfo(params) {
  return request('/zhgf-core/api/0/powerStation/getById',{
    method: 'POST',
    body: params,
  });
}
//分钟功率回放
export async function playBackRate(params) {
  return request('/zhgf-core/api/0/liveStationMiPortApi/stationCurrentBnp',{
    method: 'POST',
    body: params,
  });
}
//日，月，年发电量
export async function playBackPower(params) {
  return request('/zhgf-core/api/0/reportStationApi/queryStationPowerOfPushCondition',{
    method: 'POST',
    body: params,
  });
}
//获取天气信息
export async function queryWeather(params) {
  return request('/zhgf-core/api/0/weather/query',{
    method: 'POST',
    body: params,
  });
}
