/**
 *  desc: 判断渲染单电站还是多点站页面
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Tabs,Button,Card,Modal,Form} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import StationDetails from './StationDetails';
 import MultiStation from './MultiStation';

/**
 *
 类说明：电站(业主首页)
 @class 类名 StationIndex
 @constructor
 */
@connect(state => ({
    station: state.station,
    }))
@Form.create()

 export default class StationIndex extends Component {
  state = {

  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'station/queryList',payload:{}});
  }



  render() {
    const {data:{pagination:{total}}} = this.props.station;
    return (
      <PageHeaderLayout>
      	<Card bordered={false}>
	      	<div>
	      		{total.length>1?
	      			<MultiStation></MultiStation>
	      			:<StationIndex></StationIndex>}
	      	</div>
      	</Card>
      </PageHeaderLayout>
    );
  }
}
