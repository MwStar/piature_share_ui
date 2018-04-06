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
 类说明：电站详情，概览--发电统计--年柱状图
 @class 类名 YearChart
 @constructor
 */
 class YearChart extends Component {
  state = {
    
  }
  getCurrentYear = () =>{
    const date = new Date();
    return date.getFullYear(); 
    }


  render() {
    const {data} = this.props;
    const year = this.getCurrentYear();
    let firstyear = 2018;
    const source= [];
    const arr = [];
    if(data.length>0){
    	firstyear = data[0].year;
	  data.map((item)=>{
	    source.push({year:item.year.toString(),power:item.totalPower});
	    arr.push(item.year);
	  })
	  if(arr.length<=5){
	  		arr.splice(0,arr.length);
	  		arr.push(firstyear,firstyear+1,firstyear+3,firstyear+4,firstyear+5);
	  }
    }
    //const arr = [firstyear,firstyear+1,firstyear+2,firstyear+3,firstyear+4,firstyear+5];
    //const source= [{year:2018,power:2},{year:2019,power:1.3},{year:2020,power:2.3},{year:2021,power:2.3},{year:2022,power:2.3},{year:2023,power:2.3},{year:2024,power:2.3}];
    //const source= [{year:'2018',power:2},{year:'2019',power:1.3},{year:'2020',power:2.3},{year:'2021',power:2.3},{year:'2022',power:2.3},{year:'2023',power:2.3}];
	const cols = {
	    year: {
            type: 'cat',
	        //values:['2018','2019','2020','2021','2022','2023'],
	        values:arr,
	    },
	    power: {
	       range: [0,1],
         alias:'发电量'
	    }
	  }
    
    return (
    	<div id="year">
        <span>单位：kwh</span>
	      <Chart height={400} data={source} scale={cols} background={{fill:'#fff'}} forceFit>
            <Axis name="year"/>
            <Axis name="power" label={{formatter: val => `${val}kwh`}}/>
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type="interval" position="year*power" />
          </Chart>
	    </div>
    );
  }
}
export default (YearChart);