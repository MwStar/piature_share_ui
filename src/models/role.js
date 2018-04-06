import { queryRolesLsit ,deleteRole, updateRole ,addRole, queryResources} from '../services/system';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {getAllNode,setCheckobxData} from '../utils/utils';

export default {
  namespace: 'role',

  state: {
    list: [],//所有角色列表
    pagination: {pageNum: 0, total: 0, pageSize: 0},
    page:{pageNum: 1, pageSize: 10},
    loading: true,
    formValues:{},//保存查询条件，在分页的时候好带着
    visible:false,//控制modal层的显示，true:显示，false：不显示
    record:{},//编辑时传到modal 中的对象
		resourcesList :[],//资源列表
		checkResoutcesList:[],//获取选中树节点列表
		checkResoutcesAllList:[],//获取选中节点以及父节点
		role:{},
    isResetForm:false,//重置表单

  },

  effects: {
    *toLogin({}, { put }){
      yield put(routerRedux.push('/'));
    },
    *usersList({payload}, { call, put }) {
      const response = yield call(queryRolesLsit,payload);
      if(response.status === "0"){
        yield put({
          type: 'ListSuccess',
          payload: response.data.list,
        });
        yield put({
          type: 'setPagination',
          pagination: {pageNum:response.data.pageNum,total:response.data.total,pageSize:response.data.pageSize},
          });
        //yield put({ type: 'queryResources' });
        yield put({ type: 'queryResources' , payload:{}});
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
    *deleteUser({payload}, { call, put ,select}) {
      const formValues = yield select(state => state.role.formValues);
      const response = yield call(deleteRole,payload);
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
    *updateUser({payload: { id, values } }, { call, put ,select}) {
    const formValues = yield select(state => state.role.formValues);
		const checkResoutcesAllList =yield select(state => state.role.checkResoutcesAllList);
		const checkResoutcesList = yield select(state => state.role.checkResoutcesList);
		values.id = id;
		//const companyId = getLocalStorage("companyInfo").id;
      values.roleType = 1;
      //values.organizationId =companyId;
      if(checkResoutcesList && checkResoutcesList.length>0){
        values.resourceIds = checkResoutcesList.toString();
      }else{
        values.resourceIds = "";
      }
      if(checkResoutcesAllList && checkResoutcesAllList.length>0){
        values.resourceAllIds = checkResoutcesAllList.toString();
      }else{
        values.resourceAllIds = "";
      }
      console.log("-----------"+values.nameCn);
		const response = yield call(updateRole, values);
		if(response.status === 0||response.status === '0'){
			message.success("更新用户成功！");
			yield put({ type: 'hideModal'});
			yield put({ type: 'usersList' ,payload:formValues});
      yield put({ type: 'resetForm',isResetForm:true});
      yield put({type:'login/queryResource'});
		}else{
			message.error(response.message);
		}

    },
    //增加用户
    *addUser({payload}, { call, put ,select}) {
      const formValues = yield select(state => state.role.formValues);
      const checkResoutcesList = yield select(state => state.role.checkResoutcesList);
		  const checkResoutcesAllList =yield select(state => state.role.checkResoutcesAllList);
		//const companyId = getLocalStorage("companyInfo").id;
	  	payload.roleType = 1;
	  	//values.organizationId =companyId;
	  	payload.organizationId ='141';
	  	payload.resourceIds = checkResoutcesList.toString();
	  	payload.resourceAllIds = checkResoutcesAllList.toString();
      	const response = yield call(addRole,payload);
      	switch (response.status){
	        case '0':
	          message.success("添加用户成功！");

	          //重新查询数据
	          yield put({
	            type: 'usersList',
	            payload:formValues
	          })
	          yield put({ type: 'hideModal'});
             yield put({ type: 'resetForm',isResetForm:true});   
	          break;
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


    *queryResources({ payload: values }, { call, put ,select}) {
		const response = yield call(queryResources, values);
		if(response.status === 0||response.status === '0'){
			yield put({ type: 'saveResources',resourcesList:response.data||{} });
		}else{
			message.error(response.data.message);
		}
	},

	//选中的资源
	*checkResources({ checkResoutcesList }, { call, put ,select}) {
		const resourcesList = yield select(state => state.role.resourcesList);
      //const checkResoutcesList = checkResoutcesList;
      const result = getAllNode(resourcesList,checkResoutcesList);
      yield put({ type: 'saveCheckResources', checkResoutcesList,checkResoutcesAllList:result});
			// }else{
			// 	message.error(response.data.message,DURATION);
			// }
		},
     
  },

  reducers: {
    ListSuccess(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
	hideModal(state) {
		return { ...state, visible:false,record:{}};
	},
	showModal(state,{record}) {

		return { ...state, visible: true,record:record};
	},
	saveResources(state,{resourcesList}) {
			return { ...state,resourcesList};
		},
	saveCheckResources(state,{checkResoutcesList,checkResoutcesAllList}) {
			return { ...state,checkResoutcesList,checkResoutcesAllList};
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
      return Object.assign({}, state,{checkRolesList:checkRolesList});
    },
    saveFormValues(state,{formValues}){
      return Object.assign({}, state,{formValues:formValues});
    },
    saveRoles(state, { rolesList }) {
      return { ...state, rolesList};
    },
    resetForm(state,{isResetForm}){
      return { ...state, isResetForm};
    },

  },

};
