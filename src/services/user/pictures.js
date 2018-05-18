import { stringify } from 'qs';
import request from '../../utils/request';


/**
 * 获取用户下所有采集到的图片
 * @param param
 * @returns {*}
 */
export async function getAllPicture(param) {
  return request('/getAllPicture',{
    method: 'GET',
  });
}

/**
 * 根据id获取用户下所有采集到的图片
 * @param param
 * @returns {*}
 */
export async function getAllPictureById(param) {
  return request('/getAllPicture',{
    method: 'GET',
    param:param.id
  });
}

/**
 * 获取用户下所有收藏的图片
 * @param param
 * @returns {*}
 */
export async function getPictureCollect(param) {
  return request('/getPictureCollect',{
    method: 'GET',
  });
}

/**
 * 根据id获取用户下所有收藏的图片
 * @param param
 * @returns {*}
 */
export async function getPictureCollectById(param) {
  return request('/getPictureCollect',{
    method: 'GET',
    param:param.id,
  });
}


