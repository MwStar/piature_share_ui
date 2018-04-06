
/**
 * Created by ll on 2018/03/01
 * 日志管理-系统日志model
 */
import {querySystemLogList,downloadLogFile,previewLogFile} from '../services/log';
import {message} from 'antd';

export default {

  namespace: 'systemlog',
  state: {
    //total:0,
   // pageNum:1,
    //文件列表
    dirList:[],
    //面包屑导航
    dirMap:[{name:'全部日志',id:0}],
    /*loading:false;*/
    //预览文件
    previewFile:'',
    isShow:false,
    title:'',
    //文件分页
    startNum:0,
    endNum:0,
    //是否结束
    over:false,
  },

  subscriptions: {
   setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if(pathname === '/system/log/sys'){
          dispatch({type:"getDirList",param:{path:'/'}});
          dispatch({type:"setBreadcrumb"});
      }
    })
    },
  },

  effects: {
    /**
     * 获取文件列表数据
     * @param call
     * @param put
     */
    *getDirList({param},{call,put}){
      

      const {data} = yield call(querySystemLogList,param);
      switch (data.status){
        case '0':
          yield put({type:'dirListSuccess',dirList:data.data});
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          yield put({type:'error',error:data.message});
          break;
      }
    },

    /**
     * 下载
     * @param call
     * @param put
     */
    *getDownloadFile({param,fileName},{call,put}){
      const result=yield call(downloadLogFile,param,fileName);
      yield put({type:'downloadFile'});
    },

    /**
     * 预览
     * @param call
     * @param put
     */
    *getPreviewFile({param},{call,put,select}){
      
      const r = yield select(({systemlog})=>{
        const {startNum, endNum,over} = systemlog;
        return {startNum, endNum,over};
      });
      param.start = r.startNum;
      param.end = r.endNum;
      const {data}=yield call(previewLogFile,param);
      switch (data.status){
        case '0':
          yield put({type:'overState',over:data.data.end});
          console.log("state里的end"+data.data.end);
          /*while(data.data.end==false){yield put({type:'doPreviewFile',previewFile:data.data.content});}*/
          if(data.data.content){          
          yield put({type:'doPreviewFile',previewFile:data.data.content});}
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          yield put({type:'error',error:data.message});
          break;
      }
    },

  },

  reducers: {
    dirListSuccess(state,{dirList}){
      return {...state,dirList};
    },
    pushBreadcrumb(state,{record}){
      state.dirMap.push(record);
      return {...state};
    },
    pullBreadcrumb(state,{idx}){
      state.dirMap.splice(idx+1,state.dirMap.length-idx-1);
      return {...state};
    },
    setBreadcrumb(state){
      return Object.assign({}, state,{dirMap:[{name:'全部日志',id:0}]});
    },
    doPreviewFile(state,{previewFile}){

      return Object.assign({}, state,{previewFile:state.previewFile+previewFile});
    },
    setPreviewFile(state){

      return Object.assign({}, state,{previewFile:''});
    },


    downloadFile(state){
      return {...state};
    },
    modalIsshow(state,{isShow}){
      return {...state,isShow};
    },
    titleShow(state,{title}){
      return {...state,title};
    },
    startState(state){
      return Object.assign({}, state,{startNum:state.startNum+1200});
    },
    endState(state){
      return Object.assign({}, state,{endNum:state.endNum+1200});
    },
    setStart(state,{start}){
      
      return Object.assign({}, state,{startNum:0});
    },
    setEnd(state,{end}){
      return Object.assign({}, state,{endNum:1200});
    },
    overState(state,{over}){
      return {...state,over};
    }

  }
};
