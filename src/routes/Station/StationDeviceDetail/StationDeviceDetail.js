import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Popconfirm, Badge, Modal, Tooltip, Form, Input, Table, Tabs, Menu, Dropdown, Checkbox, Button, Icon, Divider, Select } from 'antd';
import styles from './StaionDeviceDetail.less';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const statusMap = ['default', 'success', 'error', 'processing'];
const status = ['建设中', '在线', '离线', '升级中'];
const alarmMap = ['success', 'error'];
const alarmStatus = ['运行中', '已告警'];


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
  stationDeviceDetail: state.stationDeviceDetail,
  login: state.login,
}))
@Form.create()


class stationDeviceDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const initSearch = {
    // alarmStatus: '',
    // brand: '',
    // filtStatus: '',
    // model: '',
    // sn: '',
    // sorter: '',
    };
    // 初始化时默认选择所有的table字段
    const resetCheckedValues = [];
    this.columns.forEach((item, $index) => {
      resetCheckedValues.push(item.dataIndex);
    });
    this.setState({ checkColumnsList: resetCheckedValues });

    // 初始化发起请求
    dispatch({
      type: 'stationDeviceDetail/DTUList',
      payload: initSearch,
    });
  }

    // 列表选项
    onChangeTableColumn = (checkedValues) => {
      this.setState({ checkColumnsList: checkedValues });
    }

    onDropMenuClick = (val) => {
      // 0:配置文件升级;1:删除;2:替换;3:开机/关机；
      const { deviceInfo, currentTab } = this.state;
      const { dispatch } = this.props;
      const dropDownKey = val.key;
      const params = [];
      let devieceType = 0;
      switch (currentTab) { //  1，微逆 2，中继器； 3，DTU
        case 'dtu':
          devieceType = 3;
          break;
        case 'repeater':
          devieceType = 2;
          break;
        case 'micro':
          devieceType = 1;
          break;
        default:
          break;
      }
      if (dropDownKey === '0') {
        this.updateFirmwareDoc(deviceInfo);
      } else if (dropDownKey === '1') {
        params.push({
          oldId: deviceInfo.id,
          stationId: deviceInfo.stationId,
          type: devieceType,
        });
        dispatch({
          type: 'stationDeviceDetail/delete',
          payload: params,
        });
        dispatch({ type: 'stationDeviceDetail/editmodalStatus', editmodal: false });
      } else if (dropDownKey === '2') {
        dispatch({ type: 'stationDeviceDetail/editmodalStatus', editmodal: true });
      } else if (dropDownKey === '3') {
        console.log('开机/关机');
      }
    }

    setDevieceInfo =(val) => {
      this.setState({ deviceInfo: val });
    }

  /* ----------------定义变量--------------------------*/

  columns = [
    {
      title: 'DTU-ID',
      // dataIndex: 'sn',
      key: 'sn',
      render: (record) => {
        return (
          <div >
            {record.sn}
            {this.buttonIs("replace_dtu")?<Tooltip trigger="click" placement="top" title={this.state.historyText}>
              <Icon
                onClick={() => { this.queryHistory(record); }}
                type="retweet"
                style={{ fontSize: 16, color: '#08c', marginLeft: '5px' }}
              />
            </Tooltip>:''}
          </div>
        );
      },
    },
    {
      title: '建设状态',
      dataIndex: 'filtStatus',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '告警状态',
      width: 100,
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      render: (val) => {
        return <Badge status={alarmMap[val]} text={alarmStatus[val]} />;
      },
    },
    {
      title: '所属安装商',
      dataIndex: 'installer',
      key: 'installer',
    },
    {
      title: '时区',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: '版本',
      dataIndex: 'init_soft_ver',
      key: 'init_soft_ver',
    },
    {
      title: '连接中继器数',
      dataIndex: 'repeaterCount',
      key: 'repeaterCount',
    },
    {
      title: '连接微逆数',
      key: 'micNumber',
      // dataIndex: 'online',
      render: (text, record) => {
        return (
          <div >{record.online}<span style={{ color: 'green' }}>({ record.total })</span></div>
        );
      },
    },
    {
      title: '操作',
      className: styles.operate,
      render: (record) => {
        return (
          <span>
            <a href="javascript:void(0)" onClick={() => { this.restart(record.sn); }}>重启</a>
            <Divider type="vertical" />
            <a href="javascript:void(0)" onClick={() => { this.updateFirmware(record); }}>固件升级</a>
            <Divider type="vertical" />
            <Dropdown overlay={this.dtuDropMenu} trigger={['click']} onClick={() => { this.setDevieceInfo(record); }}>
              <a className="ant-dropdown-link" href="#">
                <span>更多</span> <Icon type="down" />
              </a>
            </Dropdown>
          </span>
        );
      },
    },
  ];
  columns_no = [
    {
      title: 'DTU-ID',
      // dataIndex: 'sn',
      key: 'sn',
      render: (record) => {
        return (
          <div >
            {record.sn}
            {this.buttonIs("replace_dtu")?<Tooltip trigger="click" placement="top" title={this.state.historyText}>
              <Icon
                onClick={() => { this.queryHistory(record); }}
                type="retweet"
                style={{ fontSize: 16, color: '#08c', marginLeft: '5px' }}
              />
            </Tooltip>:''}
          </div>
        );
      },
    },
    {
      title: '建设状态',
      dataIndex: 'filtStatus',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '告警状态',
      width: 100,
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      render: (val) => {
        return <Badge status={alarmMap[val]} text={alarmStatus[val]} />;
      },
    },
    {
      title: '所属安装商',
      dataIndex: 'installer',
      key: 'installer',
    },
    {
      title: '时区',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: '版本',
      dataIndex: 'init_soft_ver',
      key: 'init_soft_ver',
    },
    {
      title: '连接中继器数',
      dataIndex: 'repeaterCount',
      key: 'repeaterCount',
    },
    {
      title: '连接微逆数',
      key: 'micNumber',
      // dataIndex: 'online',
      render: (text, record) => {
        return (
          <div >{record.online}<span style={{ color: 'green' }}>({ record.total })</span></div>
        );
      },
    },
    
  ];

  repeaterColumns = [
    {
      title: '中继器-ID',
      // dataIndex: 'sn',
      key: 'ter$sn',
      render: (record) => {
        return (
          <div >
            {record.ter$sn}
            {this.buttonIs("replace_repeater")?<Tooltip trigger="click" placement="top" title={this.state.historyText}>
              <Icon
                onClick={() => { this.queryHistory(record); }}
                type="retweet"
                style={{ fontSize: 16, color: '#08c', marginLeft: '5px' }}
              />
            </Tooltip>:''}
          </div>
        );
      },
    },
    {
      title: '建设状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '告警状态',
      width: 100,
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      render: (val) => {
        return <Badge status={alarmMap[val]} text={alarmStatus[val]} />;
      },
    },
    {
      title: '所属经销商',
      dataIndex: 'distributor',
      key: 'distributor',
    },
    {
      title: '所属安装商',
      dataIndex: 'installer',
      key: 'installer',
    },
    {
      title: '时区',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: '版本',
      dataIndex: 'initSoftVer',
      key: 'initSoftVer',
    },
    {
      title: '连接DTU',
      dataIndex: 'dtuSn',
      key: 'dtuSn',
    },
    {
      title: '连接微逆数',
      key: 'microInverterCount',
      dataIndex: 'microInverterCount',
    },
    {
      title: '操作',
      className: styles.operate,
      render: (record) => {
        return (
          <span>
            <a href="javascript:void(0)" onClick={() => { this.restartDevice(record); }}>重启</a>
            <Divider type="vertical" />
            <a href="javascript:void(0)" onClick={() => { this.updateFirmware(record); }}>固件升级</a>
            <Divider type="vertical" />
            <Dropdown overlay={this.repeaterDropMenu} trigger={['click']} onClick={() => { this.setDevieceInfo(record); }}>
              <a className="ant-dropdown-link" href="#">
                  更多 <Icon type="down" />
              </a>
            </Dropdown>
          </span>
        );
      },
    },
  ];
  repeaterColumns_no = [
    {
      title: '中继器-ID',
      // dataIndex: 'sn',
      key: 'ter$sn',
      render: (record) => {
        return (
          <div >
            {record.ter$sn}
            {this.buttonIs("replace_repeater")?<Tooltip trigger="click" placement="top" title={this.state.historyText}>
              <Icon
                onClick={() => { this.queryHistory(record); }}
                type="retweet"
                style={{ fontSize: 16, color: '#08c', marginLeft: '5px' }}
              />
            </Tooltip>:''}
          </div>
        );
      },
    },
    {
      title: '建设状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '告警状态',
      width: 100,
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      render: (val) => {
        return <Badge status={alarmMap[val]} text={alarmStatus[val]} />;
      },
    },
    {
      title: '所属经销商',
      dataIndex: 'distributor',
      key: 'distributor',
    },
    {
      title: '所属安装商',
      dataIndex: 'installer',
      key: 'installer',
    },
    {
      title: '时区',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: '版本',
      dataIndex: 'initSoftVer',
      key: 'initSoftVer',
    },
    {
      title: '连接DTU',
      dataIndex: 'dtuSn',
      key: 'dtuSn',
    },
    {
      title: '连接微逆数',
      key: 'microInverterCount',
      dataIndex: 'microInverterCount',
    },
    
  ];

  microColumns = [
    {
      title: '微逆-ID',
      // dataIndex: 'sn',
      key: 'sn',
      render: (record) => {
        return (
          <div >
            {record.sn}
            {this.buttonIs("replace_Micro")?<Tooltip trigger="click" placement="top" title={this.state.historyText}>
              <Icon
                onClick={() => { this.queryHistory(record); }}
                type="retweet"
                style={{ fontSize: 16, color: '#08c', marginLeft: '5px' }}
              />
            </Tooltip>:''}
          </div>
        );
      },
    },
    {
      title: '建设状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '告警状态',
      width: 100,
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      render: (val) => {
        return <Badge status={alarmMap[val]} text={alarmStatus[val]} />;
      },
    },
    {
      title: '所属经销商',
      dataIndex: 'distributor',
      key: 'distributor',
    },
    {
      title: '所属安装商',
      dataIndex: 'installer',
      key: 'installer',
    },
    {
      title: '时区',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: '版本',
      dataIndex: 'soft_version',
      key: 'soft_version',
    },
    {
      title: '连接DTU',
      dataIndex: 'dtu_sn',
      key: 'dtu_sn',
    },
    {
      title: '连接中继器',
      key: 'repeater_sn',
      dataIndex: 'repeater_sn',
    },
    {
      title: '操作',
      className: styles.operate,
      render: (record) => {
        return (
          <span>
            <a href="javascript:void(0)" onClick={() => { this.restartDevice(record); }}>重启</a>
            <Divider type="vertical" />
            <a href="javascript:void(0)" onClick={() => { this.updateFirmware(record); }}>固件升级</a>
            <Divider type="vertical" />
            <Dropdown overlay={this.microDropMenu} trigger={['click']} onClick={() => { this.setDevieceInfo(record); }}>
              <a className="ant-dropdown-link" href="#">
                  更多 <Icon type="down" />
              </a>
            </Dropdown>
          </span>
        );
      },
    },
  ];
  microColumns_no = [
    {
      title: '微逆-ID',
      // dataIndex: 'sn',
      key: 'sn',
      render: (record) => {
        return (
          <div >
            {record.sn}
            {this.buttonIs("replace_Micro")?<Tooltip trigger="click" placement="top" title={this.state.historyText}>
              <Icon
                onClick={() => { this.queryHistory(record); }}
                type="retweet"
                style={{ fontSize: 16, color: '#08c', marginLeft: '5px' }}
              />
            </Tooltip>:''}
          </div>
        );
      },
    },
    {
      title: '建设状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '告警状态',
      width: 100,
      dataIndex: 'alarmStatus',
      key: 'alarmStatus',
      render: (val) => {
        return <Badge status={alarmMap[val]} text={alarmStatus[val]} />;
      },
    },
    {
      title: '所属经销商',
      dataIndex: 'distributor',
      key: 'distributor',
    },
    {
      title: '所属安装商',
      dataIndex: 'installer',
      key: 'installer',
    },
    {
      title: '时区',
      dataIndex: 'display_name',
      key: 'display_name',
    },
    {
      title: '版本',
      dataIndex: 'soft_version',
      key: 'soft_version',
    },
    {
      title: '连接DTU',
      dataIndex: 'dtu_sn',
      key: 'dtu_sn',
    },
    {
      title: '连接中继器',
      key: 'repeater_sn',
      dataIndex: 'repeater_sn',
    },
    
  ];

  state = {
    currentTab: 'dtu',
    columnsList: this.columns,
    columnsListOwner: this.columns_no,
    checkColumnsList: [],
    dropDownVisible: false,
    dataList: [],
    deviceInfo: {},
    openClose: false,
    selectedRowKey: '',
    selectedRows: [],
    selectedRowKeys: [],
    DtuSnNum: '',
    historyText: '',
  };

  dtuDropMenu = (
    <Menu onClick={this.onDropMenuClick}>
      <Menu.Item key="0"><span>配置文件升级</span></Menu.Item>
      <Menu.Item key="1"><span>删除</span></Menu.Item>
      <Menu.Item key="2">替换</Menu.Item>
    </Menu>
  );

  repeaterDropMenu = (
    <Menu onClick={this.onDropMenuClick}>
      <Menu.Item key="1"><span>删除</span></Menu.Item>
      <Menu.Item key="2">替换</Menu.Item>
    </Menu>
  );

  microDropMenu = (
    <Menu onClick={this.onDropMenuClick}>
      <Menu.Item key="0"><span>配置文件升级</span></Menu.Item>
      <Menu.Item key="1"><span>删除</span></Menu.Item>
      <Menu.Item key="2"><span>替换</span></Menu.Item>
      <Menu.Item key="3">
        {this.state.openClose === false ? <span>开机</span> : <span>关机</span>}
      </Menu.Item>
    </Menu>
  );

  handleTabsChange = (key) => { // tabs标签选择
    switch(key) { // 切换tab时渲染colums显示字段
      case 'dtu':
      if(this.buttonIs("delete_dtu")){this.setState({ columnsList: this.columns });this.setState({ columnsListOwner: this.columns });}
      else{this.setState({ columnsList: this.columns_no });this.setState({ columnsListOwner: this.columns_no })};
     case 'repeater':
      if(this.buttonIs("delete_repeater")){this.setState({ columnsList: this.repeaterColumns });this.setState({ columnsListOwner: this.repeaterColumns });}
      else{this.setState({ columnsList: this.repeaterColumns_no });this.setState({ columnsListOwner: this.repeaterColumns_no });}
     case 'micro':
      if(this.buttonIs("delete_Micro")){this.setState({ columnsList: this.microColumns });this.setState({ columnsListOwner: this.microColumns });}
      else{this.setState({ columnsList: this.microColumns_no });this.setState({ columnsListOwner: this.microColumns_no });}
    }
    this.setState({
      currentTab: key,
      selectedRowKeys: [],
    });
    const { stationDeviceDetail: { data: { pagination } } } = this.props;
    this.handleSearch(pagination.pageNum, pagination.pageSize, key); // 切换tab时请求不同tab页table数据
  }


  handleVisibleChange = () => {
    console.log(111);
  }

  /* ------------------- 组装table显示字段------------------------- */


  // 修改表格显示的字段
  handleTableColumn = (type) => {
    if (type === 'reset') {
      // 重置时默认选择所有的table字段
      const resetCheckedValues = [];
      this.columns.forEach((item, $index) => {
        resetCheckedValues.push(item.dataIndex);
      });
      this.setState({ checkColumnsList: resetCheckedValues, columnsList: this.columns });
    }
    const arr = [];
    const checkedValues = this.state.checkColumnsList;
    this.columns.map((item) => {
      checkedValues.map((col) => {
        if (item.dataIndex === col) {
          arr.push(item);
        }
      });
    });
    this.setState({ columnsList: arr, checkColumnsList: this.state.checkColumnsList, dropDownVisible: false });
  }

  // dropdown  改变状态
 handleVisibleChange = (flag) => {
   this.setState({ dropDownVisible: flag });
 }


  /* -----------------------查询操作----------------------------- */

  moreHandleChange=(val) => { // 更多操作
    const selectedKey = val.key;
    const params = [];
    const { currentTab, selectedRows } = this.state;
    const { dispatch } = this.props;
    // 0:配置文件升级;1:删除;2:重启;3:开机/关机；
    let devieceType = 0;
    switch (currentTab) { //  1，微逆 2，中继器； 3，DTU
      case 'dtu':
        devieceType = 3;
        break;
      case 'repeater':
        devieceType = 2;
        break;
      case 'micro':
        devieceType = 1;
        break;
      default:
        break;
    }
    if (selectedKey == '2' && currentTab == 'dtu') {
      this.restart();
    } else if (selectedKey == '2' && currentTab != 'dtu') {
      this.restartDevice();
    } else if (selectedKey == '1') {
      selectedRows.forEach((item) => {
        params.push({
          oldId: item.id,
          stationId: item.stationId,
          type: devieceType,
        });
      });
      dispatch({
        type: 'stationDeviceDetail/delete',
        payload: params,
      });
    } else if(selectedKey == '0'){
      this.updateFirmwareDoc();
    }
  }
  handleSearch =(pageNum, pageSize, tab) => { // 查询请求
    // e.preventDefault();
    const { dispatch, form } = this.props;
    const { currentTab } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      values.pageNum = pageNum;
      values.pageSize = pageSize;
      if (tab === 'dtu') {
        dispatch({
          type: 'stationDeviceDetail/DTUList',
          payload: values,
        });
      } else if (tab === 'repeater') {
        dispatch({
          type: 'stationDeviceDetail/repeaterList',
          payload: values,
        });
      } else if (tab === 'micro') {
        dispatch({
          type: 'stationDeviceDetail/microList',
          payload: values,
        });
      }
    });
  }

  /* ---------------------Table操作--------------------------*/
  queryHistory =(val) => { // 历史查询
    const deviceInfo = val;
    let deviceType = 0;
    const { dispatch } = this.props;
    const { currentTab } = this.state;
    const columns = [{
      title: 'DTU-ID',
      dataIndex: 'newSn',
      key: 'newSn',
    }, {
      title: '原DTU-ID',
      dataIndex: 'oldSn',
      key: 'oldSn',
    }, {
      title: '替换人',
      dataIndex: 'updateBy',
      key: 'updateBy',
    }, {
      title: '替换时间',
      dataIndex: 'createAtFormat',
      key: 'createAtFormat',
    }];
    if (currentTab == 'dtu') {
      deviceType = 3;
    } else if (currentTab == 'repeater') {
      deviceType = 2;
    } else if (currentTab == 'micro') {
      deviceType = 1;
    }
    const payload = {
      deviceId: deviceInfo.id,
      deviceType: 2,
      stationId: deviceInfo.stationId,
    };
    dispatch({
      type: 'stationDeviceDetail/queryDeviceHistory',
      payload,
    }).then(() => {
      const { stationDeviceDetail: { historyList } } = this.props;
      this.setState({
        historyText: <div><p>替换记录</p><Table dataSource={historyList} columns={columns} /></div>,
      });
    });
  }

  restart = (dtuId) => { // 重启DTU
    const { dispatch } = this.props;
    const { selectedRowKey } = this.state;
    const params = {};
    if (dtuId) {
      params.dtuIds = dtuId.toString();
      params.orderFlag = '2';
      dispatch({ type: 'stationDeviceDetail/dtuOperate', payload: params });
    } else {
      params.dtuIds = selectedRowKey;
      params.orderFlag = '2';
      dispatch({ type: 'stationDeviceDetail/dtuOperate', payload: params });
    }
  }

  restartDevice = (val) => { // 重启其余设备
    const { dispatch } = this.props;
    const { selectedRowKey, DtuSnNum, currentTab, selectedRows } = this.state;
    const params = {};
    if (val) {
      params.dtuId = (val.dtu_sn || val.dtuSn).toString();
      params.orderFlag = '2';
      params.eqIds = val.sn || val.ter$sn;
      params.type = currentTab;
      dispatch({ type: 'stationDeviceDetail/deviceOperate', payload: params });
    } else {
      const selectedRowKeys = [];
      const selectDtu = [];
      for(var i=0; i<selectedRows.length; i++){
        if(selectDtu.indexOf(selectedRows[i].dtu_sn || selectedRows[i].dtuSn)==-1){
          selectDtu.push(selectedRows[i].dtu_sn || selectedRows[i].dtuSn)
        }
      }
      selectDtu.forEach(item=>{
        selectedRowKeys.push({
          dtuId: item,
          eqIds: [],
          orderFlag: '2',
        })
      })
      selectedRows.forEach((item) =>{
        selectedRowKeys.forEach((ele) =>{
          if(item.dtu_sn == ele.dtuId || item.dtuSn == ele.dtuId){
            ele.eqIds.push(item.ter$sn || item.sn)
          }
        })
      })
      
      selectedRowKeys.forEach((item)=>{
        const payload = item;
        payload.eqIds = payload.eqIds.join('|')
        dispatch({
          type: 'stationDeviceDetail/deviceOperate',
          payload,
        });
    })
    }
  }

  updateFirmware = (val) => { // 固件升级
    const { dispatch } = this.props;
    const { selectedRowKey, currentTab, selectedRows } = this.state;
    const params = {};
    if (val) { // 蛋哥设备固定升级
      // params.eqIds = val.id.toString();
      if (currentTab == 'dtu') {
        params.dtuIds = val.sn;
        params.orderFlag = '1';
        dispatch({ type: 'stationDeviceDetail/dtuOperate', payload: params });
      } else {
        params.dtuId = val.dtu_sn || val.dtuSn;
        params.eqIds = val.sn || val.ter$sn;
        params.orderFlag = '1';
        params.type = currentTab;
        dispatch({ type: 'stationDeviceDetail/deviceOperate', payload: params });
      }
    } else { // 多个设备固定升级
      if (currentTab == 'dtu') {
        params.dtuIds = selectedRowKey;
        params.orderFlag = '1';
        dispatch({ type: 'stationDeviceDetail/dtuOperate', payload: params });
      }else{
        const selectedRowKeys = [];
      const selectDtu = [];
      for(var i=0; i<selectedRows.length; i++){
        if(selectDtu.indexOf(selectedRows[i].dtu_sn || selectedRows[i].dtuSn)==-1){
          selectDtu.push(selectedRows[i].dtu_sn || selectedRows[i].dtuSn)
        }
      }
      selectDtu.forEach(item=>{
        selectedRowKeys.push({
          dtuId: item,
          eqIds: [],
          orderFlag: '1',
        })
      })
      selectedRows.forEach((item) =>{
        selectedRowKeys.forEach((ele) =>{
          if(item.dtu_sn == ele.dtuId || item.dtuSn == ele.dtuId){
            ele.eqIds.push(item.ter$sn || item.sn)
          }
        })
      })
      
      selectedRowKeys.forEach((item)=>{
        const payload = item;
        payload.eqIds = payload.eqIds.join('|')
          dispatch({
            type: 'stationDeviceDetail/deviceOperate',
            payload,
          });
        })
      }
    }
  }

  updateFirmwareDoc = (val) => { // 配置文件升级
    const { dispatch } = this.props;
    const { selectedRowKey, currentTab, selectedRows } = this.state;
    const params = {};
    if (val) { // 蛋哥设备固定升级
      // params.eqIds = val.id.toString();
      if (currentTab == 'dtu') {
        params.dtuIds = val.sn;
        params.orderFlag = '5';
        dispatch({ type: 'stationDeviceDetail/dtuOperate', payload: params });
      } else {
        params.dtuId = val.dtu_sn || val.dtuSn;
        params.eqIds = val.sn || val.ter$sn;
        params.orderFlag = '5';
        params.type = currentTab;
        dispatch({ type: 'stationDeviceDetail/deviceOperate', payload: params });
      }
    } else { // 多个设备固定升级
      if (currentTab == 'dtu') {
        params.dtuIds = selectedRowKey;
        params.orderFlag = '5';
        dispatch({ type: 'stationDeviceDetail/dtuOperate', payload: params });
      }else{
        const selectedRowKeys = [];
      const selectDtu = [];
      for(var i=0; i<selectedRows.length; i++){
        if(selectDtu.indexOf(selectedRows[i].dtu_sn || selectedRows[i].dtuSn)==-1){
          selectDtu.push(selectedRows[i].dtu_sn || selectedRows[i].dtuSn)
        }
      }
      selectDtu.forEach(item=>{
        selectedRowKeys.push({
          dtuId: item,
          eqIds: [],
          orderFlag: '5',
        })
      })
      selectedRows.forEach((item) =>{
        selectedRowKeys.forEach((ele) =>{
          if(item.dtu_sn == ele.dtuId || item.dtuSn == ele.dtuId){
            ele.eqIds.push(item.ter$sn || item.sn)
          }
        })
      })
      
      selectedRowKeys.forEach((item)=>{
        const payload = item;
        payload.eqIds = payload.eqIds.join('|')
          dispatch({
            type: 'stationDeviceDetail/deviceOperate',
            payload,
          });
        })
      }
    }
  }


  // 替换编辑取消事件
 handleCancel = () => {
   const { dispatch } = this.props;
   dispatch({ type: 'stationDeviceDetail/editmodalStatus', editmodal: false });
 }
// 替换修改确定事件
handleOk = () => {
  const { deviceInfo, currentTab } = this.state;
  const { dispatch, form } = this.props;
  //  1，微逆 2，中继器； 3，DTU
  let devieceType = 0;
  switch (currentTab) {
    case 'dtu':
      devieceType = 3;
      break;
    case 'repeater':
      devieceType = 2;
      break;
    case 'micro':
      devieceType = 1;
      break;
    default:
      break;
  }
  form.validateFields((err, fieldsValue) => {
    if (err) return;
    const values = {
      newSN: fieldsValue.deviceSn,
      oldId: deviceInfo.id,
      stationId: deviceInfo.stationId,
      type: devieceType,
    };
    dispatch({ type: 'stationDeviceDetail/update', payload: values });
  });
};

   /* ----------------表格分页操作-------------------- */
   handlePageChange = (pageNum, pageSize) => {
     const { currentTab } = this.state;
     this.setState({ // 变格单选框重置
       selectedRowKeys: [],
     });
     this.handleSearch(pageNum, pageSize, currentTab);
   };

   showTotal = (total, range) => { // 显示table总条数
     // const { users: { pagination } } = this.props;
     return `当前 ${range[0]} - ${range[1]}条，共${total}条`;
   }

  handleSizeChange = (current, size) => {
    const { currentTab } = this.state;
    this.handleSearch(current, size, currentTab);
  }

  /* -----------------查询操作按钮渲染 ----------------------*/
  renderSimpleForm() {
    const { currentTab } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { page } = this.props.stationDeviceDetail;


    const dtuMenu = (
      <Menu onClick={this.moreHandleChange}>
        <Menu.Item key="0">配置文件升级</Menu.Item>
        <Menu.Item key="2">重启</Menu.Item>
        <Menu.Item key="1">删除</Menu.Item>
      </Menu>
    );
    const repeaterMenu = (
      <Menu onClick={this.moreHandleChange}>
        <Menu.Item key="2">重启</Menu.Item>
        <Menu.Item key="1">删除</Menu.Item>
      </Menu>
    );
    const microMenu = (
      <Menu onClick={this.moreHandleChange}>
        <Menu.Item key="0">配置文件升级</Menu.Item>
        <Menu.Item key="2">重启</Menu.Item>
        <Menu.Item key="1">删除</Menu.Item>
        <Menu.Item key="3">开机/关机</Menu.Item>
      </Menu>
    );

    if (currentTab === 'dtu') {
      return (
      // DTU按钮组件渲染
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem>
                {getFieldDecorator('sn')(
                  <Input placeholder="DTU-ID/电站名称搜索" />
              )}
              </FormItem>
              <FormItem style={{ marginLeft: '5%' }}>
                {getFieldDecorator('alarmStatus')(
                  <Select placeholder="告警状态" style={{ width: '100px' }}>
                    <Option value="0">运行中</Option>
                    <Option value="1">已告警</Option>
                  </Select>
              )}
              </FormItem>
              <FormItem style={{ marginLeft: '5%' }}>
                {getFieldDecorator('filtStatus')(
                  <Select placeholder="建设状态" style={{ width: '100px' }}>
                    <Option value="1">建设中</Option>
                    <Option value="2">在线</Option>
                    <Option value="3">离线</Option>
                    <Option value="4">升级中</Option>
                  </Select>
              )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <div className={styles.buttonGroup}>
                <Button type="primary" onClick={() => this.handleSearch(1, page.pageSize, currentTab)}>查询</Button>
                <Button type="primary">导出</Button>
                {this.buttonIs("upgrade_dtu")?<Button type="primary" onClick={() => { this.updateFirmware(); }}>固件升级</Button>:''}
                {this.buttonIs("delete_dtu")?<Dropdown overlay={dtuMenu}>
                  <Button style={{ marginLeft: 8 }}>
                    更多操作 <Icon type="down" />
                  </Button>
                </Dropdown>:''}
              </div>
            </Col>
          </Row>
        </Form>
      );
    } else if (currentTab === 'repeater') {
      // 中继器按钮组件渲染
      return (
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem>
                {getFieldDecorator('ter$sn')(
                  <Input placeholder="请输入中继器ID" style={{ width: '165px' }} />
              )}
              </FormItem>
              <FormItem style={{ marginLeft: '5%' }}>
                {getFieldDecorator('alarmStatus')(
                  <Select placeholder="告警状态" style={{ width: '100px' }}>
                    <Option value="0">运行中</Option>
                    <Option value="1">已告警</Option>
                  </Select>
              )}
              </FormItem>
              <FormItem style={{ marginLeft: '5%' }}>
                {getFieldDecorator('status')(
                  <Select placeholder="建设状态" style={{ width: '100px' }}>
                    <Option value="1">建设中</Option>
                    <Option value="2">在线</Option>
                    <Option value="3">离线</Option>
                    <Option value="4">升级中</Option>
                  </Select>
              )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <div className={styles.buttonGroup}>
                <Button type="primary" onClick={() => this.handleSearch(1, page.pageSize, currentTab)}>查询</Button>
                <Button type="primary">导出</Button>
                {this.buttonIs("delete_repeater")?<Dropdown overlay={repeaterMenu}>
                  <Button style={{ marginLeft: 8 }}>
                    更多操作 <Icon type="down" />
                  </Button>
                </Dropdown>:''}
              </div>
            </Col>
          </Row>
        </Form>
      );
    } else if (currentTab === 'micro') {
      // 微逆按钮组件渲染
      return (
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={13} sm={24}>
              <FormItem label="微逆-ID">
                {getFieldDecorator('dtuId')(
                  <Input placeholder="请输入" />
              )}
              </FormItem>
              <FormItem style={{ marginLeft: '5%' }}>
                {getFieldDecorator('status')(
                  <Select placeholder="状态" style={{ width: '100px' }}>
                    <Option value="1">建设中</Option>
                    <Option value="2">在线</Option>
                    <Option value="3">离线</Option>
                    <Option value="4">升级中</Option>
                  </Select>
              )}
              </FormItem>
              <FormItem style={{ marginLeft: '2%' }}>
                {getFieldDecorator('alarmStatus')(
                  <Select placeholder="告警状态" style={{ width: '100px' }}>
                    <Option value="0">运行中</Option>
                    <Option value="1">已告警</Option>
                  </Select>
              )}
              </FormItem>
            </Col>
            <Col md={11} sm={24}>
              <div className={styles.buttonGroup}>
                <Button type="primary" onClick={() => this.handleSearch(1, page.pageSize, currentTab)}>查询</Button>
                <Button type="primary">导出</Button>
                {this.buttonIs("upgrade_Micro")?<Button type="primary" onClick={() => { this.updateFirmware(); }}>固件升级</Button>:''}
                {this.buttonIs("delete_Micro")?<Dropdown overlay={microMenu}>
                  <Button style={{ marginLeft: 8 }}>
                    更多操作 <Icon type="down" />
                  </Button>
                </Dropdown>:''}
              </div>
            </Col>
          </Row>
        </Form>
      );
    }
  }

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
    const { columnsListOwner, columnsList, checkColumnsList, dropDownVisible, dataList, selectedRowKeys } = this.state;
    const { stationDeviceDetail: { data: { pagination, list }, editmodal } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const tableColum = (
      <Checkbox.Group value={checkColumnsList} onChange={this.onChangeTableColumn} style={{ paddings: '10px' }}>
        <Row>
          {this.columns.map((item) => {
      return (
        <Col style={{ padding: '10px 10px 0px 10px' }}><Checkbox key={item.dataIndex} value={item.dataIndex}>{item.title}</Checkbox></Col>

      );
    })
  }
        </Row>
        <Row className="dropChk">
          <Col span={12} style={{ paddings: '10px 10px', textAlign: 'center' }}><a onClick={() => this.handleTableColumn('ok')}>确定</a></Col>
          <Col span={12} style={{ paddings: '10px 10px', textAlign: 'center' }}><a onClick={() => this.handleTableColumn('reset')}>重置</a></Col>
        </Row>
      </Checkbox.Group>
    );
    const rowSelection = {
      selectedRowKeys,
      onChange: (currentSelectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        const { currentTab } = this.state;
        const selectRowKeys = [];
        let DtuSnNum = '';
        if (currentTab === 'dtu') {
          selectedRows.forEach((item) => {
            selectRowKeys.push(item.sn);
          });
        } else if (currentTab === 'repeater') {
          selectedRows.forEach((item) => {
            selectRowKeys.push(item.id);
          });
          DtuSnNum = selectedRows[0].dtuSn;
        } else if (currentTab === 'micro') {
          selectedRows.forEach((item) => {
            selectRowKeys.push(item.id);
          });
          DtuSnNum = selectedRows[0].dtu_sn;
        }
        this.setState({
          selectedRowKey: selectRowKeys.join('|'),
          selectedRows,
          selectedRowKeys: currentSelectedRowKeys,
          DtuSnNum,
        });
      },
    };

    const { owner } = this.props.login;
    return (
      <div className={styles.stationDeviceDetail}>
        <Tabs onChange={this.handleTabsChange} type="card">
          <TabPane tab="DTU" key="dtu" />
          <TabPane tab="中继器" key="repeater" />
          <TabPane tab="微逆" key="micro" />
        </Tabs>
        {this.renderSimpleForm()}
        <div className={styles.columsSelcet}>
          <Dropdown visible={this.state.dropDownVisible} overlay={tableColum} trigger={['click']} onVisibleChange={this.handleVisibleChange}>
            <Button>
            选择列 <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
        <Table
          columns={owner?columnsListOwner:columnsList}
          dataSource={list}
          rowSelection={rowSelection}
          pagination={{
            total: pagination.total,
            current: pagination.pageNum,
            pageSize: pagination.pageSize,
            showTotal: this.showTotal,
            onChange: this.handlePageChange,
            showSizeChanger: true,
            onShowSizeChange: this.handleSizeChange,
            pageSizeOptions: ['5', '10', '20', '50'],
            showQuickJumper: true,
            }}
        />
        <Modal
          title="替换"
          visible={editmodal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={(e) => { e.stopPropagation(); this.handleSearch(); }} >
            <FormItem {...formItemLayout} label="序列号">
              {getFieldDecorator('deviceSn', {
                   initialValue: '',
                  //  rules: [{ required: true, message: '请填入序列号' }],
                 })(
                   <Input />
                     )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default stationDeviceDetail;
