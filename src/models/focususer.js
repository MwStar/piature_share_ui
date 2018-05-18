
import { getFocus , getFocusById} from '../services/user/user';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'focususer',
//关注用户列表
  state: {
    list: [],//所有关注人
    modal: false,//图片信息modal显示与否
    loading: false,//加载
  },

  effects: {
    *reload( {payload} , { call , put } ){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
    },
    //所有关注人列表
    *getFocus({payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      if(payload){
        var response = yield call(getFocusById,payload);
      }
      else{
        var response = yield call(getFocus,payload);
      }
      let value = [];
      if(response.status === 0){
        response.data.map((item)=>{
          value.push(item.author_id);
        })
        yield put({
            type: 'saveList',
            payload: value,
          });
        yield put({
        type: 'changeLoading',
        payload: false,
      });
      }
    },

  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    modalStatus(state,{modal}){
      return Object.assign({}, state,{modal:modal});
    },
  },
};
