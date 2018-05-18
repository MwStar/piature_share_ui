import { userRegister } from '../services/user';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({payload}, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      console.log("payload--",payload);
      const response = yield call(userRegister,payload);
      if(response.status === 0){
        yield put({
          type: 'registerHandle',
          payload: response,
        });
        message.success(response.message);
        yield put(routerRedux.push({ pathname: '/user/login' }));          
      }

       else{
          message.error(response.message);
        }
      yield put({
          type: 'changeSubmitting',
          payload: false,
        });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
