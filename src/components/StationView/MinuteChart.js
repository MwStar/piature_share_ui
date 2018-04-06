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
 类说明：电站详情，概览--发电统计--分钟趋势图
 @class 类名 MinuteChart
 @constructor
 */
 class MinuteChart extends Component {
  state = {

  }

  componentDidMount = () => {

  }

  render() {
    const {data} = this.props;
    const source= [];
    //const gg = /\w+:\w+/;
    let date = new Date();
    const mon = ['01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12'];
    const day=['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10','11','12','13', '14', '15', '16', '17','18', '19', '20', '21', '22','23', '24', '25', '26', '27','28', '29', '30','31'];
    const ymd = date.getFullYear()+"-"+mon[date.getMonth()]+"-"+day[date.getDate()];
    if(data){
      data.map((item)=>{
        source.push({time:item.create_at,rate:item.miBnP});
      })
    }
	const cols = {
	    time: {
        type:'time',
        mask:'HH:mm',
	      values: [`${ymd} 00:00`, `${ymd} 02:00`, `${ymd} 04:00`, `${ymd} 06:00`,`${ymd} 08:00`, `${ymd} 10:00`, `${ymd} 11:00`, `${ymd} 12:00`,`${ymd} 14:00`, `${ymd} 16:00`,`${ymd} 18:00`,`${ymd} 20:00`, `${ymd} 22:00`,`${ymd} 24:00`]
	    },
	    rate: {
         min: 0 ,
	       values: ['5', '10','15','20','25','30','35','40'],
         alias:'功率'
	    }
	  }

    return (
    	<div id="minute">
        <span>单位：kw</span>
	      <Chart height={400} data={source} scale={cols} background={{fill:'#fff'}}  forceFit>
	          <Axis name="time" />
	          <Axis name="rate" />
	          <Tooltip />
	          <Geom type="areaStack" position="time*rate" color={'#aae5ee'} />
	         <Geom type='lineStack' position="time*rate" size={2} color={'#aae5ee'} />
        </Chart>
	    </div>
    );
  }
}
export default (MinuteChart);

