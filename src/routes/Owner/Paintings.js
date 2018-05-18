
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import PaintingCard from '../../components/PaintingCard/index';
 import EditPainging from '../../components/EditPainting/index';
 import User from './User';
 import PaintingCardDiscover from '../../components/PaintingCard/PaintingsCard';

/**
 *
 类说明：用户---画集
 @class 类名 Paintings
 @constructor
 */
 

 @connect(state => ({
  paintingsuser: state.paintingsuser,
}))
 @Form.create()

 export default class Paintings extends Component {


  componentDidMount() {
       const {dispatch} = this.props;
       const { location: {pathname} } = this.props;
       if(pathname === "/owner/paintings"){
        dispatch({type:"paintingsuser/getAllPaintings"});
      } 
      else{
        const id = this.props.match.params.id;
        dispatch({type:"paintingsuser/getAllPaintings",payload:{id:id}});
      }
  }
 	//添加画集
	add = () => {
	  	const {dispatch} = this.props;
	  	dispatch({ type: 'paintingsuser/modalStatus', modal: true });
	}

  render() {
   	const { painting ,list } = this.props.paintingsuser;
    const { location: {pathname} } = this.props;
    return (
      <div className={styles.paintings}>
        <Row gutter={24}>
      		{pathname === "/owner/paintings"?<Col xs={12} sm={8} md={6} lg={6} xl={6}>
      		<div><div className={styles.add}>
      			<a onClick={this.add}>
      			<i className="iconfont icon-add"></i>
      			<p>创建画集</p>
      			</a>
      		</div></div></Col>:''}
      		{
            list.length > 0 ?
      			list.map((item)=>{
      			return (
      				<Col xs={12} sm={8} md={6} lg={6} xl={6}>
              {pathname === "/owner/paintings"?
      				<PaintingCard data={item} dispatch={this.props.dispatch}></PaintingCard>
              :
              <PaintingCardDiscover data={item} dispatch={this.props.dispatch}></PaintingCardDiscover>
              }
      				</Col>
      				)
      			})
            :
            <Col xs={12} sm={16} md={18} lg={18} xl={18} className={styles.no}>还没有画集呐</Col>
      		}
        </Row>
      <EditPainging painting={painting}></EditPainging>
      </div>
    );
  }
}
