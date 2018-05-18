import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Tooltip, Menu, Dropdown ,Avatar} from 'antd';
import numeral from 'numeral';
import {
  ChartCard, yuan, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart,MiniArea} from '../../components/Charts';
import Trend from '../../components/Trend';
import {config} from '../../utils/config';
import MonthChart from './MonthChart';

import styles from './Dashboard.less';


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
         if (new RegExp("(" + k + ")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));    
         }
    }
    return fmt;
}
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 10 },
    };

const date = new Date();
const currentYear = date.getFullYear();
const currentDay = date.getDay();
let ticksArray = [];
for (let i = 0; i < 7; i++) {
    ticksArray.push(new Date(date.getTime() + 24 * 60 * 60 * 1000 * (i - (currentDay + 6) % 7)).Format("yyyy-MM-dd"));
}
const mon = ['01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12'];
//const day = ['01','02', '03', '04', '05','06', '07', '08', '09','10', '11', '12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
let yearArray = [];
//let yearMonth = [];
mon.map((value)=>{
  yearArray.push(`${currentYear}-${value}`);
})
console.log('yearArray---',yearArray);
@connect(state => ({
  chart: state.chart,
}))
export default class Powerlist extends Component {
  state = {
    
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
     this.props.dispatch({
      type: 'chart/get',
      payload:{time:1},
    });
  }

/*  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }*/
  //改变选择
  onChangeTab = (key) => {
    const {dispatch} = this.props;
    switch(key){
      case "1":
        dispatch({type: 'chart/get',payload:{time:1}});//周
        break;
      case "2":
        dispatch({type: 'chart/get',payload:{time:2}});//月
        break;
      case "3":
        dispatch({type: 'chart/get',payload:{time:3}});//年
        break;
    }
  }



  render() {

    const { count, download ,data} = this.props.chart;
    const picture = count.picture?count.picture.all:'';
    const checked = count.picture?count.picture.checked:'';
    const unchecked = count.picture?count.picture.unchecked:'';
    const person = count.user?count.user.all:'';
    const user = count.user?count.user.user:'';
    const admin = count.user?count.user.admin:'';
    const down = count.down?count.down:'';
    const pageAll = count.pageview?count.pageview.all:'';
    const pageUser = count.pageview?count.pageview.login:'';
    const pageNotUser = count.pageview?count.pageview.unlogged:'';
    const list = count.ranking?count.ranking:[];
    const scale = {'x':{ticks:{}},'y':{}};
    console.log('data-----',data);
    return (
      <div>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="图片总数"
              action={<Tooltip title="本站拥有的所有图片数"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(picture).format('0,0')}
              contentHeight={46}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="" style={{ marginRight: 16 }}>
                    已审核<span className={styles.trendText}>{checked}</span>
                  </Trend>
                  <Trend flag="">
                    审核中<span className={styles.trendText}>{unchecked}</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="用户总数"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(person).format('0,0')}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="" style={{ marginRight: 16 }}>
                    用户<span className={styles.trendText}>{user}</span>
                  </Trend>
                  <Trend flag="">
                    管理员<span className={styles.trendText}>{admin}</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
 
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="下载量"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(down).format('0,0')}
              contentHeight={46}
            >

            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="浏览量"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(pageAll).format('0,0')}
               footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="" style={{ marginRight: 16 }}>
                    用户<span className={styles.trendText}>{pageUser}</span>
                  </Trend>
                  <Trend flag="">
                    游客<span className={styles.trendText}>{pageNotUser}</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >

            </ChartCard>
          </Col>

        </Row>
        
        <Row>
          <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <div className={styles.block}>
                <i className={`iconfont icon-pic ${styles.exportImg}`}></i>
                <div className={styles.cardcontainer}>
                  <Tabs type="card" onChange={this.onChangeTab}>
                   <TabPane tab="本周" key="1">{download.length>0?
                    /*<MonthChart data={data} array={ticksArray}></MonthChart>*/
                    <Bar
                        height={295}
                        title="本周下载量柱状图"
                        data={data}
                        ticks={ticksArray}
                        mask="YYYY-MM-dd"
                      />:''}
                    </TabPane>
                   <TabPane tab="本月" key="2">{download.length>0?
                    <MiniArea
                        height={295}
                        title="本月下载量趋势图"
                        data={data}
                        scale={scale}
                        timeType='20yy-mm-dd'
                      />:''}
                    </TabPane>
                   <TabPane tab="全年" key="3">{download.length>0?
                    <Bar
                        height={295}
                        title="全年下载量柱状图"
                        data={data}
                        ticks={yearArray}
                        mask="YYYY-MM"
                      />:''}
                   </TabPane>
                  </Tabs>
                </div>
          </div>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <div className={styles.rank}>
              <h4 className={styles.rankingTitle}>下载量排名</h4>
              <ul className={styles.rankingList}>
                {
                  list.map((item, i) => (
                    <li key={item._id}>
                      <span className={(i < 3) ? styles.active : ''}>{i + 1}</span>
                      <span onClick={this.showPicture}>{item.title}</span>
                      <span style={{color:'#f56a00',fontWeight:'bold',marginLeft:"20px"}}>{item.download_count}</span>
                      <span><Avatar size="small" className={styles.avatar} src={config.CHRCK_FILE+item.author.avatar} />{item.author.name}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
