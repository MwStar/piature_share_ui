import {message} from 'antd';
import { routerRedux } from 'dva/router';
import { setting ,userInfo, rePassword} from '../services/user';
import { getLocalStorage} from '../utils/utils';
export default {
  namespace: 'setting',

  state: {
    info: {},//用户信息
    disabled:true,//是否可编辑，初始化为不可编辑
    visible:false,//修改密码框显示与隐藏
    key:1,//修改的是个人信息还是密码，1为个人信息，2为密码
    loading: false,
  },

  effects: {
    *fetch({playload}, { call, put }) {
      const response = yield call(userInfo);
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    //修改信息
    *setting({payload}, { call, put ,select}) {
      const key = yield select(state => state.setting.key);
      const userType = getLocalStorage('userType');
      const response = yield call(setting,payload);
      if(response.status === 0){
          message.success("修改用户信息成功");
          if(userType === "1"){yield put(routerRedux.push('/owner/paintings'));}
          else{yield put(routerRedux.push('/statistics'));}
          yield put({type: 'user/fetchCurrent'});
      }
      else{
        message.error(response.message);
      }
    },

    //修改密码
    *settingPass({payload}, { call, put ,select}) {
      const key = yield select(state => state.setting.key);
      const userType = getLocalStorage('userType');
      const response = yield call(rePassword,payload);
      if(response.status === 0){
      		message.success("修改密码成功");
      		yield put(routerRedux.push('/user/login'));
          yield put({type: 'user/isVisible',visible:false});
      	
      }
      else{
      	message.error(response.message);
      }
    },


    
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    isDisabled(state,{disabled}){
      return { ...state, disabled};
    },
    isVisible(state,{visible}){
      return { ...state, visible};
    },
    setKey(state,{key}){
      return { ...state, key};
    },
  },
};
