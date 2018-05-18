import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table, Popconfirm ,Divider} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Manage.less';
import DoTag from '../../components/DoTag/index';


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
  tag: state.tag,
}))
@Form.create()

export default class TagList extends React.Component {
  state = {
    formValue:{},//查询条件
  };


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/getAllPicture',
      payload: {},
    });
  }


  // 查询
  handleSearch = (pageNum, pageSize) => {
    // e.preventDefault();
    const { dispatch, form } = this.props;
    const { formValue } = this.state;
    // const { page } = this.props.users;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        query:{...fieldsValue},
        page:{pageNum:pageNum,pageSize:pageSize}
      };
      dispatch({
        type: 'tag/getAllPicture',
        payload: values,
      });
    });
  }



  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    const { tag: { page } } = this.props;
    dispatch({ type: 'tag/setPage', payload: { pageSize, total:page.total, pageNum } });
    this.handleSearch(pageNum, pageSize);
  };


  showTotal = (total, range) => {
    return `当前 ${range[0]} - ${range[1]}条，共${total}条`;
  }

  handleSizeChange = (current, size) => {
    const { dispatch } = this.props;
    const { tag: { page } } = this.props;
    dispatch({ type: 'tag/setPage', payload: { pageSize: size, total:page.total, pageNum: current } });
    this.handleSearch(current, size);
  }

  tagModal = (record) => {
  	const { dispatch } = this.props;
  	dispatch({ type: 'tag/savePicture', payload: record });
    dispatch({ type: 'tag/editmodalStatus', modal: true });
  }

  render() {
    const { tag: { loading, list, page ,picture} } = this.props;
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
              <a href="javascript:void(0)" onClick={() => { this.tagModal(record); }}>打标签</a>  
            </span>
          );
        },

      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
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
          <DoTag record={picture} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
