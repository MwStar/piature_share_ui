
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Avatar} from 'antd';
 import {connect} from 'dva';
 import {routerRedux} from 'dva/router';
 const forge = require('node-forge');
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import { config } from '../../utils/config';
 import styles from './index.less'

  const FormItem = Form.Item;
/**
 *
 类说明：用户----用户信息
 @class 类名 UserInfo
 @constructor
 */
 @connect(state => ({
  setting: state.setting,
  user: state.user,
}))
 @Form.create()

 export default class UserInfo extends Component {

  componentDidMount() {
    const {dispatch} = this.props;
    const {location:{pathname}} = this.props;
	  const id = this.props.match.params.id;
	  dispatch({type: 'user/getUserById',payload:{id:id}});

  }

  render() {
    const { currentUser , user } = this.props.user;
    const {location:{pathname}} = this.props;
    return (
      <div className={styles.main}>
	      <Avatar size="large" className={styles.avatar} src={config.CHRCK_FILE+user.avatar} />
          <h2>{user.name}</h2>
	      <p>{user.signature}</p>      	
      </div>
    );
  }
}