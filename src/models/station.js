import {message} from 'antd';
import { config } from '../utils/config';
import * as StationService from '../services/station';
import * as quicksiteService from "../services/quicksite";
import {getLocalStorage} from "../utils/utils";
export default {
  namespace: 'station',

  state: {
     data: {
        list: [],
        pagination: { pageNum: 1, total: 0, pageSize: config.PAGE_SIZE },
        addressList:[],//国家地区
        ownerList:[],//业主列表
        ownerVisibler:false,//选择业主模态框
        tableColumnsList:[],//选项列表集合
        statisticsList:{},//统计信息
        statisticsListOPS:{},//运维-统计信息
        stationMapList:[],//地图信息
    },
    loading: false,
  },

  effects: {
     *queryList({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const data = yield select(state => state.station.data);
      if (!payload || !payload.pageNum) {
        payload.pageNum = data.pagination.pageNum;
        payload.pageSize = data.pagination.pageSize;
      }
      const response = yield call(StationService.queryList, payload);
      if (response.status === '0' && response.data.data instanceof Array) {
       const pagination = { pageNum: response.data.pageNum, total: response.data.total, pageSize: response.data.pageSize };
        yield put({
          type: 'saveData',
          payload: {list:response.data.data,pagination:pagination},
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      } else {
        if(response.message) {
          message.error(response.message);
        }
      }
    },
    *deleteStationById({payload},{call,put,select}){
      const data = yield select(state => state.station.data);
      const response = yield call(StationService.deleteStationById,payload);
      const pageNum = data.pagination.pageNum;
      const pageSize = data.pagination.pageSize;
      if(response.status == "0" ){
         yield put({type:'queryList',payload:{pageNum:pageNum,pageSize:pageSize}});

         message.success("删除成功");
      }else{
        if(response.message){
          message.error(response.message);
        }
      }
    },
    *getStationAddress({payload},{call,put,select}){
      const response = yield call(StationService.getStationAddress,payload);
      if (response.status === '0' && response.data instanceof Array) {
        yield put({
          type: 'saveData',
          payload: {addressList:response.data},
        });
      } else {
        if(response.message)
        message.error(response.message);
      }
    },
    //修改电站信息
    *updateStationInfo({payload},{call,put,select}){
      const response = yield call(StationService.updateStationInfo,payload);
      if (response.status === '0') {
        const data = yield select(state => state.station.data);
        const pageNum = data.pagination.pageNum;
        const pageSize = data.pagination.pageSize;
        yield put({type:'queryList',payload:{pageNum:pageNum,pageSize:pageSize}});
      } else {
        if(response.message)
          message.error(response.message);
      }
    },
    //获取业主信息 queryOwnerByOrgan
    *queryOwner({payload},{call,put}){
      const organizationId = getLocalStorage("userInfo");
      payload={organizationId:organizationId,type:"2"};
      const response = yield call(StationService.queryOwnerByOrgan, payload);
      if(response.status == "0" && response.data instanceof Array){
        // const treeData = setAgencySelectTree(response.data,[],0);
        yield put({type:'saveData',payload:{ownerList:response.data}});
      }else{
        if(response.message){
          message.error('获取业主发生异常，'+response.message);
        }
      }
    },
    //转移业主
    *moveOwner({payload},{call,put}){
      const response = yield call(StationService.moverOwner, payload);
      if(response.status == "0"){
        message.success("转移业主成功");
        yield put({type:'saveData',payload:{ownerVisibler:false}});
      }else{
        if(response.message){
          message.error('转移业主发生异常，'+response.message);
        }
      }
    },
    //保存列表选项
    *saveTableColumns({payload},{call,put}){
      const response = yield call(StationService.saveTableColumns, payload);
      if(response.status == "0"){
        yield put({type:'queryTableColumns'});
      }else{
        if(response.message){
          message.error('保存列表选项发生异常，'+response.message);
        }
      }
    },
    //查询列表选项
    *queryTableColumns({payload},{call,put}){
      const response = yield call(StationService.queryTableColumns, {tableName:"stationList"});
      if(response.status == "0" && response.data instanceof Array){
        const column = response.data[0].cols!=""?response.data[0].cols.split(","):[];
        yield put({type:'saveData',payload:{tableColumnsList:column}});
      }else{
        if(response.message){
          message.error('查询列表选项发生异常，'+response.message);
        }
      }
    },
    //获取销售-统计信息
    *generalStatistics({payload},{call,put}){
      const response = yield call(StationService.generalStatistics);
      if(response.status == "0" ){

        yield put({type:'saveData',payload:{statisticsList:response.data}});
      }else{
        if(response.message){
          message.error('获取统计信息，'+response.message);
        }
      }
    },
    //获取运维-统计信息
    *generalStatisticsOPS({payload},{call,put}){
      const response = yield call(StationService.generalStatisticsOPS);
      if(response.status == "0" ){

        yield put({type:'saveData',payload:{statisticsListOPS:response.data}});
      }else{
        if(response.message){
          message.error('获取统计信息，'+response.message);
        }
      }
    },
    //获取地图信息
    *getStationMapList({payload},{call,put}){
        const response = yield call(StationService.getStationMapList);
      if(response.status == "0" ){

        yield put({type:'saveData',payload:{stationMapList:response.data}});
      }else{
        if(response.message){
          message.error('获取统计信息，'+response.message);
        }
      }
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    },
   changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
