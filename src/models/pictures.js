import { routerRedux } from 'dva/router';
import { userLogin ,getBackPassword ,getValidateCode , queryResource} from '../services/user';
import {setLocalStorage, getLocalStorage , setMenuTree} from '../utils/utils';
import {message} from 'antd';
import getCountryToDo from '../utils/request';

export default {
  namespace: 'pictures',

  state: {
  	list:[],//图片数组
  	picture:{},//一个图片的信息
  	modal:false,//查看某一张图片信息框
  },

  effects: {
   

  },

  reducers: {
    modalStatus(state,{modal}){
      return Object.assign({}, state,{modal:modal});
    },
    savePicture(state,{painting}){
      return Object.assign({}, state,{picture:picture});
    },

  },
};
