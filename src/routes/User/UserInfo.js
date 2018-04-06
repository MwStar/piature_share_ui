/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs} from 'antd';
 import {connect} from 'dva';
   const forge = require('node-forge');
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import UserInfoSetting from '../../components/UserInfoSetting/index';
/**
 *
 类说明：用户个人中心
 @class 类名 UserInfo
 @constructor
 */
 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class UserInfo extends Component {


  render() {
    return (
      <PageHeaderLayout>
      	<Card bordered={false}>
	      	<UserInfoSetting></UserInfoSetting>
      	</Card>
      </PageHeaderLayout>
    );
  }
}
