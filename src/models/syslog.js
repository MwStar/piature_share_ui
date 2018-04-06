/**
 * Created by pluto on 2018/03/01
 * 平台运维人员账号管理-日志管理model
 */
import { routerRedux } from 'dva/router';
import {querySystemLog,queryAllServiceProviderList,queryAllLogLevenList} from '../services/log';
import {message } from 'antd';
export default {

  namespace: 'syslog',

  state: {
  	//业务日志列表
    list:[],
    //分页
    param: {pageNum: 0, total: 0, pageSize: 0},
    //查询条件
    appName:"",
    //所有服务商信息
    serviceProviderList:[],
    //选择的服务商名称
    selectServiceProvider:{
    		servicePlatformPrefix:""
    },
    priority:"",
    //加载中
    loading:false,
    startTime:null,
    endTime:null,
    //日志级别
    //logLevelList:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
		return history.listen(({ pathname, query }) => {
	        if(pathname === '/system/log/business'){
	        		dispatch({type:'queryAllServiceProvider',param:{}});
              dispatch({type:'querySysLog',param:{}});
              dispatch({type:'setDefaultSelectServiceProvider'});
              dispatch({type:'setStartTime',startTime:null});
	        		dispatch({type:'setEndTime',endTime:null});
	        }
        });
    }
  },

  effects: {
	*querySysLog({param},{call,put}){
		yield put({type: 'setLoading', loading: true});
		const {data} = yield call(querySystemLog,param)
		yield put({type: 'setLoading', loading: false});
		if(data.status === "0"){
			//设置回显数据
			yield put({type: 'setList', list: data.data.data});
      yield put({type: 'setPagination', param: {pageNum:data.data.pageNum,total:data.data.total,pageSize:data.data.pageSize}});
		}else{
			message.error(data.message);
		}
	},
	/**
     *得到所有服务商信息
     */
    *queryAllServiceProvider({}, { call, put ,select}){
      const {data} = yield call(queryAllServiceProviderList,{});
      if(data.status === "0"){
        //设置回显数据
        yield put({type: 'setServiceProviderList', serviceProviderList: data.data});
      }else{
        message.error(data.message);
      }
    },
    /**
     *得到所有日志级别
     */
    /**queryAllLogLevels({}, { call, put ,select}){
      const result = yield call(queryAllLogLevenList,{});
      if(result.data.status === "0"){
        //设置回显数据
        yield put({type: 'setLogLevelList', logLevelList: result.data.data});
      }else{
        message.error(result.data.message);
      }
    }*/
  },

  reducers: {
	setList(state,{list}){
      return Object.assign({}, state,{list:list});
    },
    setPagination(state,{param}){
      return Object.assign({}, state,{param:param});
    },
    setServiceProviderList(state,{serviceProviderList}){
      return Object.assign({}, state,{serviceProviderList:serviceProviderList});
    },
    setSelectServiceProvider(state,{selectServiceProvider}){
    		return Object.assign({}, state,{selectServiceProvider:selectServiceProvider});
    },
    setDefaultSelectServiceProvider(state){
      return Object.assign({}, state,{selectServiceProvider:{servicePlatformPrefix:''}});
    },
    setLoading(state,{loading}){
    		return Object.assign({},state,{loading:loading})
    },
    setStartTime(state,{startTime}){
    		return Object.assign({},state,{startTime:startTime})
    },
    setEndTime(state,{endTime}){
    		return Object.assign({},state,{endTime:endTime})
    },
    setSelectPriority(state,{priority}){
    		return Object.assign({},state,{priority:priority})
    },
    setLogLevelList(state,{logLevelList}){
    		return Object.assign({},state,{logLevelList:logLevelList})
    },
    setPageNum(state,{pagination}){
    		return Object.assign({},state,{pagination:pagination})
    }
  }
};
