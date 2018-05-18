import { queryCount , getDownload} from '../services/system';

export default {
  namespace: 'chart',

  state: {
    count:{},//统计数据
    download:[],//下载量
    data:[],//下载量，整理数据后的
    loading:false,//
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCount);
      if(response.status === 0){
        yield put({
          type: 'saveCount',
          payload: response.data,
        });       
      }
    },

    *get({payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getDownload,payload);
      if(response.status === 0){
        yield put({
          type: 'saveDownload',
          payload: response.data,
        });
        let value = [];
        response.data.map((item)=>{
           value.push(
            {x:item._id,
            y:item.number,}
          );
        });
        yield put({type: 'saveData',payload: value});

        yield put({
        type: 'changeLoading',
        payload: false,
      });

      }
    },

  },

  reducers: {
    saveCount(state, { payload }) {
      return {
        ...state,
        count: payload,
      };
    },
    saveDownload(state, { payload }) {
      return {
        ...state,
        download: payload,
      };
    },
    saveData(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },

    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};
