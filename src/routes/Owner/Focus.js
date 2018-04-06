
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';

/**
 *
 类说明：收藏
 @class 类名 Focus
 @constructor
 */

 @connect(state => ({
  setting: state.setting,
}))
 @Form.create()

 export default class Focus extends Component {


  render() {
   	
    return (
      <div className={styles.paintings}>
      		<p>关注</p>
      </div>
    );
  }
}
