
import { getAll } from '../services/picture';
import {  getImgInfo } from '../services/user/paintings';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
import {config} from '../utils/config';
export default {
  namespace: 'allpicture',
//首页---
  state: {
    list: [],//所有图片
    page:{pageNum: 1, total: 0, pageSize: config.PAGE_SIZE},
    modal: false,//图片信息modal显示与否
    picture: {},//一张图片信息
    loading: false,//加载
    pullUpStatus: 1,//往下滚动
  },

  effects: {
    *reload( {payload} , { call , put } ){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
    },
    //所有图片---第一次加载
    *getAllPicture({payload}, { call, put ,select}) {
      const page = yield select(state => state.allpicture.page);
      if(!payload.page){
        payload.page = page;
      }
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getAll,payload);
      if(response.status === 0){
        yield put({
            type: 'saveList',
            payload: response.data.img,
          });
        yield put({
            type: 'setPage',
            payload: response.data.page,
          });
        yield put({
        type: 'changeLoading',
        payload: false,
      });
      }
    },

    //所有图片----第一次之后的加载
    *getPicture({payload}, { call, put ,select}) {
      const page = yield select(state => state.allpicture.page);
      if(!payload.page){
        payload.page = page;
      }
      yield put({
        type: 'pullUpStatus',
        status: 2,
      });
      const response = yield call(getAll,payload);
      if(response.status === 0){
        yield put({
            type: 'saveList',
            payload: response.data.img,
          });
        yield put({
            type: 'setPage',
            payload: response.data.page,
          });
        if(page.pageNum*page.pageSize >= page.total){
          yield put({
          type: 'pullUpStatus',
          status: 4,
        });
        }
        else{
          yield put({
          type: 'pullUpStatus',
          status: 3,
        });
        }
      }
    },

    //根据图片id查看这个图片信息
    *viewPicture({payload}, { call, put }) {
      const response = yield call(getImgInfo,payload);
      if(response.status === 0 ){ 
        yield put({
            type: 'savePictureInfo',
            payload: response.data,
          });
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    savePictureInfo(state, action) {
      return {
        ...state,
        picture: action.payload,
      };
    },
    setPage(state, action) {
      return {
        ...state,
        page: action.payload,
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
    pullUpStatus(state,{status}){
      return Object.assign({}, state,{pullUpStatus:status});
    },
  },
};
