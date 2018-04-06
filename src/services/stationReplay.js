import { stringify } from 'qs';
import request from '../utils/request';

//分页查询用户列表
export async function queryLineData(params) {
  return request('/zhgf-core/api/0/liveStationMiPortApi/findPlayBackWithMiBy',{
    method: 'POST',
    body: params,
  });
}
