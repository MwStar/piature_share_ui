
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs} from 'antd';
 import {connect} from 'dva';
 const forge = require('node-forge');
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './index.less'
/**
 *
 类说明：用户----用户信息
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
      <div className={styles.main}>
	      	<img src={require("../../assets/logo.svg")}/>
	      	<h2>琪琪</h2>
	      	<Button>上传图片</Button>

      </div>
    );
  }
}