import * as stationDevice from '../services/stationDeviceDetail';
import { message } from 'antd';
import { config } from '../utils/config';

export default {
  namespace: 'stationDeviceDetail',
  state: {
    data: {
      list: [],
      pagination: { pageNum: 1, total: 0, pageSize: config.PAGE_SIZE },
    },
    page: { pageNum: 1, pageSize: config.PAGE_SIZE },
    editmodal: false,
    loading: false,
    checkList: {},
    historyList: [],
  },
  effects: {
    *DTUList({ payload }, { call, put, select }) { // 获取DTU列表数据
      const data = yield select(state => state.stationDeviceDetail.data);
      if (!payload || !payload.pageNum) {
        payload.pageNum = data.pagination.pageNum;
        payload.pageSize = data.pagination.pageSize;
      }
      const result = yield call(stationDevice.queryDTU, payload);
      if (result.status === '0') {
        data.list = result.data.data;
        data.pagination = { pageNum: result.data.pageNum == 0 ? 1 : result.data.pageNum, total: result.data.total, pageSize: result.data.pageSize };
        yield put({
          type: 'saveList',
          payload: data,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      } else {
        message.error(data.message);
      }
    },
    *repeaterList({ payload }, { call, put, select }) { // 获取中继器列表数据
      const data = yield select(state => state.stationDeviceDetail.data);
      if (!payload || !payload.pageNum) {
        payload.pageNum = data.pagination.pageNum;
        payload.pageSize = data.pagination.pageSize;
      }
      const result = yield call(stationDevice.queryRepeater, payload);
      if (result.status == 0) {
        data.list = result.data.data;
        data.pagination = { pageNum: result.data.pageNum, total: result.data.total, pageSize: result.data.pageSize };
        yield put({
          type: 'saveList',
          data,
        });
      } else {
        message.error(data.message);
      }
    },
    *microList({ payload }, { call, put, select }) { // 获取微逆列表数据
      const data = yield select(state => state.stationDeviceDetail.data);
      if (!payload || !payload.pageNum) {
        payload.pageNum = data.pagination.pageNum;
        payload.pageSize = data.pagination.pageSize;
      }
      const result = yield call(stationDevice.queryMicro, payload);
      if (result.status == 0) {
        data.list = result.data.data;
        data.pagination = { pageNum: result.data.pageNum, total: result.data.total, pageSize: result.data.pageSize };
        yield put({
          type: 'saveList',
          data,
        });
      } else {
        message.error(data.message);
      }
    },
    *delete({ payload }, { call, put, select }) { // 删除关系
      const result = yield call(stationDevice.deleteRelation, payload);
      yield put({ type: 'reload', params: payload });
      if (result.status && result.status == 0) {
        message.success(result.message);
      } else {
        message.error(result.message);
      }
    },
    *update({ payload }, { call, put, select }) { // 替换关系
      const res = yield call(stationDevice.updateRelation, payload);
      if (res.status && res.status == '0') {
        yield put({ type: 'reload', params: payload });
        message.success(res.message);
      } else {
        message.error(res.message);
      }
      yield put({
        type: 'editmodalStatus',
        editmodal: false,
      });
    },
    *dtuOperate({ payload }, { call, put, select }) { // dtu操作，重启和固件升级
      const res = yield call(stationDevice.dtuOperation, payload);
      const params = { type: '3' };
      if (res.status && res.status == '0') {
        yield put({ type: 'reload', params });
        message.success(res.message);
      } else {
        message.error(res.message);
      }
      yield put({
        type: 'editmodalStatus',
        editmodal: false,
      });
    },
    *deviceOperate({ payload }, { call, put, select }) { // 设备操作
      const subPayload = {
        dtuId: payload.dtuId,
        eqIds: payload.eqIds,
        orderFlag: payload.orderFlag,
      };
      const res = yield call(stationDevice.deviceOperation, subPayload);
      const params = { type: payload.type };
      if (res.status && res.status == '0') {
        yield put({ type: 'reload', params });
        message.success(res.message);
      } else {
        message.error(res.message);
      }
      yield put({
        type: 'editmodalStatus',
        editmodal: false,
      });
    },
    *queryDeviceHistory({ payload }, { call, put, select }) { // 历史替换记录查询
      const res = yield call(stationDevice.queryHistory, payload);
      if (res.status && res.status == '0') {
        yield put({
          type: 'saveHistory',
          payload: res.data,
        });
      } else {
        message.error(res.message);
      }
    },
    *reload(action, { put, select }) {
      const deviceType = action.params.type;
      console.log(deviceType);
      const pageNum = yield select(state => state.stationDeviceDetail.pageNum);
      const pageSize = yield select(state => state.stationDeviceDetail.pageSize);
      if (deviceType == '3') {
        yield put({ type: 'DTUList', payload: { pageNum, pageSize } });
      } else if (deviceType == 'repeater') {
        yield put({ type: 'repeaterList', payload: { pageNum, pageSize } });
      } else if (deviceType == 'micro') {
        yield put({ type: 'microList', payload: { pageNum, pageSize } });
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        ...action,
      };
    },
    saveHistory(state, action) {
      return {
        ...state,
        historyList: action.payload,
      };
    },
    editmodalStatus(state, { editmodal }) {
      return Object.assign({}, state, { editmodal });
    },
  },
};
