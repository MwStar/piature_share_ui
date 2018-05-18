import { createPainting, updatePainting, getPaintingInfo, getAllPaintings, getPaintingsById,
  getPictureUnderPainting, uploadAndAddTopaintings, getImgInfo ,de_Painting,updateImgInfo,
  updateToPaintings,daleteImg} from '../services/user/paintings';
import { de_gatherPicture } from '../services/picture';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'paintingsuser',
//用户---画集
  state: {
    list: [],//画集（用户画集展示的）
    paintingsList: [],//画集（用户上传图片时选择画集）
    loading: false,
    painting: {}, //某个画集
    uploadVisible: false,//上传文件的modal
    modal: false,//编辑画集信息或者新建画集填写信息
    pictureList: [],//图片列表
    picture: {},//一张图片信息
    picturePainting:'',//此图所属画集
    isResetForm:'',//是否重置表单
    oldPaintngs:'',//修改所属画集时，保存原所属画集
  },

  effects: {
    *reload( {payload} , { call , put } ){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
    },
    //根据用户id找到用户所有画集
    *getAllPaintings({payload}, { call, put }) {
      if(payload){
        var response = yield call(getPaintingsById,payload);
      }
      else{
        var response = yield call(getAllPaintings,payload);
      }
      if(response.status === 0){ 
        yield put({
            type: 'saveList',
            payload: response.data,
          });
        let value = [];
        response.data.map((item)=>{
          value.push({id:item._id,title:item.title,picture:item.topic});
        })
        yield put({
            type: 'savePaintingsList',
            payload: value,
          });
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
    //根据画集id修改这个画集信息
    *updatePainting({payload}, { call, put }) {
      const response = yield call(updatePainting,payload);
      if(response.status === 0 ){ 
        message.success("修改成功!");
        yield put({
            type: 'getAllPaintings',
          });
        yield put({type:'modalStatus',modal:false});
      }
      else{
        message.error(response.message);
      }
    },

    //根据画集id想得到画集信息
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
            payload: response.data.img,
          });
      }
    },
    //上传图片并保存信息
    *uploadImgAndSave({payload}, { call, put }) {
      const response = yield call(uploadAndAddTopaintings,payload);//储存这张照片
      if(response.status === 0 ){
        message.success("上传成功");
          yield put(routerRedux.push('/owner/painting/'+response.data.id));//跳转画集
        }
      else{
        message.error("上传失败");
        yield put({
            type: 'reload',
          });
      }
    },

    //修改已上传的图片信息
    *updateImgInfo({payload}, { call, put }) {
      const response = yield call(updateImgInfo,payload);//
      const userType = getLocalStorage("userType");
      if(response.status === 0 ){
        message.success("修改成功");
        if(userType === '2'){
          yield put(routerRedux.push('/picture/manage'));//跳转到图片管理
        }else{
          yield put(routerRedux.push('/owner/painting/'+payload.new_p));//跳转画集
        }
        }
      else{
        message.error("修改失败");
      }
    },

    //修改图片所属画集
    *updateToPaintings({payload}, { call, put }) {
      const response = yield call(updateToPaintings,payload);//
      if(response.status === 0 ){
        message.success("修改成功");
          yield put(routerRedux.push('/owner/painting/'+response.data.id));//跳转画集
        }
      else{
        message.error("修改失败");
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

    //取消采集
    *de_gatherPicture({payload}, { call, put , select}) {
      const response = yield call(de_gatherPicture,payload);
      if(response.status === 0 ){ 
        message.success("移除采集成功");
        yield put(routerRedux.push('/owner/paintings'));//跳转画集
      }
    },

    //创建画集 author_id---用户id,,title----画集名称，content---画集描述，
    *createPaintings({payload}, { call, put }) {
      const response = yield call(createPainting,payload);
      if(response.status=== 0 ){ 
        message.success("创建画集成功");
        yield put({
            type: 'getAllPaintings',
          });
        yield put({type:'modalStatus',modal:false});
      }
      else{
        message.error("创建画集失败");
      }
    },

    //删除画集 id
    *de_Painting({payload}, { call, put }) {
      const response = yield call(de_Painting,payload);
      if(response.status=== 0 ){ 
        message.success("删除画集成功");
        yield put({
            type: 'getAllPaintings',
          });
        yield put({type:'modalStatus',modal:false});
      }
      else{
        message.error("删除画集失败");
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
    savePaintingsList(state, action) {
      return {
        ...state,
        paintingsList: action.payload,
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
    savePictureInfo(state, action) {
      return {
        ...state,
        picture: action.payload,
      };
    },
    savePicturePaingting(state, id) {
      return {
        ...state,
        picturePainting: id,
      };
    },
    saveOldPaingtings(state, {id}) {
      return {
        ...state,
        oldPaintngs: id,
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
    changeUploadVisible (state , uploadVisible){
      return {
        ...state,
        uploadVisible:uploadVisible,
      }
    },
    resetForm(state,{isResetForm}){
      return { ...state, isResetForm};
    },
  },
};
