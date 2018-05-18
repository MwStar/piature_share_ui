
import React, { Component } from 'react';
import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
import { Route, Redirect, Switch } from 'dva/router';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import UserInfo from '../../components/UserInfo/index';
import UserInfoOther from '../../components/UserInfo/other';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './User.less';
import { getRoutes } from '../../utils/utils';
import Paintings from './Paintings';
import Gather from './Gather';
import Collect from './Collect';
import Focus from './Focus';
import {setLocalStorage, getLocalStorage } from '../../utils/utils';
const TabPane = Tabs.TabPane;
const token = getLocalStorage("Token");
/**
 *
 类说明：画集,收藏，关注，资料
 @class 类名 User
 @constructor
 */
const { Content ,Sider ,Header} = Layout;

 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class User extends Component {


/* componentWillMount() {
       const {dispatch} = this.props;
       const token = getLocalStorage("Token");
       if(!token){
          dispatch(routerRedux.push('/user/login'));
       }
  }*/

//设置
  setting = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/owner/setting'));
  }



  getSelectedMenuKeys = (path) => {
    let arr = [];
    arr.push(path);
    return arr;
  }

  render() {
  	//const CurrentComponent = this.getCurrentComponent();
    const { location: { pathname }} = this.props;
    const token = getLocalStorage("Token");
  	
    return (
      <div className={styles.paintings}>
      {token?<div>
              {pathname === "/owner/paintings"?
                <div>
                <span onClick={this.setting} className={styles.setting}>设置</span>  
    		      	<UserInfo dispatch={this.props} location={this.props.location} match={this.props.match}></UserInfo>
                </div>
                :
                <UserInfoOther dispatch={this.props} location={this.props.location} match={this.props.match}></UserInfoOther>
              }
              <Tabs defaultActiveKey="1">
                <TabPane tab="画集" key="1"><Paintings location={this.props.location} match={this.props.match}></Paintings></TabPane>
                {/*<TabPane tab="采集" key="2"><Gather location={this.props.location} match={this.props.match}></Gather></TabPane>*/}
                <TabPane tab="喜欢" key="3"><Collect location={this.props.location} match={this.props.match}></Collect></TabPane>
                <TabPane tab="关注" key="4"><Focus location={this.props.location} match={this.props.match}></Focus></TabPane>
              </Tabs>
   		 </div>:
       <div className={styles.login}>
          <h2>请先登录</h2>
       </div>}
      </div>
    );
  }
}
