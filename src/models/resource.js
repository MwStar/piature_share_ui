import { thirdTreeCreate, thirdTreeUpdate, thirdTreeList, thirdTreeDeleteConditional } from '../services/resourceManager';
import { queryResource} from '../services/user';
import { message } from 'antd';
import { routerRedux } from 'dva/router';


export default {
  namespace: 'thirdtreemodel',

  state: {
    status: '',
    list: [],
    selectTree: null,
    isAdd: false,
    isUpdate: false,
    pagination: { current: 1, total: 0, pageSize: 10 },
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    editmodal: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/system/resource') {
          dispatch({ type: 'list', param: {} });
        }
      });
    },
  },

  effects: {
    *toLogin({}, { put }) {
      yield put(routerRedux.push('/'));
    },
    *list({ param }, { call, put }) {
      yield put({ type: 'showLoading', showLoading: true });
      const { data, status } = yield call(thirdTreeList, param);
      switch (status) {
        case '0':
          yield put({
            type: 'listSuccess',
            data: data,
            showLoading: false,
          });
          break;
        case '100':
          yield put({ type: 'toLogin' });
          break;
        default:
          message.error(data.message);
          break;
      }
    },
    
    *update({ param }, { call, put }) {
      const { data, status } = yield call(thirdTreeUpdate, param);
      switch (status) {
        case '0':
          message.success('修改菜单成功！');
          yield put({
            type: 'list',
            param: { },
          });
          yield put({type:'login/queryResource'});
          break;        
        case '100':
          yield put({ type: 'toLogin' });
          break;
        default:
          message.error(data.message);
          break;
      }
    },
    *delete({ param }, { select, call, put }) {
      const { data, status } = yield call(thirdTreeDeleteConditional, param);
      switch (status) {
        case '0':
          message.success('删除菜单成功！');
          yield put({type:'login/queryResource'});
          yield put({
            type: 'list',
            param: {},
          });
          break;
        case '100':
          yield put({ type: 'toLogin' });
          break;
        default:
          message.error("删除错误");
          break;
      }
    },
    *create({ param }, { call, put }) {
      const { data, status } = yield call(thirdTreeCreate, param);
      switch (status) {
        case '0':
          message.success('添加菜单成功！');
          yield put({type:'login/queryResource'});
          yield put({
            type: 'list',
            param: {},
          });
          break;
        case '100':
          yield put({ type: 'toLogin' });
          break;
        default:
          message.error(data.message);
          break;
      }
    },
  },

  reducers: {
    listSuccess(state, { data, showLoading }) {
      return Object.assign({}, state, { list: data, showLoading });
    },
    showLoading(state, { showLoading }) {
      return Object.assign({}, state, { showLoading });
    },
    setSelectTree(state, { selectTree }) {
      return Object.assign({}, state, { selectTree });
    },
    setisAdd(state, { isAdd }) {
      return Object.assign({}, state, { isAdd });
    },
    setisUpdate(state, { isUpdate }) {
      return Object.assign({}, state, { isUpdate });
    },
  },

};
