import { userInfo , getUserById} from '../services/user';
import {setLocalStorage, getLocalStorage} from '../utils/utils';
import {message} from 'antd';
export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},//当前用户
    user: {},//用户
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(userInfo);
      if(response.status===0){
        setLocalStorage("userinfo", response.data || {});
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
    *getUserById({payload}, { call, put }) {
      const response = yield call(getUserById,payload);
      if(response.status===0){
        yield put({
          type: 'saveUser',
          payload: response.data,
        });
      }
    },
    
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    saveUser(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
