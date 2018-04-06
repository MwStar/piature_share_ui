import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert,Row,Col,Badge, Divider,Menu ,Dropdown,Icon} from 'antd';
import {
  ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart
} from '../Charts';
import styles from './index.less';
import { capacityConver } from '../../utils/utils';


class PowerStationTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }
  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  expandedRowRender =(record) =>{
    console.log("record:",record);
    let percent = record.s$equipe_capacitor==0?0:(record.power/record.s$equipe_capacitor)*100;
     let target = percent +10;
    if(percent > 100){
      percent =100;
    }
    if(percent > 90){
      target =100;
    }
    let power = record.power +"Kw";
    if(record.power < 0){
        power  = power * 1000 +"W";
    }else if(record.power > 1000){
        power  = power/1000 +"Mw";
    }
   
    return (
      <div>
      <Row >
        <Col span={6}>当日发电量：{record.todayTotal} kWh
        </Col>
        <Col span={6}>累计发电量：{record.hisTotal} kWh</Col>
        <Col span={6}>
          <Row>
            <Col span={6}>当前功率：</Col><Col span={12}><MiniProgress percent={percent} target={target} strokeWidth={8} color="#13C2C2" /></Col>
            <Col span={6}>{power} </Col>
          </Row>
        </Col>
        <Col span={6}>满发时间：{record.hour}小时</Col>
      </Row >
        <Row style={{marginTop:20}}>
          <Col span={6}>微逆数量：{record.miCount}</Col>
          {record.lastAlarm ? <Col span={18}>告警总数：{record.lastAlarm.total} 最新告警：{record.lastAlarm.suggestion}</Col>
 :null}

        </Row>
      </div>
    )
  }
  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;
   
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showSizeChanger :true,
      pageSizeOptions:['10','20','50','100'],
      onShowSizeChange:function(current, pageSize){},
      showTotal:function(total){return `总共 ${total} 条数据`;},
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    // const documentW =document.body.clientWidth-290;
    // let width ={};
    // if(this.props.width > documentW){
    //   width ={x:this.props.width};
    // }
    return (
      <div className={styles.stationTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={this.props.columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          expandedRowRender={this.expandedRowRender}
          // expandRowByClick={true}
          scroll={{x:this.props.width}}
        />
        </div>
      </div>
    );
  }
}

export default PowerStationTable;
