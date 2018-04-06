import { routerRedux } from 'dva/router';
import { userLogin ,getBackPassword ,getValidateCode , queryResource} from '../services/user';
import {setLocalStorage, getLocalStorage , setMenuTree} from '../utils/utils';
import {message} from 'antd';
import getCountryToDo from '../utils/request';

export default {
  namespace: 'login',

  state: {
    status: 1,
    codeStatus:true,
    menuList:[],//菜单资源0
    button:[],//按钮1
    func:[],//功能2
    owner:false,//是否是业主
  },

  effects: {
    *login({ param }, { call, put }) {

      const response = yield call(userLogin, param);
      console.log(response);
      if(response.status=== 0){
        //把登录信息存入localStorage
        /*setLocalStorage("gfToken", response.data.token);
        let userInfo = getLocalStorage("userInfo");
        let t = getLocalStorage("gfToken"); */       
        if(response.data.userType === "2"){
          debugger
          //yield put({ type: 'queryOwnerResource' });
          yield put({type: 'saveOwner',owner: true,});
          yield put(routerRedux.push('/owner/view'));
        }
        else{
          debugger
          //yield put({ type: 'queryResource' });
          yield put({type: 'saveOwner',owner: false,});
          yield put(routerRedux.push('/statistics'));
        }
        message.success("登录成功")
        
        /*yield put({
          type: 'changeLoginStatus',
          payload: response,
        });*/
        }
        else {
          message.error(response.message);
        }
      },

      *logout(_, { put }) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
          },
        });
        yield put(routerRedux.push('/user/login'));
      },
      //获取管理菜单资源
      *queryResource({param},{call,put}){    
        const result = yield call(queryResource);
        if (result.status === '0') {
          let menujsons = [];//树形结构的菜单
          let menuData = [];//平行数组结构的菜单
          let button = [];//按钮
          let func = [];//功能
          for(let k in result.data){
            if(result.data[k].resourceMenuType==="0"){
              menuData.push(result.data[k]);
            }
            if(result.data[k].resourceMenuType==="1"){
              button.push(result.data[k]);
              yield put({type: 'saveButton',button: button});
            }
            if(result.data[k].resourceMenuType==="2"){
              func.push(result.data[k]);
              yield put({type: 'saveFunc',func: func});
            } 
          };          
          /*const menul = menuData;
          const menu2 = menuData;
          const menu3 = menuData;
          for (let i in menul) {
            if (menul[i].pid == 1 ) {
              //一级菜单
              let menujson = {"name": menul[i].nameCn, "path": menul[i].resourceUrl, icon: menul[i].menuIcon,pid:menul[i].pid};

              //二级菜单
              let twomenujsons = [];
              for (let j in menu2) {
                if (menu2[j].pid == menul[i].id) {
                  let twomenujson = {"name": menu2[j].nameCn, "path": menu2[j].resourceUrl, icon: menu2[j].menuIcon};
                  twomenujsons.push(twomenujson);
                }
                menujson["children"] = twomenujsons;
                //三级菜单
                let threemenujsons = [];
                for(let k in menu3){
                  if(menu3[k].pid == menu2[j].id) {
                    let threemenujson = {"name": menu3[k].nameCn, "path": menu3[k].resourceUrl, icon: menu3[k].menuIcon};
                    threemenujsons.push(threemenujson);
                  }
                  twomenujsons["children"] = threemenujsons;
                }
              }
              menujsons.push(menujson);
            }
          }*/
          menujsons = setMenuTree(menuData,[],1);
          //把组装好的菜单放入缓存
          setLocalStorage("menulist", menujsons);
          yield put({type: 'saveMenu',menuList: menujsons,});
        } else {
          message.error(result.message);
          return false;
        }
      },
      //获取业主菜单资源
      *queryOwnerResource({param},{call,put}){    
        const result = yield call(queryResource);
        if (result.status === '0') {
          let menujsons = [];//树形结构的菜单
          let menuData = [];//平行数组结构的菜单
          let button = [];//按钮
          let func = [];//功能
          for(let k in result.data){
            if(result.data[k].resourceMenuType==="0"){
              menuData.push(result.data[k]);
            }
            if(result.data[k].resourceMenuType==="1"){
              button.push(result.data[k]);
              yield put({type: 'saveButton',button: button});
            }
            if(result.data[k].resourceMenuType==="2"){
              func.push(result.data[k]);
              yield put({type: 'saveFunc',func: func});
            } 
          };          
          menujsons = setMenuTree(menuData,[],27);
          //把组装好的菜单放入缓存
          setLocalStorage("menulist", menujsons);
          yield put({type: 'saveMenu',menuList: menujsons,});
        } else {
          message.error(result.message);
          return false;
        }
      },

    //找回密码
    *getBackPassword({param}, { call,put }) {

        const response = yield call(getBackPassword, param);
      if(response.status==="0"){

        
        }
        else {
          message.error(response.message);
        }
    },
    //获取验证码
    *getValidateCode({param}, { call,put }) {
      const response = yield call(getValidateCode, param);
      switch(response.status){
        case "0":
          yield put({
            type: 'saveCodeStatus',
            codeStatus: true,
            });
            message.success(response.data);
            break;
        case "1":
        yield put({
            type: 'saveCodeStatus',
            codeStatus: false,
            });
          message.error(response.message);
          break;
        case "2":
        yield put({
            type: 'saveCodeStatus',
            codeStatus: false,
            });
          message.error("用户名不能为空");
          break;
        default:
        yield put({
            type: 'saveCodeStatus',
            codeStatus: false,
            });
          message.error(response.message);
          break;
        }
          
    },

  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },

    saveCodeStatus (state,{codeStatus}){
      return { ...state, codeStatus};
    },
    saveMenu (state,{menuList}){
      return { ...state, menuList};
    },
    saveOwner (state,{owner}){
      return { ...state, owner};
    },
    saveButton (state,{button}){
      return { ...state, button};
    },
    saveFunc (state,{func}){
      return { ...state, func};
    },

  },
};
