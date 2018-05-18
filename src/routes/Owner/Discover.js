
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Button,Card,Form,Tabs,Menu,Layout} from 'antd';
 import {connect} from 'dva';
 import PageHeaderLayout from '../../layouts/PageHeaderLayout';
 import styles from './Paintings.less';
 import PaintingsCard from '../../components/PaintingCard/PaintingsCard';

/**
 *
 类说明：发现---画集
 @class 类名 Disciver
 @constructor
 */
 

 @connect(state => ({
  paintings: state.paintings,
}))
 @Form.create()

 export default class Disciver extends Component {


  componentDidMount() {
       const {dispatch} = this.props;
       dispatch({type:"paintings/getAllPaintings",payload:{}});
       window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    const { dispatch } = this.props;
    const { page :{pageNum, pageSize, total}, pullUpStatus} = this.props.paintings;
    let scTop=document.body.scrollTop||Math.round(document.documentElement.scrollTop);
    let clHeight=document.body.clientHeight;
    let scHeight=document.body.scrollHeight;
    if ( pullUpStatus != 4 ) {
             dispatch({type:'paintings/pullUpStatus',status:1});
        }
    if (pullUpStatus == 1 && scTop+clHeight>=scHeight) { // 发起了加载，那么更新状态
                dispatch({type: 'paintings/getPaintings',
                  payload:{page:{pageNum: pageNum+1, total: total, pageSize: pageSize}}
                });
            }
  }
  render() {
   	const { list , pullUpStatus} = this.props.paintings;
    const pullUpTips = {
            // 上拉状态（下滚）
            0: '滚动鼠标发起加载',
            1: '滚动即可加载',
            2: '正在加载',
            3: '加载成功',
            4: '到底啦！！没有可以加载的了',
        };
    return (
      <div className={styles.paintings}>
      	<Row gutter={16}>
      		{
      			list.map((item)=>{
      			return (
      				<Col span={6}>
      				<PaintingsCard data={item} dispatch={this.props.dispatch}></PaintingsCard>
      				</Col>
      				)
      			})
      		}      		
  		</Row>
      <p ref="PullUp" id="#PullUp" className={styles.remind}>{pullUpTips[pullUpStatus]}</p>
      </div>
    );
  }
}
