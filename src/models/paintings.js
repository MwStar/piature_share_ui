import { routerRedux } from 'dva/router';
import { userLogin ,getBackPassword ,getValidateCode , queryResource} from '../services/user';
import {setLocalStorage, getLocalStorage , setMenuTree} from '../utils/utils';
import {message} from 'antd';
import getCountryToDo from '../utils/request';

export default {
  namespace: 'paintings',

  state: {
  	list:[],//画集数组
  	painting:{},//一个画集的信息
  	modal:false,//新增/编辑画集框
  },

  effects: {
   

  },

  reducers: {
    modalStatus(state,{modal}){
      return Object.assign({}, state,{modal:modal});
    },
    savePainting(state,{painting}){
      return Object.assign({}, state,{painting:painting});
    },

  },
};
