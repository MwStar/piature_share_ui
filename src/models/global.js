import { queryNotices , readNotices, clearAllNotices} from '../services/user';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    fetchingNotices: false,
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const response = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: response.data.messages_unread,
      });
      /*yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });*/
    },
    //已读消息--一条
    *clearOneNotices({ payload }, { call, put, select }) {
      const response = yield call(readNotices,payload);
      if(response.status === 0){
        yield put({
          type: 'fetchNotices',
        });
      }
      else{
        message.error(response.message);
      }
      /*const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });*/
    },
    //清空消息-----将所有消息设置为已读
    *clearNotices({ payload }, { call, put, select }) {
      const notices = yield select(state => state.global.notices);
      const data = yield call(clearAllNotices,{message:notices});
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      //onst count = yield select(state => state.global.notices.length);
      /*yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });*/
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: [],
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
