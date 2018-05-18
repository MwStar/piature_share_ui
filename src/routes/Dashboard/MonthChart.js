/**
 *  desc: 日趋势图
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input ,Icon, message,Button,Spin} from 'antd';
 import {connect} from 'dva';
 import { Chart, Geom, Axis, Tooltip, Legend, Coord ,Label} from 'bizcharts';
 import {config} from '../../utils/config';


	/**
 *
 类说明：电站详情，概览--发电统计--日趋势图
 @class 类名 DayChart
 @constructor
 */
  /*@connect(state => ({
  view: state.view,
}))*/
 class MonthChart extends Component {
  state = {

  }

  componentDidMount = () => {

  }

  render() {
    const {array, data} = this.props;//2018-05-05
    const source= [];
    const dayNum=['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10','11','12','13', '14', '15', '16', '17','18', '19', '20', '21', '22','23', '24', '25', '26', '27','28', '29', '30','31'];

    if(data){
      //ymd = data[0].create_at.substr(0,10);
      data.map((item)=>{
        source.push({time:item.x,rate:item.y});
      })
    }

	const cols = {
	    time: {
        type:'time',
        mask:'YYYY-MM-DD',
        ticks:array,
        tickCount:13,
	      //values: [`${day} 00:00`, `${day} 02:00`, `${day} 04:00`, `${day} 06:00`,`${day} 08:00`, `${day} 10:00`, `${day} 11:00`, `${day} 12:00`,`${day} 14:00`, `${day} 16:00`,`${day} 18:00`,`${day} 20:00`, `${day} 22:00`,`${day} 23:59`]
	    },
	    rate: {
         min: 0 ,
	       values: ['5', '10','15','20','25','30','35','40'],
         alias:'下载量'
	    }
	  }
    const tooltipCfg = {
      custom: true,
      itemTpl: '<div><span>{name}：</span><span>{value} 张</span></div>'
    };
    return (
      <Spin spinning={false} delay={200}>
      	<div id="day">
          <span>单位：张</span>
  	      <Chart padding={[20,20,100,70]} height={400} forceFit data={source} scale={cols} background={{fill:'#fff'}}  forceFit>
  	          <Axis name="time" />
  	          <Axis name="rate" />
  	          <Tooltip {...tooltipCfg}/>
             <Geom type='interval' position="time*rate" size={2} color={'#aae5ee'}
               />
          </Chart>
  	    </div>
      </Spin>
    );
  }
}
export default (MonthChart);

