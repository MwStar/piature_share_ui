import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table, Popconfirm ,Divider} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Manage.less';


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
  manage: state.manage,
}))
@Form.create()

export default class CheckList extends React.Component {
  state = {
    
  };


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manage/getAllPicture',
      payload: {query:{'status':false}},
    });
  }


  // 查询
  handleSearch = (pageNum, pageSize) => {
    // e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({type: 'manage/setFormValue',formValues: fieldsValue,});
      const values = {
        query:{...fieldsValue,'status':false},
        page:{pageNum:pageNum,pageSize:pageSize}
      };
      dispatch({
        type: 'manage/getAllPicture',
        payload: values,
      });
    });
  }



  // 首行查询，新增操作
   renderSimpleForm() {
     const { getFieldDecorator } = this.props.form;
     const { page } = this.props.manage;

     return (
       <Form layout="inline" >
         <FormItem label="图片名称" style={{ width: 350 }}>
           {getFieldDecorator('title')(
             <Input placeholder="请输入图片名称" />
              )}
         </FormItem>
         <FormItem className={styles.submitButtons}>
           <Button type="primary" onClick={()=>{this.handleSearch(1, page.pageSize);}}>查询</Button>
           {/*<Button type="primary" style={{ marginLeft: 8 }} onClick={this.addImg}>新增</Button>*/}
         </FormItem>
       </Form>
     );
   }


  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'manage/setPage', page: { pageSize, pageNum } });
    this.handleSearch(pageNum, pageSize);
  };

  // 删除图片
  deleteImg = (id) => {
    const { dispatch } = this.props;
    const { formValues } = this.props.manage;
    dispatch({ type: 'manage/daleteImg', payload: { id: id } });
    const values = {
        query:{...formValue,'status':false},
    };
    // 重新查询数据
    dispatch({
      type: 'manage/getAllPicture',
      payload: values,
    });
  }

  // 图片通过审核
  pass = (record) => {
    const { dispatch } = this.props;
    const values = {
      id:record._id,
      status:1,
    }
    dispatch({ type: 'manage/checked', payload:values });
  }
  // 图片未通过审核
  Notpass = (record) => {
    const { dispatch } = this.props;
    const values = {
      id:record._id,
      status:2,
    }
    dispatch({ type: 'manage/checked', payload:values });
  }


  showTotal = (total, range) => {
    return `当前 ${range[0]} - ${range[1]}条，共${total}条`;
  }

  handleSizeChange = (current, size) => {
    const { dispatch } = this.props;
    dispatch({ type: 'manage/setPage', page: { pageSize: size, pageNum: current } });
    this.handleSearch(current, size);
  }

  render() {
    const { manage: { loading, list, page } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '图片名称',
        dataIndex: 'title',
        key: 'title',
        render:(text, record)=>{
          return(
            <a>{text}</a>
            )
        }
      },
      {
        title: '图片标签',
        dataIndex: 'tag',
        key: 'tag',
      },
      {
        title: '图片参数',
        dataIndex: 'params',
        key: 'params',
      },
      {
        title: '图片描述',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at',
      },
      {
        title: '更新时间',
        dataIndex: 'update_at',
        key: 'update_at',
      },
      {
        title: '操作',
        className: styles.operate,
        render: (record) => {
          return (
            <span>
              <a href="javascript:void(0)" onClick={() => { this.pass(record); }}>通过</a>
              <Divider type="vertical" />
              <Popconfirm placement="top" title="您是否要删除？" onConfirm={() => { this.Notpass(record); }} okText="是" cancelText="否"><a href="javascript:void(0)">删除</a></Popconfirm>
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

        </Card>
      </PageHeaderLayout>
    );
  }
}
