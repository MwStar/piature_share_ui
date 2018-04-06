import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import styles from './index.less';






class YearPicker extends PureComponent {
  year = new Date().getUTCFullYear();
  state = {
      start: this.year-8,
      end: this.year+1,
      visible:false,
      icon:false,//显示删除图标还是日历图标
    };


//点击输入框
  handlerClick = (e) => {
    e.preventDefault();
    this.setState({visible:!this.state.visible});
  }
  //聚焦输入框
  handlerEnter = () => {
    console.log("进入了");
    this.setState({icon:true});

  }
  handlerLeave = () => {
    console.log("离开了");
    this.setState({icon:false});

  }
  //前一段年份
  prevYear = (e) => {
    e.preventDefault();
    this.setState({start:this.state.start-10});
    this.setState({end:this.state.end-10});
  }
  //后一段年份
  nextYear = (e) => {
    e.preventDefault();
    this.setState({start:this.state.start+10});
    this.setState({end:this.state.end+10});
  }
//选择具体年份
  chooseYear = (year) => {
    this.setState({visible:false});
    const node = document.getElementById('inputvalue');
    node.value = year;
    this.props.handlerValue(year);
  }
  //清除年份选择
  clearYear = () => {
    const node = document.getElementById('inputvalue');
    node.value = '';
  }
  //鼠标进入删除图标
  mouseEnter = () => {
    this.setState({icon:true});
  }
  //


  render() {
    const {start,end,visible,icon} = this.state;
    const {placeholder} = this.props;
    /*const year = new Date().getUTCFullYear();
    console.log("year" + year);
    this.state.start = year-8;
    this.state.end = year+1;*/
    return (
      <div>
        <span>
          <input readOnly placeholder={placeholder} 
          className="ant-calendar-picker-input ant-input" 
          id="inputvalue" 
          onClick={this.handlerClick} 
          onMouseEnter={this.handlerEnter}
          onMouseLeave={this.handlerLeave}
          />
          {(icon)?<i className={styles.clear} onClick={this.clearYear} onMouseEnter={this.mouseEnter}></i>:
          <span className="ant-calendar-picker-icon"></span>}
        </span>
        
        {(visible)?<div className={styles.year}>
          <div className={styles.header}>
            <a role="button" title="Last decade" onClick={this.prevYear}></a>
            <a role="button" title="Choose a decade">
              {start}-{end}
            </a>
            <a role="button" title="Next decade" onClick={this.nextYear}></a>
          </div>
          <div className={styles.body}>
            <ul>
              <li className={styles.prev}><a onClick={this.prevYear}>{start-1}</a></li>
              <li ><a onClick={()=>{this.chooseYear(start);}}>{start}</a></li>
              <li><a onClick={()=>{this.chooseYear(start+1);}}>{start+1}</a></li>
            </ul>
            <ul>
              <li><a onClick={()=>{this.chooseYear(start+2);}}>{start+2}</a></li>
              <li><a onClick={()=>{this.chooseYear(start+3);}}>{start+3}</a></li>
              <li><a onClick={()=>{this.chooseYear(start+4);}}>{start+4}</a></li>
            </ul>
            <ul>
              <li><a onClick={()=>{this.chooseYear(start+5);}}>{start+5}</a></li>
              <li><a onClick={()=>{this.chooseYear(start+6);}}>{start+6}</a></li>
              <li><a onClick={()=>{this.chooseYear(start+7);}}>{start+7}</a></li>
            </ul>
            <ul>
              <li><a onClick={()=>{this.chooseYear(start+8);}}>{start+8}</a></li>
              <li><a onClick={()=>{this.chooseYear(start+9);}}>{start+9}</a></li>
              <li className={styles.next}><a onClick={this.nextYear}>{start+10}</a></li>
            </ul>
          </div>
        </div>:''}
      </div>
    );
  }
};

export default YearPicker;
