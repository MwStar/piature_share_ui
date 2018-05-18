import { getAllPaintings } from '../services/picture';
import {  getImgInfo , getPictureUnderPainting  , getPaintingInfo} from '../services/user/paintings';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
import {config} from '../utils/config';
export default {
  namespace: 'paintings',
//首页---发现
  state: {
    list: [],//画集数组
    page:{pageNum: 1, total: 0, pageSize: config.PAGE_SIZE},
    modal: false,//图片信息modal显示与否
    painting:{},//某画集
    pictureList: [],//图片列表
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
    //找到所有画集---第一次
    *getAllPaintings({payload}, { call, put ,select}) {
      const page = yield select(state => state.paintings.page);
      if(!payload.page){
        payload.page = page;
      }
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getAllPaintings,payload);
      if(response.status === 0){
        yield put({
            type: 'saveList',
            payload: response.data.paintings,
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
    //找到所有画集---第一次之后
    *getPaintings({payload}, { call, put ,select}) {
      const page = yield select(state => state.paintings.page);
      if(!payload.page){
        payload.page = page;
      }
      yield put({
        type: 'pullUpStatus',
        status: 2,
      });
      const response = yield call(getAllPaintings,payload);
      if(response.status === 0){
        yield put({
            type: 'saveList',
            payload: response.data.paintings,
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

  //根据画集id找到这个画集中所有图片
    *findPaintingById({payload}, { call, put }) {
      const response = yield call(getPictureUnderPainting,payload);
      if(response.status === 0 ){ 
        yield put({
            type: 'savePictureList',
            payload: response.data,
          });
      }
    },

    //根据画集id得到这个画集信息
    *getPaintingInfo({payload}, { call, put }) {
      const response = yield call(getPaintingInfo,payload);
      if(response.status === 0 ){ 
        yield put({
            type: 'savePaintingInfo',
            payload: response.data,
          });
      }
      else{
        message.error(response.message);
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
    setPage(state, action) {
      return {
        ...state,
        page: action.payload,
      };
    },
    savePictureInfo(state, action) {
      return {
        ...state,
        picture: action.payload,
      };
    },
    savePaintingInfo(state, action) {
      return {
        ...state,
        painting: action.payload,
      };
    },
    savePictureList(state, action) {
      return {
        ...state,
        pictureList: action.payload,
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

