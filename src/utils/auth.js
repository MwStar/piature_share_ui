import { getLocalStorage } from './utils';
import { routerRedux } from 'dva/router';

// Auth
export function getAuthHeader(sso_token) {
  let language = getLocalStorage("language");
  if(!language ){
    language = "zh-cn";
  }

  let headers = {};
 // headers["authorization"] = sso_token;
  headers['Accept'] = 'application/json';
  headers['Content-Type'] = 'application/json;charset=utf-8';
  //headers['language'] = language;
  return ({headers});
}


export function authenticated() {
  const sso_token = getLocalStorage("Token");
  if (!sso_token) {
    redirectLogin();
  }
  return sso_token;
}

export function redirectLogin() {
  localStorage.clear();
  routerRedux.push('/')
}

export function logOut() {
  localStorage.clear();
  routerRedux.push('/')
}



