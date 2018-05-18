import { routerRedux } from 'dva/router';
import { userLogin ,getBackPassword ,getValidateCode , queryResource} from '../services/user';
import { focus, de_focus, collect , de_collect , gatherPicture , de_gatherPicture, comment, de_comment} from '../services/picture';
import {  getImgInfo } from '../services/user/paintings';
import {setLocalStorage, getLocalStorage , setMenuTree} from '../utils/utils';
import {message} from 'antd';
import getCountryToDo from '../utils/request';

export default {
  namespace: 'pictures',

  state: {
  	picture:{},//一个图片的信息
  	modal:false,//查看某一张图片信息框
    choosePaintings: false,//采集时选择画集的Modal
    id:'',//图片id
  },

  effects: {
   //关注
    *focus({payload}, { call, put , select}) {
      const response = yield call(focus,payload);
      if(response.status === 0 ){ 
        yield put({type:"focususer/getFocus"});
        //message.success("喜欢成功");
      }
      else{
        message.error(response.message);
      }
    },

    //取消关注
    *de_focus({payload}, { call, put , select}) {
      const response = yield call(de_focus,payload);
      if(response.status === 0 ){ 
        yield put({type:"focususer/getFocus"});
        //message.success("喜欢成功");
      }
      else{
        message.error(response.message);
      }
    },

    //收藏
    *collect({payload}, { call, put , select}) {
      const id = yield select(state => state.pictures.id);
      const value={
        id:id,
      }
      const response = yield call(collect,value);
      if(response.status === 0 ){
        yield put({type:"collectuser/getPictureCollect"});
        //message.success("喜欢成功");
      }
      else{
        message.error(response.message);
      }
    },

    //取消收藏
    *de_collect({payload}, { call, put ,select}) {
      const id = yield select(state => state.pictures.id);
      const value={
        id:id,
      }
      const response = yield call(de_collect,value);
      if(response.status === 0 ){ 
        yield put({type:"collectuser/getPictureCollect"});
        //message.success("取消喜欢成功");
      }
      else{
        message.error(response.message);
      }
    },

    //采集
    *gatherPicture({payload}, { call, put , select}) {
      const id = yield select(state => state.pictures.id);
      const value={
        picture_id:id,
        paintings_id:payload.paintings_id,
      }
      const response = yield call(gatherPicture,value);
      if(response.status === 0 ){ 
        message.success("采集成功");
         yield put({
            type: 'changeChoose',
            choosePaintings: false,
          });
      }
    },

    //取消采集
    *de_gatherPicture({payload}, { call, put , select}) {
      const id = yield select(state => state.pictures.id);
      const value={
        picture_id:id,
        paintings_id:payload.paintings_id,
      }
      const response = yield call(de_gatherPicture,value);
      if(response.status === 0 ){ 
        message.success("取消采集成功");
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

    //评论
    *comment({payload}, { call, put }) {
      const response = yield call(comment,payload);
      if(response.status === 0 ){ 
        yield put({
            type: 'viewPicture',
            payload: {id:payload.imgId},
          });
      }
    },
    //删除评论
    *de_comment({payload}, { call, put ,select}) {
      const  picture = yield select(state => state.pictures.picture);
      const response = yield call(de_comment,payload);
      if(response.status === 0 ){ 
        yield put({
            type: 'viewPicture',
            payload: {id:picture.img._id},
          });
      }
    },

  },

  reducers: {
    modalStatus(state,{modal}){
      return Object.assign({}, state,{modal:modal});
    },
    changeChoose(state,{choosePaintings}){
      return Object.assign({}, state,{choosePaintings:choosePaintings});
    },
    savePictureInfo(state, action) {
      return {
        ...state,
        picture: action.payload,
      };
    },
    saveId(state, {id}) {
      return {
        ...state,
        id: id,
      };
    },
  },
};
