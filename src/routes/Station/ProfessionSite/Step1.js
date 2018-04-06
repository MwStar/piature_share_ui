import React from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Upload,
  message,
  Icon,
  TreeSelect,
  InputNumber,
  Card,
  Row,
  Col
} from 'antd';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import styles from './style.less';
import {config} from '../../../utils/config';
import {getLocalStorage} from '../../../utils/utils';
import MapSearchBox from '../../../components/MapSearchBox';
import StationBasicInfo from '../../../components/StationSite/StationBasicInfo';

const TreeNode = TreeSelect.TreeNode;
const {Option} = Select;

@connect(state => ({
  quicksite: state.quicksite,
}))

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulePower: 0,
      advanceFlag: false,
      calculationFlag: false,
      picPath: "",//电站图片
      ownerRecord: {},
      confirmDirty: "",
      errorMsg: "",
      isShowPwd: true,
      uploadLoading: false,


    }

  }

  componentDidMount() {
  }

  onValidateForm = (e) => {
    const {dispatch, quicksite} = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {

      e.preventDefault();
      if (!err) {
        if (quicksite.data.places.address == "") {
          alert("qingxuanze weizhi ");
          return false;
        }
        if (this.props.params != 0) {
          values.id = this.props.params;
        }
        const {userInfo, stationInfo} = this.props.quicksite.data;
        if (userInfo.ownerId) {
          values.ownerId = userInfo.ownerId;
          values.userId = userInfo.id;
        }
        values.userFirstName = quicksite.data.ownerFirstName;
        values.userLastName = quicksite.data.ownerLastName;
        values.picPath = this.state.picPath ? this.state.picPath : stationInfo.picPath;
        values.address = quicksite.data.places.address;
        values.buildType = 1;
        values.latitude = quicksite.data.places.latitude;
        values.longitude = quicksite.data.places.longitude;
        values.equipeCapacitor = values.equipeCapacitor;

        dispatch({
          type: 'quicksite/submitStep1',
          payload: values,
        });
        //dispatch(routerRedux.push('/station/quicksite/device'));
      }
    });
  };

  onMapClick = (e) => {
    var self = this;
    const {dispatch} = this.props;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'location': e.latLng
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          dispatch({
            type: 'quicksite/saveData',
            payload: {
              places: {
                address: results[0].formatted_address,
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng(),
              }
            },
          });

        } else {
          alert("Geocoder failed due to: " + status);
        }
      }
    });

    const nextMarkers = [{
      position: e.latLng
    }];
    // this.setState({markers:nextMarkers})
    dispatch({
      type: 'quicksite/saveData',
      payload: {
        markers: nextMarkers
      },
    });
  }
  onChangeModuleType = (value) => {
    const {quicksite, dispatch} = this.props;
    var len = quicksite ? quicksite.data.assemblyList.length : 0;
    var modulePower = 0;
    for (var i = 0; i < len; i++) {
      if (quicksite.data.assemblyList[i].id == value) {
        modulePower = quicksite.data.assemblyList[i].power;
        break;
      }
    }
    this.setState({
      modulePower: Number(modulePower)
    });
    dispatch({
      type: 'quicksite/saveData',
      payload: {
        equipeCapacitor: Number(modulePower) * quicksite.data.moduleNum
      }
    });

  }
  onChangeModuleNum = (value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'quicksite/saveData',
      payload: {
        equipeCapacitor: this.state.modulePower * value,
        moduleNum: value
      }
    });

  }
  onChangeAddress = (e) => {
    const {quicksite, dispatch} = this.props;
    dispatch({
      type: 'quicksite/saveData',
      payload: {
        places: {
          address: e.target.value,
          latitude: quicksite.data.places.latitude,
          longitude: quicksite.data.places.longitude,
        }
      },
    });

  }
  //显示高级内容
  onToggleUser = (advanceFlag) => {
    this.setState({advanceFlag: !advanceFlag});
  }
  //显示辅助计算
  onToggleCalculation = (calculationFlag) => {
    this.setState({calculationFlag: !calculationFlag});
  }
  //显示业主选择
  onOwnerVisibler = (visible) => {
    const {dispatch} = this.props;
    dispatch({type: 'quicksite/saveData', payload: {owneVisibler: visible}})
  }
  onOwnerOk = (values, obj) => {

    this.props.form.setFieldsValue({userLastName: obj.lastName, userFirstName: obj.firstName});
    this.setState({isShowPwd: false})
    const {dispatch} = this.props;
    dispatch({type: 'quicksite/getUserInfoByOwnerId', payload: {organizationIds: values, ownerRecord: obj}})

    // this.setState({owneVisibler:false,ownerRecord:userInfo});
  }
  onClearOwner = () => {
    const {dispatch} = this.props;
    this.props.form.setFieldsValue({userLastName: "", userFirstName: ""});
    dispatch({type: "quicksite/saveData", payload: {userInfo: {}}})
  }
  onChangeUpload = (info) => {

    const status = info.file.status;
    if (status !== 'uploading') {
      // console.log(info.file.response.data.url);
    }

    if (status === 'done') {
      this.setState({picPath: info.file.response.data.url});
      message.success(`${info.file.name} 上传成功.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }

  }

  //验证业主姓名
  checkOwner = (rule, value, callback) => {
    const {data} = this.props.quicksite;

    if (data.ownerFirstName == "") {
      callback('输入业主名');
    }
  }
  //密码验证
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('userPass')) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPwd'], {force: true});
    }
    callback();
  }

  //上传图片
  beforeUpload(file) {
    const isImg = file.type.indexOf('image') > -1;

    if (!isImg) {
      message.error('请选择图片');
    }

    return isImg;
  }

  render() {

    const {quicksite} = this.props;


    let initOwnerId = 0,
      initAgency = 0,
      initTimeZone,
      stationType = 0,
      netType = 0,
      moduleId = 0,
      userInfo = quicksite.data.userInfo,
      ownerFirstName = "",
      equipeCapacitor = 0;

    if (quicksite.data.stationInfo.id && this.props.params != 0) {
      initOwnerId = quicksite.data.stationInfo.ownerId;
      initAgency = quicksite.data.stationInfo.regionId + "";
      initTimeZone = quicksite.data.stationInfo.tzId;
      stationType = quicksite.data.stationInfo.stationType + "";
      netType = quicksite.data.stationInfo.netType + "";
      moduleId = quicksite.data.stationInfo.moduleId;
      userInfo = quicksite.data.userInfo;
      ownerFirstName = quicksite.data.ownerFirstName;

    } else if (this.props.params == 0) {
      initOwnerId = "";
      initAgency = "";
      initTimeZone = "";
      stationType = '';
      netType = '';
      moduleId = "";
      ownerFirstName = "";
      // userInfo ={};

    }
    const imgUrl = this.state.picPath ? this.state.picPath : quicksite.data.stationInfo.picPath;
    const tips = this.props.params == 0 ? <span className={styles.tips}>{this.state.errorMsg}&nbsp;&nbsp;<a
      onClick={() => this.onOwnerVisibler(true)}>选择业主</a>&nbsp;&nbsp;{(quicksite.data.userInfo.id && this.props.params == 0) ? (
      <a onClick={this.onClearOwner}>清空已选业主</a>) : null}</span> : null;
    const addEquipeCapacitorTips = <span className={styles.tips}>前往<a>组件管理</a>添加组件型号</span>
    const equipeCapacitorTips = <div className={styles.tips}>装机容量单位为KW<a onClick={() => {
      this.onToggleCalculation(this.state.calculationFlag)
    }}>辅助计算</a></div>;
    equipeCapacitor = quicksite.data.equipeCapacitor == 0 ? "" : quicksite.data.equipeCapacitor;
    const {getFieldDecorator, validateFields} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 20
        }
      },
    };
    const formItemLayoutCal = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 17
        }
      },
    };

    const uploadButton = (
      <div>
        <Icon type={this.state.UploadLoading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>

            <StationBasicInfo stationId = {this.props.params} />


      </div>
    )
  }

}

const BasicInfoForm = Form.create({})(BasicInfo);

export default BasicInfoForm;
