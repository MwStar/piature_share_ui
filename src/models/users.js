import { queryUsers , daleteUser , updateUser , getUser ,addtUser ,queryRoles ,queryAgency, queryProprietor} from '../services/system';
import {message} from 'antd';
import { routerRedux } from 'dva/router';

import {setCheckobxData ,setOfficeSelectTree} from '../utils/utils';
export default {
  namespace: 'users',

  state: {
    list: [],//所有用户列表
    pagination: {pageNum: 0, total: 0, pageSize: 0},
    page:{pageNum: 1, pageSize: 10},
    loading: true,
    formValues:{},//查询表单域
    userList :{},//用户信息列表
    organizationList :[],//组织机构(公司/经销商)列表
    officeList:[],//部门信息列表
    editmodal:false,
    checkRolesList:[],//选中权限列表
    rolesList:[],//角色列表
    userObj:{},//
    isResetForm:false,//重置表单
  },

  effects: {
    *toLogin({}, { put }){
      yield put(routerRedux.push('/'));
    },
    *usersList({payload}, { call, put }) {
      payload.userType = 1;
      const response = yield call(queryUsers,payload);
      if(response.status === "0"){
        yield put({
          type: 'ListSuccess',
          payload: response.data.list,
        });
        yield put({ type: 'queryRoles', payload: {} });
        yield put({ type: 'queryAgency', payload: {  } });
        yield put({ type: 'saveUserObj', userObj: payload});
        yield put({
          type: 'setPagination',
          pagination: {pageNum:response.data.pageNum,total:response.data.total,pageSize:response.data.pageSize},
          });
        yield put({
          type: 'changeLoading',
          payload: false,
          });
      }
      else{
        message.error(response.message);
      }
    },
    //删除用户
    *daleteUser({payload}, { call, put ,select}) {
      const formValues = yield select(state => state.users.formValues);
      const response = yield call(daleteUser,payload);
      switch (response.status){
        case '0':
          //提示
          message.success("删除用户成功！");
          yield put({ type: 'usersList' ,payload:formValues});
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },

    //更新用户
    *updateUser({payload}, { call, put , select}) {
      const formValues = yield select(state => state.users.formValues);
      const checkRolesList = yield select(state => state.users.checkRolesList);
      payload.roleIds =checkRolesList.toString();
      const response = yield call(updateUser,payload);
      switch (response.status){
        case '0':
          message.success("更新用户成功！");
          yield put({
            type: 'editmodalStatus',
            editmodal:false
          });
          yield put({ type: 'usersList' ,payload:formValues});
          yield put({ type: 'resetForm',isResetForm:true}); 
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },
    //获取用户根据id
    *getUserbyId({payload}, { call, put }) {
      const response = yield call(getUser,payload);
      switch (response.status){
        case '0':
          yield put({
          type: 'userListSuccess',
          payload: response.data,
        });
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },

    //增加用户
    *addUser({payload}, { call, put ,select}) {
      const formValues = yield select(state => state.users.formValues);
      const checkRolesList = yield select(state => state.users.checkRolesList);
      //const tenantId = getLocalStorage("tenantInfo").id;
      //values.tenantId=tenantId;
      //values.userType=USER_TYPE;
      payload.roleIds =checkRolesList.toString();
      payload.userType = 1;
      const response = yield call(addtUser,payload);
      switch (response.status){
        case '0':
          message.success("添加用户成功！");
           yield put({
            type: 'editmodalStatus',
            editmodal:false
          });
           yield put({ type: 'usersList' ,payload:formValues});
          yield put({ type: 'resetForm',isResetForm:true});   
          break;
          message.success(response.message);
          case '1':
          message.error(response.message);
          break;
        case '100':
          yield put({type:'toLogin'});
          break;
        default:
          message.error(response.message);
          break;
      }
    },

    //查询角色信息
  *queryRoles({ payload }, { call, put }) {
      const response =  yield call(queryRoles, payload);
      if(response.status === 0||response.status === '0'){
       yield put({ type: 'saveRoles' , rolesList:setCheckobxData(response.data)});
     }else{
      //yield put ({type:"saveMsg",msg:response.data.message});
      //message.error(response.data.message,DURATION);
      message.error(response.message);
    }
  },


   //查询经销商信息
  *queryAgency({ payload }, { call, put}) {
      //const ids = getLocalStorage("companyInfo").id;
      const ids = 141;
      const response =  yield call(queryAgency, {ids:ids});

      if(response.status === 0||response.status === '0'){
        let parentId =0;
        if(response.data.length > 0){
           parentId= response.data[0].parentId;
        }
        const selectTreeList = setOfficeSelectTree(response.data,[],parentId);

         yield put({ type: 'saveAgency' , payload:{organizationList:selectTreeList}});
       }else{
        //message.error(response.data.message,DURATION);
        //yield put ({type:"saveMsg",msg:response.data.message});
      }
  },
  //查询部门
  *queryOffice({ payload: values }, { call, put ,select}) {
      const userObj = yield select(state => state.users.userObj);
      if(!values.ids){
         yield put({ type: 'saveOffice'  ,payload:{officeList:[],officeId:"0"}});
         userObj.officeId="0";
          yield put({type:"saveUserObj",userObj});
         return false;
      }
      const response =  yield call(queryProprietor, values);
      if(response.status === 0||response.status === '0'){
        let officeId ="0";
        if(response.data && response.data.length >0 ){
            officeId = response.data[0].id;
        }

        if(values.officeId){
          officeId = values.officeId.toString;
        }
        userObj.officeId = "0";
        let parentId =0;
        if(response.data.length > 0){
           parentId= response.data[1].parentId;
        }
        let officeData = response.data;
        officeData.splice(0,1);
        const selectTreeList = setOfficeSelectTree(officeData,[],parentId);
        yield put({ type: 'saveOffice'  ,payload:{officeList:selectTreeList,officeId:officeId}});
        //yield put({ type: 'saveOffice'  ,payload:{officeList:response.data,officeId:officeId}});
        yield put({type:"saveUserObj",userObj});

       }else{
        //message.error(response.data.message,DURATION);
        //yield put ({type:"saveMsg",msg:response.data.message});
      }
  },
     
  },

  reducers: {
    ListSuccess(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    userListSuccess(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    setFormValue(state,{formValues}){
      return { ...state, formValues};
    },
    setPagination(state,{pagination}){
      return Object.assign({}, state,{pagination:pagination});
    },
    setPage(state,{page}){
      return Object.assign({}, state,{page:page});
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    editmodalStatus(state,{editmodal}){
      return Object.assign({}, state,{editmodal:editmodal});
    },
    savecheckRolesList(state,{checkRolesList}){
      return { ...state, checkRolesList};
    },
    saveAgency(state, { payload: { organizationList} }) {
      return { ...state, organizationList};
    },
    saveRoles(state, { rolesList }) {
      return { ...state, rolesList};
    },
    saveUserObj(state,{userObj}){
      return { ...state, userObj};
    },
    saveOffice(state, { payload: { officeList,officeId} }) {
      return { ...state, officeList,officeId};
    },
    resetForm(state,{isResetForm}){
      return { ...state, isResetForm};
    },

  },

};
