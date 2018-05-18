import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table, Popconfirm ,Divider} from 'antd';
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
        query:{...fieldsValue},
        page:{pageNum:pageNum,pageSize:pageSize}
      };
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



  // 首行查询，导出，新增操作
   renderSimpleForm() {
     const { getFieldDecorator } = this.props.form;
     const { users } = this.props;
     const { page } = this.props.users;

     return (
       <Form layout="inline" >
         <FormItem label="用户类型" style={{ width: 250 }}>
           {getFieldDecorator('userType')(

             <Select
              placeholder="请选择用户类型"
            >
              <Option value="1">用户</Option>
              <Option value="3">摄影师</Option>
              <Option value="2">管理员</Option>
            </Select>

              )}
         </FormItem>

         <FormItem label="用户名" style={{ width: 160 }}>
           {getFieldDecorator('loginname')(
             <Input placeholder="请输入" />
              )}
         </FormItem>
         <FormItem label="昵称" style={{ width: 160 }}>
           {getFieldDecorator('name')(
             <Input placeholder="请输入" />
              )}
         </FormItem>
         <FormItem className={styles.submitButtons}>
           <Button type="primary" onClick={()=>{this.handleSearch(1, page.pageSize); }}>查询</Button>
           <Button type="primary" style={{ marginLeft: 8 }} onClick={this.addUser}>新增</Button>
         </FormItem>
       </Form>
     );
   }


  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    const { page } = this.props.users;
    dispatch({ type: 'users/setPage', page: { pageSize,total:page.total, pageNum } });
    this.handleSearch(pageNum, pageSize);
  };

  // 删除用户
  deleteUser = (id) => {
    const { dispatch } = this.props;
    const { formValues } = this.props.users;
    dispatch({ type: 'users/daleteUser', payload: { ids: id } });
    // 重新查询数据
    dispatch({
      type: 'users/usersList',
      payload: formValues,
    });
  }

  // 新增用户
  addUser = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/userListSuccess', payload: {} });
    dispatch({ type: 'users/editmodalStatus', editmodal: true });
  }

  // 修改用户
  updateUser = (record) => {
    const { dispatch } = this.props;
    const { users: { checkRolesList } } = this.props;
    dispatch({ type: 'users/userListSuccess', payload: record });
    dispatch({ type: 'users/editmodalStatus', editmodal: true });
  }

  //重置密码
  resetPassword = (record) => {
    const {dispatch} = this.props;
    const params = {
      id: record.id,
      userPwd : record.userPwd,
    }
    dispatch({type:'users/resetPass',payload:params});
  }

  showTotal = (total, range) => {
    // const { users: { pagination } } = this.props;
    return `当前 ${range[0]} - ${range[1]}条，共${total}条`;
  }

  handleSizeChange = (current, size) => {
    const { dispatch } = this.props;
    const { page } = this.props.users;
    dispatch({ type: 'users/setPage', page: { pageSize: size,total:page.total, pageNum: current } });
    this.handleSearch(current, size);
  }

  render() {
    const { users: { loading, list, page, userList ,formValues} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '用户登录名',
        dataIndex: 'loginname',
        key: 'loginname',
      },
      {
        title: '用户类型',
        dataIndex: 'userType',
        key: 'userType',
        render:(text,record)=>{
          if(text === '1'){return(<span>普通用户</span>)}
            else if(text === '2'){return(<span>管理员</span>)}
              else{return(<span>摄影师</span>)}
        }
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '原创图片',
        dataIndex: 'img_count',
        key: 'img_count',
      },
      {
        title: '操作',
        className: styles.operate,
        render: (record) => {
          return (
            <span>
              <a href="javascript:void(0)" onClick={() => { this.updateUser(record); }}>修改</a>
              <Divider type="vertical" />
              <Popconfirm placement="top" title="您是否要删除？" onConfirm={() => { this.deleteUser(record._id); }} okText="是" cancelText="否"><a href="javascript:void(0)">删除</a></Popconfirm>
              <Divider type="vertical" />
              <Popconfirm placement="top" title="您是否要重置密码？" onConfirm={() => { this.resetPassword(record); }} okText="是" cancelText="否"><a href="javascript:void(0)">重置密码</a></Popconfirm>
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
              loading={loading}
              dataSource={list}
              columns={columns}
              bordered
              className={styles.content}
              pagination={{
              total: page.total,
              current: page.pageNum,
              pageSize: page.pageSize,
              showSizeChanger: true,
              onShowSizeChange: this.handleSizeChange,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: this.showTotal,
              onChange: this.handlePageChange,
              showQuickJumper: true,
              }}
            />
          </div>
          <Edituser user={userList} formValues={formValues} />

        </Card>
      </PageHeaderLayout>
    );
  }
}
