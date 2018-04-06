import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './agencyList.less';
import Adduser from './component/createAgency';

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  agencyList: state.agencyList,
}))
@Form.create()

export default class AgencyList extends PureComponent {
  state = {
    formValues: {},
  };


  componentDidMount() { // 初始化加载数据
    const { dispatch } = this.props;
    dispatch({
      type: 'agencyList/getAllLists',
      payload: {
        pageNum: '1',
        pageSize: '10',
      },
    });
  }


  getDetailInfo = () => { // 查看详情
    console.log('查看详情');
  }

  handleExport = () => { // 导出按钮事件
    console.log('导出');
  }


  handleAddAgency = () => { // 添加按钮事件
    const { dispatch } = this.props;
    dispatch({ type: 'agencyList/modalStatus', modal: true });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dtu/DTUList',
      payload: {},
    });
  }

  editRowDetail = () => {
    console.log('编辑信息');
  }

  handleSearch = (pageNum) => {
    // e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      values.pageNum = pageNum || '1';
      values.pageSize = '10';
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'agencyList/getAllLists',
        payload: values,
      });
    });
  }

  handlePageChange = (pageNum) => { // 分页
    this.handleSearch(pageNum);
  };


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={(e) => { e.stopPropagation(); this.handleSearch(); }} layout="inline" >
        <FormItem label="名称" style={{ width: 180 }}>
          {getFieldDecorator('name')(
            <Input placeholder="请输入" />
              )}
        </FormItem>
        <FormItem label="创建时间" style={{ width: 280 }}>
          {getFieldDecorator('createTime')(
            <RangePicker
              format={dateFormat}
            />
              )}
        </FormItem>
        <FormItem label="" style={{ width: 130 }}>
          {getFieldDecorator('areaId')(
            <Select placeholder="国家地区" style={{ width: '100%' }}>
              <Option value="0">关闭</Option>
              <Option value="1">运行中</Option>
            </Select>
              )}
        </FormItem>
        <FormItem className={styles.submitButtons}>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleExport}>导出</Button>
          <Button type="primary" style={{ marginLeft: 8, marginRight: 8 }} onClick={this.handleAddAgency}>添加</Button>
        </FormItem>
      </Form>
    );
  }


  render() {
    const { agencyList: { loading: usersLoading, list, pagination } } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '国家',
        dataIndex: 'address',
      },
      {
        title: '电站数量',
        dataIndex: 'createBy',
      },
      {
        title: '联系人',
        dataIndex: 'hardwareVersion',
      },
      {
        title: '联系方式',
        dataIndex: 'dtuModel',
      },
      {
        title: '操作',
        className: styles.operate,
        render: () => {
          return (
            <span>
              <a onClick={this.getDetailInfo}>查看</a>
              <a onClick={this.editRowDetail}>编辑</a>
            </span>
          );
        },
      },
    ];


    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <p><span className={styles.titleLabel}>经销商列表</span></p>
          </div>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <Table
              dataSource={list}
              columns={columns}
              bordered
              className={styles.content}
              pagination={{
              total: pagination.total,
              current: pagination.pageNum,
              pageSize: pagination.pageSize,
              onChange: this.handlePageChange,
              }}
            />
          </div>
          <Adduser />
        </Card>
      </PageHeaderLayout>
    );
  }
}
