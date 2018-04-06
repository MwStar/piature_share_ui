
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs} from 'antd';
 import {connect} from 'dva';
 const forge = require('node-forge');
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import UserInfoSetting from '../../components/UserInfoSetting/index';
 import styles from './Setting.less'
/**
 *
 类说明：用户个人中心
 @class 类名 Setting
 @constructor
 */
 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class Setting extends Component {


  render() {
    return (
      <div className={styles.userInfo}>
	      	<UserInfoSetting></UserInfoSetting>
      </div>
    );
  }
}
