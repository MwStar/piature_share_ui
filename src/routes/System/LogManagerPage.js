import React from 'react';
import { connect } from 'dva';
import { Table, Select, Button, Row, Col, Input, DatePicker ,Card} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import DateUtil from '../../utils/DateUtil.js';
import pageStyles from './LogManagerPage.css';

const Option = Select.Option;

//业务日志

const LogManagerPage = ({dispatch,syslog}) => {
	const {
		appName,
		param,
		priority,
		startTime,
		endTime,
		serviceProviderList,
		selectServiceProvider,
		/*logLevelList*/
	} = syslog;
	const columns = [{
		title: '应用名称',
		dataIndex: 'appName',
		width: 90
	}, {
		title: '操作人',
		dataIndex: 'operationUser',
		width: 50
	}, {
		title: '描述',
		dataIndex: 'description',
		width: 200
	},{
		title: '创建时间',
		dataIndex: 'createTime',
		width: 90
	}];

	/**
	 * 查询
	 */
	const queryLog = () => {
		setParamAndLoad(1);
	};

	//点击分页
	const handlePageChange = (pageNum) => {
		dispatch({type: 'syslog/setPageNum', pagination: {current:pageNum}});
		setParamAndLoad(pageNum);
	};

	//组织参数并进行查询
	const setParamAndLoad = (pageNum) => {
		let appName = selectServiceProvider.servicePlatformPrefix;
		let operationUser=document.getElementById("people").value;
		let queryKeys=document.getElementById("key").value;
		let param = {
			pageNum: pageNum,
			appName: appName,
			priority:"info",
			operationUser:operationUser,
			queryKeys:queryKeys,
			startTime: startTime==null?"":startTime.format("YYYY-MM-DD"),
			endTime: endTime == null?"":endTime.format("YYYY-MM-DD")
		};
		dispatch({type: 'syslog/querySysLog', param: param});
	};

	/**
	 * 获取服务商下的所有数据源
	 * @param id
	 */
	const changeServiceProvider = (servicePlatformPrefix) => {
		//设置选中
		selectServiceProvider.servicePlatformPrefix = servicePlatformPrefix;
		dispatch({type: 'syslog/setSelectServiceProvider', selectServiceProvider: selectServiceProvider});
	};

	const changePriority = (priority) => {
		//设置选中
		dispatch({type: 'syslog/setSelectPriority', priority: priority});
	};

	const onChangeBegin = (startTime) => {
		//设置选中开始时间
		dispatch({type: 'syslog/setStartTime', startTime: startTime})
	};

	const onChangeEnd = (endTime) => {
		//设置选中结束时间
		dispatch({type: 'syslog/setEndTime', endTime: endTime})
	};

  const showTotal = (total,range) => {
    return `当前 `+param.pageNum+` / `+param.pageSize+`条，共${total}条`
  };

	return(
		<PageHeaderLayout>
        	<Card bordered={false}>
	    		<div className="query-talbe-div">
		            <Row gutter={1}>
		              <Col className="gutter-row" span={24}>
		                应用名称 :&nbsp;
		                <Select onChange={changeServiceProvider} value={selectServiceProvider!=null?selectServiceProvider.servicePlatformPrefix:""} style={{width:200,marginRight:10,verticalAlign:'middle'}}>
		                    <Option value="" key="">--请选择--</Option>
		                    {
		                      serviceProviderList.map(function (item, idx) {
		                        return (<Option value={item.applicationName+""} key={idx}>{item.serviceName}</Option>)
		                      })
		                    }
		                </Select>
		                操作人 : <Input  style={{width:90,marginRight:10,verticalAlign:'middle'}}  id="people"/>
		                关键字 : <Input  style={{width:90,marginRight:10,verticalAlign:'middle'}}  id="key"/>
		                时间 :&nbsp;
		                <DatePicker onChange={onChangeBegin} className="datepicker-ie"  style={{verticalAlign:'middle'}} value={startTime ==null? null:moment(DateUtil.TimestampToDate(new Date(startTime),"yyyy-MM-dd"), 'YYYY-MM-DD')} />
		                ~
		                <DatePicker onChange={onChangeEnd} className="datepicker-ie"  style={{marginRight:10,verticalAlign:'middle'}} value={endTime == null? null:moment(DateUtil.TimestampToDate(new Date(endTime),"yyyy-MM-dd"), 'YYYY-MM-DD')} />
		                <Button className="query-talbe-button" onClick={queryLog}>查询</Button>
		               </Col>
		            </Row>
	    		</div>
	    		<Table dataSource={syslog.list} loading={syslog.loading} columns={columns}
	    		pagination={{
			      total:param.total,
			      current:param.pageNum,
			      pageSize:param.pageSize,
			      showTotal:showTotal,
			      onChange:handlePageChange
			    }} bordered />
    	</Card>
     </PageHeaderLayout>
	)
};

export default connect(({syslog}) => ({syslog}))(LogManagerPage);
