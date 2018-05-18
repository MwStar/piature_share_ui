import { stringify } from 'qs';
import request from '../utils/request';


/**
 * 获取所有图片---首页
 * @param param
 * @returns {*}
 */
export async function getAll(param) {
  return request('/getAllList',{
    method: 'POST',
    body: param,
  });
}

/**
 * 根据关键词获取所有图片---搜索
 * @param param
 * @returns {*}
 */
export async function getAllByQuery(param) {
  return request('/getListByQuery',{
    method: 'POST',
    body: param,
  });
}

/**
 * 获取所有画集---发现
 * @param param
 * @returns {*}
 */
export async function getAllPaintings(param) {
  return request('/getAllListByAuthor',{
    method: 'POST',
    body: param,
  });
}

/**
 * 获取所有最新图片---最新
 * @param param
 * @returns {*}
 */
export async function getAllNew(param) {
  return request('/getAllListByTime',{
    method: 'POST',
    body: param,
  });
}

/**
 * 关注
 * @param param
 * @returns {*}
 */
export async function focus(param) {
  return request('/follow',{
    method: 'GET',
    param:param.id,
  });
}

/**
 * 取消关注
 * @param param
 * @returns {*}
 */
export async function de_focus(param) {
  return request('/de_follow',{
    method: 'GET',
    param:param.id,
  });
}

/**
 * 收藏
 * @param param
 * @returns {*}
 */
export async function collect(param) {
  return request('/collect',{
    method: 'GET',
    param:param.id,
  });
}

/**
 * 取消收藏
 * @param param
 * @returns {*}
 */
export async function de_collect(param) {
  return request('/de_collect',{
    method: 'GET',
    param:param.id,
  });
}

/**
 * 采集
 * @param param
 * @returns {*}
 */
export async function gatherPicture(param) {
  return request('/gatherPicture',{
    method: 'POST',
    body: param,
  });
}

/**
 * 删除采集
 * @param param
 * @returns {*}
 */
export async function de_gatherPicture(param) {
  return request('/de_gatherPicture',{
    method: 'POST',
    body: param,
  });
}

/**
 * 评论
 * @param param
 * @returns {*}
 */
export async function comment(param) {
  return request('/comment',{
    method: 'POST',
    body: param,
  });
}

/**
 * 删除评论
 * @param param
 * @returns {*}
 */
export async function de_comment(param) {
  return request('/de_comment',{
    method: 'GET',
    param: param.id,
  });
}

/**
 * 打标签
 * @param param
 * @returns {*}
 */
export async function doTag(param) {
  return request('/doTag',{
    method: 'POST',
    body: param,
  });
}
