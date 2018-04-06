import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message,Table,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Users.less';
import RoleModal from '../../components/Role/RoleModal';
const FormItem = Form.Item;
const { Option } = Select;


    

@connect(state => ({
  role: state.role,
}))
@Form.create()

export default class RoleManager extends PureComponent {
  state = {
    selectedRowKeys: [],
    formValues: {},
    modal:false,
  };



  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/usersList',
      payload: {},
    });
  };







  handleSearch = (pageNum,pageSize) => {
    //e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      values.pageNum = pageNum;
      values.pageSize = pageSize;
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'role/saveFormValues',
        formValues: values,
      });
      dispatch({
        type: 'role/usersList',
        payload: values,
      });
    });
  }

//显示新增或者修改对话框
  showModel = (record)=>{
    const { dispatch } = this.props;
    let checkResoutcesList =[];
    let checkResoutcesAllList=[];
    if(record.resourceIds){
      checkResoutcesList = record.resourceIds.split(",");
    }


    dispatch({type:"role/showModal",record});
    let arr =[];
    if(record.resourceIds && record.resourceIds.length >0){
      arr = record.resourceIds.split(",")
    }
    if(record.resourceAllIds){
      checkResoutcesAllList = record.resourceAllIds.split(",");
    }
     dispatch({
              type: 'role/saveCheckResources',
              checkResoutcesList:arr,
              checkResoutcesAllList:checkResoutcesAllList
      });
  };



  //删除权限
  deleteHandler(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/deleteUser',
      payload:{ids:id}
    });
    dispatch({type:"role/usersList",payload:this.state.formValues});
  }


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { page } = this.props.role;
    return (
      <Form onSubmit={(e)=>{e.stopPropagation();this.handleSearch(1,page.pageSize);}} layout="inline" >
            <FormItem label="角色名称" style={{width:240}}>
              {getFieldDecorator('nameCn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.showModel}>新增</Button>
            </FormItem>
      </Form>
    );
  }

 showTotal = (total,range) => {
   //const { users: { pagination } } = this.props;
    return `当前 `+range[0]+` - `+range[1]+`条，共${total}条`;
  }

  handlePageChange = (pageNum,pageSize) => {
    const { dispatch } = this.props;
    dispatch({type:'role/setPage',page:{pageSize:pageSize,pageNum:pageNum}})
    //const { users: { pagination } } = this.props;
    this.handleSearch(pageNum,pageSize);
  };

  handleSizeChange = (current, size) =>{
    const { dispatch } = this.props;
    dispatch({type:'role/setPage',page:{pageSize:size,pageNum:current}});
    this.handleSearch(current,size);
  }



  render() {
    const { role: { loading: roleLoading, list, pagination ,record,} } = this.props;
    const {selectedRowKeys } = this.state;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'nameCn',
        key: 'nameCn'
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '操作',
        key: 'operation',
        className:styles.operate,
        render: (text, record) => (
          <span className={styles.operation}>
            <a className="update-btn" onClick={()=>{this.showModel(record)}}>修改</a>
            <span className="ant-divider" />
            <Popconfirm title="确定要删除吗?" onConfirm={()=>{this.deleteHandler(record.id)}}>
              <a href="javascript:void(0)" className="delete-btn">删除</a>
            </Popconfirm>
          </span>
        )
      }
    ];


    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <Table dataSource={list} columns={columns} bordered className={styles.content} 
              pagination={{
              total:pagination.total,
              current:pagination.pageNum,
              pageSize:pagination.pageSize,
              showSizeChanger:true,
              onShowSizeChange:this.handleSizeChange,
              pageSizeOptions:['10','20','50'],
              showTotal:this.showTotal,
              onChange:this.handlePageChange,
              showQuickJumper:true
              }}
            />
          </div>
          <RoleModal record={record}></RoleModal>

        </Card>
      </PageHeaderLayout>
    );
  }
}
