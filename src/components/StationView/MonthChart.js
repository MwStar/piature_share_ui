/**
 *  desc: 分钟趋势图
 * author: ll
 */
 import React, { Component } from 'react';
 import { Modal, Form, Input,Tree ,Checkbox,Row,Col,Upload, Icon, message,Select,Button} from 'antd';
 import styles from './index.less';
 import {connect} from 'dva';
 import { Chart, Geom, Axis, Tooltip, Legend, Coord ,Label} from 'bizcharts';

	/**
 *
 类说明：电站详情，概览--发电统计--月柱状图
 @class 类名 MonthChart
 @constructor
 */
 class MonthChart extends Component {
  state = {
    
  }
  getCurrentYear = () =>{
    const date = new Date();
    return date.getFullYear(); 
    }
  getCurrentMonth = () => {
    const date = new Date();
    return date.getMonth(); 
    }
 Month = (year,month)  => {
    const mon = ['01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12'];
    
    let arr=[];
    for(let i=month,j=12;j>0;i--,j--){
        if(i<0){
            arr.push(year-1+" "+mon[i+12]);
        }

        else{
        arr.push(year+" "+mon[i]);}
    }
    return arr.reverse();
  }


  render() {
    const m = ['00','01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12'];
    const {data} = this.props;
    const month = this.getCurrentMonth();
    const year = this.getCurrentYear();
    let arr = this.Month(year,month);
    const source= [];
    if(data){
      data.map((item)=>{
        source.push({month:(item.year+" "+m[item.month]).toString(),power:item.totalPower});
      })
    }

	const cols = {
	    month: {
            type: 'cat',
	        values: arr
	    },
	    power: {
	       range: [0,1],
         alias:'发电量'
	    }
	  }
    
    return (
    	<div id="month">
        <span>单位：kwh</span>
	      <Chart height={400} data={source} scale={cols} background={{fill:'#fff'}} forceFit>
            <Axis name="month"/>
            <Axis name="power" label={{formatter: val => `${val}kwh`}}/>
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type="interval" position="month*power" />
          </Chart>
	    </div>
    );
  }
}
export default (MonthChart);