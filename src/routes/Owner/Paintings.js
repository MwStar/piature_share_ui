
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import PaintingCard from '../../components/PaintingCard/index';
 import EditPainging from '../../components/EditPainting/index';

/**
 *
 类说明：画集
 @class 类名 Paintings
 @constructor
 */
 

 @connect(state => ({
  paintings: state.paintings,
}))
 @Form.create()

 export default class Paintings extends Component {
 	//添加画集
	add = () => {
	  	const {dispatch} = this.props;
	  	dispatch({ type: 'paintings/savePainting', painting: {} });
	  	dispatch({ type: 'paintings/modalStatus', modal: true });
	}

  render() {
   	const list = [
   	{"id":1,"title":"feddddd","cover_path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
   	{"id":2,"title":"feddddd","cover_path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
   	{"id":3,"title":"feddddd","cover_path":"https://images.pexels.com/photos/191076/pexels-photo-191076.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
   	{"id":4,"title":"feddddd","cover_path":"https://images.pexels.com/photos/189536/pexels-photo-189536.jpeg?h=350&auto=compress&cs=tinysrgb 1x"},
   	];
   	const {painting} = this.props.paintings;
    return (
      <div className={styles.paintings}>
      	<Row gutter={16}>
      		<Col span={6}>
      		<div className={styles.add}>
      			<a onClick={this.add}>
      			<i className="iconfont icon-add"></i>
      			<p>创建画集</p>
      			</a>
      		</div>
      		</Col>
      		{
      			list.map((item)=>{
      			return (
      				<Col span={6}>
      				<PaintingCard data={item} dispatch={this.props.dispatch}></PaintingCard>
      				</Col>
      				)
      			})
      		}
      		
  		</Row>
  		<EditPainging painting={painting}></EditPainging>
      </div>
    );
  }
}
