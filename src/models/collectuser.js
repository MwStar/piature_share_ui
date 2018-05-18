
import { getPictureCollect , getPictureCollectById} from '../services/user/pictures';
import {  getImgInfo } from '../services/user/paintings';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'collectuser',
//收藏图片---（用户）
  state: {
    list: [],//所有图片
    modal: false,//图片信息modal显示与否
    picture: {},//一张图片信息
    loading: false,//加载
  },

  effects: {
    *reload( {payload} , { call , put } ){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
    },
    //所有图片
    *getPictureCollect({payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      if(payload){
        var response = yield call(getPictureCollectById,payload);
      }
      else{
        var response = yield call(getPictureCollect,payload);
      }
      let value = [];
      if(response.status === 0){
        response.data.map((item)=>{
          value.push(item.topic_id);
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
        list: action.payload,
      };
    },
    savePictureInfo(state, action) {
      return {
        ...state,
        picture: action.payload,
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
