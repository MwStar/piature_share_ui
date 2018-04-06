
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
import { Route, Redirect, Switch } from 'dva/router';
 import {connect} from 'dva';
 import UserInfo from '../../components/UserInfo/index';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
import { getRoutes } from '../../utils/utils';
import Paintings from './Paintings.js';
import Collect from './Collect.js';
import Focus from './Focus.js';
import Setting from './Setting.js';

/**
 *
 类说明：画集,收藏，关注，资料
 @class 类名 User
 @constructor
 */
const { Content ,Sider ,Header} = Layout;
 const menu = [
  	{name:'我的画集',path:'/owner/paintings',},
  	{name:'我的收藏',path:'/owner/collect',},
  	{name:'我的关注',path:'/owner/focus',},
  	{name:'我的资料',path:'/owner/setting',},
  	]
 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class User extends Component {

 	getCurrentStep() {
    const { location: { pathname }} = this.props;
    switch(pathname){
    	case "/owner/paintings":return 0;break;
    	case "/owner/collect":return 1;break;
    	case "/owner/focus":return 2;break;
    	case "/owner/setting":return 3;break;
    }
    
  }
  getCurrentComponent() {
    const componentMap = {
      0: Paintings,
      1: Collect,
      2: Focus,
      3: Setting,
    };
    return componentMap[this.getCurrentStep()];
  }

  render() {
  	const CurrentComponent = this.getCurrentComponent();
    const { location: { pathname }} = this.props;

  	
    return (
      <div className={styles.paintings}>
      	<Row gutter={16}>
      		<Col span={4}>
		      	<UserInfo></UserInfo>      
			      	<Menu
			          theme="dark"
			          mode="inline"
			          selectedKeys={pathname}
			          style={{ padding: '16px 0', width: '100%' ,borderRadius:'4px'}}
			        >
			          {
			          	menu.map((item)=>{
		          		return (
		          			<Menu.Item key={item.path}>
		          				<a href={`#${item.path}`}>
				                  <span>{item.name}</span>
				                </a>
		          			</Menu.Item>
		          			)
			          	})
			          }
			        </Menu>
		    </Col>
	        <Col span={20}>
		        <div style={{padding: 24, margin: 0, minHeight: 280 }}>
		            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
		              <CurrentComponent/>
		            </div>
		        </div>
	        </Col>
		</Row>
      </div>
    );
  }
}
