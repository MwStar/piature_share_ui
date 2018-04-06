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
  Col,
  Modal
} from 'antd';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import styles from './style.less';
import {config} from '../../utils/config';
import {getLocalStorage} from '../../utils/utils';
import MapSearchBox from '../MapSearchBox';
import OwnerModal from './OwnerModal';

const TreeNode = TreeSelect.TreeNode;
const {Option} = Select;

/**电站基本信息修改（已完成）**/
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
class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulePower: 0,//装机容量
      advanceFlag: false,//业主基本信息控制高级内容
      calculationFlag: false,//辅助计算显示隐藏
      picPath: "",//电站图片
      //ownerRecord: {},//业主对象
      confirmDirty: "",//确认密码验证
      errorMsg: "",//错误信息
      isShowPwd: true,//密码框显示
      uploadLoading: false,//上传电站图片loading

    }
  }

  /**保存电站信息*/
  onValidateForm = (e) => {
    const {dispatch, quicksite} = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      e.preventDefault();
      if (!err) {
        const pic = this.state.picPath==""?quicksite.data.stationInfo.picPath:this.state.picPath;
        if(!pic){
          message.destroy();
          message.warning(`请选择电站图片`);
          return false;
        }
        if (quicksite.data.places.address == "") {
          message.destroy();
          message.warning(`请输入电站地址`);
          return false;
        }
        if(!quicksite.data.places.latitude){
          message.destroy();
          message.warning(`请在地图上设置电站位置`);
          return false;
        }

        if (this.props.stationId != 0) {
          values.id = this.props.stationId;
        }
        const {userInfo, stationInfo} = this.props.quicksite.data;
        if (userInfo.ownerId) {
          values.ownerId = userInfo.ownerId;
          values.userId = userInfo.id;
        }
        values.buildType = this.props.buildType;
        values.picPath = pic;
        values.address = quicksite.data.places.address;
        values.latitude = quicksite.data.places.latitude;
        values.longitude = quicksite.data.places.longitude;
        values.equipeCapacitor = values.equipeCapacitor;
        const {addressObj} = quicksite.data.places

        if(addressObj && addressObj.country){
          values.country = addressObj.country;
          values.districtLv1 = addressObj.district_lv1;
          values.districtLv2 = addressObj.district_lv2;
          values.districtLv3 = addressObj.district_lv3;
        }
        dispatch({
          type: 'quicksite/saveStationInfo',
          payload: values,
        });
      }
    });
  };
  //遍历获取国家，省市 区信息
  getDetailAddress =(values)=>{
     var obj ={};
     var arr =[];
    if(values && values.length >0){
      var len = values.length
       for(var i = len-1 ; i > -1 ;i--){
        let type = values[i].types[0];
          if(type === "country"){
            obj.country =values[i].long_name ;
            arr.push(values[i].long_name);
          }else if(type === "administrative_area_level_1"){
            obj.district_lv1 =values[i].long_name;
            arr.push(values[i].long_name);
          }else if(type === "administrative_area_level_2"){
             obj.district_lv2 =values[i].long_name;
             arr.push(values[i].long_name);
           }else if(type === 'locality') {
            if(obj.district_lv2){
              obj.district_lv3 =values[i].long_name;
              arr.push(values[i].long_name);
            }else{
              obj.district_lv2 =values[i].long_name;
              arr.push(values[i].long_name);
            }
           }else if(type ==="political"){
              obj.district_lv3 =values[i].long_name;
              arr.push(values[i].long_name);
           }
       }
    }
    return {address:obj,arr:arr};
  }
  //d单击地图获得详细地址
  onMapClick = (e) => {
    var self = this;
    const {dispatch} = this.props;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'location': e.latLng
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        const addressDetail=self.getDetailAddress(results[0].address_components);
        if (results[0]) {
          dispatch({
            type: 'quicksite/saveData',
            payload: {
              places: {
                address: results[0].formatted_address,
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng(),
                addressArr:addressDetail.arr,
                addressObj:addressDetail.address

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
    dispatch({
      type: 'quicksite/saveData',
      payload: {
        markers: nextMarkers
      },
    });
  }
/**切换组件型号，获取功率**/
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
    const {data} = this.props.quicksite;
    const stationName = data.ownerFirstName+data.ownerLastName+"_"+Number(modulePower) * quicksite.data.moduleNum;
    if(quicksite.data.moduleNum!="" && quicksite.data.moduleNum >0){
      this.props.form.setFieldsValue({equipeCapacitor: Number(modulePower) * quicksite.data.moduleNum,fullName: stationName});

      dispatch({
        type: 'quicksite/saveData',
        payload: {
          equipeCapacitor: Number(modulePower) * quicksite.data.moduleNum,
          stationName:stationName
        }
      });
    }

  }
  /***组件数目变化修改装机容量**/
  onChangeModuleNum = (value) => {
    const {dispatch} = this.props;
    const {data} = this.props.quicksite;
    dispatch({
      type: 'quicksite/saveData',
      payload: {moduleNum: value}
    });
    if(this.state.modulePower >0 && value){
      const stationName = data.ownerFirstName+data.ownerLastName+"_"+this.state.modulePower * value;
      this.props.form.setFieldsValue({equipeCapacitor: this.state.modulePower * value,fullName: stationName});
      dispatch({
        type: 'quicksite/saveData',
        payload: {
          equipeCapacitor: this.state.modulePower * value,
          stationName:stationName
        }
      });
    }

  }
  /**修改地图详细地址**/
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
  /**显示高级内容**/
  onToggleUser = (advanceFlag) => {
    this.setState({advanceFlag: !advanceFlag});
  }
  /**显示辅助计算**/
  onToggleCalculation = (calculationFlag) => {
    this.setState({calculationFlag: !calculationFlag});
  }
  /**显示业主选择**/
  onOwnerVisibler = (visible) => {
    const {dispatch} = this.props;
    dispatch({type: 'quicksite/saveData', payload: {ownerVisibler: visible}})
  }
  /**选择业主*/
  onOwnerOk = (values, obj) => {
    this.props.form.setFieldsValue({userLastName: obj.lastName, userFirstName: obj.firstName});
    this.setState({isShowPwd: false})
    const {dispatch} = this.props;

    dispatch({type: 'quicksite/getUserInfoByOwnerId',
      payload: {organizationIds: values, ownerRecord: obj,ownerFirstName:obj.firstName,ownerLastName:obj.lastName}})
    //this.setState({owneVisibler:false,ownerRecord:userInfo});
  }
  /**清空已选业主*/
  onClearOwner = () => {
    const {dispatch} = this.props;
    this.props.form.setFieldsValue({userLastName: "", userFirstName: ""});
    this.setState({isShowPwd:true});
    dispatch({type: "quicksite/saveData", payload: {userInfo: {}}})
  }
  /**上传图片**/
  onChangeUpload = (info) => {
    const status = info.file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      this.setState({picPath: info.file.response.data.url});
      message.destroy();
      message.success(`${info.file.name} 上传成功.`);
    } else if (status === 'error') {
      message.destroy();
      message.error(`${info.file.name} 上传失败.`);
    }
  }
  /**确认密码验证**/
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }
  /**密码验证*/
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
  /**验证上传内容为图片*/
  beforeUpload(file) {
    const isImg = file.type.indexOf('image') > -1;
    if (!isImg) {
      message.destroy();
      message.error('请选择图片');
    }
    return isImg;
  }
/**选择设备录入方式**/
onChooseType =(type)=>{
  const {dispatch} = this.props;
  dispatch({type:"quicksite/saveStep2",payload:{bindRelationType:type}});
  if(type === 0){
    dispatch(routerRedux.push('/station/profession/'+this.props.stationId+'/device'));
  }else{
    dispatch(routerRedux.push('/station/profession/'+this.props.stationId+'/upload'));
  }
}
/**改变业主姓**/
onChangeOwnerLastName =(e)=>{

  const {data} = this.props.quicksite;
  const stationName = data.ownerFirstName+e.target.value+"_"+data.equipeCapacitor;
  this.props.form.setFieldsValue({userLastName: e.target.value,fullName: stationName});
  this.props.dispatch({type:'quicksite/saveData',payload:{stationName:stationName,ownerLastName:e.target.value}})
}
  /**改变业主名**/
  onChangeOwnerFirstName =(e)=>{

    const {data} = this.props.quicksite;
    const stationName = e.target.value+data.ownerLastName+"_"+data.equipeCapacitor;
    this.props.form.setFieldsValue({userFirstName: e.target.value,fullName: stationName});
    this.props.dispatch({type:'quicksite/saveData',payload:{stationName:stationName,ownerFirstName:e.target.value}})
  }
  /**改变装机容量**/
  onChangeCapacitor =(value)=>{
    const {data} = this.props.quicksite;
    const stationName = data.ownerFirstName+data.ownerLastName+"_"+value;
    this.props.form.setFieldsValue({equipeCapacitor: value,fullName: stationName});
    this.props.dispatch({type:'quicksite/saveData',payload:{stationName:stationName,equipeCapacitor:value}})
  }

  //取消编辑电站信息
  cancelEdit = () => {
  	const {dispatch} = this.props;
  	//dispatch(routerRedux.push('/station/view/'+quicksite.data.id+"&"+quicksite.data.stationName));
  	window.history.back();
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
      equipeCapacitor = 0,
      ownerLastName ="",
      stationName="";

    if (quicksite.data.stationInfo.id && this.props.stationId != 0) {
      initOwnerId = quicksite.data.stationInfo.ownerId;
      initAgency = quicksite.data.stationInfo.regionId + "";
      initTimeZone = quicksite.data.stationInfo.tzId;
      stationType = quicksite.data.stationInfo.stationType + "";
      netType = quicksite.data.stationInfo.netType + "";
      moduleId = quicksite.data.stationInfo.moduleId;
      userInfo = quicksite.data.userInfo;
      ownerFirstName = quicksite.data.ownerFirstName;
      ownerLastName = quicksite.data.ownerLastName;
      stationName =quicksite.data.stationName;
    } else if (this.props.stationId == 0) {
      initOwnerId = "";
      initAgency = "";
      initTimeZone = "";
      stationType = '1';
      netType = '1';
      moduleId = "";
      userInfo={};
      ownerFirstName = "";
      ownerLastName="";
      stationName ="";
      // userInfo ={};

    }
    const imgUrl = this.state.picPath ? this.state.picPath : quicksite.data.stationInfo.picPath;
    const tips = this.props.stationId == 0 ? <span className={styles.tips}>{this.state.errorMsg}&nbsp;&nbsp;<a
      onClick={() => this.onOwnerVisibler(true)}>选择业主</a>&nbsp;&nbsp;{(quicksite.data.userInfo.id && this.props.stationId == 0) ? (
      <a onClick={this.onClearOwner}>清空已选业主</a>) : null}</span> : null;
    const addEquipeCapacitorTips = <span className={styles.tips}>前往<a>组件管理</a>添加组件型号</span>
    const equipeCapacitorTips = <div className={styles.tips}>装机容量单位为KW<a onClick={() => {
      this.onToggleCalculation(this.state.calculationFlag)
    }}>辅助计算</a></div>;
    equipeCapacitor = quicksite.data.equipeCapacitor == 0 ? "" : quicksite.data.equipeCapacitor;
    const {getFieldDecorator, validateFields} = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.UploadLoading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Form layout="inline" hideRequiredMark={true} className="ant-advanced-search-form" hideRequiredMark>
          <Card title="业主信息">
            <Form.Item
              {...formItemLayout}
              label={`业主名`}
              help={tips}
            >
              {getFieldDecorator(`userFirstName`, {
                initialValue:ownerFirstName,
                rules: [{
                  required: true,
                  message: '业主名'
                }],
              })(
                <Input placeholder="名" style={{width: '100%'}} onChange={this.onChangeOwnerFirstName} readOnly={userInfo.firstName ? true : false}/>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={`业主姓`}>
              {getFieldDecorator(`userLastName`, {
                initialValue:ownerLastName,
                rules: [{
                  required: true,
                  message: '业主姓'
                }],
              })(
                <Input placeholder="姓"  onChange={this.onChangeOwnerLastName}
                       readOnly={userInfo.lastName ? true : false}/>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={`用户名`}>
              {getFieldDecorator(`userName`, {
                initialValue: userInfo.userName,
                rules: [{
                  required: true,
                  message: '请输入用户名'
                }],
              })(
                <Input placeholder="" readOnly={userInfo.id ? true : false}/>
              )}
            </Form.Item>
            {this.state.isShowPwd && this.props.stationId == 0 ? (<div>

                <Form.Item {...formItemLayout} label={`输入密码`}>
                  {getFieldDecorator(`userPass`, {
                    rules: [{
                      required: true,
                      message: '请输入密码'
                    }, {
                      validator: this.checkConfirm,
                    }],
                  })(
                  <Input placeholder=""   type="password" />)
                  }
                </Form.Item>

              <Form.Item {...formItemLayout} label={`确认密码`}>
                {getFieldDecorator(`confirmPwd`, {
                  rules: [{
                    required: true,
                    message: '请输入密码'
                  }, {
                    validator: this.checkPassword,
                  }],
                })(
                  <Input placeholder="" type="password" onBlur={this.handleConfirmBlur}/>
                )}
              </Form.Item>
            </div>) : null}
            <div onClick={() => this.onToggleUser(this.state.advanceFlag)}><a>高级</a></div>
            {this.state.advanceFlag ? (<div>
                <Form.Item {...formItemLayout} label={`邮箱`}>
                  {getFieldDecorator(`email`, {
                    initialValue: userInfo.email
                  })(
                    <Input placeholder="" readOnly={userInfo.id ? true : false}/>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={`邮编`}>
                  {getFieldDecorator(`zipCode`)(
                    <Input placeholder="" readOnly={userInfo.id ? true : false}/>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label={`电话`}>
                  {getFieldDecorator(`phone`, {
                    initialValue: userInfo.phone
                  })(
                    <Input placeholder="" readOnly={userInfo.id ? true : false}/>
                  )}
                </Form.Item></div>
            ) : null}
          </Card>
          <Card title="电站信息" style={{
            marginTop: '30px'
          }}>

            <Form.Item
              {...formItemLayout}
              label="装机容量"
              help={equipeCapacitorTips}
            >
              {getFieldDecorator('equipeCapacitor', {
                initialValue:equipeCapacitor,
                rules: [{
                  required: true,
                  message: '请输入装机容量'
                }],
              })(
                <InputNumber  onChange={this.onChangeCapacitor} placeholder="数量*组件型号功率" style={{
                  width: 'calc(100% - 0px)'
                }}/>
              )}
            </Form.Item>
            {this.state.calculationFlag ? (
              <div>
                <Form.Item
                  help={addEquipeCapacitorTips}
                  {...formItemLayoutCal}
                  label="组件型号"
                >
                  {getFieldDecorator('moduleId', {
                    initialValue: moduleId,
                    rules: [{}],
                  })(
                    <div><Select
                      style={{width: '40%'}}
                      placeholder="请选择"
                      onChange={this.onChangeModuleType}
                    >
                      {quicksite.data.assemblyList && quicksite.data.assemblyList.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>{item.model}</Option>
                        )
                      })}
                    </Select>
                      <InputNumber style={{width: '40%'}} placeholder="请输入数量" onChange={this.onChangeModuleNum}/>
                    </div>
                  )}
                </Form.Item>
              </div>) : null}
            <Form.Item
              {...formItemLayout}
              label="电站名称"
            >
              {getFieldDecorator('fullName', {
                initialValue: stationName,
                rules: [{
                  required: true,
                  message: '请输入电站名称'
                }],
              })(
                <Input placeholder="请输入"/>
              )}
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="电站类型"
            >{getFieldDecorator('stationType', {
              initialValue: stationType,
              rules: [{
                  required: true,
                  message: '请选择电站类型'
                }],
            })(
              <Select placeholder="请选择" style={{
                width: '100%'
              }}>
                <Option value="1">家用屋顶</Option>
                <Option value="2">商业用屋顶</Option>
                <Option value="3">工业用屋顶</Option>
                <Option value="4">地面电站</Option>
              </Select>
            )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="并网类型"

            >
              {getFieldDecorator('netType', {
                initialValue: netType,
                rules: [
                  {
                    required: true,
                    message: '请选择并网类型'
                  },

                ],
              })(
                <Select placeholder="请选择" style={{
                  width: '100%'
                }}>
                  <Option value="1">分布式全额上网</Option>
                  <Option value="2">分布式自发自用余电上网</Option>
                  <Option value="3">离网</Option>
                  <Option value="4">储能系统</Option>
                  <Option value="5">地面全额上网</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="时区"
            >
              {getFieldDecorator('tzId', {
                initialValue: initTimeZone,
                rules: [
                  {
                    required: true,
                    message: '请选择时区'
                  },
                ],
              })(
                <Select
                  style={{
                    width: '100%'
                  }}
                  placeholder="请选择"
                >
                  {quicksite.data.timeZone && quicksite.data.timeZone.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.displayName}</Option>
                    )
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="电站图片"
            >
              <Upload

                listType="picture-card"
                className={styles['avatar-uploader']}
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                name='file'
                multiple={false}
                action={config.UPLOAD_SERVER}
                onChange={this.onChangeUpload}
              >
                {imgUrl ? <img style={{width: 102, height: 102}} src={imgUrl} alt=""/> : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="位置"
              hasFeedback
            >
              <div>
                  <MapSearchBox places={quicksite.data.places} markers ={quicksite.data.markers} onMapClick={this.onMapClick}/>

                <div>
                  <Input value={quicksite.data.places.address} placeholder="点击地图获取位置" onChange={this.onChangeAddress}/>
                </div>
                <div>纬度：{quicksite.data.places.latitude}, 经度：{quicksite.data.places.longitude}
                </div>

              </div>

            </Form.Item>


          </Card>
          <Form.Item
            wrapperCol={{
              xs: {
                span: 24,
                offset: 0
              },
              sm: {
                span: 20,
                offset: 15
              },
            }}
            label=""
            style={{
              marginTop: '10px'
            }}
          >
            <Button type="primary" onClick={this.cancelEdit}>
              取消
            </Button>
            <Button type="primary" onClick={this.onValidateForm} style={{marginLeft:56}}>
              修改
            </Button>
          </Form.Item>
        </Form>

        <OwnerModal onCancel={() => this.onOwnerVisibler(false)} onOK={this.onOwnerOk}
                    visible={quicksite.data.ownerVisibler}/>

      </div>
    )
  }

}

const BasicStationInfo = Form.create({})(BasicInfo);
export default BasicStationInfo;
