import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Office.css';
import OfficeModal from './OfficeModal';
import { message } from 'antd';

function Office({ dispatch, list, loading, visible, record, msg }) {
  if (msg) {
    if (msg.indexOf('成功') != -1) {
      message.success(msg, 3);
    } else {
      message.warning(msg, 3);
    }
    dispatch({ type: 'office/saveMsg', msg: '' });
  }
  // 删除权限
  function deleteHandler(id) {
    dispatch({
      type: 'office/remove',
      payload: id,
    });
  }
  // 显示新增或者修改对话框
  const showModel = (record) => {
    dispatch({ type: 'office/showModal', record });
    dispatch({ type: 'office/address', payload: {} });
  };
  // 表属性
  const columns = [
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      className: 'tableCententCenter',
      render: (text, record) => {
        switch (text) {
          case '0':
            return <span>经销商</span>;
          case '1':
            return <span>部门</span>;
          case '2':
            return <span>业主</span>;
          case '3':
            return <span>OEM商</span>;
          case '4':
            return <span>安装商</span>;
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      className: 'tableCententCenter',
      key: 'remarks',
    },
    {
      title: '联系人',
      dataIndex: 'master',
      className: 'tableCententCenter',
      key: 'master',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      className: 'tableCententCenter',
      key: 'phone',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      className: 'tableCententCenter',
      key: 'address',
    },
    {
      title: '国家/地区',
      dataIndex: 'areaId',
      className: 'tableCententCenter',
      key: 'areaId',
    },
    {
      title: '操作',
      key: 'operation',
      className: 'tableCententCenter',
      width: 160,
      render: (text, record) => {
        if (record.parentId != 0) {
          return (<span className={styles.operation} >
            <a href="javascript:void(0)" className="update-btn" onClick={() => { showModel(record)}}>修改</a>
            <span className="ant-divider" />
            <Popconfirm title="确定要删除吗?" onConfirm={deleteHandler.bind(null, record.key)}>
              <a href="" className="delete-btn">删除</a>
            </Popconfirm>
          </span>);
        }
      },


    },
  ];
  return (
    <div className={styles.normal}>
      <div>
        <div className={styles.create}>
          <Button type="primary" className={`${styles.addButton} new-btn`} onClick={() => { showModel({}); }}>新增</Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          defaultExpandAllRows
          pagination={false}
        />
      </div>
      <OfficeModal record={record} />
    </div>
  );
}
function mapStateToProps(state) {
  const { list, data, selectTreeList, visible, record, msg } = state.office;
  return {
    // loading: state.loading.models.office,
    list,
    data,
    selectTreeList,
    visible,
    record,
    msg,
  };
}
export default connect(mapStateToProps)(Office);
