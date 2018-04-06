/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Tabs,Button,Card,Modal,Form} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import StationCard from '../../components/StationCard/index';

/**
 *
 类说明：多个电站详情
 @class 类名 StationDetails
 @constructor
 */
@connect(state => ({
    station: state.station,
    }))
@Form.create()

 export default class StationDetails extends Component {
  state = {

  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'station/queryList',payload:{}});
  }



  render() {
    const {data:{list,pagination:{total}}} = this.props.station;
    return (
	      	<div>
            <Row>
          {total?list.map((item)=>{
            return (
              <Col span={6}>
                <StationCard
                  data={item}
                >
                </StationCard>
              </Col>
              )
          })    
            :''}
            </Row>
	      	</div>
    );
  }
}
