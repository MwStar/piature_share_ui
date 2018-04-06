import { stringify } from 'qs';
import request from '../utils/request';


/**
 * 获取所有系统日志信息
 * @param param
 * @returns {*}
 */
export async function querySystemLog(param) {
  return request('/logger/api/0/system/biz/query',{
    method: 'POST',
    body: param,
  });
}

/**
 * 得到所有服务商信息
 * @param param
 * @returns {*}
 */
export async function queryAllServiceProviderList(param) {
	return request('/logger/doc/system/0/apiDocument/queryAllByInterior',{
    method: 'POST',
    body: param,
  });
}

/**
 * 得到所有日志级别
 * @param param
 * @returns {*}
 */
export async function queryAllLogLevenList(param) {
	return request('/logger/api/0/system/queryLogLevel',{
    method: 'POST',
    body: param,
  });
}


/**
 * 文件列表
 * @param param
 * @returns {*}
 */
export function querySystemLogList(param) {
	return request('/logger/api/0/system/getFiles',{
    method: 'POST',
    body: param,
  });
}
/**
 * 下载文件
 * @param param
 * @returns {*}
 */
export function downloadLogFile(param,fileName) {
	return request('/logger/api/0/system/downloadFile',{
    method: 'POST',
    body: param,fileName,
  });
}

/**
 * 预览文件
 * @param param
 * @returns {*}
 */
export function previewLogFile(param) {
	return request('/logger/api/0/system/openFile',{
    method: 'POST',
    body: param,
  });
}


