import { config } from '../utils/config';
import request from '../utils/request';
export async function download(id,url,filename){
	const newUrl = config.CHRCK_FILE+url;
  let a = document.createElement('a');
	a.href = newUrl;
    a.download = filename;
    var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Chrome") > -1){
        //download这属性只支持火狐和谷歌，但是实际测试只支持谷歌，所以分开作用
        a.click();
      }else{
        window.location.href = newUrl;
      }

request('/download',{
    method: 'GET',
    param: id,
  });
}
	