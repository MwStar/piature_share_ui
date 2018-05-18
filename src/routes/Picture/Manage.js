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
  paintingsuser: state.paintingsuser,
}))
@Form.create()

export default class PictureList extends React.Component {
  state = {
    formValue:{},//查询条件
  };


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manage/getAllPicture',
      payload: {},
    });
  }


  // 查询
  handleSearch = (pageNum, pageSize) => {
    // e.preventDefault();
    const { dispatch, form } = this.props;
    const { formValue } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({formValue:fieldsValue});
      const values = {
        query:{...fieldsValue},
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
           <Button type="primary" onClick={()=>{this.handleSearch(1, page.pageSize)}}>查询</Button>
           {/*<Button type="primary" style={{ marginLeft: 8 }} onClick={this.addImg}>新增</Button>*/}
         </FormItem>
       </Form>
     );
   }


  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    const { manage: { page } } = this.props;
    dispatch({ type: 'manage/setPage', payload: { pageSize, total:page.total, pageNum } });
    this.handleSearch(pageNum, pageSize);
  };

  // 删除图片
  deleteImg = (id) => {
    const { dispatch } = this.props;
    const { formValue } = this.state;
    dispatch({ type: 'manage/daleteImg', payload: { id: id } });
    const values = {
        query:{...formValue,'status':false},
    };
    // 重新查询数据
    dispatch({
      type: 'manage/getAllPicture',
      payload: formValue,
    });
  }

  /*// 新增图片
  addImg = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'paintingsuser/savePictureInfo', payload: {} });
    dispatch(routerRedux.push('/picture/add'));
  }*/

  // 修改图片
  updateImg = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'paintingsuser/savePictureInfo', payload: record });
    dispatch(routerRedux.push('/picture/edit/'+record._id));
  }


  showTotal = (total, range) => {
    return `当前 ${range[0]} - ${range[1]}条，共${total}条`;
  }

  handleSizeChange = (current, size) => {
    const { dispatch } = this.props;
    const { manage: { page } } = this.props;
    dispatch({ type: 'manage/setPage', payload: { pageSize: size, total:page.total, pageNum: current } });
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
              <a href="javascript:void(0)" onClick={() => { this.updateImg(record); }}>修改</a>
              <Divider type="vertical" />
              <Popconfirm placement="top" title="您是否要删除？" onConfirm={() => { this.deleteImg(record._id); }} okText="是" cancelText="否"><a href="javascript:void(0)">删除</a></Popconfirm>
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
