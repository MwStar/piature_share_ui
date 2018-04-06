/**
 *  desc: 新增固件包
 * author: ll
 */
 import React, { Component } from 'react';
 import { Input,Row,Col, Icon, message,Tabs,Button,Card,Modal,Form,Table,Tooltip} from 'antd';
 import styles from './index.less';
 import {connect} from 'dva';
 import { routerRedux } from 'dva/router';
 import {setLocalStorage, getLocalStorage} from '../../utils/utils';
 import MinuteChart from './MinuteChart';
 import DayChart from './DayChart';
 import MonthChart from './MonthChart';
 import YearChart from './YearChart';
 import {config} from '../../utils/config';
 import DateUtil from '../../utils/DateUtil';
 import NoData from './NoData';
 /*const requireContext = require.context("../../assets/icons", true, /^\.\/.*\.png$/);
const projectImgs  = requireContext.keys().map(requireContext);
console.log("images--"+projectImgs);*/

 const ButtonGroup = Button.Group;
 const TabPane = Tabs.TabPane;
 const FormItem = Form.Item;
 const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12}
  }
};
/**
 *
 类说明：电站详情，概览
 @class 类名 UploadModal
 @constructor
 */
 @connect(state => ({
  view: state.view,
  login: state.login,
  warning: state.warning,
}))
 @Form.create()

 export default class StationView extends Component {
 	columns = [
      {
        title: '设备ID',
        dataIndex: 'sn',
        key: 'sn'
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: ((text) => {
          return (
            <span>{DateUtil.TimestampToDate(new Date(text), "yyyy-MM-dd hh:mm:ss")}</span>
          )
        })
      },
      {
        title: '告警代码',
        dataIndex: 'alarm_code',
        key: 'alarm_code',
      },
    {
        title: '告警内容',
        dataIndex: 'suggestion',
        key: 'suggestion',
      },
    ];
  state = {
    visible:false,//收入计算框
    alarmVisible:false,//告警列表
    name:false,//安装商名字
    panel:1,//canvas面板
    chartname:'chart',//导出时图表的名字
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const {id} = this.props;
    dispatch({
      type: 'view/fetch',
      payload:{id:id}
    });  
    dispatch({type: 'view/rateFetch',payload:{id:id}}); 
  }
	//modal收入计算显示
	countView = () => {
		this.setState({visible:true});
	}
	//收入计算
	count = () => {
		const form = this.props.form;
		const daypower=1000;
		const allpower=200;
		const price = form.getFieldValue('price');
		const unit = form.getFieldValue('unit');
		const node = document.getElementById('income');
    	node.value = price*daypower;
    	const no = document.getElementById('allincome');
    	no.value = price*allpower;
    	setLocalStorage("income", {price:price,unit:unit});
	}
	//取消
	cancel = () => {
		this.setState({visible:false});
	}
	//切换面板时加载数据
	onChangeTab = (key) => {
		const { dispatch } = this.props;
		const {id} = this.props;
    	const dayValue = {
    	reportTimeType:1,
    	stationId:id,
    	};
    	const monthValue = {
    	reportTimeType:3,
    	stationId:id,
    	};
    	const yearValue = {
    	reportTimeType:4,
    	stationId:id,
    	};
		switch(key){
			case "1":
				dispatch({type: 'view/rateFetch',payload:{id:id}});
				this.setState({panel:1});
				break;
			case "2":
				dispatch({type: 'view/powerFetch',payload:dayValue});
				this.setState({panel:2});
				break;
			case "3":
				dispatch({type: 'view/powerFetch',payload:monthValue});
				this.setState({panel:3});
				break;
			case "4":
				dispatch({type: 'view/powerFetch',payload:yearValue});
				this.setState({panel:4});
				break;
		}
	}
	//安装商鼠标移进
	imgMouseEnter = (e) => {
		e.stopPropagation();
		this.setState({name:true});
	}
	//安装商鼠标移出
	imgMouseLeave = (e) => {
		e.stopPropagation();
		this.setState({name:false});
	}
	//导出图片
	exportImg = () => {
		const {panel,chartname} = this.state;
		const {rate,power} = this.props.view;
		if(panel===1){
			if(rate.length>0){
				var canvasDom = document.getElementById('minute').getElementsByTagName("canvas");
				this.setState({chartname:'minute'});
				let Img = new Image();
				Img.src=canvasDom[0].toDataURL("image/jpg");
				var linka = document.createElement('a');
				linka.download = (chartname || 'chart') + '.jpg';
				linka.href = Img.src;
				linka.click();
			}
			else{
				message.info("没有数据可导出");
			}
		}
		else{
			if(power.length>0){
				switch(panel){
					case 1:
						var canvasDom = document.getElementById('minute').getElementsByTagName("canvas");
						this.setState({chartname:'minute'});
						break;
					case 2:
						var canvasDom = document.getElementById('day').getElementsByTagName("canvas");
						this.setState({chartname:'day'});
						break;
					case 3:
						var canvasDom = document.getElementById('month').getElementsByTagName("canvas");
						this.setState({chartname:'month'});
						break;
					case 4:
						var canvasDom = document.getElementById('year').getElementsByTagName("canvas");
						this.setState({chartname:'year'});
						break;

				}
				let newImg = new Image();
				newImg.src=canvasDom[0].toDataURL("image/jpg");
				var link = document.createElement('a');
				link.download = (chartname || 'chart') + '.jpg';
				link.href = newImg.src;
				link.click();
			}
			else{
				message.info("没有数据可导出");
			}
		}
		
		
	}
	//点击告警
	clickWarning = () => {	
		if(this.buttonIs("to_warning")){
			this.toWarning();
		}
		else{this.alarmModal();}
	}
	//告警框
	alarmModal = () => {
		const {id} = this.props;
		const { dispatch } = this.props; 
	    dispatch({
	      type: 'view/List',
	      payload:{stationId:id}
	    });
		this.setState({alarmVisible:true});
	}
	//跳转到告警页面
	toWarning = () => {
		const {info:{fullName}} = this.props.view;
		const {dispatch} = this.props;
		dispatch({type:'warning/saveName',stationName:fullName});
		dispatch(routerRedux.push('/warning/list'));
	}
	alarmCancel = () => {
		this.setState({alarmVisible:false});
	}
	handleSizeChange = (current, size) => {
		const {id} = this.props;
	    const { dispatch } = this.props;
	    const values ={
	    	stationId:id,
	    	pageNum:current,
	    	pageSize:size,
	    }
	    dispatch({
        type: 'view/List',
        payload: values,
      });
  	}
  	handlePageChange = (pageNum, pageSize) => {
  		const {id} = this.props;
	    const { dispatch } = this.props;
	    const values ={
	    	stationId:id,
	    	pageNum:pageNum,
	    	pageSize:pageSize,
	    }
	    dispatch({
        type: 'view/List',
        payload: values,
      });
  };

  //编辑电站信息
  editStationInfo = () => {
  	const {dispatch} = this.props;
  	const {info:{id}} = this.props.view;
  	dispatch(routerRedux.push('/station/editInfo/'+ id));
  }
  //权限
  buttonIs = (key) =>{
    const {button} = this.props.login;
    let result = false;
      button.forEach((item)=>{
        if(item.resourceUrl = key){
          result = true;
        }
        else {result = false;}
      })
      console.log("权限----"+result);
    return result;
  }

  render() {
    //const { record } = this.props;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {visible,name,alarmVisible} = this.state;
    //ownerInfo,userInfo,电站名称，装机容量，时区，电站图片,国家，省，市，区，最后更新|告警信息，安装商信息，总体统计信息，分钟功率统计，发电量统计,天气信息
    const {info:{userInfo,fullName,equipeCapacitor,displayName,picPath,country,districtLv1,districtLv2,districtLv3,updateAt},alarm,install,currInfo,rate,power,weather} = this.props.view;
    const {list,pagination} = this.props.view;
	const icon = weather&&weather.length>0?weather[0].weather.icon:'';
    const income = getLocalStorage("income");
    /*let imgURL = '';
    if(icon){
		for (let j = 0; j < projectImgs.length;j++){
	            if(projectImgs[j].indexOf(icon) > 0){  
	                imgURL = projectImgs[j];  
	            } 
	    }
    }*/

    return (
	      	<div>
	      		<Row>
	      			<Col md={18} sm={24}>
			      		<div className={styles.statistics}>
				      		<ul>
				      			<li>
				      				<p>当前发电量</p><Icon type="pay-circle-o" onClick={this.countView}/>
				      				<p><span>{currInfo.length>0?new Number(currInfo.today_total).toFixed(2):0}</span><span>kWh</span></p>
				      			</li>
				      			<li className={styles.divide}></li>
				      			<li>
				      				<p>当前功率</p>
				      				<p><span>{currInfo.length>0?new Number(currInfo.power).toFixed(2):0}</span><span>kW</span></p>
				      			</li>
				      			<li className={styles.divide}></li>
				      			<li>
				      				<p>满发时间</p>
				      				<p><span>{currInfo.length>0?new Number(currInfo.cur_manfa).toFixed(2):0}</span><span>小时</span></p>
				      			</li>
				      		</ul>
				      		<ul>
				      			<li>
				      				<p>累计发电量</p><Icon type="pay-circle-o" onClick={this.countView}/>
				      				<p><span>{currInfo.length>0?new Number(currInfo.his_total).toFixed(2):0}</span><span>kWh</span></p>
				      			</li>
				      			<li className={styles.divide}></li>
				      			<li>
				      				<p>总减排</p>
				      				<p><span>11</span><span>吨</span></p>
				      			</li>
				      			<li className={styles.divide}></li>
				      			<li>
				      				<p>相当于种树</p>
				      				<p><span>11</span><span>棵</span></p>
				      			</li>
				      		</ul>	
			      		</div>
				        <div className={styles.block}>
				      			<span>发电统计</span>
				      			<i className={`iconfont icon-pic ${styles.exportImg}`} onClick={this.exportImg}></i>
				      		<div className={styles.cardcontainer}>
							    <Tabs type="card" onChange={this.onChangeTab}>
								   <TabPane tab="分钟" key="1">{rate.length>0?<MinuteChart data={rate}></MinuteChart>:<NoData></NoData>}</TabPane>
								   <TabPane tab="日" key="2">{power.length>0?<DayChart data={power}></DayChart>:<NoData></NoData>}</TabPane>
								   <TabPane tab="月" key="3">{power.length>0?<MonthChart data={power}></MonthChart>:<NoData></NoData>}</TabPane>
								   <TabPane tab="年" key="4">{power.length>0?<YearChart data={power}></YearChart>:<NoData></NoData>}</TabPane>
								</Tabs>
							</div>
						</div>
			      	</Col>
			      	<Col md={6} sm={24}>
			      		<div className={styles.blockright}>
			      			{/*<span>告警</span>*/}
			      			<div className={styles.alarm}>
			      				{alarm.total?
			      					<div onClick={()=>{this.clickWarning()}} className={styles.one_alarm}>
				      					<p><i className="iconfont icon-armal"></i><span>告警{alarm.total}</span></p>
				      					<p>最新告警:{alarm.suggestion}</p>
			      					</div>
			      					:<div className={styles.no_alarm}><i className="iconfont icon-normal"></i><span>正常</span></div>
			      				}
			      			</div>
			      		</div>
			      		<div className={styles.blockright}>
			      			{/*<span>安装商</span>*/}
			      			<div className={styles.install}>
			      				{install.logoPath?
			      					<Tooltip title={`安装商：${install.name}
			      					电话：${install.phone}`}>
									    <img src={install.logoPath?config.CHRCK_FILE+install.logoPath:''}
				      					/>
								  </Tooltip>
								  :<Tooltip title={`电话：${install.phone}`}>
								    <p>安装商：{install.name}</p>
								  </Tooltip>}
			      				{/*{name&&install.logoPath?<span
			      						onMouseEnter = {this.imgMouseEnter}
			      						onMouseLeave = {this.imgMouseLeave}
			      					>{install.name}
			      					</span>:''}*/}
			      			</div>
			      		</div>
			      		<div className={styles.blockright}>
			      			{/*<span>电站信息</span><a>编辑</a>*/}
			      			<div className={styles.station}>
			      				{this.buttonIs("edit_station_info")?<i className="iconfont icon-bianji" onClick={this.editStationInfo}></i>:''}
			      				<span><img src={picPath}/></span>
			      				<p>电站名称：{fullName}</p>
			      				<p>装机容量：{equipeCapacitor}kw</p>
			      				<p>地址：{country+'/'+districtLv1+'/'+districtLv2+'/'+districtLv3}</p>
			      				<p>时区：{displayName}</p>
			      				<p>最后更新：{updateAt}</p>
			      			</div>
			      		</div>
			      		<div className={styles.blockright}>
			      			<div className={styles.weather}>
			      				<p><i className="iconfont icon-dingwei"></i>{weather&&weather.length>0?weather[0].cityName:''}</p>
			      				<div>
				      				{/*<img src={icon?require(`../../assets/icons/${icon}.png`):''} className={styles.weatherIcon}></img>*/}
				      				<i className={`iconfont icon-${icon} ${styles.weatherIcon}`}></i>
				      				<span>{weather&&weather.length>0?weather[0].stateCode:''}</span>
				      				℃
			      				</div>
			      				<p><span>日出{weather&&weather.length>0?weather[0].sunset:''}</span><span>日落{weather&&weather.length>0?weather[0].sunrise:''}</span></p>
			      			</div>
			      		</div>
			      		
			      	</Col>
	      		</Row>
	      		<Modal
		      		title='收入计算'
		            visible={visible}
		            width={600}
		            maskClosable={true}
		            footer={null}
		            onCancel={this.cancel}
	      		>
	      			<Form onSubmit={(e)=>{e.stopPropagation();this.count();}} className={styles.countform}>
		              <Row>
		                <Col span={24}>
		                  <FormItem {...formItemLayout} label="单位电价">
		                    {getFieldDecorator('price', {
		                      rules: [{ message: '请输入单位电价!' }],
		                      initialValue:income==null?'':income.price,
		                    })(
		                      <Input />
		                        )}
		                    <span>/kWh</span>
		                  </FormItem>
		                </Col>
		                <Col span={24}>
		                  <FormItem {...formItemLayout} label="货币单位">
		                    {getFieldDecorator('unit', {
		                      rules: [{ message: '请输入货币单位!' }],
		                      initialValue:income==null?'':income.unit,
		                    })(
		                      <Input />
		                        )}
		                  </FormItem>
		                </Col>
		                <Col span={24}>
			                <FormItem {...formItemLayout} label="当日电量"  className={styles.power}>
			                  <span>{currInfo.length>0?new Number(currInfo.today_total).toFixed(2):0}kWh</span><span>收入</span><Input readOnly className={styles.income} id="income"/>
			                </FormItem>
		                </Col>
		                <Col span={24}>
			                <FormItem {...formItemLayout} label="累计电量"  className={styles.power}>
			                  <span>{currInfo.length>0?new Number(currInfo.his_total).toFixed(2):0}MWh</span><span>收入</span><Input readOnly className={styles.income} id="allincome"/>
			                </FormItem>
		                </Col>
		                <Col span={7} offset={9}>
		                  <Button type="primary" htmlType="submit" style={{marginRight:20}}>计算</Button>
		                  <Button onClick={this.cancel}>取消</Button>
		                </Col>
		               </Row>
		              </Form>
	      		</Modal>
	      		<Modal
	      			title='告警列表'
		            visible={alarmVisible}
		            width={600}
		            maskClosable={true}
		            footer={null}
		            onCancel={this.alarmCancel}
	      		>
	      			<Table
						dataSource={list}
						columns={this.columns}
						className={styles.content}
		                pagination={{
		                total: pagination.total,
		                current: pagination.pageNum,
		                pageSize: pagination.pageSize,
		                showSizeChanger: true,
		                onShowSizeChange: this.handleSizeChange,
		                pageSizeOptions: ['10', '20', '50'],
		                showTotal: this.showTotal,
		                onChange: this.handlePageChange,
		                showQuickJumper: true,
		              }}
		            />
	      		</Modal>
	      	</div>
    );
  }
}
