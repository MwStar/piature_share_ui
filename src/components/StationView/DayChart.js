/**
 *  desc: 小时色块图
 * author: ll
 */
 import React, { Component } from 'react';
 import {  Input ,Button,} from 'antd';
 import styles from './index.less';
 import { Chart, Geom, Axis, Tooltip, Legend, Coord ,Label} from 'bizcharts';

	/**
 *
 类说明：电站详情，概览--发电统计--日期
 @class 类名 DayChart
 @constructor
 */
 class DayChart extends Component {
  state = {
    
  }
  //
  getCurrentYear = () =>{
    const date = new Date();
    return date.getFullYear(); 
    }
  getCurrentMonth = () => {
    const date = new Date();
    return date.getMonth(); 
    }
  Month = (year,momth)  => {
  	const mon = ['01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12'];
  	let arr=[];
  	for(let i=momth,j=12;j>0;i--,j--){
  		if(i<0){
  			arr.push(year-1+" "+mon[i+12]);
  		}

  		else{
  		arr.push(year+" "+mon[i]);}
  	}
  	return arr;
  }
 


  render() {
    const m = ['00','01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12'];
    //数据源
    const {data} = this.props;
    //const data = [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58],[1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]];
    const source = [];
    if(data){
      data.map((item)=>{
        const obj = {};
        obj.day = item.day-1;
        obj.month = (item.year+" "+m[item.month]).toString()
        obj.power = item.totalPower;
        obj.date = item.year+"-"+item.month+"-"+item.day;
        source.push(obj);
      });   
    }
    const month = this.getCurrentMonth();
    const year = this.getCurrentYear();
    //const mon = ['一月','二月', '三月', '四月', '五月','六月', '七月', '八月', '九月','十月', '十一月', '十二月'];
    //const mon = ['01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12'];
    //定义度量
    let arr = this.Month(year,month);
    const cols = {
      day: {
          type: 'cat',
          values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11','12','13', '14', '15', '16', '17','18', '19', '20', '21', '22','23', '24', '25', '26', '27','28', '29', '30','31'],
      },
      month: {
        type: 'cat',
        values: arr
      },
      power: {
        sync: true,
        alias:'发电量'
      }
    }
    return (
    	<div id="day">
	      <Chart width={400} height={400} data={source} scale={cols} background={{fill:'#fff'}} forceFit>
          <Axis name='day' grid={{
            align: 'center',
            lineStyle: {
              lineWidth: 1,
              lineDash: null,
              stroke: '#f0f0f0'
            },
            showFirstLine: true
          }} />
          <Axis name='month' grid={{
            align: 'center',
            lineStyle: {
              lineWidth: 1,
              lineDash: null,
              stroke: '#f0f0f0'
            }
          }} />
          <Tooltip title='date'/>
          <Geom type="polygon" position="day*month*date" 
          color={['power', '#BAE7FF-#1890FF-#0050B3']}
          style={{stroke: '#fff',lineWidth: 1}}
          
            >
            
          </Geom>
          </Chart>
	    </div>
    );
  }
}
export default (DayChart);