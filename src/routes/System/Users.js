import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table, Popconfirm, TreeSelect } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Users.less';
import Edituser from '../../components/Addusermodal/edit';


const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

@connect(state => ({
  users: state.users,
}))
@Form.create()

export default class Users extends React.Component {
  state = {
    formValues: {},
  };


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/usersList',
      payload: {},
    });
  }


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'users/usersList',
      payload: {},
    });
  }


  // 查询
  handleSearch = (pageNum, pageSize) => {
    // e.preventDefault();
    const { dispatch, form } = this.props;
    // const { page } = this.props.users;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        organizationId:fieldsValue.organizationId?fieldsValue.organizationId:'',
        officeId:fieldsValue.officeId?fieldsValue.officeId:'',
        userName:fieldsValue.name?fieldsValue.name:'',
        userFullName:fieldsValue.userFullName?fieldsValue.userFullName:'',
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      values.pageNum = pageNum;
      values.pageSize = pageSize;
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'users/setFormValue',
        formValues: values,
      });
      dispatch({
        type: 'users/usersList',
        payload: values,
      });
    });
  }


  // 归属公司改变联动归属部门
   changeOigaization = (value) => {
     const { dispatch } = this.props;
     dispatch({ type: 'users/queryOffice', payload: { ids: value } });
     // dispatch({type: 'users/saveOfficeId', payload: {officeId: null}});
   }

  // 首行查询，导出，新增操作
   renderSimpleForm() {
     const { getFieldDecorator } = this.props.form;
     const { users } = this.props;
     const { page } = this.props.users;

     return (
       <Form onSubmit={(e) => { e.stopPropagation(); this.handleSearch(1, page.pageSize); }} layout="inline" >
         <FormItem label="归属经销商" style={{ width: 250 }}>
           {getFieldDecorator('organizationId')(

             <TreeSelect
              placeholder="请选择归属经销商"
              onChange={this.changeOigaization}
              treeData={users.organizationList}
              treeDefaultExpandAll
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />

              )}
         </FormItem>
         <FormItem {...formItemLayout} label="归属部门" style={{ width: 220 }}>
           {getFieldDecorator('officeId', {

                })(
                  <TreeSelect placeholder="请选择归属部门"
                        treeData={users.officeList}
                        treeDefaultExpandAll
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        >
                  </TreeSelect>
                  )}
         </FormItem>
         <FormItem label="用户名" style={{ width: 160 }}>
           {getFieldDecorator('name')(
             <Input placeholder="请输入" />
              )}
         </FormItem>
         <FormItem label="姓名" style={{ width: 160 }}>
           {getFieldDecorator('userFullName')(
             <Input placeholder="请输入" />
              )}
         </FormItem>
         <FormItem className={styles.submitButtons}>
           <Button type="primary" htmlType="submit">查询</Button>
           {/* <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>导出</Button> */}
           <Button type="primary" style={{ marginLeft: 8 }} onClick={this.addUser}>新增</Button>
         </FormItem>
       </Form>
     );
   }


  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/setPage', page: { pageSize, pageNum } });
    // const { users: { pagination } } = this.props;
    this.handleSearch(pageNum, pageSize);
  };

  // 删除用户
  deleteUser = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/daleteUser', payload: { ids: id } });
    // 重新查询数据
    dispatch({
      type: 'users/usersList',
      payload: this.state.formValues,
    });
  }

  // 新增用户
  addUser = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/userListSuccess', payload: {} });
    dispatch({ type: 'users/editmodalStatus', editmodal: true });
    // dispatch({type:'users/modalStatus',modal:true});
  }

  // 修改用户
  updateUser = (record) => {
    const { dispatch } = this.props;
    const { users: { checkRolesList } } = this.props;

    let arr = [];
    if (record.roleIds && record.roleIds.length > 0) {
      arr = record.roleIds.split(',');
    }
    // state中设置checkcheckRolesList
    dispatch({ type: 'users/savecheckRolesList', checkRolesList: arr });
    dispatch({ type: 'users/userListSuccess', payload: record });
    dispatch({ type: 'users/editmodalStatus', editmodal: true });
  }

  showTotal = (total, range) => {
    // const { users: { pagination } } = this.props;
    return `当前 ${range[0]} - ${range[1]}条，共${total}条`;
  }

  handleSizeChange = (current, size) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/setPage', page: { pageSize: size, pageNum: current } });
    this.handleSearch(current, size);
  }

  render() {
    const { users: { loading: usersLoading, list, pagination, userList } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '归属经销商',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '归属部门',
        dataIndex: 'officeName',
        key: 'officeName',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
      },
      {
        title: '姓名',
        dataIndex: 'userFullName',
      },
      {
        title: '操作',
        className: styles.operate,
        render: (record) => {
          return (
            <span>
              <Popconfirm placement="top" title="您是否要删除？" onConfirm={() => { this.deleteUser(record.id); }} okText="是" cancelText="否"><a href="javascript:void(0)">删除</a></Popconfirm>
              <span className="ant-divider" />
              <a href="javascript:void(0)" onClick={() => { this.updateUser(record); }}>修改</a>
            </span>
          );
        },

      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
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
              showSizeChanger: true,
              onShowSizeChange: this.handleSizeChange,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: this.showTotal,
              onChange: this.handlePageChange,
              showQuickJumper: true,
              }}
            />
          </div>
          <Edituser user={userList} formValues={this.state.formValues} />

        </Card>
      </PageHeaderLayout>
    );
  }
}
