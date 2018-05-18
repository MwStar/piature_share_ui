import { getAllNew ,doTag} from '../services/picture';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {config} from '../utils/config';

import {setCheckobxData ,setOfficeSelectTree} from '../utils/utils';
export default {
  namespace: 'tag',

  state: {
    list: [],//所有图片列表
    page:{pageNum: 1, total: 0, pageSize: config.PAGE_SIZE},
    loading: true,
    picture :{},//图片信息
    modal:false,
  },

  effects: {
    *toLogin({}, { put }){
      yield put(routerRedux.push('/'));
    },
    //获取未打标签的图片
    *getAllPicture({payload}, { call, put ,select}) {
      const page = yield select(state => state.tag.page);
      if(!payload.page){
        payload.page = page;
      }
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const value = {
        ...payload,
        query:{'dotag':false},
      }
      const response = yield call(getAllNew,value);
      if(response.status === 0){
        yield put({
            type: 'ListSuccess',
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


    //打标签
    *doTag({payload}, { call, put , select}) {
      const page = yield select(state => state.tag.page);
      const response = yield call(doTag,payload);
      if(response.status === 0){
        yield put({type:'editmodalStatus',modal:false});
        yield put({ type: 'getAllPicture' ,payload:{page:page}});
        message.success(response.message);
      }else{

        message.error(response.message);
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
    savePicture(state, action) {
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
    editmodalStatus(state,{modal}){
      return Object.assign({}, state,{modal:modal});
    },

  },

};
