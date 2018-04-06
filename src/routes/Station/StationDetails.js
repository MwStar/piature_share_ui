/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Tabs,Button,Card,Modal,Form,Breadcrumb} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import StationView from '../../components/StationView/index';
 import StationDeviceDetail from './StationDeviceDetail/StationDeviceDetail';


 const TabPane = Tabs.TabPane;
/**
 *
 类说明：电站详情
 @class 类名 StationDetails
 @constructor
 */
 @connect(state => ({
  view: state.view,
}))
 @Form.create()

 export default class StationDetails extends Component {
  state = {

  }

  componentWillMount() {
    
  }



  render() {
    const id = this.props.match.params.id;
    const name = this.props.match.params.name;
    console.log("id:",id)
    return (
      	<Card bordered={false}>
	      	<div>
            <Breadcrumb style={{marginBottom:20}}>
              <Breadcrumb.Item><a href="#/station/list">电站</a></Breadcrumb.Item>
              <Breadcrumb.Item>{name}</Breadcrumb.Item>
            </Breadcrumb>
	      		<Tabs defaultActiveKey="1">
			    	<TabPane tab="概览" key="1"><StationView id={id}></StationView></TabPane>
			    	<TabPane tab="组件布局" key="2">Content of Tab Pane 2</TabPane>
			    	<TabPane tab="设备" key="3"><StationDeviceDetail></StationDeviceDetail></TabPane>
			  	</Tabs>

	      	</div>
      	</Card>
    );
  }
}
