import { stringify } from 'qs';
import request from '../../utils/request';


/**
 * 获取所有画集
 * @param param
 * @returns {*}
 */
export async function getAllPaintings(param) {
  return request('/getAllPaintings',{
    method: 'GET',
  });
}

/**
 * 获取用户id获取所有画集
 * @param param
 * @returns {*}
 */
export async function getPaintingsById(param) {
  return request('/getAllPaintings',{
    method: 'GET',
    param:param.id
  });
}
/**
 * 获取某个画集下所有图片
 * @param param
 * @returns {*}
 */
export async function getPictureUnderPainting(param) {
  return request('/getPictureUnderPainting',{
    method: 'GET',   
    param:param.id
  });
}
/**
 * 得到某个画集的信息
 * @param param
 * @returns {*}
 */
export async function getPaintingInfo(param) {
  return request('/paintingInfo',{
    method: 'GET',
    param:param.id
  });
}
/**
 * 修改某个画集的信息
 * @param param
 * @returns {*}
 */
export async function updatePainting(param) {
  return request('/updatePaintingInfo',{
    method: 'POST',
    body: param,
  });
}
/**
 * 新建某个画集
 * @param param
 * @returns {*}
 */
export async function createPainting(param) {
  return request('/createPainting',{
    method: 'POST',
    body: param,
  });
}

/**
 * 删除某个画集
 * @param param
 * @returns {*}
 */
export async function de_Painting(param) {
  return request('/de_Painting',{
    method: 'GET',
    param: param.id,
  });
}


/**
 * 上传画之后将画归哪个画集
 * @param param
 * @returns {*}
 */
export async function uploadAndAddTopaintings(param) {
  return request('/uploadAndAddTopaintings',{
    method: 'POST',
    body: param,
  });
}


/**
 * 得到一张图片的信息
 * @param param
 * @returns {*}
 */
export async function getImgInfo(param) {
  return request('/getImgInfo',{
    method: 'GET',
    param:param.id
  });
}
/**
 * 更新一张图片的信息
 * @param param
 * @returns {*}
 */
export async function updateImgInfo(param) {
  return request('/updatePicture',{
    method: 'POST',
    body: param,
  });
}

/**
 * 更新一张图片所属画集
 * @param param
 * @returns {*}
 */
export async function updateToPaintings(param) {
  return request('/updatePictureToPaintings',{
    method: 'POST',
    body: param,
  });
}

/**
 * 删除一张图片
 * @param param
 * @returns {*}
 */
export async function daleteImg(param) {
  return request('/deletePicture',{
    method: 'GET',
    param:param.id
  });
}
/**
 * 审核一张图片
 * @param param
 * @returns {*}
 */
export async function checked(param) {
  return request('/checked',{
    method: 'POST',
    body: param,
  });
}

