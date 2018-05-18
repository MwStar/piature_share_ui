
import { getAllNew } from '../services/picture';
import {  getImgInfo , daleteImg , checked } from '../services/user/paintings';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
import {config} from '../utils/config';
export default {
  namespace: 'new',
//首页---最新
  state: {
    list: [],//所有图片
    page:{pageNum: 1, total: 0, pageSize: config.PAGE_SIZE},
    modal: false,//图片信息modal显示与否
    picture: {},//一张图片信息
    loading: false,//加载
    pullUpStatus: 1,//往下滚动
    formValues:{},//查询
  },

  effects: {
    *reload( {payload} , { call , put } ){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
    },
    //获取最新图片---first
    *getAllPicture({payload}, { call, put ,select}) {
      const page = yield select(state => state.new.page);
      if(!payload.page){
        payload.page = page;
      }
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getAllNew,payload);
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
    //获取最新图片----after
    *getPicture({payload}, { call, put, select }) {
      const page = yield select(state => state.new.page);
      if(!payload.page){
        payload.page = page;
      }
      yield put({
        type: 'pullUpStatus',
        status: 2,
      });
      const response = yield call(getAllNew,payload);
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

    //删除图片
    *daleteImg({payload}, { call, put }) {
      const response = yield call(daleteImg,payload);//
      if(response.status === 0 ){
        message.success("删除成功");
        }
      else{
        message.error("删除失败");
      }
    },

    //审核图片
    *checked({payload}, { call, put }) {
      const response = yield call(checked,payload);//
      if(response.status === 0 ){
          yield put({
            type: 'getAllPicture',
            payload: {query:{'status':false}},
          });
        }
      else{
        message.error("删除失败");
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
    setFormValue(state,{formValues}){
      return { ...state, formValues};
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
