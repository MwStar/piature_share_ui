import * as stationReplay from '../services/stationReplay';
import { message } from 'antd';


export default {
  namespace: 'stationReplay',

  state: {
    list: [], // table列表
    lineData: [],
  },
  effects: {
    *getAllLineData({ payload }, { call, put }) { // 获取所有经销商列表
      const response = yield call(stationReplay.queryLineData, payload);
      console.log(response)
      if (response.status == '0') {
        yield put({
          type: 'setLineData',
          payload: response.data,
        });
      }else{
        message.error(res.message);
      }
    },

  },
  reducers: {
    setLineData(state, action){
      return {
        ...state,
        lineData: action.payload,
      };
    },
  },

};
