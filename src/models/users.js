import { queryUsers , daleteUser , updateUser , getUser ,addtUser ,queryRoles ,queryAgency, queryProprietor} from '../services/system';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {config} from '../utils/config';

import {setCheckobxData ,setOfficeSelectTree} from '../utils/utils';
export default {
  namespace: 'users',

  state: {
    list: [],//所有用户列表
    page:{pageNum: 1, total: 0, pageSize: config.PAGE_SIZE},
    loading: true,
    formValues:{},//查询表单域
    userList :{},//用户信息列表
    editmodal:false,
    isResetForm:false,//重置表单
  },

  effects: {
    *toLogin({}, { put }){
      yield put(routerRedux.push('/'));
    },
    *usersList({payload}, { call, put , select }) {
      const page = yield select(state => state.users.page);
      if(!payload.page){
        payload.page = page;
      }
      const response = yield call(queryUsers,payload);
      if(response.status === 0){
        yield put({
          type: 'ListSuccess',
          payload: response.data.user,
        });
       yield put({
          type: 'setPage',
          page: response.data.page,
          });
        yield put({
          type: 'changeLoading',
          payload: false,
          });
      }
      else{
        message.error(response.message);
      }
    },
    //删除用户
    *daleteUser({payload}, { call, put ,select}) {
      const formValues = yield select(state => state.users.formValues);
      const page = yield select(state => state.users.page);
      const value = {
        page:page,
        query:formValues,
      }
      const response = yield call(daleteUser,payload);
      switch (response.status){
        case 0:
          //提示
          message.success("删除用户成功！");
          yield put({ type: 'usersList' ,payload:value});
          break;
        case 100:
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },

    //重置密码
    *resetPass({payload}, { call, put ,select}) {
      const formValues = yield select(state => state.users.formValues);
      const page = yield select(state => state.users.page);
      const value = {
        page:page,
        query:formValues,
      }
      const response = yield call(daleteUser,payload);
      switch (response.status){
        case 0:
          //提示
          message.success("重置密码成功！");
          yield put({ type: 'usersList' ,payload:value});
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },

    //更新用户
    *updateUser({payload}, { call, put , select}) {
      const formValues = yield select(state => state.users.formValues);
      const page = yield select(state => state.users.page);
      const value = {
        page:page,
        query:formValues,
      }
      const response = yield call(updateUser,payload);
      switch (response.status){
        case '0':
          message.success("更新用户成功！");
          yield put({
            type: 'editmodalStatus',
            editmodal:false
          });
          yield put({ type: 'usersList' ,payload:value});
          yield put({ type: 'resetForm',isResetForm:true}); 
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },
    //获取用户根据id
    *getUserbyId({payload}, { call, put }) {
      const response = yield call(getUser,payload);
      switch (response.status){
        case '0':
          yield put({
          type: 'userListSuccess',
          payload: response.data,
        });
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },

    //增加用户
    *addUser({payload}, { call, put ,select}) {
      const formValues = yield select(state => state.users.formValues);
      
      const response = yield call(addtUser,payload);
      switch (response.status){
        case 0:
          message.success("添加用户成功！");
           yield put({
            type: 'editmodalStatus',
            editmodal:false
          });
           yield put({ type: 'usersList' ,payload:formValues});
          yield put({ type: 'resetForm',isResetForm:true});   
          break;
          case 1:
          message.error(response.message);
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },

     
  },

  reducers: {
    ListSuccess(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    userListSuccess(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    setFormValue(state,{formValues}){
      return { ...state, formValues};
    },
    setPage(state,{page}){
      return Object.assign({}, state,{page:page});
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    editmodalStatus(state,{editmodal}){
      return Object.assign({}, state,{editmodal:editmodal});
    },
    resetForm(state,{isResetForm}){
      return { ...state, isResetForm};
    },

  },

};
