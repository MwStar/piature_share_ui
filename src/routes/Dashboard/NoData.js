/**
 *  desc:暂无数据
 * author: ll
 */
 import React, { Component } from 'react';
 import {  Input ,Button,} from 'antd';
 import styles from './index.less';
 import { Chart, Geom, Axis, Tooltip, Legend, Coord ,Label} from 'bizcharts';

	/**
 *
 类说明 无数据时显示
 @class 类名 NoData
 @constructor
 */
 class NoData extends Component {
  state = {
    
  }

  render() {
    
    return (
    	<div style={{textAlign:'center',marginLeft:'14%',marginTop:'14%',marginBottom:'14%',color:'#bebebe'}}>
    		<i className="iconfont icon-c01n" style={{fontSize:108}}></i>
	      	<p style={{fontSize:26}}>暂无数据</p>
	    </div>
    );
 }
}
export default (NoData);