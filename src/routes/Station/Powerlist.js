import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col,Tabs, Card, Form, Tooltip,Input, Select, Badge,Cascader, Popconfirm, Popover, Icon, Checkbox, Button, Dropdown, Menu, Divider, InputNumber, DatePicker, Modal, message, Table } from 'antd';
import {
  ChartCard, yuan, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart} from '../../components/Charts';
import MiniAreaChart from '../../components/Charts/MiniAreaChart';
import Trend from '../../components/Trend';
import moment from 'moment';
import numeral from 'numeral';
import { routerRedux } from 'dva/router';
import styles from './Powerlist.less';
import StandardTable from '../../components/PowerStationTable';
import MapCluster from '../../components/MapCluster';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
const { TabPane } = Tabs;
const status = ['关闭', '运行中', '已上线', '异常'];
const statusMap = ['default', 'processing', 'success', 'error'];

// const moreMenu = (
//   <Menu>
//
//     <Menu.Item>
//       <a rel="noopener noreferrer" >转移业主</a>
//     </Menu.Item>
//     <Menu.Item>
//       <a rel="noopener noreferrer" >转移经销商</a>
//     </Menu.Item>
//   </Menu>
// );
 const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

@connect(state => ({
    station: state.station,
    login: state.login,
    }))
@Form.create()
export default class Powerlist extends PureComponent {

        constructor(props) {
            super(props);
            this.state = {
                addInputValue: '',
                modalVisible: false,
                expandForm: false,
                selectedRows: [],
                formValues: {},
                columnsList: this.columns,
                checkColumnsList: [],
                dropDownVisible: false,//列表选项
                record: {},
                rangePickerValue: [],//moments
                rangePickerValueString:[],
                ownerId:0,//业主Id
                operateTYpe:"sigle",//sigle 转移单个电站 mult:转移多个电站
                width:0,//table的宽度
            }
        }
        componentDidMount() {
           const {dispatch} = this.props;
           dispatch({type:"station/queryTableColumns"});
            dispatch({
                type: 'station/queryList',
                payload: {pageNum:1,pageSize:10}
            });
           dispatch({type:'station/getStationAddress'});
           dispatch({type:'station/generalStatistics'});
           dispatch({type:'station/queryOwner',payload:{}})
           dispatch({type:'station/getStationMapList'});
        }
        componentWillUnmount() {}
        handleSelectRows = (rows) => {
            this.setState({
                selectedRows: rows,
            });
        }
        //删除
        delStation=(record) => {
            const {dispatch} = this.props;
            dispatch({type:'station/deleteStationById',payload:{id:record.id}})
        }
        //建设中的电站不可进入电站详情，提示去完成建站
        toCompleteStation = () => {
          message.info("未完成建站，请在操作中去编辑完成建站！");
        }
        dropMenu = (
        <Menu onClick={this.handleMenuClick}>
            <Menu.Item >
              <a rel="noopener noreferrer" onClick={()=>{this.batchUpdateStationAuth(1)}}>打开权限</a>
            </Menu.Item>
          <Menu.Item >
            <a rel="noopener noreferrer" onClick={()=>{this.batchUpdateStationAuth(0)}}>关闭权限</a>
          </Menu.Item>
            <Menu.Item >
              <a rel="noopener noreferrer" onClick={()=>{this.showOwnerModal(true,{})}}>转移业主</a>
            </Menu.Item>
          </Menu>
        );
        columns =[
            {
                title: '电站ID',
              width:100,
              // fixed: 'left',
                dataIndex: 'id',
            },
            {
                title: '电站名称',
              width:200,
              // fixed: 'left',
              dataIndex: 'full_name',
              render:(text,record)=>{
                  let url = "#/station/view/"+record.id+"&"+record.full_name;
                  if(record.status == 40){
                    return (<a href={url}>{record.full_name}</a>)
                  }
                  else{
                    return (<a onClick={this.toCompleteStation}>{record.full_name}</a>)
                  }

              }
            },
          {
            title: '建站状态',
            dataIndex: 'status',
            width:100,
            render(text,record) {
              let SiteStatus=null;
              if(record.status == 40){
                SiteStatus =<Badge status="success" text="已完成" />;
              }else{
                SiteStatus =<Badge status="processing" text="建设中" />;
              }
              return SiteStatus;
            },
          },
            {
                title: '国家',
                width:140,
                dataIndex: 'country',
            },
            {
                title: '省',
                width:140,
                dataIndex: 'district_lv1',
            },
          ,
          {
            title: '详细地址',
            width:200,
            dataIndex: 'address',
            render:(text)=>{
              if(text && text.length > 20){
                const str = text.substring(0,20);
                return <span title={text}>{str}...</span>
              }
            }
          },
            {
                title: '装机容量',
                width:150,
                dataIndex: 's$equipe_capacitor',
                sorter: true,

            },
            {
                title: '告警状态',
                dataIndex: 'alarmStatus',
                width:160,
                filters: [
                    {
                        text: "运行中",
                        value: 0,
                    },
                    {
                        text: '已告警',
                        value: 1,
                    }

                ],
                render(text,record) {
                  if(record.lastAlarm){
                    if(record.lastAlarm.total >0){
                      return <a className={styles.warningStatus}><Badge status="error" text="已告警" />&nbsp;&nbsp;{record.lastAlarm.total}</a>;
                    }else{
                      return <Badge status="success" text="运行中"  />;
                    }
                  }else{
                    return <Badge status="success" text="运行中"  />;
                  }


                },
            },
          {
            title:'业主',
            width:160,
            dataIndex:'ownerName',
          },
          {
            title:'联系方式',
            width:160,
            dataIndex:'contact_number',
          },
            {
            title: '创建时间',
            dataIndex: 'createAt',
            width:160,
            sorter: true,
            render: (text,record) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
          },
          {
            title: '数据更新',
            dataIndex: 'lastTime',
            width:180,
            sorter: true,
            render: (text,record) =>{
              return text?<span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>:<span>--</span>;
            }
          },
            {
              title: '操作',
              dataIndex: 'operate',
              width:270,
              // fixed: 'right',
                render: (text,record) => {
                    return (
                        <div>
            <a onClick={() => this.editStation(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.delStation(record)}>删除</a>
            <Divider type="vertical" />
            {record.visible===0?<a onClick={()=>this.updateStationAuth(record)}>打开权限</a>:<a onClick={()=>this.updateStationAuth(record)}>关闭权限</a>}
            <Divider type="vertical" />
            <a onClick={()=>{this.showOwnerModal(true,record)}}>转移业主</a>
          </div>
                    )
                }
            },
        ];
        //选择下拉框
        handleDropdown =(record) => {
            this.setState({
                record: record
            });
        }
        //列表选项保存选中的值
        onChangeColumns = (checkedValues) => {

            this.setState({
                checkColumnsList: checkedValues
            });
        }
        // 修改表格显示的字段 type：ok 确定 reset ：重置
        handleTableColumn = (type) => {
          const {dispatch} = this.props;
            if (type == 'reset') {
                this.setState({
                    // checkColumnsList: [],
                    // columnsList: this.columns,
                    dropDownVisible: false
                });
                dispatch({type:"station/saveData",payload:{tableColumnsList:[]}})

                return false;
            }
            const arr = [];
            const checkedValues = this.state.checkColumnsList;
            dispatch({type:"station/saveTableColumns",payload:{tableName:"stationList",cols:checkedValues.length >0 ?checkedValues.join(","):""}})


            this.setState({
                dropDownVisible: false
            });
        }
        // dropdown  显示隐藏状态
        handleVisibleChange = (flag) => {
            this.setState({
                dropDownVisible: flag
            });
        }
        //表格数据过滤，分页，排序功能
        handleStandardTableChange = (pagination, filtersArg, sorter) => {
            const {dispatch} = this.props;
            const {formValues} = this.state;

            const filters = Object.keys(filtersArg).reduce((obj, key) => {
                const newObj = {
                    ...obj
                };
                newObj[key] = getValue(filtersArg[key]);
                return newObj;
            }, {});
            const params = {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,
                ...filters,
            };
            if (sorter.field) {
                params.sorter = `${sorter.field} ${sorter.order}`;
            }
            dispatch({
                type: 'station/queryList',
                payload: params,
            });
        }
        // 重置查询Form表单
        handleFormReset = () => {
            const {form, dispatch} = this.props;
            form.resetFields();
            this.setState({
                formValues: {},
            });
        }
        //简单查询和高级查询切换
        toggleForm = () => {
            this.setState({
                expandForm: !this.state.expandForm,
            });
        }
        //创建时间选择
        handleRangePickerChange = (date, dateString) => {
            this.setState({
                rangePickerValue:date,
                rangePickerValueString:dateString
            });
        }
        handleModalVisible = (flag) => {
            this.setState({
                modalVisible: !!flag,
            });
        }
        //新增电站
        handleNewStation =(type) => {
            const {dispatch} = this.props;
            dispatch(routerRedux.push('/station/'+type+'/0'));
        }
        //编辑电站
        editStation =(record) => {
            const {dispatch} = this.props;
          const status = record.status;
            if(record.build_type ===1){
              switch(status){
                case 10:
                  dispatch(routerRedux.push('/station/quicksite/'+record.id+'/device'));
                  break;
                case 20:
                  dispatch(routerRedux.push('/station/quicksite/'+record.id+'/diagram'));
                  break;
                case 30:
                  break;
                case 40:
                  dispatch(routerRedux.push('/station/quicksite/' + record.id));
                  break;
              }
            }else if(record.build_type ===2){
              dispatch(routerRedux.push('/station/profession/' + record.id));
            }
        }
        //修改电站权限
        updateStationAuth=(record)=>{
          let status = 0;
          if(record.visible ===0){
            status = 1;
          }
          this.props.dispatch({type:"station/updateStationInfo",payload:{stationIds:record.id,visible:status}});
        }
      //批量修改电站权限
      batchUpdateStationAuth=(visible)=>{
        const ids = this.state.selectedRows.map((item)=>{return item.id});
        this.props.dispatch({type:"station/updateStationInfo",payload:{stationIds:ids.join(","),visible:visible}});
      }
        //转移业主
          handleMoveOwner=()=>{
            const {dispatch} = this.props;
            let stationIds="";
            if(this.state.operateTYpe ==='sigle'){
              stationIds = this.state.record.id;
            }else{
              const ids = this.state.selectedRows.map((item)=>{return item.id});
              stationIds = ids.length > 0?ids.join(","):"";
            }
            if(this.state.ownerId===0){
              message.destroy();
              message.warning("请选择业主");
            }else{
              dispatch({type:"station/moveOwner",payload:{ownerId:this.state.ownerId,stationIds:stationIds}})
            }
        }
        //业主信息变化
        onChangeOwner =(values)=>{
          this.setState({ownerId:values});
        }
        //显示隐藏转移业主modal
        showOwnerModal =(visible,record)=>{
          const {dispatch} = this.props;
          dispatch({type:'station/saveData',payload:{ownerVisibler:visible}});
          if(record.id){
            this.setState({record,operateTYpe:'sigle'});
          }else{
            this.setState({record:{},operateTYpe:'mutil'});
          }
        }
        //查询列表
        handleSearch =(e)=>{
          this.props.form.validateFieldsAndScroll((err, values) => {
            e.preventDefault();
            if (!err) {

              const {dispatch,station} = this.props;
              let payload ={};
              if(values.fullName){
                payload.fullName = values.fullName;
              }
              if(values.alarmStatus){
                payload.alarmStatus = values.alarmStatus;
              }
              if(this.state.rangePickerValueString.length > 0){
                payload.startDate =new Date(this.state.rangePickerValueString[0]).getTime();
                payload.endDate =new Date(this.state.rangePickerValueString[1]).getTime();
              }
              if(values.status){
                payload.status =values.status;
              }
              if(values.country){
                payload.country =values.country.join(",");
              }
              payload.pageNum = 1;
              payload.pageSize = station.data.pagination.pageSize;
              dispatch({
                type: 'station/queryList',
                payload: payload
              });
            }
          })
        }
        renderSimpleForm() {
            const {getFieldDecorator} = this.props.form;
            return (
                <Form  layout="inline">
        <Row gutter={{
                    md: 8,
                    lg: 24,
                    xl: 48
                }}>
          <Col md={8} sm={24}>
            <FormItem label="电站名称">
              {getFieldDecorator('fullName')(
                    <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="告警状态">
              {getFieldDecorator('alrmStatus')(
                    <Select placeholder="请选择" style={{
                        width: '100px'
                    }}>
                  <Option value="0">运行中</Option>
                  <Option value="1">已告警</Option>
                </Select>
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>查询</Button>
              <Button style={{
                    marginLeft: 8
                }} onClick={this.handleFormReset}>重置</Button>

              <a style={{
                    marginLeft: 8
                }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>

            </span>
          </Col>
        </Row>
      </Form>
            );
        }
        renderAdvancedForm() {
            const {getFieldDecorator} = this.props.form;
            const {rangePickerValue} = this.state;
            const {data}= this.props.station;
            return (
                <Form layout="inline">
        <Row gutter={{
                    md: 8,
                    lg: 24,
                    xl: 48
                }}>
          <Col md={8} sm={24}>
            <FormItem label="电站名称">
              {getFieldDecorator('fullName')(
                    <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="告警状态">
              {getFieldDecorator('alarmStatus')(
                    <Select placeholder="请选择" style={{width: '100px'}}>
                  <Option value="0">运行中</Option>
                  <Option value="1">已告警</Option>

                </Select>
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="国家地区">
              {getFieldDecorator('country')(
                <Cascader  options={data.addressList} style={{width:'100%'}} changeOnSelect />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{
                    md: 8,
                    lg: 24,
                    xl: 48
                }}>
          <Col md={8} sm={24}>
            <FormItem label="建站状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100px'}}>
                  <Option value="0">运行中</Option>
                  <Option value="10">已告警</Option>

                </Select>
                )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="创建时间">
             <RangePicker
                value={rangePickerValue}
                onChange={this.handleRangePickerChange}
                style={{
                    width: 256
                }}
                />
            </FormItem>
          </Col>

        </Row>
        <div style={{
                    overflow: 'hidden'
                }}>
          <span style={{
                    float: 'right',
                    marginBottom: 24
                }}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button style={{
                    marginLeft: 8
                }} onClick={this.handleFormReset}>重置</Button>
            <a style={{
                    marginLeft: 8,
                    marginRight: 8
                }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>

          </span>
        </div>
      </Form>
            );
        }

        renderForm() {
            return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
        }
        getColumns=() =>{
          const column = this.props.station.data.tableColumnsList;
          let width=350;
          let arr =[];
          if(column.length >0){
            this.columns.map((item) => {
              column.map((col) => {
                if (item.dataIndex === col) {
                  width+=item.width;
                  arr.push(item);
                }

              });
              if(item.dataIndex ==="operate"){
                arr.push(item);
              }
            });
          }else{
            arr =this.columns;
          }
          this.setState({width})
          return arr;

        }

        //判断是否有权限
        buttonIs = (key) =>{
          const {button} = this.props.login;
          let result = false;
            button.forEach((item)=>{
              if(item.resourceUrl = key){
                result = true;
              }
              else {result = false;}
            })
          return result;
        }
        //tabs默认选择电站列表或者底地图
        activeKey = () => {
          if(this.buttonIs("sell_info_station")){
            return "1";
          }
          else {return "2";}
        }

        render() {
            const {station: {loading, data}} = this.props;
            const {statisticsList , statisticsListOPS} = this.props.station.data;
            //销售统计信息
            const stationTotal = statisticsList.stationTotal?statisticsList.stationTotal.total:0;
            const onStationTotal = statisticsList.stationTotal?statisticsList.stationTotal.online:0;
            const buildStationTotal = statisticsList.stationTotal?statisticsList.stationTotal.build:0;
            const powerTotal = statisticsList.totalPower?statisticsList.totalPower:0;
            const alarmTotal = statisticsList.alarmCount?statisticsList.alarmCount.total:0;
            const targetAlarm = statisticsList.alarmCount?statisticsList.alarmCount.targetAlarm:0;
            const connectAlarm = statisticsList.alarmCount?statisticsList.alarmCount.connectAlarm:0;
            const last7DayPower = statisticsList.last7DayPower?statisticsList.last7DayPower:[];
            const last7DayAlarm = statisticsList.last7DayAlarm?statisticsList.last7DayAlarm:[];

            //运维统计信息
            const stationTotal_OPS = statisticsListOPS.stationTotal?statisticsListOPS.stationTotal.total:0;
            const onStationTotal_OPS = statisticsListOPS.stationTotal?statisticsListOPS.stationTotal.online:0;
            const buildStationTotal_OPS = statisticsListOPS.stationTotal?statisticsListOPS.stationTotal.build:0;
            const todayPower_OPS = statisticsListOPS.todayPower?statisticsListOPS.todayPower:0;
            const totalPower_OPS = statisticsListOPS.totalPower?statisticsListOPS.totalPower:0;
            const alarmTotal_OPS = statisticsListOPS.alarmCount?statisticsListOPS.alarmCount.total:0;
            const dtu_OPS = statisticsListOPS.alarmCount?statisticsListOPS.alarmCount.dtu:0;
            const micro_OPS = statisticsListOPS.alarmCount?statisticsListOPS.alarmCount.micro:0;
            const repeater_OPS = statisticsListOPS.alarmCount?statisticsListOPS.alarmCount.repeater:0;

            const {selectedRows, modalVisible, addInputValue,checkColumnsList} = this.state;
            const columnsList =this.getColumns();
            const tableColum = (
            <Checkbox.Group defaultValue={data.tableColumnsList}  onChange={this.onChangeColumns} style={{
                paddings: '10px'
            }}>
        <Row>
          {this.columns.map((item) => {
                if(item.dataIndex!="operate"){
                  return (
                    <Col style={{
                      padding: '10px 10px 0px 10px'
                    }}><Checkbox  value={item.dataIndex}>{item.title}</Checkbox></Col>

                  );
                }

            })
            }

        </Row>
        <Row className="dropChk">
          <Col span={12}><a onClick={() => this.handleTableColumn('ok')}>确定</a></Col>
          <Col span={12}><a onClick={() => this.handleTableColumn('reset')}>重置</a></Col>
        </Row>
      </Checkbox.Group>
            );
            const visitData =[{x:'2012-01-02',y:100},{x:'2012-01-03',y:10},{x:'2012-01-04',y:60},{x:'2012-01-05',y:20}];
      return (
        <div>
        {this.buttonIs("sell_info_station")?<Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="电站总数"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(stationTotal).format('0,0')}
              footer={
                <div>
                  <Trend flag="" style={{ marginRight: 16 }}>
                    在线<span className={styles.trendText}>&nbsp;&nbsp;{`${numeral(onStationTotal).format('0,0')}`}</span>
                  </Trend>
                  <Trend flag="">
                    建设中<span className={styles.trendText}>&nbsp;&nbsp;{`${numeral(buildStationTotal).format('0,0')}`}</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <Trend flag="" style={{ marginRight: 16 }}>

              </Trend>
              {/*<Trend flag="">*/}
                {/*建设中<span className={styles.trendText}>11</span>*/}
              {/*</Trend>*/}
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="发电量"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(powerTotal).format('0,0')}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="" style={{ marginRight: 16 }}>
                    碳减排<span className={styles.trendText}>12ppm</span>
                  </Trend>
                  <Trend flag="">
                    种树<span className={styles.trendText}>11棵</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniAreaChart
                color="#975FE4"
                height={46}
                data={last7DayPower}
              />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="告警"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(alarmTotal).format('0,0')}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="" style={{ marginRight: 16 }}>
                    指标<span className={styles.trendText}>&nbsp;&nbsp;{targetAlarm}</span>
                  </Trend>
                  <Trend flag="">
                    连通<span className={styles.trendText}>&nbsp;&nbsp;{connectAlarm}</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniBar
                height={46}
                data={last7DayAlarm}
              />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="系统"
              total=""
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}

              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="" style={{ marginRight: 16 }}>

                  </Trend>
                  <Trend flag="">

                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <Row gutter={8} style={{ top: '20px' }}>
                <Col span={12}>
                  <Pie
                    animate={false}
                    percent={28}
                    subTitle="CPU"
                    total="28%"
                    height={120}
                    lineWidth={1}
                  />
                </Col>
                <Col span={12}>
                  <Pie
                    animate={false}
                    color="#5DDECF"
                    percent={22}
                    subTitle="网络"
                    total="22%"
                    height={120}
                    lineWidth={1}
                  />
                </Col>

              </Row>
            </ChartCard>
          </Col>
        </Row>:
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <div className={styles.stationinfo}>
              {/*<p>电站数量<span>{stationTotal_OPS}</span></p> */}
              <p>电站数量</p>
              <p>{stationTotal_OPS}</p> 
              <p>已完成：{onStationTotal_OPS}建设中：{buildStationTotal_OPS}</p>
            </div>
          </Col>
          <Col {...topColResponsiveProps}>
            <div className={styles.stationinfo} style={{padding:30}}>
              <p>当日发电量</p> 
              <p>{todayPower_OPS}</p>
            </div>
          </Col>
          <Col {...topColResponsiveProps}>
            <div className={styles.stationinfo} style={{padding:30}}>
              <p>累计发电量</p> 
              <p>{totalPower_OPS}</p>
            </div>
          </Col>
          <Col {...topColResponsiveProps}>
            <div className={styles.stationinfo}>
              <p>告警数量</p>
              <p>{alarmTotal_OPS}</p> 
              <p>微逆：{micro_OPS} 中继器：{repeater_OPS} DTU：{dtu_OPS}</p>
            </div>
          </Col>
        </Row>}

                <Card bordered={false}>
                <Tabs  size="large" tabBarStyle={{ marginBottom: 24 }} defaultActiveKey={this.activeKey()}>
                    <TabPane tab="电站列表" key="1">
                      <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                          {this.renderForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                          <Dropdown visible={this.state.dropDownVisible} overlay={tableColum} trigger="click" onVisibleChange={this.handleVisibleChange}>
                            <Button>
                                列表选项 <Icon type="down" />
                            </Button>
                          </Dropdown>
                          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                            新建
                          </Button>
                          <Button  type="primary" >
                            导出
                          </Button>
                          {
                            selectedRows.length > 0 && (
                            <span>
                                <Dropdown overlay={this.dropMenu} trigger="click">
                                  <Button>
                                    更多操作 <Icon type="down" />
                                  </Button>
                                </Dropdown>
                              </span>
                            )
                            }
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            width={this.state.width}
                            data={data}
                            columns={columnsList}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                            expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                            />
                      </div>
                      </TabPane>
                          <TabPane tab="地图" key="2">
                            <MapCluster data={data.stationMapList}/>
                          </TabPane>
                      </Tabs>
                    </Card>
          <Modal
                title="建站选择"
                visible={modalVisible}
                onOk={this.handleAdd}
                onCancel={() => this.handleModalVisible()}
                width={400}
                footer={null}
                >
                 <h4>根据建站规模，选择建站类型</h4>
               <Row className={styles.stationType} gutter={8}>
                 <Col className={styles.stationBtn} span={12}>
                   <Button type="primary" onClick={() => this.handleNewStation('quicksite')}>快速</Button>
                 </Col>
                 <Col className={styles.stationBtn}  span={12}>
                   <Button type="primary" onClick={() => this.handleNewStation('profession')}>专业</Button>
                 </Col>
               </Row>

        </Modal>
        <Modal
          title="选择业主"
          visible={data.ownerVisibler}
          onOk={this.handleMoveOwner}
          onCancel={()=>{this.showOwnerModal(false,{})}}
          width={400}
        >
          <Row gutter={8}>
            <Col className={styles.stationBtn} span={24}>
              <Select
                style={{ width: 200 }}
                onChange={this.onChangeOwner}
              >
                {data.ownerList && data.ownerList.map((item)=>{
                  return <Option key={item.id}>{item.name}</Option>
                })}
              </Select>
            </Col>

          </Row>

        </Modal>
      </div>
            )
        }
    }
