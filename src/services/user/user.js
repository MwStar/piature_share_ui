import { stringify } from 'qs';
import request from '../../utils/request';


/**
 * 获取用户关注的人
 * @param param
 * @returns {*}
 */
export async function getFocus(param) {
  return request('/getFocus',{
    method: 'GET',
  });
}

/**
 * 根据id获取用户关注的人
 * @param param
 * @returns {*}
 */
export async function getFocusById(param) {
  return request('/getFocus',{
    method: 'GET',
    param:param.id,
  });
}



