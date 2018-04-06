import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as quicksiteService from '../services/quicksite';
import {getLocalStorage,setAgencySelectTree,getOwnerByAgencyId,setDeviceTree,alertMessage} from '../utils/utils';
export default {
  namespace: 'quicksite',

  state: {
    data:{
      // originalList:[],
      // agencyList:[],//经销商
      ownerList:[],//业主
      timeZone:[],//时区
      assemblyList:[],//组件
      places:{},//地图地址
      markers:[],//地图经纬度
      stationInfo:{},//电站信息
      equipeCapacitor:0,//装机容量
      moduleNum:0,//装机数量
      ownerVisibler:false,//业主选择模态框
      userInfo:{},//业主下第一个用户基本信息
      ownerFirstName:"",//业主名
      ownerLastName:"",//业主姓
      stationName:"",//电站名称
      stationId:0,//电站id
    },
    step2:{
      deviceRelationList:[],//设备关系原始数据
      dataSource:[],//封装tree 数据格式
      deviceRecord:{},//单击树节点保存当前节点对象
      oprateType:0,//0:绑定关系  3:修改dtu序列号 2：修改中继器序列号 1:修改微逆序列号，界面元素控制
    },
    layout:{
        originalDeviceList:[],//原始设备集合
        treeDeviceList:[],//树节点显示数据
    },
    mapData:{
      fileList:[],//安装图列表
    }
  },
  effects: {
    *queryOwner({payload},{call,put}){
        const organizationId = getLocalStorage("userInfo");
        payload={organizationId:organizationId,type:"2"};
        const response = yield call(quicksiteService.queryOwnerByOrgan, payload);
        if(response.status == "0" && response.data instanceof Array){
           // const treeData = setAgencySelectTree(response.data,[],0);
            yield put({type:'saveData',payload:{ownerList:response.data}});
        }else{
          if(response.message){
            alertMessage('获取业主发生异常，'+response.message,"error");
          }
        }
    },
    *queryTimeZone({},{call,put}){
        const response = yield call(quicksiteService.queryTimeZone);
        if(response.status == "0" && response.data instanceof Array){
          yield put({type:'saveData',payload:{timeZone:response.data}});
        }else{
          if(response.message){
            alertMessage('获取时间区域发生异常，'+response.message,"error");
          }
       }
    },
    *queryAssemblyList({},{call,put}){
        const response = yield call(quicksiteService.queryAssemblyList);
        if(response.status == "0" && response.data instanceof Array){
          yield put({type:'saveData',payload:{assemblyList:response.data}});
        }else{
          if(response.message){
            alertMessage('获取组件型号发生异常，'+response.message,'error');
          }
        }
    },
    *getDeviceRelationList({payload},{call,put,select}){
      const response = yield call(quicksiteService.getDeviceRelationList,payload);
      if(response.status == "0" && response.data instanceof Array){

          const data = setDeviceTree(response.data,[],payload.id);

          yield put({type:'saveStep2',payload:{deviceRelationList:response.data,dataSource:data}});
        }else{
          if(response.message){
            alertMessage('获取设备关系发生异常，'+response.message,'error');
          }
        }
    },
    *queryStationInfoById({payload},{call,put,select}){

      const response = yield call(quicksiteService.getStationById,payload);
      if(response.status == "0" && response.data){
        yield put({type:'queryOwnerByAgencyId',payload:response.data.regionId});
          const places = {address:response.data.address,latitude:response.data.latitude,longitude:response.data.longitude};
          const markers = [{
            position: {lat:Number(response.data.latitude),lng:Number(response.data.longitude)}
        }];
        let userInfo = response.data.userInfo;
        if(!userInfo){
          userInfo ={};
        }
        if(response.data.ownerInfo){
          userInfo.firstName = response.data.ownerInfo.firstName;
          userInfo.lastName = response.data.ownerInfo.lastName;
          userInfo.ownerId = response.data.ownerInfo.id;
        }

          yield put({type:'saveData',payload:{stationInfo:response.data,places:places,markers:markers,
                  equipeCapacitor:response.data.equipeCapacitor,
                  moduleNum:"",userInfo:userInfo,
                  ownerFirstName:response.data.ownerInfo.firstName,
                  ownerLastName:response.data.ownerInfo.lastName,
                  stationName:response.data.fullName,
                  stationId:response.data.id,
                }});
        const mapsList = response.data.stationMaps;
        let arr =[];
        mapsList && mapsList.map((item,index)=>{
          arr.push({url:item.mapPath,uid:index});
        })
         yield put({type:'saveMapData',payload:{fileList:arr}});



      }else{
        if(response.message){
          alertMessage('获取电站基本信息发生异常，'+response.message,'error');
        }
      }
    },
    *getUserInfoByOwnerId({payload},{call,put,select}){

      const response = yield call(quicksiteService.getUserInfoByOwnerId,{organizationIds:payload.organizationIds});
      if(response.status == "0" && response.data){
        let user=response.data[0];
        if(!user)user={};
        user.firstName = payload.ownerRecord.firstName;
        user.lastName = payload.ownerRecord.lastName;
        user.ownerId =payload.ownerRecord.id;
        yield put({type:'saveData',payload:{userInfo:user,ownerVisibler:false}});
      }else{
        if(response.message){
          alertMessage('根据业主ID 获取用户基本信息，'+response.message,"error");
        }
      }
    },

    //保存电站信息
    *saveStationInfo({ payload },{ call,put ,select}){
      const response = yield call(quicksiteService.updateStationBaseInfo,payload);
      const {stationId , stationName } = yield select(select=>select.quicksite.data);
      if(response.status == "0"){
        message.success("修改电站信息成功");
        yield put({type: 'queryStationInfoById', payload:{id:stationId}});
        yield put(routerRedux.push('/station/view/'+stationId+"&"+payload.fullName));
      }
      else{
        message.error("修改电站信息失败");
      }
    },
    //基本信息提交
    *submitStep1({ payload }, { call, put }){

      const response = yield call(quicksiteService.createStep1,payload);
       if(response.status == "0"){
          yield put({type:'getDeviceRelationList',payload:{id:response.data}});
          if(payload.buildType == 1){
            yield put({type:'saveData',payload:{modalVisible:false}});
            yield put(routerRedux.push('/station/quicksite/'+response.data+'/device'));
          }else if(payload.buildType == 2){
            //yield put({type:'saveData',payload:{modalVisible:true}});
             yield put(routerRedux.push('/station/profession/'+response.data+'/device'));
          }

        }else{
          if(response.message){
            alertMessage('保存电站基本信息发生异常，'+response.message,"error");
          }
        }
    },
     //关系提交
    *submitStep2({ payload }, { call, put }){
      const response = yield call(quicksiteService.createStep2,{id:payload.id});
       if(response.status == "0"){
         if(payload.buildType === 1){
           yield put(routerRedux.push('/station/quicksite/'+payload.id+'/diagram'));
         }else if(payload.buildType ===2){
           yield put(routerRedux.push('/station/profession/'+payload.id+'/layout'));
         }

        }else{
          if(response.message){
            alertMessage('保存设备关系发生异常，'+response.message,'error');
          }
        }
    },
    //上传地图
    *uploadMap({ payload }, { call, put }){
      const response = yield call(quicksiteService.uploadMap,payload);
       if(response.status == "0"){
          yield put(routerRedux.push('/station/qucikResult/'+payload.stationId));
        }else{
          if(response.message){
            alertMessage('保存地图发生异常，'+response.message,'error');
          }
        }
    },
    *bindRelation({ payload }, { call, put }){
      const response = yield call(quicksiteService.bindRelation,payload.payload);

      if(response.status == "0"){
          payload.form.resetFields();
          yield put({type:'getDeviceRelationList',payload:{id:payload.payload.stationId}});
          //yield put({type:'getDTUList',payload:{id:payload.stationId}});
            yield put({type:'saveStep2',payload:{deviceRecord:{}}});
          alertMessage("绑定设备关系成功","success");
        }else{
          if(response.message){
            alertMessage("绑定设备发生异常，"+response.message,'error');
          }
        }
    },

    *updateSn({ payload }, { call, put,select }){
      const response = yield call(quicksiteService.updateSn,payload);
      if(response.status == "0"){
          yield put({type:"saveStep2",payload:{oprateType:0}});
        alertMessage("修改成功","success");
          yield put({type:'getDeviceRelationList',payload:{id:payload.stationId}});
      }else{
          // yield put({type:"saveStep2",payload:{updateMessage:response.message}});
        if(response.message){
          alertMessage(response.message,"error");
        }


      }
    },
*deleteSn({ payload }, { call, put,select }){
      const response = yield call(quicksiteService.deleteSn,payload);
      if(response.status == "0"){

        alertMessage("删除成功","success");
          yield put({type:'getDeviceRelationList',payload:{id:payload.stationId}});
      }else{

        alertMessage(response.message,"error");
      }
     },
    *reload({ payload }, { call, put }){

      yield put({ type: 'queryTimeZone' });
      yield put({ type: 'queryAssemblyList' });
      yield put({type:'queryOwner',payload:{}});
    },
    /***设备布局***/
    *getDevceList({ payload }, { call, put,select }){
     // const response = yield call(quicksiteService.queryDeviceList);
     const data = [
  {
    id:1,
    name:"103df45redf23",
    children:[
      {id:11,name:"12f8uife4511-a"},
      {id:12,name:"12f3ife45321-2"},
      {id:13,name:"12f3ife45321-3"},
      {id:14,name:"12f3ife45321-4"},
      {id:15,name:"12f3ife45321-5"},
      {id:16,name:"12f3ife45321-6"},
      {id:17,name:"12f3ife45321-7"},
      {id:18,name:"12f3ife45321-8"}

      ]},
      { id:1,
    name:"111111111111",
    children:[
      {id:11,name:"111111111111-a"}]},
  {
    id:2,
    name:"56r32lkmvnd2",
    children:[
      {id:21,name:"56r32lkmvnd2-1"},
      {id:22,name:"56r32lkmvnd2-2"},
      {id:23,name:"56r32lkmvnd2-3"},
      {id:24,name:"56r32lkmvnd2-4"},
      {id:25,name:"56r32lkmvnd2-5"},
      {id:26,name:"56r32lkmvnd2-6"},
      {id:27,name:"56r32lkmvnd2-7"},
      {id:28,name:"56r32lkmvnd2-8"}

    ]}

];
yield put({type:"saveLayout",payload:{originalDeviceList:data,treeDeviceList:data}})

    }
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
    saveStep2(state, { payload }) {
      return {
        ...state,
        step2: {
          ...state.step2,
          ...payload,
        },
      };
    },
    saveLayout(state, { payload }) {
      return {
        ...state,
        layout: {
          ...state.layout,
          ...payload,
        },
      };
    },
    saveMapData(state, { payload }) {
      return {
        ...state,
        mapData: {
          ...state.mapData,
          ...payload,
        },
      };
    },
  },
   subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/station/quicksite') {

        }
      });
    },
  },
};
