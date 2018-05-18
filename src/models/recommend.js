
import { getAllByQuery } from '../services/picture';
import {  getImgInfo } from '../services/user/paintings';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'recommend',
//推荐
  state: {
    list: [],//所有图片
    loading: false,//加载
  },

  effects: {

    //根据关键词找图片
    *getAllPicture({payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getAllByQuery,payload);
      if(response.status === 0){
        yield put({
            type: 'saveList',
            payload: response.data.topic,
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
  },
};
